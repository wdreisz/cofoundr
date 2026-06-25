import { mutation } from "./_generated/server";

/**
 * Dev helper: clear ALL swipes, matches, and messages for every account, so the
 * deck refills with the full founder pool. Keeps profiles (you + seeded founders).
 * Run with: npx convex run reset:everything   (add --prod to target production)
 */
export const everything = mutation({
  args: {},
  handler: async (ctx) => {
    let swipes = 0,
      matches = 0,
      messages = 0;
    for (const d of await ctx.db.query("swipes").collect()) {
      await ctx.db.delete(d._id);
      swipes++;
    }
    for (const d of await ctx.db.query("matches").collect()) {
      await ctx.db.delete(d._id);
      matches++;
    }
    for (const d of await ctx.db.query("messages").collect()) {
      await ctx.db.delete(d._id);
      messages++;
    }
    return { cleared: { swipes, matches, messages }, message: "Deck reset — all founders are swipeable again." };
  },
});

/** Clear only the signed-in user's swipes/matches/messages. */
export const mine = mutation({
  args: {},
  handler: async (ctx) => {
    const subject = (await ctx.auth.getUserIdentity())?.subject;
    if (!subject) throw new Error("Not signed in");
    let n = 0;
    for (const d of await ctx.db.query("swipes").withIndex("by_user_mode", (q) => q.eq("userId", subject)).collect()) {
      await ctx.db.delete(d._id);
      n++;
    }
    for (const d of await ctx.db.query("matches").withIndex("by_user", (q) => q.eq("userId", subject)).collect()) {
      await ctx.db.delete(d._id);
    }
    const msgs = await ctx.db.query("messages").collect();
    for (const m of msgs) if (m.userId === subject) await ctx.db.delete(m._id);
    return { clearedSwipes: n };
  },
});
