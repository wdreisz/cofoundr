import { useEffect, useMemo, useState } from "react";
import type { ChatMessage, Dating, Filters, Founder, Match, Mode, Profile, SavedItem, Tab } from "./types";
import { noFilters } from "./types";
import { founders as allFounders } from "./data/founders";
import { rankDeck, rankRomance } from "./lib/matching";
import { createMatch, wouldMatch } from "./lib/match";
import { useIsDesktop } from "./hooks/useIsDesktop";
import { BottomNav } from "./components/BottomNav";
import { DesktopShell } from "./components/DesktopShell";
import { MatchOverlay } from "./components/MatchOverlay";
import { FilterSheet } from "./components/FilterSheet";
import { BoostSheet } from "./components/BoostSheet";
import { DatingSetupSheet } from "./components/DatingSetupSheet";
import { Onboarding } from "./screens/Onboarding";
import { Discover } from "./screens/Discover";
import { Matches } from "./screens/Matches";
import { Saved } from "./screens/Saved";
import { ProfileScreen } from "./screens/ProfileScreen";

const tabTitles: Record<Tab, string> = {
  discover: "Discover",
  matches: "Matches",
  saved: "Saved",
  profile: "Profile",
};

const byId = (id: string): Founder => allFounders.find((f) => f.id === id)!;

const passesFilters = (f: Founder, flt: Filters): boolean =>
  (flt.brings === "any" || f.brings === flt.brings) &&
  (flt.stage === "any" || f.stage === flt.stage) &&
  (flt.commitment === "any" || f.commitment === flt.commitment) &&
  (!flt.remoteOnly || f.remoteOk);

export function App() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [tab, setTab] = useState<Tab>("discover");
  const [mode, setMode] = useState<Mode>("cofounder");
  const isDesktop = useIsDesktop();

  const [seen, setSeen] = useState<Set<string>>(new Set());
  const [saved, setSaved] = useState<SavedItem[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [matchOverlay, setMatchOverlay] = useState<{ founder: Founder; mode: Mode } | null>(null);

  const [filters, setFilters] = useState<Filters>(noFilters);
  const [sheet, setSheet] = useState<"filter" | "boost" | "dating" | null>(null);
  const [boostLeft, setBoostLeft] = useState(0);

  useEffect(() => {
    if (boostLeft <= 0) return;
    const t = window.setTimeout(() => setBoostLeft((s) => s - 1), 1000);
    return () => window.clearTimeout(t);
  }, [boostLeft]);

  const ranked = useMemo(
    () =>
      profile
        ? { cofounder: rankDeck(profile, allFounders), romance: rankRomance(profile, allFounders) }
        : { cofounder: [], romance: [] },
    [profile]
  );

  const seenKey = (m: Mode, id: string) => `${m}:${id}`;
  const available = ranked[mode].filter((s) => !seen.has(seenKey(mode, s.founder.id)));
  const deck = mode === "cofounder" ? available.filter((s) => passesFilters(s.founder, filters)) : available;
  const filtersActive = mode === "cofounder" && JSON.stringify(filters) !== JSON.stringify(noFilters);

  const registerMatch = (founder: Founder, m: Mode) => {
    setMatches((cur) =>
      cur.some((x) => x.founderId === founder.id && x.mode === m)
        ? cur
        : [...cur, createMatch(profile!, founder, m)]
    );
  };

  const connect = (id: string, m: Mode) => {
    const founder = byId(id);
    if (wouldMatch(profile!, founder, m)) {
      registerMatch(founder, m);
      setMatchOverlay({ founder, mode: m });
    }
  };

  const handleAction = (id: string, action: "connect" | "skip" | "save") => {
    if (action === "save") {
      setSaved((cur) =>
        cur.some((x) => x.id === id && x.mode === mode) ? cur : [...cur, { id, mode }]
      );
      setSeen((cur) => new Set(cur).add(seenKey(mode, id)));
      return;
    }
    setSeen((cur) => new Set(cur).add(seenKey(mode, id)));
    if (action === "connect") connect(id, mode);
  };

  const connectFromSaved = (id: string, m: Mode) => {
    setSaved((cur) => cur.filter((x) => !(x.id === id && x.mode === m)));
    connect(id, m);
  };
  const removeSaved = (id: string, m: Mode) =>
    setSaved((cur) => cur.filter((x) => !(x.id === id && x.mode === m)));

  const appendMessage = (founderId: string, msg: ChatMessage) =>
    setMatches((cur) =>
      cur.map((m) => (m.founderId === founderId ? { ...m, messages: [...m.messages, msg] } : m))
    );

  const sendMessage = (founderId: string, text: string) => {
    const isFirst = !matches.find((m) => m.founderId === founderId)?.messages.length;
    appendMessage(founderId, { id: `m-${Date.now()}`, from: "me", text });
    if (isFirst) {
      const founder = byId(founderId);
      window.setTimeout(() => {
        appendMessage(founderId, {
          id: `r-${Date.now()}`,
          from: "them",
          text: `Hey! Great to match. I'm heads-down on ${founder.industries[0]} right now — want to grab 20 minutes this week?`,
        });
      }, 700);
    }
  };

  const proposeCall = (founderId: string, slot: string) => {
    const cardId = `c-${Date.now()}`;
    appendMessage(founderId, {
      id: cardId, from: "me", kind: "call", when: slot, accepted: false,
      text: `Proposed a call for ${slot}`,
    });
    window.setTimeout(() => {
      setMatches((cur) =>
        cur.map((m) =>
          m.founderId === founderId
            ? { ...m, messages: m.messages.map((x) => (x.id === cardId ? { ...x, accepted: true } : x)) }
            : m
        )
      );
      appendMessage(founderId, {
        id: `ra-${Date.now()}`, from: "them",
        text: `${slot} works — calendar invite is in your inbox. Talk then!`,
      });
    }, 800);
  };

  const sendSession = (founderId: string, agenda: string[]) => {
    appendMessage(founderId, {
      id: `s-${Date.now()}`, from: "me", kind: "session", agenda,
      text: "Shared a working-session agenda",
    });
    window.setTimeout(() => {
      appendMessage(founderId, {
        id: `rs-${Date.now()}`, from: "them",
        text: "Love this — added it to our call. Exactly the conversation we should have.",
      });
    }, 800);
  };

  const enableDating = (dating: Dating, age: number) => {
    setProfile((p) => (p ? { ...p, dating, age } : p));
    setSheet(null);
  };

  const openChat = (founderId: string) => {
    setActiveChat(founderId);
    setTab("matches");
  };

  const switchMode = (m: Mode) => {
    setMode(m);
    if (m === "romance" && profile && !profile.dating.open) setSheet("dating");
  };

  if (!profile) {
    return (
      <div className="app-root">
        <div className="phone">
          <Onboarding onComplete={setProfile} />
        </div>
      </div>
    );
  }

  const screen = (
    <>
      {tab === "discover" && (
        <Discover
          deck={deck}
          onAction={handleAction}
          boostLeft={boostLeft}
          filtersActive={filtersActive}
          mode={mode}
          onSwitchMode={switchMode}
          datingOpen={profile.dating.open}
          onSetupDating={() => setSheet("dating")}
        />
      )}
      {tab === "matches" && (
        <Matches
          matches={matches}
          activeChat={activeChat}
          onOpenChat={setActiveChat}
          onSend={sendMessage}
          onProposeCall={proposeCall}
          onSendSession={sendSession}
          twoPane={isDesktop}
        />
      )}
      {tab === "saved" && (
        <Saved saved={saved} profile={profile} onConnect={connectFromSaved} onRemove={removeSaved} />
      )}
      {tab === "profile" && (
        <ProfileScreen
          profile={profile}
          matchCount={matches.length}
          savedCount={saved.length}
          passCount={Math.max(0, seen.size - saved.length)}
        />
      )}
    </>
  );

  const overlays = (
    <>
      {matchOverlay && (
        <MatchOverlay
          profile={profile}
          founder={matchOverlay.founder}
          mode={matchOverlay.mode}
          onMessage={() => {
            const f = matchOverlay.founder;
            setMatchOverlay(null);
            openChat(f.id);
          }}
          onKeepSwiping={() => setMatchOverlay(null)}
        />
      )}
      {sheet === "filter" && (
        <FilterSheet
          current={filters}
          resultCount={(f) => available.filter((s) => passesFilters(s.founder, f)).length}
          onApply={(f) => { setFilters(f); setSheet(null); }}
          onClose={() => setSheet(null)}
        />
      )}
      {sheet === "boost" && (
        <BoostSheet
          active={boostLeft > 0}
          onActivate={() => { setBoostLeft(1800); setSheet(null); }}
          onClose={() => setSheet(null)}
        />
      )}
      {sheet === "dating" && (
        <DatingSetupSheet onSave={enableDating} onClose={() => setSheet(null)} />
      )}
    </>
  );

  if (isDesktop) {
    return (
      <DesktopShell
        tab={tab}
        onTab={setTab}
        matchCount={matches.length}
        boostActive={boostLeft > 0}
        filtersDisabled={mode === "romance"}
        onFilter={() => mode === "cofounder" && setSheet("filter")}
        onBoost={() => setSheet("boost")}
        overlays={overlays}
      >
        {screen}
      </DesktopShell>
    );
  }

  return (
    <div className="app-root">
      <div className="phone">
        <header className="topbar">
          <button
            className="icon"
            aria-label="filters"
            disabled={mode === "romance"}
            style={{ opacity: mode === "romance" ? 0.35 : 1 }}
            onClick={() => mode === "cofounder" && setSheet("filter")}
          >
            <i className="ti ti-adjustments-horizontal" />
          </button>
          <span className="title">{tabTitles[tab]}</span>
          <button
            className={`icon ${boostLeft > 0 ? "boost-on" : ""}`}
            aria-label="boost"
            onClick={() => setSheet("boost")}
          >
            <i className="ti ti-bolt" />
          </button>
        </header>

        <div className="screen">{screen}</div>

        <BottomNav tab={tab} onChange={setTab} matchCount={matches.length} />

        {overlays}
      </div>
    </div>
  );
}
