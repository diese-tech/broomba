import { Suspense } from "react";
import ResultContent from "./ResultContent";

export default function ResultPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-background font-body-lg text-body-lg text-on-surface-variant">
          Loading...
        </div>
      }
    >
      <ResultContent />
    </Suspense>
  );
}
