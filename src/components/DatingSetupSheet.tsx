import { useState } from "react";
import type { Dating } from "../types";
import { Sheet } from "./Sheet";
import { DatingPrefsForm, datingPrefsValid, emptyDatingPrefs } from "./DatingPrefsForm";

export function DatingSetupSheet({
  onSave,
  onClose,
}: {
  onSave: (dating: Dating, age: number) => void;
  onClose: () => void;
}) {
  const [prefs, setPrefs] = useState(emptyDatingPrefs);
  const valid = datingPrefsValid(prefs);

  return (
    <Sheet
      title="Date fellow founders"
      onClose={onClose}
      footer={
        <button
          className="btn btn-primary btn-block"
          disabled={!valid}
          onClick={() =>
            onSave(
              { open: true, gender: prefs.gender, seeking: prefs.seeking, intent: prefs.intent },
              prefs.age!
            )
          }
        >
          Start dating
        </button>
      }
    >
      <p className="tiny" style={{ margin: "0 0 12px" }}>
        Building a company is a lifestyle. Meet founders who already get it — matched on shared
        world, pace, and place, not on filling a role.
      </p>
      <DatingPrefsForm value={prefs} onChange={setPrefs} />
    </Sheet>
  );
}
