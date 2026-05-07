import { Suspense } from "react";
import ResultContent from "./ResultContent";

export default function ResultPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-48 items-center justify-center text-zinc-500">
          Loading…
        </div>
      }
    >
      <ResultContent />
    </Suspense>
  );
}
