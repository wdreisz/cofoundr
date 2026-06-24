import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { modeV } from "./schema";
import { getMyProfile } from "./profiles";
import { maybeMatch } from "./swipes";
import { scoreCofounder, scoreRomance } from "./lib/matching";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const subject = (await ctx.auth.getUserIdentity())?.subject;
    if (!subject) return [];
    const me = await getMyProfile(ctx);
    if (!me) return [];

    const saves = await ctx.db
      .query("swipes")
      .withIndex("by_user_mode", (q) => q.eq("userId", subject))
      .filter((q) => q.eq(q.field("action"), "save"))
      .collect();

    const out = [];
    for (const s of saves) {
      // skip if already matched (connected from saved)
      const matched = await ctx.db
        .query("matches")
        .withIndex("by_user_target_mode", (q) =>
          q.eq("userId", subject).eq("targetId", s.targetId).eq("mode", s.mode)
        )
        .unique();
      if (matched) continue;
      const profile = await ctx.db.get(s.targetId);
      if (!profile) continue;
      const scored = s.mode === "romance" ? scoreRomance(me, profile) : scoreCofounder(me, profile);
      out.push({ profile, mode: s.mode, score: scored.score });
    }
    return out;
  },
});

export const remove = mutation({
  args: { targetId: v.id("profiles"), mode: modeV },
  handler: async (ctx, { targetId, mode }) => {
    const subject = (await ctx.auth.getUserIdentity())?.subject;
    if (!subject) throw new Error("Not signed in");
    const saves = await ctx.db
      .query("swipes")
      .withIndex("by_user_target_mode", (q) =>
        q.eq("userId", subject).eq("targetId", targetId).eq("mode", mode)
      )
      .filter((q) => q.eq(q.field("action"), "save"))
      .collect();
    await Promise.all(saves.map((s) => ctx.db.delete(s._id)));
  },
});

export const connect = mutation({
  args: { targetId: v.id("profiles"), mode: modeV },
  handler: async (ctx, { targetId, mode }) => {
    const subject = (await ctx.auth.getUserIdentity())?.subject;
    if (!subject) throw new Error("Not signed in");
    const matched = await maybeMatch(ctx, subject, targetId, mode);
    return { matched };
  },
});
