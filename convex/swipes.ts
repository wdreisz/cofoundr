import { mutation, MutationCtx } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { v } from "convex/values";
import { modeV, actionV } from "./schema";
import { getMyProfile } from "./profiles";
import { isMutual, makeIcebreaker } from "./lib/matching";

/** Create a match (idempotent) if the swipe is mutual. Returns whether a match was made. */
export async function maybeMatch(
  ctx: MutationCtx,
  subject: string,
  targetId: Id<"profiles">,
  mode: "cofounder" | "romance"
): Promise<boolean> {
  const me = await getMyProfile(ctx);
  if (!me) return false;
  const target = await ctx.db.get(targetId);
  if (!target) return false;
  if (!isMutual(me, target, mode)) return false;

  const existing = await ctx.db
    .query("matches")
    .withIndex("by_user_target_mode", (q) =>
      q.eq("userId", subject).eq("targetId", targetId).eq("mode", mode)
    )
    .unique();
  if (existing) return true;

  await ctx.db.insert("matches", {
    userId: subject,
    targetId,
    mode,
    icebreaker: makeIcebreaker(me, target, mode),
  });
  return true;
}

export const act = mutation({
  args: { targetId: v.id("profiles"), mode: modeV, action: actionV },
  handler: async (ctx, { targetId, mode, action }) => {
    const subject = (await ctx.auth.getUserIdentity())?.subject;
    if (!subject) throw new Error("Not signed in");

    await ctx.db.insert("swipes", { userId: subject, targetId, mode, action });

    if (action === "connect") {
      const matched = await maybeMatch(ctx, subject, targetId, mode);
      return { matched };
    }
    return { matched: false };
  },
});
