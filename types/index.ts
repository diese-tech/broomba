export type RoomStatus =
  | "Stable"
  | "Slight Drift"
  | "Getting Suspicious"
  | "Side Quest"
  | "Bro…";

export type EffortEstimate = "2 min" | "5 min" | "10 min";

export type PersonalityMode =
  | "bro"
  | "passive-aggressive"
  | "corporate"
  | "dark-souls"
  | "toxic-ranked"
  | "cozy-goblin"
  | "butler";

export interface AnalysisResult {
  status: RoomStatus;
  roast: string;
  observations: string[];
  cleanupAction: string;
  effort: EffortEstimate;
  personality: PersonalityMode;
}

export interface RoomCheck {
  id: string;
  roomName: string;
  imageUrl: string | null;
  timestamp: string;
  analysis: AnalysisResult;
}
