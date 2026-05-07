import Link from "next/link";
import { MOCK_HISTORY } from "@/lib/mock-analysis";
import { getStatusConfig, formatRelativeTime } from "@/lib/status";
import type { RoomStatus } from "@/types";

const NEEDS_ATTENTION: RoomStatus[] = [
  "Getting Suspicious",
  "Side Quest",
  "Bro…",
];

export default function Dashboard() {
  const needsAttention = MOCK_HISTORY.filter((c) =>
    NEEDS_ATTENTION.includes(c.analysis.status)
  );

  // Latest check per room
  const latestByRoom = Object.values(
    MOCK_HISTORY.reduce<Record<string, (typeof MOCK_HISTORY)[0]>>(
      (acc, check) => {
        const existing = acc[check.roomName];
        if (!existing || check.timestamp > existing.timestamp) {
          acc[check.roomName] = check;
        }
        return acc;
      },
      {}
    )
  );

  return (
    <div className="space-y-8">
      {/* Hero CTA */}
      <section className="rounded-2xl bg-zinc-900 p-6 text-center">
        <p className="mb-1 text-sm font-medium text-zinc-400 uppercase tracking-widest">
          Bro Mode
        </p>
        <h1 className="mb-2 text-3xl font-bold tracking-tight">
          How bad is it in there?
        </h1>
        <p className="mb-6 text-zinc-400">
          Upload a photo. Get roasted. Do one tiny thing.
        </p>
        <Link
          href="/check"
          className="inline-block rounded-xl bg-violet-600 px-8 py-3 font-semibold text-white transition hover:bg-violet-500 active:scale-95"
        >
          Check a Room
        </Link>
      </section>

      {/* Needs Attention */}
      {needsAttention.length > 0 && (
        <section>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-500">
            Needs Attention
          </h2>
          <div className="space-y-2">
            {needsAttention.map((check) => {
              const cfg = getStatusConfig(check.analysis.status);
              return (
                <Link
                  key={check.id}
                  href={`/result?id=${check.id}&mock=1`}
                  className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900 p-4 transition hover:border-zinc-700"
                >
                  <div>
                    <p className="font-semibold">{check.roomName}</p>
                    <p className="text-sm text-zinc-400 line-clamp-1">
                      {check.analysis.roast}
                    </p>
                  </div>
                  <div className="ml-4 flex flex-col items-end gap-1">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${cfg.bg} ${cfg.color}`}
                    >
                      {cfg.emoji} {check.analysis.status}
                    </span>
                    <span className="text-xs text-zinc-500">
                      {formatRelativeTime(check.timestamp)}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* All Rooms */}
      <section>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-500">
          All Rooms
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {latestByRoom.map((check) => {
            const cfg = getStatusConfig(check.analysis.status);
            return (
              <Link
                key={check.id}
                href={`/result?id=${check.id}&mock=1`}
                className="flex flex-col gap-2 rounded-xl border border-zinc-800 bg-zinc-900 p-4 transition hover:border-zinc-700"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{check.roomName}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${cfg.bg} ${cfg.color}`}
                  >
                    {cfg.emoji} {check.analysis.status}
                  </span>
                </div>
                <p className="text-sm text-zinc-400 line-clamp-2">
                  {check.analysis.roast}
                </p>
                <div className="flex items-center justify-between text-xs text-zinc-500">
                  <span>{check.analysis.effort} fix available</span>
                  <span>{formatRelativeTime(check.timestamp)}</span>
                </div>
              </Link>
            );
          })}
          {/* Add new room card */}
          <Link
            href="/check"
            className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-zinc-700 bg-zinc-900/50 p-4 text-zinc-500 transition hover:border-zinc-500 hover:text-zinc-400"
          >
            <span className="text-2xl">+</span>
            <span className="text-sm">Check a room</span>
          </Link>
        </div>
      </section>

      {/* Recent History */}
      <section>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-500">
          Recent Checks
        </h2>
        <div className="space-y-2">
          {MOCK_HISTORY.map((check) => {
            const cfg = getStatusConfig(check.analysis.status);
            return (
              <Link
                key={check.id}
                href={`/result?id=${check.id}&mock=1`}
                className="flex items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-900 p-3 transition hover:border-zinc-700"
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xl ${cfg.bg}`}
                >
                  {cfg.emoji}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{check.roomName}</span>
                    <span className={`text-xs ${cfg.color}`}>
                      {check.analysis.status}
                    </span>
                  </div>
                  <p className="truncate text-sm text-zinc-400">
                    {check.analysis.roast}
                  </p>
                </div>
                <span className="shrink-0 text-xs text-zinc-500">
                  {formatRelativeTime(check.timestamp)}
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
