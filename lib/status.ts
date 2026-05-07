import type { RoomStatus } from "@/types";

export const STATUS_CONFIG: Record<
  RoomStatus,
  { emoji: string; color: string; bg: string; border: string }
> = {
  Stable: {
    emoji: "✅",
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
  },
  "Slight Drift": {
    emoji: "👀",
    color: "text-yellow-700",
    bg: "bg-yellow-50",
    border: "border-yellow-200",
  },
  "Getting Suspicious": {
    emoji: "🤨",
    color: "text-orange-700",
    bg: "bg-orange-50",
    border: "border-orange-200",
  },
  "Side Quest": {
    emoji: "⚔️",
    color: "text-red-700",
    bg: "bg-red-50",
    border: "border-red-200",
  },
  "Bro…": {
    emoji: "💀",
    color: "text-purple-700",
    bg: "bg-purple-50",
    border: "border-purple-200",
  },
};

export function getStatusConfig(status: RoomStatus) {
  return STATUS_CONFIG[status];
}

export function formatRelativeTime(timestamp: string): string {
  const now = Date.now();
  const then = new Date(timestamp).getTime();
  const diffMs = now - then;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}
