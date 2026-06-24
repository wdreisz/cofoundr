# CoFoundr — Product Requirements Document

**A swipe-based matchmaking app for entrepreneurs.**

| | |
|---|---|
| **Author** | Briar Reisz |
| **Status** | Draft v0.1 |
| **Last updated** | 2026-06-22 |
| **Target** | iOS / Android (React Native), web companion |

---

## 1. Overview

CoFoundr applies the familiar Tinder mechanic — a fast, low-friction swipe deck — to a high-stakes professional problem: **finding the right person to start or grow a company with.** Instead of matching on photos and proximity, it matches on complementary skills, stage, commitment level, industry, and working style.

The core insight: founders waste months at networking events and in warm-intro chains looking for a co-founder, early hire, advisor, or investor. A structured, intent-driven matching surface compresses that search from months to days.

### One-liner
> Tinder for co-founders — swipe to find the person who completes your cap table.

---

## 2. Problem statement

- **Finding a co-founder is the #1 reason startups fail to start.** Talent is distributed; opportunity to meet the *complementary* person is not.
- Existing tools are wrong-shaped: LinkedIn is a résumé graveyard optimized for recruiters, not partnerships. Accelerator programs gate access behind admission. Slack/Discord communities are noisy and unstructured.
- There is **no intent signal** in existing networks. You can't tell who is *actively looking* to start something this quarter vs. who is heads-down at a job.

### Goals
1. Let a founder go from sign-up to first meaningful conversation in **under 10 minutes**.
2. Surface **complementary** matches (technical ↔ business, not technical ↔ technical) by default.
3. Make **intent and commitment explicit** so both sides know what they're opting into.

### Non-goals
- Not a job board (no formal applications, no ATS).
- Not a fundraising platform (investor matching is a later phase, not v1).

> **Update (dual-mode):** the product now supports an optional, opt-in **Dating mode** in addition to co-founder matching — a switchable second discovery surface for founders who want to date other founders (thesis: building a company is a lifestyle, so founders align well romantically). It uses an *alignment* algorithm (shared world, pace, geography, age) rather than the co-founder *complementarity* algorithm, and is orientation-aware. Co-founder matching remains the default and is unaffected when dating is off. Trust & safety, verification, and reporting (already first-class) become even more important with a romantic surface.

---

## 3. Target users & personas

| Persona | Looking for | Primary intent |
|---|---|---|
| **The Domain Founder** (Amara) | Technical co-founder / CTO | Has the idea + market, needs to build it |
| **The Builder** (Dev) | Business co-founder / commercial partner | Can ship product, needs GTM + fundraising |
| **The Operator** (Sam) | Early co-founding team to join | Wants equity + a mission, flexible on idea |
| **The Angel / Advisor** (Pat) | Founders to back or mentor | Deal flow + giving back |

v1 focuses on the first three (founder ↔ founder ↔ early operator). Advisors/angels are gated to a later phase.

---

## 4. Core user flows

### 4.1 Onboarding (the matching profile)
A structured profile, not a freeform bio. Each field feeds the matching algorithm:

1. **Identity & verification** — name, photo, LinkedIn OAuth (verifies work history, reduces fakes).
2. **Role & superpower** — what you bring (e.g. *Technical · backend/infra*).
3. **What you're seeking** — complementary role(s) (e.g. *Seeking CTO*).
4. **Stage** — idea / pre-seed / building / has revenue.
5. **Commitment** — full-time now / nights & weekends / exploring.
6. **Industry & interests** — tags for fit scoring.
7. **Deal expectations** — equity openness, location/remote, timeline.

> **Design principle:** every onboarding question must change a match. If it doesn't affect ranking, cut it.

### 4.2 Discover (the swipe deck)
- A vertical stack of profile cards, each showing a **fit score**, role tags, commitment, and a short pitch.
- **Connect (bolt icon)** — express intent. **Skip (×)** — pass. **Save (bookmark)** — shortlist without committing.
- Mutual Connect → **Match** → chat unlocks.
- Daily curated batch (quality over infinite scroll) to keep signal high and prevent spray-and-pray.

### 4.3 Match & conversation
- On a mutual match, both get an icebreaker prompt seeded from shared tags ("You both tagged fintech + pre-seed").
- In-app chat with lightweight scheduling (propose a call slot).
- Optional **"working session" prompt** after first chat: a structured 30-min agenda to test fit.

### 4.4 Profile & settings
- Edit matching profile, pause discovery ("heads down"), manage filters, privacy/blocking.

---

## 5. Matching algorithm (v1)

A weighted fit score, surfaced as the `94% fit` badge. Composed of:

| Signal | Weight | Logic |
|---|---|---|
| **Role complementarity** | 35% | Seeking ↔ Brings must invert (penalize two of the same) |
| **Stage alignment** | 20% | Same or adjacent stage scores high |
| **Commitment match** | 20% | Full-time ↔ full-time; mismatch heavily penalized |
| **Industry/interest overlap** | 15% | Jaccard similarity on tags |
| **Location/remote compatibility** | 10% | Same metro or both remote-OK |

v1 is rules-based and explainable. v2 introduces a learned ranking model on top, trained on which connections convert to sustained conversations.

---

## 6. UI concept & design direction

The interface borrows Tinder's **single-card focus and gestural commitment** but strips the dopamine-mining patterns (infinite decks, hidden likes) in favor of a calmer, intent-first surface. See the rendered mockup of the **Discover** screen above. Key design decisions:

- **Card = a decision, not a profile dump.** Each card shows only what's needed to decide to connect: fit score, the seeking/brings inversion, commitment, equity stance, and a one-line pitch. Detail lives on tap-through.
- **Three actions, clearly weighted.** Skip (×, neutral) and Connect (bolt, accented with the only 2px border in the system) flank a smaller Save. The bolt — not a heart — keeps the tone professional.
- **Fit score is always visible** and explainable ("why am I seeing this?") to build trust in the matching.
- **Calm, flat, native aesthetic** — white surfaces, 0.5px borders, two type weights, semantic color only (success green for fit, info blue for primary action). No gradients or gamified confetti.
- **Bottom nav:** Discover · Matches · Saved · Profile.

### Screens to design for v1
1. Onboarding wizard (7 steps, progress bar)
2. **Discover deck** ← mocked above
3. Profile detail (tap-through)
4. Matches list + chat
5. Saved/shortlist
6. Profile editor & settings

---

## 7. Functional requirements

### Must-have (v1)
- [ ] LinkedIn OAuth sign-up + identity verification
- [ ] Structured matching profile (§4.1)
- [ ] Rules-based fit scoring + daily curated deck
- [ ] Swipe deck with Connect / Skip / Save
- [ ] Mutual-match detection → chat unlock
- [ ] In-app messaging with seeded icebreakers
- [ ] Filters (role, stage, location, commitment)
- [ ] Block / report / pause discovery

### Should-have (v1.1) — implemented in the prototype
- [x] Filters (role/brings, stage, commitment, location) on the deck
- [x] Call scheduling inside chat (slot picker → invite card → confirmation)
- [x] "Working session" structured fit-test agenda (shareable in chat)
- [x] Boost (timed 3× visibility with live countdown)

### Later
- [ ] Advisor/angel matching tier
- [ ] Learned ranking model (v2)
- [ ] Reference/endorsement layer ("vouched by")
- [ ] Web companion app

---

## 8. Non-functional requirements

- **Trust & safety:** mandatory identity verification, report/block flows, manual review queue for flagged accounts. This is the moat — a low-noise, real-people network.
- **Privacy:** profiles not publicly indexed; visible only within the matching pool. No exporting other users' data.
- **Performance:** deck loads in <1s; chat is real-time (websocket).
- **Quality control:** daily batch limit to prevent spam-swiping; rate-limit Connects per day.

---

## 9. Success metrics

| Metric | Target (90 days post-launch) |
|---|---|
| **Activation** — sign-up → completed profile | ≥ 60% |
| **Time to first match** | < 48 hours (median) |
| **Match → conversation** rate | ≥ 40% of matches exchange ≥5 messages |
| **Conversation → call** rate | ≥ 25% |
| **North star** — *sustained partnerships* (matched pairs still talking after 30 days) | Track from day 1 |
| **Trust** — fake/spam report rate | < 2% of accounts |

---

## 10. Open questions & risks

- **Cold-start liquidity.** A matching market is worthless without density on both sides. *Mitigation:* launch geo-by-geo (one startup hub at a time), seed with accelerator/community partnerships.
- **Adverse selection.** Will the best founders use a swipe app, or does that signal desperation? *Mitigation:* invite-only beta, verification, calm/professional tone vs. dating-app feel.
- **Equity/legal conversations** happen off-platform — do we provide templates (co-founder agreements, vesting) as a value-add and retention hook?
- **Monetization** (not in v1): premium = unlimited Connects + Boost + advisor access. Decide before scaling.

---

## 11. Phased rollout

| Phase | Scope | Gate |
|---|---|---|
| **0 — Prototype** | Onboarding + Discover deck + match (no chat), single city | Internal + 50 design partners |
| **1 — Beta** | + Chat, filters, trust/safety, invite-only | 1 startup hub, 1k users |
| **2 — Launch** | + Scheduling, Boost, open sign-up | Multi-city, liquidity proven |
| **3 — Expand** | + Advisor tier, learned ranking, web | Monetization on |

---

*This PRD covers v1 scope. The Discover-screen mockup above reflects the intended visual direction; remaining screens to be designed against the same system before build.*
