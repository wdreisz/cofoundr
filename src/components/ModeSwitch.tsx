import type { Mode } from "../types";

export function ModeSwitch({ mode, onChange }: { mode: Mode; onChange: (m: Mode) => void }) {
  return (
    <div className="mode-switch">
      <button className={mode === "cofounder" ? "on" : ""} onClick={() => onChange("cofounder")}>
        <i className="ti ti-briefcase" /> Co-founder
      </button>
      <button className={mode === "romance" ? "on romance" : "romance-idle"} onClick={() => onChange("romance")}>
        <i className="ti ti-heart" /> Dating
      </button>
    </div>
  );
}
