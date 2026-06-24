import { useState } from "react";
import type { Commitment, Filters, Role, Stage } from "../types";
import { noFilters } from "../types";
import { commitmentLabel, roleLabel, stageLabel } from "../data/labels";
import { Sheet } from "./Sheet";

const roles: Role[] = ["technical", "business", "design", "operator"];
const stages: Stage[] = ["idea", "pre-seed", "building", "revenue"];
const commitments: Commitment[] = ["full-time", "nights-weekends", "exploring"];

export function FilterSheet({
  current,
  resultCount,
  onApply,
  onClose,
}: {
  current: Filters;
  resultCount: (f: Filters) => number;
  onApply: (f: Filters) => void;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState<Filters>(current);
  const count = resultCount(draft);

  return (
    <Sheet
      title="Filters"
      onClose={onClose}
      footer={
        <>
          <button className="btn" style={{ flex: "0 0 auto" }} onClick={() => setDraft(noFilters)}>
            Reset
          </button>
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => onApply(draft)}>
            Show {count} founder{count === 1 ? "" : "s"}
          </button>
        </>
      }
    >
      <div className="filter-group">
        <div className="fg-label">They bring</div>
        <div className="seg">
          <Seg on={draft.brings === "any"} label="Any" onClick={() => setDraft({ ...draft, brings: "any" })} />
          {roles.map((r) => (
            <Seg key={r} on={draft.brings === r} label={roleLabel[r]} onClick={() => setDraft({ ...draft, brings: r })} />
          ))}
        </div>
      </div>

      <div className="filter-group">
        <div className="fg-label">Stage</div>
        <div className="seg">
          <Seg on={draft.stage === "any"} label="Any" onClick={() => setDraft({ ...draft, stage: "any" })} />
          {stages.map((s) => (
            <Seg key={s} on={draft.stage === s} label={stageLabel[s]} onClick={() => setDraft({ ...draft, stage: s })} />
          ))}
        </div>
      </div>

      <div className="filter-group">
        <div className="fg-label">Commitment</div>
        <div className="seg">
          <Seg on={draft.commitment === "any"} label="Any" onClick={() => setDraft({ ...draft, commitment: "any" })} />
          {commitments.map((c) => (
            <Seg key={c} on={draft.commitment === c} label={commitmentLabel[c]} onClick={() => setDraft({ ...draft, commitment: c })} />
          ))}
        </div>
      </div>

      <div className="filter-group">
        <div className="fg-label">Location</div>
        <div className="seg">
          <Seg on={!draft.remoteOnly} label="Anywhere" onClick={() => setDraft({ ...draft, remoteOnly: false })} />
          <Seg on={draft.remoteOnly} label="Remote-friendly only" onClick={() => setDraft({ ...draft, remoteOnly: true })} />
        </div>
      </div>
    </Sheet>
  );
}

function Seg({ on, label, onClick }: { on: boolean; label: string; onClick: () => void }) {
  return (
    <button className={on ? "on" : ""} onClick={onClick}>
      {label}
    </button>
  );
}
