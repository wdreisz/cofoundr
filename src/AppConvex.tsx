import { useEffect, useState } from "react";
import { SignedIn, SignedOut, SignIn } from "@clerk/clerk-react";
import type { Dating, Filters, Founder, Mode, Tab } from "./types";
import { noFilters } from "./types";
import { useCofoundr } from "./useConvexData";
import type { Id } from "../convex/_generated/dataModel";
import { AppShell } from "./components/AppShell";
import { MatchOverlay } from "./components/MatchOverlay";
import { FilterSheet } from "./components/FilterSheet";
import { BoostSheet } from "./components/BoostSheet";
import { DatingSetupSheet } from "./components/DatingSetupSheet";
import { Onboarding } from "./screens/Onboarding";
import { Discover } from "./screens/Discover";
import { Matches } from "./screens/Matches";
import { Saved } from "./screens/Saved";
import { ProfileScreen } from "./screens/ProfileScreen";
import { useIsDesktop } from "./hooks/useIsDesktop";

const passesFilters = (f: Founder, flt: Filters): boolean =>
  (flt.brings === "any" || f.brings === flt.brings) &&
  (flt.stage === "any" || f.stage === flt.stage) &&
  (flt.commitment === "any" || f.commitment === flt.commitment) &&
  (!flt.remoteOnly || f.remoteOk);

export function AppConvex() {
  return (
    <>
      <SignedOut>
        <div className="app-root">
          <div className="phone" style={{ alignItems: "center", justifyContent: "center" }}>
            <SignIn routing="hash" />
          </div>
        </div>
      </SignedOut>
      <SignedIn>
        <Inner />
      </SignedIn>
    </>
  );
}

function Inner() {
  const isDesktop = useIsDesktop();
  const [tab, setTab] = useState<Tab>("discover");
  const [mode, setMode] = useState<Mode>("cofounder");
  const [activeChat, setActiveChat] = useState<{ id: string; mode: Mode } | null>(null);
  const [matchOverlay, setMatchOverlay] = useState<{ founder: Founder; mode: Mode } | null>(null);
  const [filters, setFilters] = useState<Filters>(noFilters);
  const [sheet, setSheet] = useState<"filter" | "boost" | "dating" | null>(null);
  const [boostLeft, setBoostLeft] = useState(0);

  const activeChatRef = activeChat
    ? { targetId: activeChat.id as Id<"profiles">, mode: activeChat.mode }
    : null;
  const data = useCofoundr(mode, activeChatRef);

  useEffect(() => {
    if (boostLeft <= 0) return;
    const t = window.setTimeout(() => setBoostLeft((s) => s - 1), 1000);
    return () => window.clearTimeout(t);
  }, [boostLeft]);

  if (data.loading) {
    return (
      <div className="app-root">
        <div className="phone">
          <div className="empty"><i className="ti ti-loader-2" /> Loading…</div>
        </div>
      </div>
    );
  }

  if (!data.profile) {
    return (
      <div className="app-root">
        <div className="phone">
          <Onboarding onComplete={(p) => data.saveProfile(p)} />
        </div>
      </div>
    );
  }
  const profile = data.profile;

  const deck =
    mode === "cofounder" ? data.deck.filter((s) => passesFilters(s.founder, filters)) : data.deck;
  const filtersActive = mode === "cofounder" && JSON.stringify(filters) !== JSON.stringify(noFilters);

  const overlayIfMatched = (founder: Founder | undefined, m: Mode) => (res: { matched: boolean } | undefined) => {
    if (res?.matched && founder) setMatchOverlay({ founder, mode: m });
  };

  const handleAction = (id: string, action: "connect" | "skip" | "save") => {
    const founder = deck.find((s) => s.founder.id === id)?.founder;
    void data.act(id, mode, action).then(overlayIfMatched(founder, mode));
  };

  const connectFromSaved = (id: string, m: Mode) => {
    const founder = data.saved.find((s) => s.founder.id === id)?.founder;
    void data.connectSaved(id, m).then(overlayIfMatched(founder, m));
  };

  const switchMode = (m: Mode) => {
    setMode(m);
    if (m === "romance" && !profile.dating.open) setSheet("dating");
  };

  const enableDating = (dating: Dating, age: number) => {
    void data.saveProfile({ ...profile, age, dating });
    setSheet(null);
  };

  const openChat = (id: string | null) => {
    if (!id) return setActiveChat(null);
    const m = data.matches.find((x) => x.founderId === id);
    setActiveChat({ id, mode: m?.mode ?? mode });
  };

  const savedViews = data.saved.map((s) => ({ founder: s.founder, mode: s.item.mode, score: s.score }));

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
          matches={data.matches}
          activeChat={activeChat?.id ?? null}
          onOpenChat={openChat}
          onSend={(id, text) => data.send(id, activeChat?.mode ?? mode, text)}
          onProposeCall={(id, slot) => data.propose(id, activeChat?.mode ?? mode, slot)}
          onSendSession={(id, agenda) => data.session(id, activeChat?.mode ?? mode, agenda)}
          resolveFounder={(id) => data.founderOf(id) ?? fallbackFounder(id)}
          twoPane={isDesktop}
        />
      )}
      {tab === "saved" && (
        <Saved saved={savedViews} onConnect={connectFromSaved} onRemove={data.removeSaved} />
      )}
      {tab === "profile" && (
        <ProfileScreen
          profile={profile}
          matchCount={data.matches.length}
          savedCount={data.saved.length}
          passCount={0}
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
            setTab("matches");
            setActiveChat({ id: f.id, mode: matchOverlay.mode });
          }}
          onKeepSwiping={() => setMatchOverlay(null)}
        />
      )}
      {sheet === "filter" && (
        <FilterSheet
          current={filters}
          resultCount={(f) => data.deck.filter((s) => passesFilters(s.founder, f)).length}
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

  return (
    <AppShell
      isDesktop={isDesktop}
      tab={tab}
      onTab={setTab}
      matchCount={data.matches.length}
      boostActive={boostLeft > 0}
      filtersDisabled={mode === "romance"}
      onFilter={() => mode === "cofounder" && setSheet("filter")}
      onBoost={() => setSheet("boost")}
      overlays={overlays}
    >
      {screen}
    </AppShell>
  );
}

/** Placeholder if a founder isn't in any loaded list (shouldn't happen in practice). */
function fallbackFounder(id: string): Founder {
  return {
    id, name: "Founder", age: 30, initials: "··", location: "—", remoteOk: true,
    brings: "technical", seeking: "business", stage: "pre-seed", commitment: "full-time",
    industries: [], pitch: "", equity: "", secondTime: false, gender: "nonbinary",
    dating: { open: false, seeking: [], intent: "long-term" },
  };
}
