import type { Founder, Profile, ScoredFounder, Stage } from "../types";

const stageOrder: Stage[] = ["idea", "pre-seed", "building", "revenue"];

const WEIGHTS = {
  role: 0.35,
  stage: 0.2,
  commitment: 0.2,
  industry: 0.15,
  location: 0.1,
};

/** Role complementarity: seeking <-> brings should invert; same role is penalized. */
function roleScore(p: Profile, f: Founder): number {
  let s = 0;
  if (f.brings === p.seeking) s += 0.5; // they bring what I want
  if (p.brings === f.seeking) s += 0.5; // I bring what they want
  if (f.brings === p.brings) s -= 0.5; // two of the same — bad fit
  return Math.max(0, Math.min(1, s));
}

function stageScore(p: Profile, f: Founder): number {
  const dist = Math.abs(stageOrder.indexOf(p.stage) - stageOrder.indexOf(f.stage));
  return [1, 0.6, 0.3, 0][dist] ?? 0;
}

function commitmentScore(p: Profile, f: Founder): number {
  if (p.commitment === f.commitment) return 1;
  const order = ["full-time", "nights-weekends", "exploring"];
  const dist = Math.abs(order.indexOf(p.commitment) - order.indexOf(f.commitment));
  return dist === 1 ? 0.4 : 0;
}

function industryScore(p: Profile, f: Founder): number {
  const a = new Set(p.industries.map((x) => x.toLowerCase()));
  const b = new Set(f.industries.map((x) => x.toLowerCase()));
  const inter = [...a].filter((x) => b.has(x)).length;
  const union = new Set([...a, ...b]).size;
  return union === 0 ? 0 : inter / union;
}

function locationScore(p: Profile, f: Founder): number {
  if (p.location.toLowerCase() === f.location.toLowerCase()) return 1;
  if (p.remoteOk && f.remoteOk) return 0.8;
  if (p.remoteOk || f.remoteOk) return 0.5;
  return 0;
}

/** Scores one founder against the user's profile. Returns 0-100 plus human reasons. */
export function scoreFounder(p: Profile, f: Founder): ScoredFounder {
  const parts = {
    role: roleScore(p, f),
    stage: stageScore(p, f),
    commitment: commitmentScore(p, f),
    industry: industryScore(p, f),
    location: locationScore(p, f),
  };

  const total =
    parts.role * WEIGHTS.role +
    parts.stage * WEIGHTS.stage +
    parts.commitment * WEIGHTS.commitment +
    parts.industry * WEIGHTS.industry +
    parts.location * WEIGHTS.location;

  const reasons: string[] = [];
  if (parts.role >= 0.9) reasons.push("Complementary roles");
  else if (parts.role >= 0.5) reasons.push("Partial role fit");
  if (parts.stage >= 0.6) reasons.push("Stage aligned");
  if (parts.commitment === 1) reasons.push("Same commitment");
  const shared = p.industries.filter((x) =>
    f.industries.map((y) => y.toLowerCase()).includes(x.toLowerCase())
  );
  if (shared.length) reasons.push(`Both in ${shared.slice(0, 2).join(" + ")}`);
  if (parts.location >= 0.8) reasons.push(parts.location === 1 ? "Same city" : "Both remote-OK");

  return { founder: f, score: Math.round(total * 100), reasons };
}

/** Ranks the full deck for a profile, best fit first. */
export function rankDeck(p: Profile, list: Founder[]): ScoredFounder[] {
  return list
    .map((f) => scoreFounder(p, f))
    .sort((a, b) => b.score - a.score);
}

/* ---------------- Romance (dating) matching ---------------- */

const ROMANCE_WEIGHTS = {
  industry: 0.25,
  commitment: 0.2,
  location: 0.2,
  age: 0.2,
  stage: 0.15,
};

/** Two people can be shown to each other only if orientation + intent to date align both ways. */
export function orientationCompatible(p: Profile, f: Founder): boolean {
  return (
    p.dating.open &&
    f.dating.open &&
    f.dating.seeking.includes(p.dating.gender) &&
    p.dating.seeking.includes(f.gender)
  );
}

function ageScore(a: number, b: number): number {
  const d = Math.abs(a - b);
  if (d <= 2) return 1;
  if (d <= 5) return 0.75;
  if (d <= 9) return 0.45;
  return 0.15;
}

/** Romance rewards ALIGNMENT (shared world, similar pace, proximity) — the opposite of co-founder complementarity. */
export function scoreRomance(p: Profile, f: Founder): ScoredFounder {
  const parts = {
    industry: industryScore(p, f),
    commitment: commitmentScore(p, f),
    location: locationScore(p, f),
    age: ageScore(p.age ?? f.age, f.age),
    stage: stageScore(p, f),
  };

  const total =
    parts.industry * ROMANCE_WEIGHTS.industry +
    parts.commitment * ROMANCE_WEIGHTS.commitment +
    parts.location * ROMANCE_WEIGHTS.location +
    parts.age * ROMANCE_WEIGHTS.age +
    parts.stage * ROMANCE_WEIGHTS.stage;

  const reasons: string[] = [];
  const shared = p.industries.filter((x) =>
    f.industries.map((y) => y.toLowerCase()).includes(x.toLowerCase())
  );
  if (shared.length) reasons.push(`Both into ${shared.slice(0, 2).join(" + ")}`);
  if (parts.location === 1) reasons.push("Same city");
  else if (parts.location >= 0.6) reasons.push("Both remote-friendly");
  if (parts.commitment === 1) reasons.push("Same intensity");
  if (parts.age >= 0.75) reasons.push("Close in age");
  if (parts.stage >= 0.6) reasons.push("Similar life stage");

  return { founder: f, score: Math.round(total * 100), reasons };
}

/** Ranks compatible, dating-open founders by alignment. */
export function rankRomance(p: Profile, list: Founder[]): ScoredFounder[] {
  if (!p.dating.open) return [];
  return list
    .filter((f) => orientationCompatible(p, f))
    .map((f) => scoreRomance(p, f))
    .sort((a, b) => b.score - a.score);
}
