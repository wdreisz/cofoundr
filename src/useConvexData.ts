import { useMemo } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import type { Id } from "../convex/_generated/dataModel";
import type {
  ChatMessage, Founder, Match, Mode, Profile, SavedItem, ScoredFounder,
} from "./types";

type ProfileDoc = {
  _id: Id<"profiles">;
  name: string; age: number; initials: string; location: string; remoteOk: boolean;
  brings: Founder["brings"]; seeking: Founder["seeking"]; stage: Founder["stage"];
  commitment: Founder["commitment"]; industries: string[]; pitch: string; equity: string;
  secondTime: boolean; gender: Founder["gender"];
  datingOpen: boolean; datingSeeking: Founder["gender"][]; datingIntent: Founder["dating"]["intent"];
  onboarded: boolean;
};

function toFounder(p: ProfileDoc): Founder {
  return {
    id: p._id,
    name: p.name, age: p.age, initials: p.initials, location: p.location, remoteOk: p.remoteOk,
    brings: p.brings, seeking: p.seeking, stage: p.stage, commitment: p.commitment,
    industries: p.industries, pitch: p.pitch, equity: p.equity, secondTime: p.secondTime,
    gender: p.gender,
    dating: { open: p.datingOpen, seeking: p.datingSeeking, intent: p.datingIntent },
  };
}

function toProfile(p: ProfileDoc): Profile {
  return {
    name: p.name, initials: p.initials, location: p.location, remoteOk: p.remoteOk,
    brings: p.brings, seeking: p.seeking, stage: p.stage, commitment: p.commitment,
    industries: p.industries, pitch: p.pitch, age: p.age,
    dating: { open: p.datingOpen, gender: p.gender, seeking: p.datingSeeking, intent: p.datingIntent },
  };
}

function toMessage(m: {
  _id: Id<"messages">; from: "me" | "them"; text: string;
  kind?: "text" | "call" | "session"; when?: string; accepted?: boolean; agenda?: string[];
}): ChatMessage {
  return { id: m._id, from: m.from, text: m.text, kind: m.kind, when: m.when, accepted: m.accepted, agenda: m.agenda };
}

/** Live data layer backed by Convex. Mirrors the shapes the screens already consume. */
export function useCofoundr(mode: Mode, activeChat: { targetId: Id<"profiles">; mode: Mode } | null) {
  const meDoc = useQuery(api.profiles.me) as ProfileDoc | null | undefined;
  const deckRaw = useQuery(api.deck.get, { mode }) as { founder: ProfileDoc; score: number; reasons: string[] }[] | undefined;
  const matchesRaw = useQuery(api.matches.list);
  const savedRaw = useQuery(api.saved.list);
  const chatMsgs = useQuery(
    api.messages.list,
    activeChat ? { targetId: activeChat.targetId, mode: activeChat.mode } : "skip"
  );

  const upsert = useMutation(api.profiles.upsert);
  const act = useMutation(api.swipes.act);
  const savedConnect = useMutation(api.saved.connect);
  const savedRemove = useMutation(api.saved.remove);
  const sendMessage = useMutation(api.messages.send);
  const proposeCall = useMutation(api.messages.proposeCall);
  const sendSession = useMutation(api.messages.sendSession);

  const profile = meDoc ? toProfile(meDoc) : null;

  const deck: ScoredFounder[] = useMemo(
    () => (deckRaw ?? []).map((r) => ({ founder: toFounder(r.founder), score: r.score, reasons: r.reasons })),
    [deckRaw]
  );

  const founderOf = useMemo(() => {
    const map = new Map<string, Founder>();
    for (const r of deckRaw ?? []) map.set(r.founder._id, toFounder(r.founder));
    for (const m of matchesRaw ?? []) map.set((m.profile as ProfileDoc)._id, toFounder(m.profile as ProfileDoc));
    for (const s of savedRaw ?? []) map.set((s.profile as ProfileDoc)._id, toFounder(s.profile as ProfileDoc));
    return map;
  }, [deckRaw, matchesRaw, savedRaw]);

  const matches: Match[] = useMemo(
    () =>
      (matchesRaw ?? []).map((m) => {
        const isActive = activeChat?.targetId === (m.match.targetId as Id<"profiles">);
        const msgs: ChatMessage[] = isActive
          ? (chatMsgs ?? []).map(toMessage)
          : m.lastMessage
            ? [{ id: "preview", from: m.lastMessage.from, text: m.lastMessage.text }]
            : [];
        return {
          founderId: m.match.targetId as string,
          mode: m.match.mode as Mode,
          icebreaker: m.match.icebreaker,
          messages: msgs,
        };
      }),
    [matchesRaw, chatMsgs, activeChat]
  );

  const saved: { item: SavedItem; founder: Founder; score: number }[] = useMemo(
    () =>
      (savedRaw ?? []).map((s) => ({
        item: { id: (s.profile as ProfileDoc)._id, mode: s.mode as Mode },
        founder: toFounder(s.profile as ProfileDoc),
        score: s.score,
      })),
    [savedRaw]
  );

  const loading = meDoc === undefined;

  return {
    loading,
    profile,
    deck,
    matches,
    saved,
    founderOf: (id: string) => founderOf.get(id),
    saveProfile: (p: Profile) =>
      upsert({
        name: p.name, age: p.age ?? 30, location: p.location, remoteOk: p.remoteOk,
        brings: p.brings, seeking: p.seeking, stage: p.stage, commitment: p.commitment,
        industries: p.industries, pitch: p.pitch, gender: p.dating.gender,
        datingOpen: p.dating.open, datingSeeking: p.dating.seeking, datingIntent: p.dating.intent,
      }),
    act: (id: string, m: Mode, action: "connect" | "skip" | "save") =>
      act({ targetId: id as Id<"profiles">, mode: m, action }),
    connectSaved: (id: string, m: Mode) => savedConnect({ targetId: id as Id<"profiles">, mode: m }),
    removeSaved: (id: string, m: Mode) => savedRemove({ targetId: id as Id<"profiles">, mode: m }),
    send: (id: string, m: Mode, text: string) => sendMessage({ targetId: id as Id<"profiles">, mode: m, text }),
    propose: (id: string, m: Mode, when: string) => proposeCall({ targetId: id as Id<"profiles">, mode: m, when }),
    session: (id: string, m: Mode, agenda: string[]) => sendSession({ targetId: id as Id<"profiles">, mode: m, agenda }),
  };
}
