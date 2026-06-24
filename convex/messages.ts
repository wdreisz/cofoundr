import { query, mutation, internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";
import { modeV } from "./schema";

export const list = query({
  args: { targetId: v.id("profiles"), mode: modeV },
  handler: async (ctx, { targetId, mode }) => {
    const subject = (await ctx.auth.getUserIdentity())?.subject;
    if (!subject) return [];
    return await ctx.db
      .query("messages")
      .withIndex("by_convo", (q) =>
        q.eq("userId", subject).eq("targetId", targetId).eq("mode", mode)
      )
      .collect();
  },
});

export const send = mutation({
  args: { targetId: v.id("profiles"), mode: modeV, text: v.string() },
  handler: async (ctx, { targetId, mode, text }) => {
    const subject = (await ctx.auth.getUserIdentity())?.subject;
    if (!subject) throw new Error("Not signed in");

    const prior = await ctx.db
      .query("messages")
      .withIndex("by_convo", (q) =>
        q.eq("userId", subject).eq("targetId", targetId).eq("mode", mode)
      )
      .collect();
    const isFirst = prior.length === 0;

    await ctx.db.insert("messages", { userId: subject, targetId, mode, from: "me", text });

    if (isFirst) {
      await ctx.scheduler.runAfter(700, internal.messages.autoReply, { userId: subject, targetId, mode });
    }
  },
});

export const proposeCall = mutation({
  args: { targetId: v.id("profiles"), mode: modeV, when: v.string() },
  handler: async (ctx, { targetId, mode, when }) => {
    const subject = (await ctx.auth.getUserIdentity())?.subject;
    if (!subject) throw new Error("Not signed in");
    const id = await ctx.db.insert("messages", {
      userId: subject, targetId, mode, from: "me", kind: "call", when, accepted: false,
      text: `Proposed a call for ${when}`,
    });
    await ctx.scheduler.runAfter(800, internal.messages.acceptCall, {
      userId: subject, targetId, mode, when, messageId: id,
    });
  },
});

export const sendSession = mutation({
  args: { targetId: v.id("profiles"), mode: modeV, agenda: v.array(v.string()) },
  handler: async (ctx, { targetId, mode, agenda }) => {
    const subject = (await ctx.auth.getUserIdentity())?.subject;
    if (!subject) throw new Error("Not signed in");
    await ctx.db.insert("messages", {
      userId: subject, targetId, mode, from: "me", kind: "session", agenda,
      text: "Shared a working-session agenda",
    });
    await ctx.scheduler.runAfter(800, internal.messages.sessionReply, { userId: subject, targetId, mode });
  },
});

/* ---- Scheduled "them" replies (run as system, no auth) ---- */

export const autoReply = internalMutation({
  args: { userId: v.string(), targetId: v.id("profiles"), mode: modeV },
  handler: async (ctx, { userId, targetId, mode }) => {
    const target = await ctx.db.get(targetId);
    const topic = target?.industries[0] ?? "what you're building";
    await ctx.db.insert("messages", {
      userId, targetId, mode, from: "them",
      text: `Hey! Great to match. I'm heads-down on ${topic} right now — want to grab 20 minutes this week?`,
    });
  },
});

export const acceptCall = internalMutation({
  args: { userId: v.string(), targetId: v.id("profiles"), mode: modeV, when: v.string(), messageId: v.id("messages") },
  handler: async (ctx, { userId, targetId, mode, when, messageId }) => {
    await ctx.db.patch(messageId, { accepted: true });
    await ctx.db.insert("messages", {
      userId, targetId, mode, from: "them",
      text: `${when} works — calendar invite is in your inbox. Talk then!`,
    });
  },
});

export const sessionReply = internalMutation({
  args: { userId: v.string(), targetId: v.id("profiles"), mode: modeV },
  handler: async (ctx, { userId, targetId, mode }) => {
    await ctx.db.insert("messages", {
      userId, targetId, mode, from: "them",
      text: "Love this — added it to our call. Exactly the conversation we should have.",
    });
  },
});
