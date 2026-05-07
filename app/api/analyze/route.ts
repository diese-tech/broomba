import { NextResponse } from "next/server";
import { getMockAnalysis } from "@/lib/mock-analysis";

// Phase 1: returns mocked analysis
// Phase 2: will send image to Claude vision API and return real analysis
export async function POST(req: Request) {
  const body = await req.json();
  const { roomName } = body as { roomName?: string };

  if (!roomName) {
    return NextResponse.json({ error: "roomName is required" }, { status: 400 });
  }

  // TODO Phase 2: replace with real Claude vision call
  const analysis = getMockAnalysis(roomName);

  return NextResponse.json({ analysis });
}
