import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Inter, Syne } from "next/font/google";
import AttributionTracker from "./AttributionTracker";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-syne",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Broomba - Your apartment has opinions.",
  description:
    "A personality-driven AI roommate that catches mess drift before life gets annoying.",
  applicationName: "Broomba",
  appleWebApp: {
    capable: true,
    title: "Broomba",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: "#550ee7",
};

function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-around rounded-t-lg border-t border-outline-variant/30 bg-surface-container-low/80 px-4 pb-8 pt-4 shadow-[0_-8px_30px_rgba(110,61,255,0.12)] backdrop-blur-xl">
      <Link
        href="/"
        className="flex scale-105 flex-col items-center justify-center rounded-full bg-secondary-container px-6 py-2 text-on-secondary-container transition-all duration-300 active:scale-95"
      >
        <span
          className="material-symbols-outlined"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          home_filled
        </span>
        <span className="mt-1 font-label-caps text-label-caps">Home</span>
      </Link>
      <Link
        href="/"
        className="flex flex-col items-center justify-center rounded-full px-4 py-2 text-on-surface-variant opacity-70 transition-all active:scale-95"
      >
        <span className="material-symbols-outlined">history</span>
        <span className="mt-1 font-label-caps text-label-caps">History</span>
      </Link>
      <span className="flex cursor-not-allowed flex-col items-center justify-center rounded-full px-4 py-2 text-on-surface-variant opacity-40">
        <span className="material-symbols-outlined">person</span>
        <span className="mt-1 font-label-caps text-label-caps">Profile</span>
      </span>
    </nav>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${syne.variable} ${inter.variable} min-h-screen bg-background text-on-background antialiased`}
      >
        <Suspense fallback={null}>
          <AttributionTracker />
        </Suspense>
        {children}
        <BottomNav />
      </body>
    </html>
  );
}
