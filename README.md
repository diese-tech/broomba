# Broomba

> Your apartment has opinions.

Broomba is a personality-driven AI roommate that uses room photos to detect mess drift over time, then responds with humor, light guilt, and one tiny actionable cleanup task.

This is not a chore app. It's a funny AI that catches you before things get bad.

---

## What it does

1. You upload or take a photo of a room
2. Broomba analyzes visible clutter and mess drift
3. You get a room status, a short roast, and one tiny cleanup task
4. Your history is saved so you can see if a room is getting better or worse

---

## Who it's for

People who:
- Avoid cleaning until it becomes stressful
- Want a nudge, not a lecture
- Live with partners and want to reduce friction
- Would genuinely laugh at "your laundry chair is gaining sentience"

---

## Current Phase

**Phase 1 — Static Prototype**

The UI is fully built with mocked analysis results. No real AI yet.

MVP status: In progress — see [MVP.md](./MVP.md)

---

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Storage | Local JSON file (Phase 0–3) |
| AI Vision | Claude (Phase 2+) |

---

## Local Setup

```bash
# Install dependencies
npm install

# Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Project Docs

- [MVP.md](./MVP.md) — scope, features, acceptance criteria
- [ROADMAP.md](./ROADMAP.md) — phases and deliverables
- [TASKS.md](./TASKS.md) — current task tracking
- [DECISIONS.md](./DECISIONS.md) — architectural decisions log
- [docs/AI_WORKFLOW_GUARDRAILS.md](./docs/AI_WORKFLOW_GUARDRAILS.md) - guardrails for AI, async jobs, scheduling, and automation changes
