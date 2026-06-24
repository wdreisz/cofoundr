import type { DatingIntent, Gender } from "../types";
import { genderLabel, intentLabel, seekingGenderLabel } from "../data/labels";

export interface DatingPrefs {
  age: number | null;
  gender: Gender;
  seeking: Gender[];
  intent: DatingIntent;
}

export const emptyDatingPrefs: DatingPrefs = {
  age: null,
  gender: "woman",
  seeking: [],
  intent: "long-term",
};

export function datingPrefsValid(p: DatingPrefs): boolean {
  return p.age !== null && p.age >= 18 && p.age <= 99 && p.seeking.length > 0;
}

const genders: Gender[] = ["man", "woman", "nonbinary"];
const intents: DatingIntent[] = ["long-term", "see-where-it-goes", "casual"];

export function DatingPrefsForm({
  value,
  onChange,
}: {
  value: DatingPrefs;
  onChange: (p: DatingPrefs) => void;
}) {
  const toggleSeeking = (g: Gender) =>
    onChange({
      ...value,
      seeking: value.seeking.includes(g)
        ? value.seeking.filter((x) => x !== g)
        : [...value.seeking, g],
    });

  return (
    <>
      <div className="field">
        <label>Your age</label>
        <input
          type="text"
          inputMode="numeric"
          value={value.age ?? ""}
          placeholder="e.g. 30"
          onChange={(e) => {
            const n = parseInt(e.target.value.replace(/\D/g, ""), 10);
            onChange({ ...value, age: Number.isNaN(n) ? null : n });
          }}
        />
      </div>

      <div className="filter-group">
        <div className="fg-label">I am a</div>
        <div className="seg">
          {genders.map((g) => (
            <button key={g} className={value.gender === g ? "on" : ""} onClick={() => onChange({ ...value, gender: g })}>
              {genderLabel[g]}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <div className="fg-label">Interested in</div>
        <div className="seg">
          {genders.map((g) => (
            <button key={g} className={value.seeking.includes(g) ? "on" : ""} onClick={() => toggleSeeking(g)}>
              {seekingGenderLabel[g]}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <div className="fg-label">Looking for</div>
        <div className="seg">
          {intents.map((i) => (
            <button key={i} className={value.intent === i ? "on" : ""} onClick={() => onChange({ ...value, intent: i })}>
              {intentLabel[i]}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
