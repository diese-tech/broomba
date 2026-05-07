import type { AnalysisResult, RoomStatus } from "@/types";

const broResponses: Record<RoomStatus, AnalysisResult[]> = {
  Stable: [
    {
      status: "Stable",
      roast: "Bro. This room is actually clean. I don't know how to feel about this.",
      observations: [
        "Surfaces are mostly clear",
        "Floor is navigable",
        "Nothing appears to be evolving",
      ],
      cleanupAction: "Wipe down the counters — takes 2 minutes, keeps the good streak going.",
      effort: "2 min",
      personality: "bro",
    },
  ],
  "Slight Drift": [
    {
      status: "Slight Drift",
      roast: "It's not a disaster. But it is auditioning.",
      observations: [
        "A few items are out of place",
        "There's some surface creep happening",
        "The floor is fine but the vibes are slightly off",
      ],
      cleanupAction: "Grab everything that doesn't belong in this room and return it to where it lives.",
      effort: "5 min",
      personality: "bro",
    },
  ],
  "Getting Suspicious": [
    {
      status: "Getting Suspicious",
      roast: "Kitchen counter is entering side quest territory.",
      observations: [
        "Multiple surfaces have acquired guests",
        "There's a pile that has its own gravitational pull",
        "The laundry situation is not stable",
      ],
      cleanupAction: "Pick one surface. Clear it completely. Just one. You got this.",
      effort: "5 min",
      personality: "bro",
    },
  ],
  "Side Quest": [
    {
      status: "Side Quest",
      roast: "Trash is giving 'I'll deal with it tomorrow' energy. Tomorrow was yesterday.",
      observations: [
        "The floor is a navigational challenge",
        "Dishes have formed an alliance",
        "At least two items are in the wrong room entirely",
      ],
      cleanupAction: "Take out the trash. That single move will change the entire energy of this room.",
      effort: "10 min",
      personality: "bro",
    },
  ],
  "Bro…": [
    {
      status: "Bro…",
      roast: "Bro. The laundry chair is gaining sentience. This is a cry for help and I'm answering it.",
      observations: [
        "I can see at least three distinct disaster zones",
        "The laundry chair has achieved critical mass",
        "There are items here that have not moved in what I estimate to be weeks",
        "The floor is more of a suggestion at this point",
      ],
      cleanupAction: "Do one trash bag. Fill it, tie it, put it by the door. One bag. That's the mission.",
      effort: "10 min",
      personality: "bro",
    },
  ],
};

export function getMockAnalysis(roomName: string): AnalysisResult {
  const statuses: RoomStatus[] = [
    "Stable",
    "Slight Drift",
    "Getting Suspicious",
    "Side Quest",
    "Bro…",
  ];

  // Deterministically pick a status based on room name for consistent mocks
  const index = roomName.length % statuses.length;
  const status = statuses[index];
  const options = broResponses[status];
  return options[Math.floor(Math.random() * options.length)];
}

export const MOCK_HISTORY = [
  {
    id: "1",
    roomName: "Living Room",
    imageUrl: null,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    analysis: {
      status: "Getting Suspicious" as RoomStatus,
      roast: "Kitchen counter is entering side quest territory.",
      observations: [
        "Multiple surfaces have acquired guests",
        "There's a pile that has its own gravitational pull",
      ],
      cleanupAction: "Pick one surface. Clear it completely. Just one.",
      effort: "5 min" as const,
      personality: "bro" as const,
    },
  },
  {
    id: "2",
    roomName: "Bedroom",
    imageUrl: null,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    analysis: {
      status: "Bro…" as RoomStatus,
      roast: "Bro. The laundry chair is gaining sentience.",
      observations: [
        "The laundry chair has achieved critical mass",
        "The floor is more of a suggestion",
      ],
      cleanupAction: "Do one trash bag. Fill it, tie it, put it by the door.",
      effort: "10 min" as const,
      personality: "bro" as const,
    },
  },
  {
    id: "3",
    roomName: "Kitchen",
    imageUrl: null,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    analysis: {
      status: "Stable" as RoomStatus,
      roast: "This room is actually clean. I don't know how to feel about this.",
      observations: ["Surfaces are mostly clear", "Nothing appears to be evolving"],
      cleanupAction: "Wipe down the counters. Keep the good streak going.",
      effort: "2 min" as const,
      personality: "bro" as const,
    },
  },
];
