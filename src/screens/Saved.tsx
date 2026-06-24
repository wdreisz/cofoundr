import type { Profile, SavedItem } from "../types";
import { founders } from "../data/founders";
import { scoreFounder, scoreRomance } from "../lib/matching";

const byId = (id: string) => founders.find((f) => f.id === id)!;

export function Saved({
  saved,
  profile,
  onConnect,
  onRemove,
}: {
  saved: SavedItem[];
  profile: Profile;
  onConnect: (id: string, mode: SavedItem["mode"]) => void;
  onRemove: (id: string, mode: SavedItem["mode"]) => void;
}) {
  if (saved.length === 0) {
    return (
      <div className="empty">
        <i className="ti ti-bookmarks" />
        <div>Nothing saved yet.</div>
        <div className="tiny">Tap the bookmark on a card to shortlist people without committing.</div>
      </div>
    );
  }

  return (
    <div className="saved-wrap">
      {saved.map((item) => {
        const f = byId(item.id);
        const romance = item.mode === "romance";
        const { score } = romance ? scoreRomance(profile, f) : scoreFounder(profile, f);
        return (
          <div key={`${item.mode}-${f.id}`} className="saved-card">
            <div className="sc-head">
              <div className="avatar">{f.initials}</div>
              <div>
                <div className="sc-name">{f.name}, {f.age}</div>
                <div className="sc-loc">{f.location}{f.remoteOk ? " · Remote OK" : ""}</div>
              </div>
              <span className={`mode-tag ${romance ? "romance" : ""}`}>
                <i className={`ti ${romance ? "ti-heart" : "ti-briefcase"}`} />
                {romance ? "Dating" : "Co-founder"}
              </span>
            </div>
            <p className="sc-pitch">{f.pitch}</p>
            <div className="sc-actions">
              <span className="sc-fit-inline">{score}% {romance ? "match" : "fit"}</span>
              <button className="btn" onClick={() => onRemove(f.id, item.mode)}>
                <i className="ti ti-trash" /> Remove
              </button>
              <button className="btn btn-primary" onClick={() => onConnect(f.id, item.mode)}>
                <i className={`ti ${romance ? "ti-heart" : "ti-bolt"}`} /> {romance ? "Like" : "Connect"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
