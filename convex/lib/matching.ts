// Pure matching logic, mirrors src/lib/matching.ts but on the flat Convex profile shape.

export type MatchProfile = {
  brings: string;
  seeking: string;
  stage: string;
  commitment: string;
  industries: string[];
  location: string;
  remoteOk: boolean;
  age: number;
  gender: string;
  datingOpen: boolean;
  datingSeeking: string[];
};

export type Scored<T> = { founder: T; score: number; reasons: string[] };

const stageOrder = ["idea", "pre-seed", "building", "revenue"];

function roleScore(p: MatchProfile, f: MatchProfile): number {
  let s = 0;
  if (f.brings === p.seeking) s += 0.5;
  if (p.brings === f.seeking) s += 0.5;
  if (f.brings === p.brings) s -= 0.5;
  return Math.max(0, Math.min(1, s));
}
function stageScore(p: MatchProfile, f: MatchProfile): number {
  const dist = Math.abs(stageOrder.indexOf(p.stage) - stageOrder.indexOf(f.stage));
  return [1, 0.6, 0.3, 0][dist] ?? 0;
}
function commitmentScore(p: MatchProfile, f: MatchProfile): number {
  if (p.commitment === f.commitment) return 1;
  const order = ["full-time", "nights-weekends", "exploring"];
  const dist = Math.abs(order.indexOf(p.commitment) - order.indexOf(f.commitment));
  return dist === 1 ? 0.4 : 0;
}
function industryScore(p: MatchProfile, f: MatchProfile): number {
  const a = new Set(p.industries.map((x) => x.toLowerCase()));
  const b = new Set(f.industries.map((x) => x.toLowerCase()));
  const inter = [...a].filter((x) => b.has(x)).length;
  const union = new Set([...a, ...b]).size;
  return union === 0 ? 0 : inter / union;
}
function locationScore(p: MatchProfile, f: MatchProfile): number {
  if (p.location.toLowerCase() === f.location.toLowerCase()) return 1;
  if (p.remoteOk && f.remoteOk) return 0.8;
  if (p.remoteOk || f.remoteOk) return 0.5;
  return 0;
}
function ageScore(a: number, b: number): number {
  const d = Math.abs(a - b);
  if (d <= 2) return 1;
  if (d <= 5) return 0.75;
  if (d <= 9) return 0.45;
  return 0.15;
}

function sharedIndustries(p: MatchProfile, f: MatchProfile): string[] {
  return p.industries.filter((x) =>
    f.industries.map((y) => y.toLowerCase()).includes(x.toLowerCase())
  );
}

export function scoreCofounder<T extends MatchProfile>(p: MatchProfile, f: T): Scored<T> {
  const parts = {
    role: roleScore(p, f),
    stage: stageScore(p, f),
    commitment: commitmentScore(p, f),
    industry: industryScore(p, f),
    location: locationScore(p, f),
  };
  const total =
    parts.role * 0.35 +
    parts.stage * 0.2 +
    parts.commitment * 0.2 +
    parts.industry * 0.15 +
    parts.location * 0.1;

  const reasons: string[] = [];
  if (parts.role >= 0.9) reasons.push("Complementary roles");
  else if (parts.role >= 0.5) reasons.push("Partial role fit");
  if (parts.stage >= 0.6) reasons.push("Stage aligned");
  if (parts.commitment === 1) reasons.push("Same commitment");
  const shared = sharedIndustries(p, f);
  if (shared.length) reasons.push(`Both in ${shared.slice(0, 2).join(" + ")}`);
  if (parts.location >= 0.8) reasons.push(parts.location === 1 ? "Same city" : "Both remote-OK");

  return { founder: f, score: Math.round(total * 100), reasons };
}

export function scoreRomance<T extends MatchProfile>(p: MatchProfile, f: T): Scored<T> {
  const parts = {
    industry: industryScore(p, f),
    commitment: commitmentScore(p, f),
    location: locationScore(p, f),
    age: ageScore(p.age, f.age),
    stage: stageScore(p, f),
  };
  const total =
    parts.industry * 0.25 +
    parts.commitment * 0.2 +
    parts.location * 0.2 +
    parts.age * 0.2 +
    parts.stage * 0.15;

  const reasons: string[] = [];
  const shared = sharedIndustries(p, f);
  if (shared.length) reasons.push(`Both into ${shared.slice(0, 2).join(" + ")}`);
  if (parts.location === 1) reasons.push("Same city");
  else if (parts.location >= 0.6) reasons.push("Both remote-friendly");
  if (parts.commitment === 1) reasons.push("Same intensity");
  if (parts.age >= 0.75) reasons.push("Close in age");
  if (parts.stage >= 0.6) reasons.push("Similar life stage");

  return { founder: f, score: Math.round(total * 100), reasons };
}

export function orientationCompatible(p: MatchProfile, f: MatchProfile): boolean {
  return (
    p.datingOpen &&
    f.datingOpen &&
    f.datingSeeking.includes(p.gender) &&
    p.datingSeeking.includes(f.gender)
  );
}

export function isMutual(p: MatchProfile, f: MatchProfile, mode: string): boolean {
  return mode === "romance" ? orientationCompatible(p, f) : f.seeking === p.brings;
}

export function makeIcebreaker(p: MatchProfile, f: MatchProfile & { name: string }, mode: string): string {
  const first = f.name.split(" ")[0];
  const shared = sharedIndustries(p, f);
  if (mode === "romance") {
    if (shared.length) {
      return `You both live the founder life and both love ${shared[0]}. Skip the small talk — what are you building, and what keeps you sane?`;
    }
    return `You're both building companies — you already get the lifestyle. Ask ${first} what they're working on right now.`;
  }
  if (shared.length) {
    return `You both tagged ${shared.slice(0, 2).join(" + ")}. Ask ${first} what drew them to it.`;
  }
  return `${first} is ${f.brings}, you're ${p.brings} — a complementary pair. Compare notes on the build.`;
}
