type LogDetails = Record<string, string | number | boolean | null | undefined>;

export function logAnalyzeEvent(event: string, details: LogDetails) {
  console.info(
    JSON.stringify({
      event,
      route: "/api/analyze",
      timestamp: new Date().toISOString(),
      ...details,
    })
  );
}
