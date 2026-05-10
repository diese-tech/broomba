import type { AnalysisResult, EffortEstimate, PersonalityMode, RoomStatus } from "@/types";

const STATUSES: RoomStatus[] = [
  "Stable",
  "Slight Drift",
  "Getting Suspicious",
  "Side Quest",
  "Bro…",
];
const EFFORTS: EffortEstimate[] = ["2 min", "5 min", "10 min"];
const PERSONALITIES: PersonalityMode[] = [
  "bro",
  "passive-aggressive",
  "corporate",
  "dark-souls",
  "toxic-ranked",
  "cozy-goblin",
  "butler",
];

export const SAFE_ANALYSIS: AnalysisResult = {
  status: "Slight Drift",
  roast: "Broomba saw enough to be concerned, but the scan got a little weird.",
  observations: ["The photo could not be interpreted cleanly."],
  cleanupAction: "Pick one visible surface and clear just that surface.",
  effort: "5 min",
  personality: "bro",
};

function isString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function validateAnalysisResult(value: unknown): AnalysisResult | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as Partial<AnalysisResult>;

  if (!STATUSES.includes(candidate.status as RoomStatus)) return null;
  if (!isString(candidate.roast)) return null;
  if (!Array.isArray(candidate.observations)) return null;
  if (!isString(candidate.cleanupAction)) return null;
  if (!EFFORTS.includes(candidate.effort as EffortEstimate)) return null;
  if (!PERSONALITIES.includes(candidate.personality as PersonalityMode)) return null;

  const observations = candidate.observations
    .filter(isString)
    .map((observation) => observation.trim())
    .slice(0, 4);
  if (observations.length === 0) return null;

  return {
    status: candidate.status as RoomStatus,
    roast: candidate.roast.trim().slice(0, 220),
    observations,
    cleanupAction: candidate.cleanupAction.trim().slice(0, 180),
    effort: candidate.effort as EffortEstimate,
    personality: candidate.personality as PersonalityMode,
  };
}

export function parseAnalysisJson(text: string) {
  const trimmed = text.trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    const match = trimmed.match(/\{[\s\S]*\}/);
    if (!match) return null;
    try {
      return JSON.parse(match[0]);
    } catch {
      return null;
    }
  }
}
