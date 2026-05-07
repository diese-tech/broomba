"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { MOCK_HISTORY } from "@/lib/mock-analysis";
import { getStatusConfig, formatRelativeTime } from "@/lib/status";
import type { RoomCheck } from "@/types";

export default function ResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [check, setCheck] = useState<RoomCheck | null>(null);

  useEffect(() => {
    const isMockHistory = searchParams.get("mock") === "1";
    const id = searchParams.get("id");

    if (isMockHistory && id) {
      const found = MOCK_HISTORY.find((c) => c.id === id);
      if (found) {
        setCheck(found as RoomCheck);
        return;
      }
    }

    const raw = sessionStorage.getItem("latestCheck");
    if (raw) {
      try {
        setCheck(JSON.parse(raw));
      } catch {
        router.replace("/");
      }
    } else {
      router.replace("/");
    }
  }, [searchParams, router]);

  if (!check) {
    return (
      <div className="flex h-48 items-center justify-center text-zinc-500">
        Loading…
      </div>
    );
  }

  const cfg = getStatusConfig(check.analysis.status);

  return (
    <div className="space-y-6">
      <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-300">
        ← Dashboard
      </Link>

      <div>
        <h1 className="text-2xl font-bold">{check.roomName}</h1>
        <p className="text-sm text-zinc-500">
          {formatRelativeTime(check.timestamp)}
        </p>
      </div>

      {check.imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={check.imageUrl}
          alt={`${check.roomName} photo`}
          className="w-full rounded-2xl object-cover"
          style={{ maxHeight: 320 }}
        />
      )}

      <div
        className={`flex items-center gap-3 rounded-2xl border p-5 ${cfg.bg} ${cfg.border}`}
      >
        <span className="text-4xl">{cfg.emoji}</span>
        <div>
          <p className={`text-sm font-semibold uppercase tracking-widest ${cfg.color}`}>
            Status
          </p>
          <p className={`text-2xl font-bold ${cfg.color}`}>
            {check.analysis.status}
          </p>
        </div>
      </div>

      <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-zinc-500">
          Bro says
        </p>
        <p className="text-lg font-medium leading-snug">
          &ldquo;{check.analysis.roast}&rdquo;
        </p>
      </section>

      <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-500">
          What I see
        </p>
        <ul className="space-y-2">
          {check.analysis.observations.map((obs, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
              <span className="mt-0.5 text-zinc-600">•</span>
              {obs}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-violet-800 bg-violet-950/50 p-5">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-widest text-violet-400">
            The Move
          </p>
          <span className="rounded-full bg-violet-900/60 px-2 py-0.5 text-xs font-medium text-violet-300">
            {check.analysis.effort}
          </span>
        </div>
        <p className="mt-2 font-semibold text-violet-100">
          {check.analysis.cleanupAction}
        </p>
      </section>

      <div className="flex gap-3">
        <Link
          href="/check"
          className="flex-1 rounded-xl border border-zinc-700 bg-zinc-900 py-3 text-center text-sm font-medium text-zinc-300 transition hover:border-zinc-600"
        >
          Check another room
        </Link>
        <Link
          href="/"
          className="flex-1 rounded-xl bg-violet-600 py-3 text-center text-sm font-semibold text-white transition hover:bg-violet-500"
        >
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
