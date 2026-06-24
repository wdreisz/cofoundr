export type Role =
  | "technical"
  | "business"
  | "design"
  | "operator";

export type Stage = "idea" | "pre-seed" | "building" | "revenue";

export type Commitment = "full-time" | "nights-weekends" | "exploring";

/** Discovery modes: matching a co-founder vs. dating a fellow founder. */
export type Mode = "cofounder" | "romance";

export type Gender = "man" | "woman" | "nonbinary";

export type DatingIntent = "long-term" | "see-where-it-goes" | "casual";

/** A person's dating preferences. */
export interface Dating {
  open: boolean;
  gender: Gender;
  /** genders they're open to dating */
  seeking: Gender[];
  intent: DatingIntent;
}

export interface Founder {
  id: string;
  name: string;
  age: number;
  initials: string;
  location: string;
  remoteOk: boolean;
  /** what they bring */
  brings: Role;
  /** complementary role(s) they're seeking */
  seeking: Role;
  stage: Stage;
  commitment: Commitment;
  industries: string[];
  pitch: string;
  equity: string;
  secondTime: boolean;
  gender: Gender;
  dating: { open: boolean; seeking: Gender[]; intent: DatingIntent };
}

/** The signed-in user's matching profile. */
export interface Profile {
  name: string;
  initials: string;
  location: string;
  remoteOk: boolean;
  brings: Role;
  seeking: Role;
  stage: Stage;
  commitment: Commitment;
  industries: string[];
  pitch: string;
  age?: number;
  dating: Dating;
}

export interface ScoredFounder {
  founder: Founder;
  score: number;
  reasons: string[];
}

export type ChatMessage = {
  id: string;
  from: "me" | "them";
  text: string;
  /** Special message types rendered as cards. */
  kind?: "text" | "call" | "session";
  /** For "call" cards: the proposed slot, e.g. "Thu, 2:00 PM". */
  when?: string;
  /** For "call" cards: whether the other founder accepted. */
  accepted?: boolean;
  /** For "session" cards: the agenda items shared. */
  agenda?: string[];
};

export interface Filters {
  brings: Role | "any";
  stage: Stage | "any";
  commitment: Commitment | "any";
  remoteOnly: boolean;
}

export const noFilters: Filters = {
  brings: "any",
  stage: "any",
  commitment: "any",
  remoteOnly: false,
};

export interface Match {
  founderId: string;
  mode: Mode;
  messages: ChatMessage[];
  icebreaker: string;
}

export interface SavedItem {
  id: string;
  mode: Mode;
}

export type Tab = "discover" | "matches" | "saved" | "profile";
