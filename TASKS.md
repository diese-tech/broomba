# Tasks — Broomba

Simple checklist. Keep it short. Move things, don't let it rot.

---

## In Progress

_Nothing in progress right now._

---

## To Do

### Phase 1 — Polish
- [ ] Test full room check flow end-to-end (manual)
- [ ] Mobile-responsive check on dashboard and result screen

### Phase 2 — Real AI Analysis
- [ ] Set up Anthropic SDK
- [ ] Write Claude vision prompt (structured JSON output)
- [ ] Create `/api/analyze` route (stub exists at `app/api/analyze/route.ts`)
- [ ] Handle image upload → base64 → API call
- [ ] Validate and type the JSON response
- [ ] Wire real response into result screen

### Phase 3 — Local Persistence
- [ ] Choose persistence layer (JSON file vs SQLite)
- [ ] Create data schema for room checks
- [ ] Save result on analysis completion
- [ ] Load and display history on dashboard
- [ ] Group checks by room name

---

## Done

- [x] Create project repo
- [x] Choose stack (Next.js + TypeScript + Tailwind)
- [x] Create README.md
- [x] Create MVP.md
- [x] Create ROADMAP.md
- [x] Create TASKS.md
- [x] Create DECISIONS.md
- [x] Scaffold Next.js app
- [x] Build dashboard with mocked history
- [x] Build room check form (room name + image upload)
- [x] Build analysis result screen with mocked AI response
- [x] Wire navigation between screens
- [x] Verify clean `next build` (0 errors, 0 type errors)
- [x] Phase 1 static prototype complete

---

## Blocked

_Nothing blocked right now._
