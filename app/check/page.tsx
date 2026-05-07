"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { getMockAnalysis } from "@/lib/mock-analysis";

const PRESET_ROOMS = [
  "Living Room",
  "Bedroom",
  "Kitchen",
  "Bathroom",
  "Office",
  "Dining Room",
];

export default function CheckPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [roomName, setRoomName] = useState("");
  const [customRoom, setCustomRoom] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const selectedRoom = roomName === "__custom__" ? customRoom : roomName;

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImagePreview(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedRoom.trim()) return;

    setIsAnalyzing(true);

    // Phase 1: mock analysis — simulate latency
    await new Promise((r) => setTimeout(r, 1800));
    const result = getMockAnalysis(selectedRoom);

    // Store in sessionStorage so the result page can read it
    const checkData = {
      id: crypto.randomUUID(),
      roomName: selectedRoom,
      imageUrl: imagePreview,
      timestamp: new Date().toISOString(),
      analysis: result,
    };
    sessionStorage.setItem("latestCheck", JSON.stringify(checkData));

    router.push("/result");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Check a Room</h1>
        <p className="mt-1 text-zinc-400">
          Pick a room, upload a photo, get the verdict.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Room selection */}
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-zinc-400">
            Which room?
          </h2>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {PRESET_ROOMS.map((room) => (
              <button
                key={room}
                type="button"
                onClick={() => setRoomName(room)}
                className={`rounded-xl border px-3 py-2 text-sm font-medium transition ${
                  roomName === room
                    ? "border-violet-500 bg-violet-600/20 text-violet-300"
                    : "border-zinc-700 bg-zinc-800 text-zinc-300 hover:border-zinc-600"
                }`}
              >
                {room}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setRoomName("__custom__")}
              className={`rounded-xl border px-3 py-2 text-sm font-medium transition ${
                roomName === "__custom__"
                  ? "border-violet-500 bg-violet-600/20 text-violet-300"
                  : "border-zinc-700 bg-zinc-800 text-zinc-300 hover:border-zinc-600"
              }`}
            >
              Other…
            </button>
          </div>

          {roomName === "__custom__" && (
            <input
              type="text"
              placeholder="Name this room"
              value={customRoom}
              onChange={(e) => setCustomRoom(e.target.value)}
              className="mt-3 w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:border-violet-500 focus:outline-none"
              autoFocus
            />
          )}
        </section>

        {/* Image upload */}
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-zinc-400">
            Photo
          </h2>

          {imagePreview ? (
            <div className="space-y-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imagePreview}
                alt="Room preview"
                className="w-full rounded-xl object-cover"
                style={{ maxHeight: 280 }}
              />
              <button
                type="button"
                onClick={() => {
                  setImagePreview(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                className="text-sm text-zinc-500 underline hover:text-zinc-300"
              >
                Remove photo
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-zinc-700 py-12 transition hover:border-zinc-500"
            >
              <span className="text-4xl">📷</span>
              <span className="text-sm text-zinc-400">
                Upload a photo or take one
              </span>
              <span className="text-xs text-zinc-600">
                JPG, PNG, HEIC — any room photo works
              </span>
            </button>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            className="hidden"
          />
        </section>

        {/* Submit */}
        <button
          type="submit"
          disabled={!selectedRoom.trim() || isAnalyzing}
          className="w-full rounded-xl bg-violet-600 py-4 font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50 active:scale-95"
        >
          {isAnalyzing ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin">⏳</span>
              Analyzing…
            </span>
          ) : (
            "Roast this room"
          )}
        </button>

        {!imagePreview && selectedRoom.trim() && (
          <p className="text-center text-xs text-zinc-600">
            No photo? No problem — analysis works without one in prototype mode.
          </p>
        )}
      </form>
    </div>
  );
}
