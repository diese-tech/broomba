import { NextResponse } from "next/server";
import { analyzeRoom, getAnalysisProvider } from "@/lib/analysis-provider";
import { checkBurst, getQuota, recordSuccessfulScan } from "@/lib/rate-limit";
import { hashKey } from "@/lib/rate-limit";
import { logAnalyzeEvent } from "@/lib/server-logging";
import type { PersonalityMode } from "@/types";

const MAX_IMAGE_BYTES = 4 * 1024 * 1024;
const SUPPORTED_MEDIA_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

function getClientIp(req: Request) {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

function parseImageData(imageData: unknown) {
  if (typeof imageData !== "string" || imageData.length === 0) {
    return { error: "Photo is required." };
  }

  const match = imageData.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
  if (!match) return { error: "Photo must be a base64 image data URL." };

  const mediaType = match[1].toLowerCase();
  const base64 = match[2];
  if (!SUPPORTED_MEDIA_TYPES.has(mediaType)) {
    return { error: "Photo must be JPEG, PNG, or WebP." };
  }

  const bytes = Math.ceil((base64.length * 3) / 4);
  if (bytes > MAX_IMAGE_BYTES) {
    return { error: "Photo is too large. Please use an image under 4 MB." };
  }

  return { mediaType, bytes };
}

export async function POST(req: Request) {
  const startedAt = Date.now();
  const requestId = crypto.randomUUID();
  const provider = getAnalysisProvider();
  const body = await req.json().catch(() => null);
  const { roomName, imageData, deviceId, personality } = (body ?? {}) as {
    roomName?: string;
    imageData?: string;
    deviceId?: string;
    personality?: PersonalityMode;
  };

  if (!roomName?.trim()) {
    logAnalyzeEvent("rejected", {
      requestId,
      provider,
      status: 400,
      reason: "missing_room",
      latencyMs: Date.now() - startedAt,
    });
    return NextResponse.json({ error: "roomName is required" }, { status: 400 });
  }
  if (!deviceId?.trim()) {
    logAnalyzeEvent("rejected", {
      requestId,
      provider,
      status: 400,
      reason: "missing_device",
      latencyMs: Date.now() - startedAt,
    });
    return NextResponse.json({ error: "deviceId is required" }, { status: 400 });
  }

  const image = parseImageData(imageData);
  if ("error" in image) {
    logAnalyzeEvent("rejected", {
      requestId,
      provider,
      status: 400,
      reason: "invalid_image",
      deviceHash: hashKey(deviceId),
      latencyMs: Date.now() - startedAt,
    });
    return NextResponse.json({ error: image.error }, { status: 400 });
  }

  const ip = getClientIp(req);
  const deviceHash = hashKey(deviceId);
  const ipHash = hashKey(ip);
  const burst = await checkBurst(ip);
  if (!burst.allowed) {
    logAnalyzeEvent("rate_limited", {
      requestId,
      provider,
      status: 429,
      reason: "burst",
      deviceHash,
      ipHash,
      limiterStore: burst.store,
      latencyMs: Date.now() - startedAt,
    });
    return NextResponse.json(
      {
        error: "Too many scans in a row. Give Broomba a minute to breathe.",
        retryAfterSeconds: burst.retryAfterSeconds,
      },
      { status: 429 }
    );
  }

  const quota = await getQuota(deviceId, ip);
  if (!quota.allowed) {
    logAnalyzeEvent("rate_limited", {
      requestId,
      provider,
      status: 429,
      reason: "daily_quota",
      deviceHash,
      ipHash,
      limiterStore: quota.store,
      quotaUsed: quota.used,
      quotaLimit: quota.limit,
      latencyMs: Date.now() - startedAt,
    });
    return NextResponse.json(
      {
        error: "Daily beta scan limit reached.",
        quota,
      },
      { status: 429 }
    );
  }

  try {
    const analysis = await analyzeRoom({
      roomName: roomName.trim().slice(0, 80),
      imageData: imageData as string,
      mediaType: image.mediaType,
      personality: personality ?? "bro",
    });
    const limiterStore = await recordSuccessfulScan(deviceId, ip);
    const nextQuota = await getQuota(deviceId, ip);
    logAnalyzeEvent("completed", {
      requestId,
      provider,
      status: 200,
      deviceHash,
      ipHash,
      limiterStore,
      imageBytes: image.bytes,
      quotaUsed: nextQuota.used,
      quotaLimit: nextQuota.limit,
      latencyMs: Date.now() - startedAt,
    });
    return NextResponse.json({
      analysis,
      provider,
      quota: nextQuota,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Analysis failed. Please try again.";
    logAnalyzeEvent("failed", {
      requestId,
      provider,
      status: message.includes("ANTHROPIC_API_KEY") ? 503 : 502,
      reason: message.includes("ANTHROPIC_API_KEY")
        ? "provider_not_configured"
        : "provider_error",
      deviceHash,
      ipHash,
      imageBytes: image.bytes,
      latencyMs: Date.now() - startedAt,
    });
    return NextResponse.json(
      {
        error:
          message.includes("ANTHROPIC_API_KEY")
            ? "Broomba AI is not configured yet."
            : "Broomba could not analyze that photo. Please try again.",
      },
      { status: message.includes("ANTHROPIC_API_KEY") ? 503 : 502 }
    );
  }
}
