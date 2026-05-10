import { analyzeRoomWithClaude } from "@/lib/claude-provider";
import { getMockAnalysis } from "@/lib/mock-analysis";
import type { AnalyzeRoomInput } from "@/lib/claude-provider";
import type { AnalysisResult } from "@/types";

export type AnalysisProvider = "claude" | "mock";

export function getAnalysisProvider(): AnalysisProvider {
  return process.env.ANALYSIS_PROVIDER === "mock" ? "mock" : "claude";
}

export async function analyzeRoom(input: AnalyzeRoomInput): Promise<AnalysisResult> {
  if (getAnalysisProvider() === "mock") {
    const delayMs = Number(process.env.MOCK_ANALYSIS_DELAY_MS ?? 25);
    if (delayMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
    return getMockAnalysis(input.roomName);
  }

  return analyzeRoomWithClaude(input);
}
