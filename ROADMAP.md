# Roadmap — Broomba

## Current Phase: Phase 1 — Static Prototype

---

## Phase 0: Project Setup ✅
**Goal:** Create the app foundation.

Deliverables:
- [x] Initialize project repo
- [x] Create README.md
- [x] Create ROADMAP.md
- [x] Create MVP.md
- [x] Create DECISIONS.md
- [x] Create TASKS.md
- [x] Choose stack (Next.js + TypeScript + Tailwind)
- [x] Document local setup steps

Completion criteria:
- App runs locally
- Project docs exist
- Next tasks are clearly tracked

---

## Phase 1: Static Prototype 🔄
**Goal:** Build the UI without AI.

Deliverables:
- [x] Room selection screen
- [x] Image upload UI
- [x] Mocked analysis result screen
- [x] Basic dashboard/history UI

Completion criteria:
- User can simulate a full room check with fake data

---

## Phase 2: Real AI Analysis
**Goal:** Connect image analysis.

Deliverables:
- [ ] Send uploaded image to Claude vision API
- [ ] Return structured JSON result
- [ ] Validate response format
- [ ] Display real analysis in UI

Completion criteria:
- Uploaded room photo returns real status, roast, observations, and one cleanup action

---

## Phase 3: Local Persistence
**Goal:** Save room checks.

Deliverables:
- [ ] Save room checks to local JSON file or SQLite
- [ ] Display previous checks
- [ ] Group checks by room
- [ ] Basic status timeline

Completion criteria:
- User can review previous room checks after refreshing/reopening app

---

## Phase 4: Baseline + Drift
**Goal:** Compare against previous room state.

Deliverables:
- [ ] Set first photo as baseline per room
- [ ] Compare new photo to prior/baseline
- [ ] Identify whether room is cleaner, stable, or drifting
- [ ] Update prompt logic to use comparison context

Completion criteria:
- App can say whether a room is getting better or worse over time

---

## Phase 5: Personality System
**Goal:** Make tone a product feature.

Deliverables:
- [ ] Abstract personality modes
- [ ] Keep Bro Mode as default
- [ ] Add at least 2 more modes (e.g. Passive-Aggressive Roommate, Corporate Manager)
- [ ] Make mode selectable per user/session
- [ ] Document tone rules

Completion criteria:
- Same room analysis can be rewritten in different personalities

---

## Phase 6: Tiny Action Engine
**Goal:** Improve usefulness.

Deliverables:
- [ ] Convert observations into one prioritized cleanup action
- [ ] Avoid overwhelming task lists
- [ ] Estimate effort
- [ ] Optionally generate a 3-step "reset plan"

Completion criteria:
- User always gets one clear action they can do immediately

---

## Phase 7: Habit Loop
**Goal:** Encourage repeat use.

Deliverables:
- [ ] Basic reminder-ready architecture
- [ ] Lightweight "last checked" indicator
- [ ] Recurring pattern notes
- [ ] "This room usually drifts after X days" insights

Completion criteria:
- App starts feeling aware of the user's habits

---

## Phase 8: Future Expansion
**Goal:** Prepare for productization.

Potential later features:
- Mobile-first PWA
- Push notifications
- Household/shared mode
- Partner-safe language mode
- Screenshot/share cards
- Room lore and recurring jokes
- Subscription model
- App Store release

Not planned until MVP is validated.
