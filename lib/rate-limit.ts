import { createHash, randomUUID } from "crypto";

interface QuotaResult {
  allowed: boolean;
  used: number;
  remaining: number;
  limit: number;
  resetAt: string | null;
  store: "memory" | "redis";
}

function readPositiveNumber(name: string, fallback: number) {
  const value = Number(process.env[name]);
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

function getDailyLimit() {
  return readPositiveNumber("BROOMBA_DAILY_SCAN_LIMIT", 16);
}

function getQuotaWindowMs() {
  return readPositiveNumber("BROOMBA_QUOTA_WINDOW_MS", 24 * 60 * 60 * 1000);
}

function getBurstLimit() {
  return readPositiveNumber("BROOMBA_BURST_LIMIT", 8);
}

function getBurstWindowMs() {
  return readPositiveNumber("BROOMBA_BURST_WINDOW_MS", 60 * 1000);
}

const successfulScans = new Map<string, number[]>();
const attempts = new Map<string, number[]>();

function prune(items: number[], windowMs: number, now: number) {
  return items.filter((timestamp) => now - timestamp < windowMs);
}

export function hashKey(value: string) {
  return createHash("sha256").update(value).digest("hex").slice(0, 24);
}

function redisConfigured() {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

async function redisCommand<T>(command: Array<string | number>): Promise<T> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) throw new Error("Redis is not configured.");

  const response = await fetch(url, {
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
    body: JSON.stringify(command),
  });
  if (!response.ok) {
    throw new Error(`Redis command failed with ${response.status}.`);
  }

  const payload = (await response.json()) as { result: T; error?: string };
  if (payload.error) throw new Error(payload.error);
  return payload.result;
}

async function countRedisEvents(key: string, windowMs: number, now: number) {
  const cutoff = now - windowMs;
  await redisCommand<number>(["ZREMRANGEBYSCORE", key, 0, cutoff]);
  const count = await redisCommand<number>(["ZCARD", key]);
  const first = await redisCommand<string[]>(["ZRANGE", key, 0, 0]);
  await redisCommand<number>(["PEXPIRE", key, Math.ceil(windowMs / 1000) * 1000]);
  return {
    count,
    oldest: first[0] ? Number(first[0].split(":")[0]) : null,
  };
}

async function recordRedisEvent(key: string, windowMs: number, now: number) {
  await redisCommand<number>(["ZADD", key, now, `${now}:${randomUUID()}`]);
  await redisCommand<number>(["PEXPIRE", key, Math.ceil(windowMs / 1000) * 1000]);
}

function memoryQuota(deviceId: string, ip: string, now: number): QuotaResult {
  const dailyLimit = getDailyLimit();
  const quotaWindowMs = getQuotaWindowMs();
  const deviceKey = `device:${hashKey(deviceId)}`;
  const ipKey = `ip:${hashKey(ip)}`;
  const deviceScans = prune(successfulScans.get(deviceKey) ?? [], quotaWindowMs, now);
  const ipScans = prune(successfulScans.get(ipKey) ?? [], quotaWindowMs, now);
  successfulScans.set(deviceKey, deviceScans);
  successfulScans.set(ipKey, ipScans);

  const used = Math.max(deviceScans.length, ipScans.length);
  const oldest = [...deviceScans, ...ipScans].sort((a, b) => a - b)[0] ?? null;

  return {
    allowed: used < dailyLimit,
    used,
    remaining: Math.max(dailyLimit - used, 0),
    limit: dailyLimit,
    resetAt: oldest ? new Date(oldest + quotaWindowMs).toISOString() : null,
    store: "memory",
  };
}

export async function getQuota(
  deviceId: string,
  ip: string,
  now = Date.now()
): Promise<QuotaResult> {
  if (!redisConfigured()) return memoryQuota(deviceId, ip, now);

  const dailyLimit = getDailyLimit();
  const quotaWindowMs = getQuotaWindowMs();
  const deviceKey = `broomba:quota:device:${hashKey(deviceId)}`;
  const ipKey = `broomba:quota:ip:${hashKey(ip)}`;
  const [device, ipQuota] = await Promise.all([
    countRedisEvents(deviceKey, quotaWindowMs, now),
    countRedisEvents(ipKey, quotaWindowMs, now),
  ]);

  const used = Math.max(device.count, ipQuota.count);
  const oldest = [device.oldest, ipQuota.oldest]
    .filter((value): value is number => typeof value === "number")
    .sort((a, b) => a - b)[0] ?? null;

  return {
    allowed: used < dailyLimit,
    used,
    remaining: Math.max(dailyLimit - used, 0),
    limit: dailyLimit,
    resetAt: oldest ? new Date(oldest + quotaWindowMs).toISOString() : null,
    store: "redis",
  };
}

export async function checkBurst(ip: string, now = Date.now()) {
  const burstLimit = getBurstLimit();
  const burstWindowMs = getBurstWindowMs();

  if (!redisConfigured()) {
    const key = `burst:${hashKey(ip)}`;
    const recent = prune(attempts.get(key) ?? [], burstWindowMs, now);
    attempts.set(key, [...recent, now]);
    return {
      allowed: recent.length < burstLimit,
      retryAfterSeconds: Math.ceil(burstWindowMs / 1000),
      store: "memory" as const,
    };
  }

  const key = `broomba:burst:ip:${hashKey(ip)}`;
  const current = await countRedisEvents(key, burstWindowMs, now);
  await recordRedisEvent(key, burstWindowMs, now);
  return {
    allowed: current.count < burstLimit,
    retryAfterSeconds: Math.ceil(burstWindowMs / 1000),
    store: "redis" as const,
  };
}

export async function recordSuccessfulScan(deviceId: string, ip: string, now = Date.now()) {
  const quotaWindowMs = getQuotaWindowMs();

  if (!redisConfigured()) {
    for (const key of [`device:${hashKey(deviceId)}`, `ip:${hashKey(ip)}`]) {
      const recent = prune(successfulScans.get(key) ?? [], quotaWindowMs, now);
      successfulScans.set(key, [...recent, now]);
    }
    return "memory" as const;
  }

  await Promise.all([
    recordRedisEvent(`broomba:quota:device:${hashKey(deviceId)}`, quotaWindowMs, now),
    recordRedisEvent(`broomba:quota:ip:${hashKey(ip)}`, quotaWindowMs, now),
  ]);
  return "redis" as const;
}
