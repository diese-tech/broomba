"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getMockAnalysis } from "@/lib/mock-analysis";

const ROOM_OPTIONS = [
  {
    name: "Kitchen",
    icon: "kitchen",
    circle: "bg-primary-container text-on-primary-container",
    hover: "hover:bg-primary-fixed",
    quip: "Counter chaos tells me everything I need to know.",
  },
  {
    name: "Living Room",
    icon: "chair",
    circle: "bg-secondary-container text-on-secondary-container",
    hover: "hover:bg-secondary-fixed",
    quip: "The couch area always has receipts. Usually literal ones.",
  },
  {
    name: "Bedroom",
    icon: "bed",
    circle: "bg-tertiary-container text-on-tertiary-container",
    hover: "hover:bg-tertiary-fixed",
    quip: "The laundry chair and I are no longer on speaking terms.",
  },
  {
    name: "Bathroom",
    icon: "bathtub",
    circle: "bg-primary text-on-primary",
    hover: "hover:bg-primary-fixed-dim",
    quip: "Show me the sink and I will show you the truth.",
  },
];

export default function CheckPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [roomName, setRoomName] = useState("");
  const [customRoom, setCustomRoom] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const selectedRoom = roomName === "__custom__" ? customRoom : roomName;
  const selectedOption = ROOM_OPTIONS.find((room) => room.name === roomName);
  const quip =
    roomName === "__custom__"
      ? "A mystery room. Bold. Disturbing. I respect it."
      : selectedOption?.quip ??
        "I've seen cleaner garage floors than what you're about to show me, haven't I?";

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

    await new Promise((r) => setTimeout(r, 1800));
    const result = getMockAnalysis(selectedRoom);

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
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col px-margin-mobile pb-32 pt-lg font-body-base">
      <Link
        href="/"
        className="squish-active mb-md flex items-center gap-xs font-body-lg text-body-lg text-on-surface-variant"
      >
        <span className="material-symbols-outlined">arrow_back</span>
        <span>Back</span>
      </Link>

      <form onSubmit={handleSubmit} className="flex flex-1 flex-col">
        <section className="mb-lg">
          <span className="mb-base inline-block rounded-full bg-tertiary-fixed px-3 py-1 font-label-caps text-label-caps text-tertiary">
            JUDGMENT TIME
          </span>
          <h1 className="font-h1 text-h1 leading-tight">
            Which room are we judging today?
          </h1>
        </section>

        <section className="mb-lg grid grid-cols-2 gap-md">
          {ROOM_OPTIONS.map((room) => {
            const selected = roomName === room.name;
            return (
              <button
                key={room.name}
                type="button"
                onClick={() => setRoomName(room.name)}
                className={`squish-active flex min-h-40 flex-col items-center justify-center gap-sm rounded-lg bg-surface-container-lowest p-md tinted-shadow transition-all ${room.hover} ${
                  selected ? "ring-2 ring-primary ring-offset-2" : ""
                }`}
              >
                <span
                  className={`flex h-16 w-16 items-center justify-center rounded-full ${room.circle}`}
                >
                  <span className="material-symbols-outlined text-[32px]">
                    {room.icon}
                  </span>
                </span>
                <span className="text-center font-h3 text-h3">
                  {room.name}
                </span>
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => setRoomName("__custom__")}
            className={`squish-active col-span-2 flex items-center justify-center rounded-lg bg-surface-container-lowest p-md tinted-shadow transition-all hover:bg-surface-variant ${
              roomName === "__custom__" ? "ring-2 ring-primary ring-offset-2" : ""
            }`}
          >
            <span className="mr-md flex h-12 w-12 items-center justify-center rounded-full bg-on-surface-variant text-surface">
              <span className="material-symbols-outlined text-[24px]">
                other_houses
              </span>
            </span>
            <span className="font-h3 text-h3">Something Else</span>
          </button>
        </section>

        {roomName === "__custom__" && (
          <input
            type="text"
            placeholder="Name this room"
            value={customRoom}
            onChange={(e) => setCustomRoom(e.target.value)}
            className="mb-md h-14 w-full rounded-xl border-2 border-outline-variant bg-primary-fixed px-md font-body-lg text-body-lg text-on-surface placeholder:text-on-surface-variant focus:border-primary focus:outline-none"
            autoFocus
          />
        )}

        <section className="mb-md">
          {imagePreview ? (
            <div className="space-y-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imagePreview}
                alt="Room preview"
                className="aspect-[4/3] w-full rounded-xl object-cover tinted-shadow"
              />
              <button
                type="button"
                onClick={() => {
                  setImagePreview(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                className="font-body-base text-body-base text-on-surface-variant underline"
              >
                Remove photo
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="squish-active flex min-h-56 w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-outline-variant bg-surface-container-lowest p-md text-center"
            >
              <span className="material-symbols-outlined mb-sm text-[52px] text-primary">
                photo_camera
              </span>
              <span className="font-h3 text-h3 text-primary">
                Upload Photo
              </span>
              <span className="font-body-base text-body-base text-on-surface-variant">
                Let Broomba see the mess
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

        <section className="mb-lg flex items-start gap-md rounded-lg p-md glass-card">
          <span className="material-symbols-outlined text-[32px] text-primary">
            smart_toy
          </span>
          <div>
            <p className="font-body-lg text-body-lg italic text-on-surface">
              &ldquo;{quip}&rdquo;
            </p>
            <p className="mt-base font-label-caps text-label-caps text-on-surface-variant">
              BROOMBA AI IS READY
            </p>
          </div>
        </section>

        <button
          type="submit"
          disabled={!selectedRoom.trim() || isAnalyzing}
          className="squish-active mt-auto flex h-14 w-full items-center justify-center rounded-full bg-primary font-h3 text-h3 text-on-primary shadow-[0_8px_30px_rgba(85,14,231,0.3)] transition disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isAnalyzing ? "Analyzing..." : "Roast this room"}
        </button>
      </form>
    </main>
  );
}
