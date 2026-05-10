import { parseAnalysisJson, validateAnalysisResult } from "@/lib/analysis-validation";
import type { AnalysisResult, PersonalityMode } from "@/types";

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const DEFAULT_MODEL = "claude-sonnet-4-6";
const TIMEOUT_MS = 20_000;

export interface AnalyzeRoomInput {
  roomName: string;
  imageData: string;
  mediaType: string;
  personality: PersonalityMode;
}

function stripDataUrl(imageData: string) {
  const [, base64] = imageData.split(",");
  return base64 ?? imageData;
}

function buildPrompt(roomName: string, personality: PersonalityMode) {
  return `Analyze this room photo for Broomba.

Room name: ${roomName}
Personality: ${personality}

Return ONLY valid JSON matching this shape:
{
  "status": "Stable" | "Slight Drift" | "Getting Suspicious" | "Side Quest" | "Bro…",
  "roast": "short funny Bro Mode comment, not cruel",
  "observations": ["1-4 objective visible observations"],
  "cleanupAction": "exactly one small cleanup action",
  "effort": "2 min" | "5 min" | "10 min",
  "personality": "bro"
}

Rules:
- Do not identify people.
- Do not mention private/sensitive attributes.
- Keep the roast playful and useful.
- Always give exactly one cleanup action.`;
}

export async function analyzeRoomWithClaude(
  input: AnalyzeRoomInput
): Promise<AnalysisResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is not configured.");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(ANTHROPIC_URL, {
      method: "POST",
      signal: controller.signal,
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL ?? DEFAULT_MODEL,
        max_tokens: 700,
        temperature: 0.7,
        system:
          "You are Broomba, a funny AI roommate that judges room mess from photos and gives exactly one tiny cleanup task.",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image",
                source: {
                  type: "base64",
                  media_type: input.mediaType,
                  data: stripDataUrl(input.imageData),
                },
              },
              { type: "text", text: buildPrompt(input.roomName, input.personality) },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Claude request failed with ${response.status}.`);
    }

    const payload = (await response.json()) as {
      content?: Array<{ type: string; text?: string }>;
    };
    const text = payload.content?.find((part) => part.type === "text")?.text;
    if (!text) throw new Error("Claude returned no text content.");

    const parsed = parseAnalysisJson(text);
    const validated = validateAnalysisResult(parsed);
    if (!validated) throw new Error("Claude returned invalid analysis JSON.");
    return validated;
  } finally {
    clearTimeout(timeout);
  }
}
