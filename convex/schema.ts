import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const roleV = v.union(
  v.literal("technical"),
  v.literal("business"),
  v.literal("design"),
  v.literal("operator")
);
export const stageV = v.union(
  v.literal("idea"),
  v.literal("pre-seed"),
  v.literal("building"),
  v.literal("revenue")
);
export const commitmentV = v.union(
  v.literal("full-time"),
  v.literal("nights-weekends"),
  v.literal("exploring")
);
export const genderV = v.union(
  v.literal("man"),
  v.literal("woman"),
  v.literal("nonbinary")
);
export const intentV = v.union(
  v.literal("long-term"),
  v.literal("see-where-it-goes"),
  v.literal("casual")
);
export const modeV = v.union(v.literal("cofounder"), v.literal("romance"));
export const actionV = v.union(
  v.literal("connect"),
  v.literal("skip"),
  v.literal("save")
);

/** Shared shape of a person's matchable profile (also used for seeded demo founders). */
export const profileFields = {
  /** Clerk subject for real users; undefined for seeded demo founders. */
  userId: v.optional(v.string()),
  isSeed: v.boolean(),
  onboarded: v.boolean(),
  name: v.string(),
  age: v.number(),
  initials: v.string(),
  location: v.string(),
  remoteOk: v.boolean(),
  brings: roleV,
  seeking: roleV,
  stage: stageV,
  commitment: commitmentV,
  industries: v.array(v.string()),
  pitch: v.string(),
  equity: v.string(),
  secondTime: v.boolean(),
  gender: genderV,
  datingOpen: v.boolean(),
  datingSeeking: v.array(genderV),
  datingIntent: intentV,
};

export default defineSchema({
  profiles: defineTable(profileFields).index("by_user", ["userId"]),

  swipes: defineTable({
    userId: v.string(),
    targetId: v.id("profiles"),
    mode: modeV,
    action: actionV,
  })
    .index("by_user_mode", ["userId", "mode"])
    .index("by_user_target_mode", ["userId", "targetId", "mode"]),

  matches: defineTable({
    userId: v.string(),
    targetId: v.id("profiles"),
    mode: modeV,
    icebreaker: v.string(),
  })
    .index("by_user", ["userId"])
    .index("by_user_target_mode", ["userId", "targetId", "mode"]),

  messages: defineTable({
    userId: v.string(),
    targetId: v.id("profiles"),
    mode: modeV,
    from: v.union(v.literal("me"), v.literal("them")),
    text: v.string(),
    kind: v.optional(v.union(v.literal("text"), v.literal("call"), v.literal("session"))),
    when: v.optional(v.string()),
    accepted: v.optional(v.boolean()),
    agenda: v.optional(v.array(v.string())),
  }).index("by_convo", ["userId", "targetId", "mode"]),
});
