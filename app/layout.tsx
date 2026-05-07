import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Broomba — Your apartment has opinions.",
  description:
    "A personality-driven AI roommate that catches mess drift before life gets annoying.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-zinc-950 text-zinc-100 antialiased">
        <div className="mx-auto max-w-2xl px-4 pb-20">
          <header className="flex items-center justify-between py-6">
            <a href="/" className="flex items-center gap-2">
              <span className="text-2xl">🧹</span>
              <span className="text-lg font-bold tracking-tight text-zinc-100">
                Broomba
              </span>
            </a>
            <span className="text-xs text-zinc-500">
              your apartment has opinions
            </span>
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
