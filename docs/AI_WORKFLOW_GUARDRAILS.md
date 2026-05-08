# AI Workflow Guardrails

Broomba will eventually rely on AI image analysis, scheduled checks, and async cleanup workflows. These guardrails keep that automation predictable, retry-safe, and easy to operate while the product is still small.

## Core Principles

- Prefer explicit, observable workflows over hidden side effects.
- Keep each AI or automation step narrow enough to retry safely.
- Minimize shared mutable state between jobs, requests, and scheduled tasks.
- Preserve the existing product direction when fixing bugs; avoid speculative rewrites.
- Degrade gracefully when AI, storage, queues, or scheduled jobs are unavailable.

## Automation Safety

- Treat automation as user-visible product behavior, not background magic.
- Require a clear trigger, owner, input shape, and expected output for each automated workflow.
- Keep destructive actions out of automated flows unless a future design explicitly adds confirmation.
- Do not let scheduled or retried work create duplicate room checks, duplicate notifications, or conflicting state.

## Queue-First Async Workflows

- Prefer queue-style job boundaries for slow work such as image analysis, drift comparison, reminder preparation, or report generation.
- Store enough job metadata to explain what happened: room name, image reference, status, timestamps, attempt count, and failure reason.
- Keep request handlers responsible for accepting work and returning state, not doing every long-running operation inline.
- Design job payloads to be versioned so prompt and schema changes do not break older queued work.

## Retry-Safe Jobs

- Make retries idempotent by using stable identifiers for room checks and analysis jobs.
- Separate "job accepted," "analysis started," "analysis completed," and "result saved" states.
- Record errors in a way the UI or operator can inspect without rerunning the job blindly.
- Use bounded retries with clear terminal failure states.

## Scheduling Behavior

- Scheduling should be conservative by default.
- Avoid overlapping runs for the same room or household.
- Use explicit time windows and skip behavior when a prior run is still active.
- Keep reminders and recurring checks easy to disable or pause.

## State Management

- Keep source-of-truth state small and boring: room checks, room identity, image reference, analysis result, and timestamps.
- Avoid global mutable caches for user or room state.
- Store derived insights separately from raw check records when drift analysis arrives.
- Favor append-only history for room checks so accidental overwrites are less likely.

## Graceful Degradation

- If AI analysis fails, keep the uploaded check visible with a failed or retryable state.
- If persistence fails, tell the user the result may not be saved instead of pretending history is current.
- If a scheduler or queue is unavailable, keep manual room checks working.
- If an image cannot be analyzed, return a useful validation error rather than a generic failure.

## Operational Observability

- Log workflow transitions and failures with stable job or check identifiers.
- Track latency for upload handling, AI analysis, persistence, and scheduled jobs.
- Capture enough context to debug without logging sensitive image contents.
- Add tests around retry, duplicate submission, and failure paths when those workflows are implemented.

## Change Discipline

- Keep workflow fixes scoped to the failing behavior.
- Do not rewrite prompts, persistence, scheduling, and UI in one change unless the issue explicitly requires it.
- Preserve existing docs and decisions unless they conflict with a documented product or safety requirement.
- Prefer small reversible changes while the app is moving from prototype to MVP.
