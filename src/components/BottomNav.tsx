import type { Tab } from "../types";

const items: { tab: Tab; icon: string; label: string }[] = [
  { tab: "discover", icon: "ti-cards", label: "Discover" },
  { tab: "matches", icon: "ti-message-circle", label: "Matches" },
  { tab: "saved", icon: "ti-bookmarks", label: "Saved" },
  { tab: "profile", icon: "ti-user", label: "Profile" },
];

export function BottomNav({
  tab,
  onChange,
  matchCount,
}: {
  tab: Tab;
  onChange: (t: Tab) => void;
  matchCount: number;
}) {
  return (
    <nav className="bottomnav">
      {items.map((it) => (
        <button
          key={it.tab}
          className={tab === it.tab ? "active" : ""}
          onClick={() => onChange(it.tab)}
          aria-label={it.label}
        >
          <span style={{ position: "relative" }}>
            <i className={`ti ${it.icon}`} />
            {it.tab === "matches" && matchCount > 0 && (
              <span className="badge">{matchCount}</span>
            )}
          </span>
          {it.label}
        </button>
      ))}
    </nav>
  );
}
