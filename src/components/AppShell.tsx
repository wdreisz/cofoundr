import type { ReactNode } from "react";
import type { Tab } from "../types";
import { BottomNav } from "./BottomNav";
import { DesktopShell } from "./DesktopShell";

const tabTitles: Record<Tab, string> = {
  discover: "Discover",
  matches: "Matches",
  saved: "Saved",
  profile: "Profile",
};

/** Presentational chrome shared by the mock and Convex-backed apps. */
export function AppShell({
  isDesktop,
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
  isDesktop: boolean;
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
  if (isDesktop) {
    return (
      <DesktopShell
        tab={tab}
        onTab={onTab}
        matchCount={matchCount}
        boostActive={boostActive}
        filtersDisabled={filtersDisabled}
        onFilter={onFilter}
        onBoost={onBoost}
        overlays={overlays}
      >
        {children}
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
            disabled={filtersDisabled}
            style={{ opacity: filtersDisabled ? 0.35 : 1 }}
            onClick={onFilter}
          >
            <i className="ti ti-adjustments-horizontal" />
          </button>
          <span className="title">{tabTitles[tab]}</span>
          <button
            className={`icon ${boostActive ? "boost-on" : ""}`}
            aria-label="boost"
            onClick={onBoost}
          >
            <i className="ti ti-bolt" />
          </button>
        </header>

        <div className="screen">{children}</div>

        <BottomNav tab={tab} onChange={onTab} matchCount={matchCount} />

        {overlays}
      </div>
    </div>
  );
}
