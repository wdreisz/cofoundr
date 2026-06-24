import { query } from "./_generated/server";
import { modeV } from "./schema";
import { getMyProfile } from "./profiles";
import { scoreCofounder, scoreRomance, orientationCompatible } from "./lib/matching";

/** Ranked, unseen candidates for the given mode. */
export const get = query({
  args: { mode: modeV },
  handler: async (ctx, { mode }) => {
    const subject = await ctx.auth.getUserIdentity().then((i) => i?.subject ?? null);
    if (!subject) return [];
    const me = await getMyProfile(ctx);
    if (!me || !me.onboarded) return [];
    if (mode === "romance" && !me.datingOpen) return [];

    const swiped = await ctx.db
      .query("swipes")
      .withIndex("by_user_mode", (q) => q.eq("userId", subject).eq("mode", mode))
      .collect();
    const seen = new Set(swiped.map((s) => s.targetId));

    const all = await ctx.db.query("profiles").collect();
    const candidates = all.filter(
      (p) => p._id !== me._id && p.onboarded && !seen.has(p._id)
    );

    const scored = candidates
      .filter((f) => (mode === "romance" ? orientationCompatible(me, f) : true))
      .map((f) => (mode === "romance" ? scoreRomance(me, f) : scoreCofounder(me, f)))
      .sort((a, b) => b.score - a.score);

    return scored;
  },
});
