import type { Founder, Match, Mode, Profile } from "../types";
import { orientationCompatible } from "./matching";

/** Does this founder connect back? */
export function isMutualMatch(profile: Profile, founder: Founder): boolean {
  return founder.seeking === profile.brings;
}

/** Whether a connect in the given mode results in a mutual match. */
export function wouldMatch(profile: Profile, founder: Founder, mode: Mode): boolean {
  return mode === "romance"
    ? orientationCompatible(profile, founder)
    : isMutualMatch(profile, founder);
}

function sharedIndustries(profile: Profile, founder: Founder): string[] {
  return profile.industries.filter((x) =>
    founder.industries.map((y) => y.toLowerCase()).includes(x.toLowerCase())
  );
}

export function makeIcebreaker(profile: Profile, founder: Founder, mode: Mode): string {
  const first = founder.name.split(" ")[0];
  const shared = sharedIndustries(profile, founder);

  if (mode === "romance") {
    if (shared.length) {
      return `You both live the founder life and both love ${shared[0]}. Skip the small talk — what are you building, and what keeps you sane?`;
    }
    return `You're both building companies — you already get the lifestyle. Ask ${first} what they're working on right now.`;
  }

  if (shared.length) {
    return `You both tagged ${shared.slice(0, 2).join(" + ")}. Ask ${first} what drew them to it.`;
  }
  return `${first} is ${founder.brings}, you're ${profile.brings} — a complementary pair. Compare notes on the build.`;
}

export function createMatch(profile: Profile, founder: Founder, mode: Mode): Match {
  return {
    founderId: founder.id,
    mode,
    icebreaker: makeIcebreaker(profile, founder, mode),
    messages: [],
  };
}
