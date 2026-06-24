import type { Founder, Mode } from "../types";

export interface SavedView {
  founder: Founder;
  mode: Mode;
  score: number;
}

export function Saved({
  saved,
  onConnect,
  onRemove,
}: {
  saved: SavedView[];
  onConnect: (id: string, mode: Mode) => void;
  onRemove: (id: string, mode: Mode) => void;
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
      {saved.map(({ founder: f, mode, score }) => {
        const romance = mode === "romance";
        return (
          <div key={`${mode}-${f.id}`} className="saved-card">
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
              <button className="btn" onClick={() => onRemove(f.id, mode)}>
                <i className="ti ti-trash" /> Remove
              </button>
              <button className="btn btn-primary" onClick={() => onConnect(f.id, mode)}>
                <i className={`ti ${romance ? "ti-heart" : "ti-bolt"}`} /> {romance ? "Like" : "Connect"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
