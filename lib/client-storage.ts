"use client";

import type { RoomCheck } from "@/types";

const HISTORY_KEY = "broomba:history";
const LATEST_KEY = "broomba:latestCheck";
const DEVICE_ID_KEY = "broomba:deviceId";
const ATTRIBUTION_KEY = "broomba:attribution";
const EVENTS_KEY = "broomba:events";
const QUOTA_KEY = "broomba:successfulScans";

export const DAILY_SCAN_LIMIT = 16;
export const QUOTA_WINDOW_MS = 24 * 60 * 60 * 1000;

export interface Attribution {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  firstSeenAt: string;
}

export interface FunnelEvent {
  name: "visit" | "scan_started" | "scan_completed" | "result_saved" | "return_visit";
  timestamp: string;
  attribution?: Attribution | null;
  details?: Record<string, string | number | boolean | null>;
}

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  const raw = window.localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function getDeviceId() {
  let id = window.localStorage.getItem(DEVICE_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    window.localStorage.setItem(DEVICE_ID_KEY, id);
  }
  return id;
}

export function getHistory(): RoomCheck[] {
  return readJson<RoomCheck[]>(HISTORY_KEY, []).sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

export function saveCheck(check: RoomCheck) {
  const existing = getHistory().filter((item) => item.id !== check.id);
  writeJson(HISTORY_KEY, [check, ...existing].slice(0, 100));
  writeJson(LATEST_KEY, check);
}

export function getCheckById(id: string) {
  return getHistory().find((check) => check.id === id) ?? null;
}

export function saveLatestCheck(check: RoomCheck) {
  writeJson(LATEST_KEY, check);
}

export function getLatestCheck() {
  return readJson<RoomCheck | null>(LATEST_KEY, null);
}

export function getQuotaState(now = Date.now()) {
  const recent = readJson<number[]>(QUOTA_KEY, []).filter(
    (timestamp) => now - timestamp < QUOTA_WINDOW_MS
  );
  if (recent.length !== readJson<number[]>(QUOTA_KEY, []).length) {
    writeJson(QUOTA_KEY, recent);
  }
  const oldest = recent[0] ?? null;
  return {
    used: recent.length,
    remaining: Math.max(DAILY_SCAN_LIMIT - recent.length, 0),
    limit: DAILY_SCAN_LIMIT,
    resetAt: oldest ? new Date(oldest + QUOTA_WINDOW_MS).toISOString() : null,
  };
}

export function recordSuccessfulScan(now = Date.now()) {
  const recent = readJson<number[]>(QUOTA_KEY, []).filter(
    (timestamp) => now - timestamp < QUOTA_WINDOW_MS
  );
  writeJson(QUOTA_KEY, [...recent, now]);
}

export function captureAttribution(searchParams: URLSearchParams) {
  const fields = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
  const next: Partial<Attribution> = {};
  for (const field of fields) {
    const value = searchParams.get(field);
    if (value) next[field as keyof Attribution] = value;
  }
  if (Object.keys(next).length === 0) return getAttribution();

  const attribution: Attribution = {
    ...next,
    firstSeenAt: new Date().toISOString(),
  };
  writeJson(ATTRIBUTION_KEY, attribution);
  return attribution;
}

export function getAttribution() {
  return readJson<Attribution | null>(ATTRIBUTION_KEY, null);
}

export function recordEvent(event: FunnelEvent) {
  const events = readJson<FunnelEvent[]>(EVENTS_KEY, []);
  writeJson(EVENTS_KEY, [...events, event].slice(-250));
}
