"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MOCK_HISTORY } from "@/lib/mock-analysis";
import { getHistory } from "@/lib/client-storage";
import { formatRelativeTime } from "@/lib/status";
import type { RoomCheck, RoomStatus } from "@/types";

const STATUS_STYLES: Record<
  RoomStatus,
  {
    badge: string;
    icon: string;
    meter: string;
    fill: number;
    rotate: string;
    label?: string;
  }
> = {
  Stable: {
    badge: "bg-secondary text-on-secondary",
    icon: "bg-secondary-fixed text-on-secondary-fixed-variant",
    meter: "bg-secondary",
    fill: 1,
    rotate: "rotate-[1deg]",
  },
  "Slight Drift": {
    badge: "bg-primary text-on-primary",
    icon: "bg-primary-fixed text-primary",
    meter: "bg-primary",
    fill: 2,
    rotate: "rotate-[2deg]",
  },
  "Getting Suspicious": {
    badge: "bg-tertiary-container text-on-tertiary",
    icon: "bg-tertiary-fixed text-tertiary",
    meter: "bg-tertiary-container",
    fill: 3,
    rotate: "rotate-[-3deg]",
  },
  "Side Quest": {
    badge: "bg-error text-on-error",
    icon: "bg-error-container text-error",
    meter: "bg-error",
    fill: 4,
    rotate: "rotate-[2deg]",
  },
  "Bro…": {
    badge: "bg-error text-on-error",
    icon: "bg-error-container text-error",
    meter: "bg-error",
    fill: 4,
    rotate: "rotate-[-3deg]",
    label: "Bro...",
  },
};

const ROOM_ICONS: Record<string, string> = {
  Kitchen: "kitchen",
  "Living Room": "chair",
  Bedroom: "bed",
  Bathroom: "bathtub",
  Office: "computer",
};

export default function Dashboard() {
  const [history, setHistory] = useState<RoomCheck[]>([]);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const checks = history.length > 0 ? history : (MOCK_HISTORY as RoomCheck[]);
  const isDemo = history.length === 0;
  const latestByRoom = Object.values(
    checks.reduce<Record<string, RoomCheck>>(
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

  const quip =
    checks.find((check) => check.analysis.status !== "Stable")?.analysis
      .roast ?? "The floor is visible. Suspicious, but promising.";

  return (
    <div className="min-h-screen bg-background pb-32 font-body-base">
      <header className="fixed top-0 z-50 flex h-16 w-full items-center justify-between bg-surface px-margin-mobile pt-base">
        <div className="flex items-center gap-base">
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 border-primary bg-primary-fixed shadow-sm">
            <span className="material-symbols-outlined text-primary">
              smart_toy
            </span>
          </div>
          <span className="font-h1 text-h1 text-primary">Broomba</span>
        </div>
        <button
          type="button"
          className="squish-active flex h-12 w-12 items-center justify-center rounded-full text-primary"
          aria-label="Settings"
        >
          <span className="material-symbols-outlined text-[32px]">
            face_retouching_natural
          </span>
        </button>
      </header>

      <main className="space-y-lg px-margin-mobile pb-4 pt-24">
        <section className="space-y-xs">
          <h1 className="font-h1 text-h1">Welcome back, messy.</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            {quip}
          </p>
        </section>

        <section className="space-y-md">
          <div className="flex items-end justify-between gap-md">
            <h2 className="font-h2 text-h2">Room Status</h2>
            <span className="rounded-full bg-primary-fixed px-3 py-1 font-label-caps text-label-caps text-primary">
              {isDemo ? "DEMO" : "LIVE"}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-md">
            {latestByRoom.map((check) => {
              const style = STATUS_STYLES[check.analysis.status];
              return (
                <Link
                  key={check.id}
                  href={
                    isDemo ? `/result?id=${check.id}&mock=1` : `/result?id=${check.id}`
                  }
                  className="flex items-center justify-between rounded-lg border border-outline-variant/20 bg-surface-container-lowest p-md tinted-shadow"
                >
                  <div className="flex min-w-0 items-center gap-md">
                    <div
                      className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${style.icon}`}
                    >
                      <span className="material-symbols-outlined text-[28px]">
                        {ROOM_ICONS[check.roomName] ?? "other_houses"}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate font-h3 text-h3">
                        {check.roomName}
                      </h3>
                      <div className="mt-1 flex w-28 gap-1">
                        {Array.from({ length: 4 }).map((_, index) => (
                          <div
                            key={index}
                            className={`mess-meter-segment ${
                              index < style.fill
                                ? style.meter
                                : "bg-surface-container-high"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`ml-md whitespace-nowrap rounded-DEFAULT px-4 py-1 font-h3 text-h3 shadow-lg ${style.badge} ${style.rotate}`}
                  >
                    {style.label ?? check.analysis.status}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="space-y-md">
          <h2 className="font-h2 text-h2">Recent Roasts</h2>
          <div className="flex snap-x gap-md overflow-x-auto pb-4">
            {checks.map((check) => (
              <Link
                key={check.id}
                href={
                  isDemo ? `/result?id=${check.id}&mock=1` : `/result?id=${check.id}`
                }
                className="min-w-[280px] snap-start rounded-lg border border-white/40 bg-white/60 p-md shadow-sm backdrop-blur-md glass-card"
              >
                <div className="mb-base flex items-center gap-sm">
                  <span className="material-symbols-outlined text-primary">
                    history
                  </span>
                  <span className="font-label-caps text-label-caps text-on-surface-variant">
                    {formatRelativeTime(check.timestamp)}
                  </span>
                </div>
                <p className="font-body-lg text-body-lg text-on-surface">
                  &ldquo;{check.analysis.roast}&rdquo;
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-lg bg-secondary-container p-md text-on-secondary-container tinted-shadow">
          <span className="font-label-caps text-label-caps">FREE BETA</span>
          <h2 className="mt-base font-h3 text-h3">Help shape paid Broomba later.</h2>
          <p className="mt-base font-body-base text-body-base opacity-80">
            Scan a few rooms, save the results that feel useful, and use the ad
            link you came from so we can learn which jokes are actually landing.
          </p>
        </section>
      </main>

      <Link
        href="/check"
        className="squish-active fixed bottom-32 right-[20px] z-40 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-on-primary shadow-[0_8px_25px_rgba(85,14,231,0.4)]"
        aria-label="Check a room"
      >
        <span className="material-symbols-outlined text-[32px]">
          add_a_photo
        </span>
      </Link>
    </div>
  );
}
