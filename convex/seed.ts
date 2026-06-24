import { mutation } from "./_generated/server";
import { seedFounders } from "./seedData";

/** Populate the demo founder pool. Idempotent — safe to run repeatedly. */
export const run = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db
      .query("profiles")
      .filter((q) => q.eq(q.field("isSeed"), true))
      .collect();
    if (existing.length >= seedFounders.length) {
      return { inserted: 0, message: "Already seeded" };
    }
    const have = new Set(existing.map((p) => p.name));
    let inserted = 0;
    for (const f of seedFounders) {
      if (have.has(f.name)) continue;
      await ctx.db.insert("profiles", { isSeed: true, onboarded: true, ...f });
      inserted++;
    }
    return { inserted, message: `Seeded ${inserted} founders` };
  },
});
