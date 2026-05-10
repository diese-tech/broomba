const target = process.env.LOAD_TEST_URL ?? "http://localhost:3000/api/analyze";
const concurrency = Number(process.env.LOAD_TEST_CONCURRENCY ?? 8);
const requests = Number(process.env.LOAD_TEST_REQUESTS ?? 64);
const scenario = process.env.LOAD_TEST_SCENARIO ?? "valid";
const ipPool = Number(process.env.LOAD_TEST_IP_POOL ?? Math.max(200, requests));
const devicePool = Number(process.env.LOAD_TEST_DEVICE_POOL ?? requests);

const imageData =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2w==";

function percentile(values, pct) {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.min(sorted.length - 1, Math.ceil((pct / 100) * sorted.length) - 1);
  return sorted[index];
}

function buildRequest(index) {
  const headers = {
    "content-type": "application/json",
    "x-forwarded-for":
      scenario === "burst" || scenario === "quota"
        ? "203.0.113.10"
        : `198.51.${Math.floor((index % ipPool) / 250)}.${10 + (index % 250)}`,
  };

  const base = {
    roomName: "Kitchen",
    deviceId:
      scenario === "quota" || scenario === "burst"
        ? "load-test-device"
        : `load-test-device-${index % devicePool}`,
    personality: "bro",
    imageData,
  };

  if (scenario === "missing_photo") {
    delete base.imageData;
  }

  return { headers, body: JSON.stringify(base) };
}

async function runOne(index) {
  const started = performance.now();
  const request = buildRequest(index);
  try {
    const response = await fetch(target, {
      method: "POST",
      headers: request.headers,
      body: request.body,
    });
    await response.text();
    return {
      ok: response.ok,
      status: response.status,
      latencyMs: performance.now() - started,
    };
  } catch (error) {
    return {
      ok: false,
      status: "network_error",
      latencyMs: performance.now() - started,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

async function main() {
  const results = [];
  let next = 0;

  async function worker() {
    while (next < requests) {
      const index = next;
      next += 1;
      results.push(await runOne(index));
    }
  }

  const started = performance.now();
  await Promise.all(Array.from({ length: concurrency }, worker));
  const totalMs = performance.now() - started;

  const statuses = results.reduce((acc, result) => {
    acc[result.status] = (acc[result.status] ?? 0) + 1;
    return acc;
  }, {});
  const latencies = results.map((result) => result.latencyMs);

  console.log(
    JSON.stringify(
      {
        target,
        scenario,
        requests,
        concurrency,
        ipPool,
        devicePool,
        totalMs: Math.round(totalMs),
        requestsPerSecond: Number((requests / (totalMs / 1000)).toFixed(2)),
        statuses,
        latencyMs: {
          min: Math.round(Math.min(...latencies)),
          p50: Math.round(percentile(latencies, 50)),
          p95: Math.round(percentile(latencies, 95)),
          max: Math.round(Math.max(...latencies)),
        },
      },
      null,
      2
    )
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
