"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { MOCK_HISTORY } from "@/lib/mock-analysis";
import {
  getAttribution,
  getCheckById,
  getLatestCheck,
  recordEvent,
  saveCheck,
} from "@/lib/client-storage";
import type { RoomCheck, RoomStatus } from "@/types";

const STATUS_STYLES: Record<
  RoomStatus,
  { badge: string; icon: string; label?: string }
> = {
  Stable: {
    badge: "bg-secondary text-on-secondary",
    icon: "bg-secondary-fixed text-on-secondary-fixed-variant",
  },
  "Slight Drift": {
    badge: "bg-primary text-on-primary",
    icon: "bg-primary-fixed text-primary",
  },
  "Getting Suspicious": {
    badge: "bg-tertiary-container text-on-tertiary",
    icon: "bg-tertiary-fixed text-tertiary",
  },
  "Side Quest": {
    badge: "bg-error text-on-error",
    icon: "bg-error-container text-error",
  },
  "Bro…": {
    badge: "bg-error text-on-error",
    icon: "bg-error-container text-error",
    label: "Bro...",
  },
};

const EVIDENCE_ICONS = [
  "coffee_maker",
  "bottom_sheets",
  "terrain",
  "cleaning_services",
];

function formatEffort(effort: string) {
  return effort.replace("min", "mins").toUpperCase();
}

export default function ResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [check, setCheck] = useState<RoomCheck | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const isMockHistory = searchParams.get("mock") === "1";
    const id = searchParams.get("id");

    if (!isMockHistory && id) {
      const found = getCheckById(id);
      if (found) {
        setCheck(found);
        setSaved(true);
        return;
      }
    }

    if (isMockHistory && id) {
      const found = MOCK_HISTORY.find((c) => c.id === id);
      if (found) {
        setCheck(found as RoomCheck);
        return;
      }
    }

    const latest = getLatestCheck();
    if (latest) {
      setCheck(latest);
    } else {
      router.replace("/");
    }
  }, [searchParams, router]);

  if (!check) {
    return (
      <div className="flex h-screen items-center justify-center bg-background font-body-lg text-body-lg text-on-surface-variant">
        Loading...
      </div>
    );
  }

  const statusStyle = STATUS_STYLES[check.analysis.status];
  const safeStatusStyle = statusStyle ?? STATUS_STYLES["Slight Drift"];

  function handleSave() {
    if (!check) return;
    saveCheck(check);
    setSaved(true);
    recordEvent({
      name: "result_saved",
      timestamp: new Date().toISOString(),
      attribution: getAttribution(),
      details: { roomName: check.roomName, status: check.analysis.status },
    });
  }

  return (
    <main className="min-h-screen bg-background pb-32 font-body-base">
      <section className="relative w-full aspect-[4/5] overflow-hidden rounded-b-lg tinted-shadow">
        {check.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={check.imageUrl}
            alt={`${check.roomName} photo`}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary-fixed to-surface-container">
            <span className="material-symbols-outlined text-[96px] text-primary">
              photo_camera
            </span>
          </div>
        )}

        <div className="absolute right-4 top-4 -rotate-3">
          <span
            className={`block rounded-full px-6 py-2 font-h3 text-h3 uppercase tracking-widest shadow-2xl ${safeStatusStyle.badge}`}
          >
            {safeStatusStyle.label ?? check.analysis.status}
          </span>
        </div>
      </section>

      <div className="flex flex-col gap-md px-margin-mobile pt-md">
        <section>
          <h2 className="font-h2 text-h2 leading-tight text-primary">
            {check.analysis.roast}
          </h2>
        </section>

        <section className="flex flex-col gap-sm">
          <h3 className="px-xs font-label-caps text-label-caps uppercase tracking-widest text-outline">
            THE EVIDENCE
          </h3>
          <div className="grid grid-cols-1 gap-sm">
            {check.analysis.observations.map((observation, index) => (
              <div
                key={`${observation}-${index}`}
                className="flex items-center gap-md rounded-lg p-md glass-card"
              >
                <span
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${safeStatusStyle.icon}`}
                >
                  <span className="material-symbols-outlined">
                    {EVIDENCE_ICONS[index % EVIDENCE_ICONS.length]}
                  </span>
                </span>
                <p className="font-body-lg text-body-lg text-on-surface">
                  {observation}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-base rounded-lg border-2 border-secondary bg-secondary-container p-md text-on-secondary-container tinted-shadow">
          <div className="flex items-center justify-between gap-md">
            <span className="rounded-full bg-on-secondary-container/10 px-3 py-1 font-label-caps text-label-caps">
              ONE TINY ACTION
            </span>
            <span className="font-label-caps text-label-caps text-on-secondary-container/70">
              {formatEffort(check.analysis.effort)}
            </span>
          </div>
          <h3 className="font-h3 text-h3 leading-tight">
            {check.analysis.cleanupAction}
          </h3>
          <p className="font-body-base text-body-base opacity-80">
            Do it for your future self. They are rooting for you.
          </p>
        </section>

        <div className="flex flex-col gap-sm pt-base">
          <Link
            href="/"
            className="squish-active flex h-14 w-full items-center justify-center gap-base rounded-full bg-primary font-h3 text-h3 text-on-primary shadow-[0_8px_30px_rgba(85,14,231,0.3)]"
          >
            <span>Done, I&apos;m sorry</span>
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              check_circle
            </span>
          </Link>
          <button
            type="button"
            onClick={handleSave}
            disabled={saved}
            className="h-14 w-full rounded-full bg-surface-container-high font-body-lg text-body-lg text-on-surface-variant disabled:opacity-60"
          >
            {saved ? "Saved to History" : "Save to History"}
          </button>
        </div>
      </div>
    </main>
  );
}
