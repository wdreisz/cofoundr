import { query, mutation, QueryCtx } from "./_generated/server";
import { Doc } from "./_generated/dataModel";
import {
  roleV, stageV, commitmentV, genderV, intentV,
} from "./schema";
import { v } from "convex/values";

export async function getSubject(ctx: QueryCtx): Promise<string | null> {
  const identity = await ctx.auth.getUserIdentity();
  return identity?.subject ?? null;
}

export async function getMyProfile(ctx: QueryCtx): Promise<Doc<"profiles"> | null> {
  const subject = await getSubject(ctx);
  if (!subject) return null;
  return await ctx.db
    .query("profiles")
    .withIndex("by_user", (q) => q.eq("userId", subject))
    .unique();
}

export const me = query({
  args: {},
  handler: async (ctx) => getMyProfile(ctx),
});

const editableArgs = {
  name: v.string(),
  age: v.number(),
  location: v.string(),
  remoteOk: v.boolean(),
  brings: roleV,
  seeking: roleV,
  stage: stageV,
  commitment: commitmentV,
  industries: v.array(v.string()),
  pitch: v.string(),
  gender: genderV,
  datingOpen: v.boolean(),
  datingSeeking: v.array(genderV),
  datingIntent: intentV,
};

function initialsOf(name: string): string {
  return (
    name.trim().split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "ME"
  );
}

/** Create or update the signed-in user's profile (onboarding + later edits). */
export const upsert = mutation({
  args: editableArgs,
  handler: async (ctx, args) => {
    const subject = await getSubject(ctx);
    if (!subject) throw new Error("Not signed in");

    const existing = await getMyProfile(ctx);
    const fields = {
      ...args,
      initials: initialsOf(args.name),
      // sensible defaults for fields not collected from real users
      equity: "Open to discuss",
      secondTime: existing?.secondTime ?? false,
    };

    if (existing) {
      await ctx.db.patch(existing._id, fields);
      return existing._id;
    }
    return await ctx.db.insert("profiles", {
      userId: subject,
      isSeed: false,
      onboarded: true,
      ...fields,
    });
  },
});
