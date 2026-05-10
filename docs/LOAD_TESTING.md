# Broomba Load Testing

Use mock analysis for load testing. Do not load test against Claude unless the goal is an explicit provider-cost test.

For any launch-like test, configure the shared Redis limiter first. Without Redis, rate limits are per server process and do not represent a scaled deployment.

## Shared Limiter Setup

Create an Upstash Redis database and set:

```bash
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...
```

The API automatically uses Redis when both values are present. If either value is missing, it falls back to in-memory limits for local development only.

## Start A Safe Test Server

```bash
ANALYSIS_PROVIDER=mock \
BROOMBA_DAILY_SCAN_LIMIT=10000 \
BROOMBA_BURST_LIMIT=10000 \
npm run dev
```

On Windows PowerShell:

```powershell
$env:ANALYSIS_PROVIDER="mock"
$env:BROOMBA_DAILY_SCAN_LIMIT="10000"
$env:BROOMBA_BURST_LIMIT="10000"
npm run dev
```

## Simulate 1000 Launch Users

Run this only with `ANALYSIS_PROVIDER=mock`.

```bash
LOAD_TEST_URL=http://localhost:3000/api/analyze \
LOAD_TEST_REQUESTS=1000 \
LOAD_TEST_CONCURRENCY=100 \
LOAD_TEST_IP_POOL=1000 \
LOAD_TEST_DEVICE_POOL=1000 \
LOAD_TEST_SCENARIO=valid \
npm run load:test:launch
```

PowerShell:

```powershell
$env:LOAD_TEST_URL="http://localhost:3000/api/analyze"
$env:LOAD_TEST_REQUESTS="1000"
$env:LOAD_TEST_CONCURRENCY="100"
$env:LOAD_TEST_IP_POOL="1000"
$env:LOAD_TEST_DEVICE_POOL="1000"
$env:LOAD_TEST_SCENARIO="valid"
npm run load:test:launch
```

Expected result for a healthy mock-mode 1000-user launch simulation:

- Mostly or entirely `200` responses.
- No `502` or `503` responses.
- No `429` responses when each simulated user has a unique device and IP.
- P95 latency should stay comfortably below the user-visible timeout budget.

## Run Baseline Load

```bash
npm run load:test
```

Optional knobs:

```bash
LOAD_TEST_URL=http://localhost:3000/api/analyze \
LOAD_TEST_REQUESTS=200 \
LOAD_TEST_CONCURRENCY=20 \
LOAD_TEST_SCENARIO=valid \
npm run load:test
```

## Scenarios

- `valid`: unique device/IP requests that should mostly return `200`.
- `missing_photo`: validation path that should return `400` without provider work.
- `burst`: repeated requests from one IP/device, useful for checking burst `429`.
- `quota`: repeated requests from one IP/device, useful with a low `BROOMBA_DAILY_SCAN_LIMIT`.

For quota testing, start the server with a high burst limit and low daily limit:

```bash
ANALYSIS_PROVIDER=mock \
BROOMBA_DAILY_SCAN_LIMIT=3 \
BROOMBA_BURST_LIMIT=10000 \
npm run dev
```

Expected result: first 3 successful scans return `200`, later scans return `429`.

## What To Watch

The API logs structured JSON to stdout with:

- `event`: `completed`, `rejected`, `failed`, or `rate_limited`
- `provider`: `mock` or `claude`
- `status`
- `reason` when relevant
- `latencyMs`
- `quotaUsed` and `quotaLimit` for successful/quota-limited requests
- `limiterStore`: `redis` for launch-like tests, `memory` only for local tests

For the free beta, mock-mode load testing is enough to validate app routing, request validation, limiter behavior, and response latency without burning AI budget.

## Launch Test Sequence

1. Run `missing_photo` to prove bad uploads fail before provider work.
2. Run `burst` with a low `BROOMBA_BURST_LIMIT` to prove abuse is blocked.
3. Run `quota` with a low `BROOMBA_DAILY_SCAN_LIMIT` to prove daily limits are shared.
4. Run the 1000-user `valid` simulation with normal beta limits and Redis enabled.
5. Only after mock-mode results look healthy, run a tiny Claude smoke test with 3-5 requests.
