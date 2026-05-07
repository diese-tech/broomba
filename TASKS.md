# Tasks — Broomba

Simple checklist. Keep it short. Move things, don't let it rot.

---

## In Progress

- [ ] Phase 1.5: Rebuild UI to match Stitch designs

---

## To Do

### Phase 1.5 — UI Rebuild (Stitch Design System)
- [ ] Update `app/layout.tsx` — light bg, Syne/Inter fonts, bottom nav shell
- [ ] Rebuild `app/page.tsx` (dashboard) — "Welcome back, messy." header, room status cards with mess meters, recent roasts horizontal scroll, FAB
- [ ] Rebuild `app/check/page.tsx` — 2×2 room icon grid, large upload zone, Broomba AI quip
- [ ] Rebuild `app/result/ResultContent.tsx` — hero photo, rotated status badge overlay, bold purple roast text, glass-card evidence list, mint action card, "Done, I'm sorry" CTA
- [ ] Validate `npm run build` clean after rebuild
- [ ] Manual smoke-test: full room check flow end-to-end

### Phase 2 — Real AI Analysis
- [ ] Set up Anthropic SDK (`npm install @anthropic-ai/sdk`)
- [ ] Write Claude vision prompt (structured JSON output)
- [ ] Wire `/api/analyze` route — image upload → base64 → Claude API
- [ ] Validate and type the JSON response against `AnalysisResult` type
- [ ] Replace `getMockAnalysis()` call with real API response
- [ ] Add loading state and error handling to check/result flow

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
- [x] Create README.md, MVP.md, ROADMAP.md, TASKS.md, DECISIONS.md
- [x] Scaffold Next.js app
- [x] Build dashboard with mocked history (dark prototype)
- [x] Build room check form (room name + image upload)
- [x] Build analysis result screen with mocked AI response
- [x] Wire navigation between screens
- [x] Verify clean `next build` (0 errors, 0 type errors)
- [x] Phase 1 static prototype shipped to main
- [x] Google Stitch design system generated and reviewed
- [x] Design tokens added to `app/globals.css`
- [x] Stitch reference HTML saved to `design/`
- [x] DECISIONS.md updated with design pivot rationale

---

## Blocked

_Nothing blocked right now._
