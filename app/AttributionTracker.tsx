"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { captureAttribution, getAttribution, recordEvent } from "@/lib/client-storage";

export default function AttributionTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const attribution = captureAttribution(searchParams);
    const hasVisited = window.sessionStorage.getItem("broomba:visited");
    recordEvent({
      name: hasVisited ? "return_visit" : "visit",
      timestamp: new Date().toISOString(),
      attribution: attribution ?? getAttribution(),
      details: { pathname },
    });
    window.sessionStorage.setItem("broomba:visited", "1");
  }, [pathname, searchParams]);

  return null;
}
