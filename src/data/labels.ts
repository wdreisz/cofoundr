import type { Role, Stage, Commitment, DatingIntent, Gender } from "../types";

export const roleLabel: Record<Role, string> = {
  technical: "Technical",
  business: "Business",
  design: "Design",
  operator: "Operator",
};

export const roleSeekingLabel: Record<Role, string> = {
  technical: "Seeking CTO",
  business: "Seeking business co-founder",
  design: "Seeking design lead",
  operator: "Seeking founding operator",
};

export const stageLabel: Record<Stage, string> = {
  idea: "Idea stage",
  "pre-seed": "Pre-seed",
  building: "Building",
  revenue: "Has revenue",
};

export const commitmentLabel: Record<Commitment, string> = {
  "full-time": "Full-time",
  "nights-weekends": "Nights & weekends",
  exploring: "Exploring",
};

export type PillColor =
  | "purple"
  | "teal"
  | "coral"
  | "gray"
  | "amber"
  | "pink";

export const stageColor: Record<Stage, PillColor> = {
  idea: "gray",
  "pre-seed": "coral",
  building: "amber",
  revenue: "teal",
};

export const intentLabel: Record<DatingIntent, string> = {
  "long-term": "Long-term",
  "see-where-it-goes": "See where it goes",
  casual: "Keeping it casual",
};

export const genderLabel: Record<Gender, string> = {
  man: "Man",
  woman: "Woman",
  nonbinary: "Non-binary",
};

export const seekingGenderLabel: Record<Gender, string> = {
  man: "Men",
  woman: "Women",
  nonbinary: "Non-binary people",
};
