# CoFoundr

Tinder-style matchmaking app for entrepreneurs — swipe to find a complementary co-founder. Built from [PRD.md](PRD.md).

A React + TypeScript + Vite single-page app. Mobile-framed UI following a flat, calm design system.

## Run

```bash
npm install
npm run dev      # dev server (http://localhost:5173)
npm run build    # type-check + production build to dist/
```

## What it does

1. **Onboarding** — a 7-step wizard builds your structured matching profile (role you bring, role you seek, stage, commitment, industries, pitch). Every field feeds the algorithm.
2. **Discover** — a ranked swipe deck. Each card shows a **fit score**, the seeking/brings inversion, commitment, equity, and an explainable "why you're seeing this". Skip / Save / Connect via buttons or drag gestures.
3. **Match & chat** — a mutual Connect unlocks a conversation seeded with an icebreaker drawn from shared interests; the other founder replies.
4. **Saved** — shortlist founders without committing, then Connect later.
5. **Profile** — your matching profile and live activity stats.

### v1.1 features

- **Filters** — narrow the deck by the role a founder brings, stage, commitment, and remote-friendliness; the sheet previews the result count live.
- **Boost** — a timed 30-minute "3× visibility" state with a live countdown banner on the deck.
- **In-chat call scheduling** — pick a 20-minute slot; an invite card posts to the thread and the other founder confirms.
- **Working-session agenda** — share a structured 30-minute fit-test agenda (equity, decision-making, deal-breakers) as a card in chat.

### Dating mode

A second discovery mode, switchable at the top of Discover (Co-founder ↔ Dating), on the thesis that founders align romantically with other founders because building a company is a lifestyle.

- **Two different algorithms.** Co-founder matching rewards *complementarity* (technical ↔ business). Dating matching rewards *alignment* — shared industries, similar pace/commitment, geography, age, and life stage (`scoreRomance` in [matching.ts](src/lib/matching.ts)).
- **Orientation-aware.** The dating deck only shows people whose gender/seeking preferences are mutually compatible and who are open to dating (`orientationCompatible`).
- **Opt-in.** Collected in onboarding (optional final step) or enabled later from the Dating mode CTA. Off by default; the co-founder experience is unaffected.
- **Mode-tagged everywhere.** Matches and Saved label each person co-founder vs. dating; the match overlay, icebreaker, and chat actions adapt per mode (e.g. no "working session" agenda in a dating chat).

### Responsive: mobile + desktop

The same app renders two layouts based on viewport width (`useIsDesktop`, breakpoint 1024px) — no separate codebase, the screen components are shared:

- **Mobile (< 1024px)** — the phone frame with a bottom tab bar and full-screen swipe deck.
- **Desktop / laptop (≥ 1024px)** — a left sidebar (brand, nav, Filters/Boost), a centered swipe deck on Discover, a **two-pane Matches** (conversation list + live chat, like a desktop messenger), a multi-column Saved grid, and a centered Profile. Sheets and the match overlay render as centered modals.

State is preserved across the switch (resize the window to see it adapt live).

## Architecture

```
src/
  types.ts              Domain model (Founder, Profile, Match, …)
  data/
    founders.ts         The signed-in user + 10 mock founders
    labels.ts           Enum → display label / pill-color maps
  lib/
    matching.ts         Weighted fit score (role 35 / stage 20 / commitment 20 / industry 15 / location 10)
    match.ts            Mutual-match detection + seeded icebreakers
  components/
    BottomNav.tsx       Discover · Matches · Saved · Profile
    MatchOverlay.tsx    "It's a match!" screen
  screens/
    Onboarding.tsx      7-step profile wizard
    Discover.tsx        Swipe deck with drag gestures + explainable fit
    Matches.tsx         Match list + chat view
    Saved.tsx           Shortlist
    ProfileScreen.tsx   Own profile + stats
  App.tsx               State owner: deck, seen, saved, matches, chat
```

The matching algorithm is rules-based and explainable (PRD §5). Complementary roles (technical ↔ business) rank highest; two of the same role are penalized.
