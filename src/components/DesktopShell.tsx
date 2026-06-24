import type { ReactNode } from "react";
import type { Tab } from "../types";

const navItems: { tab: Tab; icon: string; label: string }[] = [
  { tab: "discover", icon: "ti-cards", label: "Discover" },
  { tab: "matches", icon: "ti-message-circle", label: "Matches" },
  { tab: "saved", icon: "ti-bookmarks", label: "Saved" },
  { tab: "profile", icon: "ti-user", label: "Profile" },
];

const titles: Record<Tab, string> = {
  discover: "Discover",
  matches: "Matches",
  saved: "Saved",
  profile: "Profile",
};

export function DesktopShell({
  tab,
  onTab,
  matchCount,
  boostActive,
  filtersDisabled,
  onFilter,
  onBoost,
  children,
  overlays,
}: {
  tab: Tab;
  onTab: (t: Tab) => void;
  matchCount: number;
  boostActive: boolean;
  filtersDisabled: boolean;
  onFilter: () => void;
  onBoost: () => void;
  children: ReactNode;
  overlays: ReactNode;
}) {
  return (
    <div className="desktop">
      <aside className="sidebar">
        <div className="brand">
          <span className="logo"><i className="ti ti-bolt" /></span>
          CoFoundr
        </div>

        <nav className="side-nav">
          {navItems.map((it) => (
            <button
              key={it.tab}
              className={tab === it.tab ? "active" : ""}
              onClick={() => onTab(it.tab)}
            >
              <i className={`ti ${it.icon}`} />
              {it.label}
              {it.tab === "matches" && matchCount > 0 && <span className="badge">{matchCount}</span>}
            </button>
          ))}
        </nav>

        <div className="side-tools">
          <button onClick={onFilter} disabled={filtersDisabled} className="side-tool">
            <i className="ti ti-adjustments-horizontal" /> Filters
          </button>
          <button onClick={onBoost} className={`side-tool ${boostActive ? "boost-on" : ""}`}>
            <i className="ti ti-bolt" /> {boostActive ? "Boosted" : "Boost"}
          </button>
        </div>
      </aside>

      <main className="desktop-main">
        <header className="desktop-head">
          <h1>{titles[tab]}</h1>
        </header>
        <div className="desktop-canvas">{children}</div>
      </main>

      {overlays}
    </div>
  );
}
