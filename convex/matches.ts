import { query } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const subject = (await ctx.auth.getUserIdentity())?.subject;
    if (!subject) return [];

    const matches = await ctx.db
      .query("matches")
      .withIndex("by_user", (q) => q.eq("userId", subject))
      .collect();

    const out = [];
    for (const m of matches) {
      const profile = await ctx.db.get(m.targetId);
      if (!profile) continue;
      const msgs = await ctx.db
        .query("messages")
        .withIndex("by_convo", (q) =>
          q.eq("userId", subject).eq("targetId", m.targetId).eq("mode", m.mode)
        )
        .collect();
      const last = msgs[msgs.length - 1];
      out.push({
        match: m,
        profile,
        lastMessage: last ? { from: last.from, text: last.text } : null,
        messageCount: msgs.length,
      });
    }
    return out;
  },
});
