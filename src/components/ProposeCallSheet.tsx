import { useState } from "react";
import { Sheet } from "./Sheet";

const SLOTS = [
  "Tue, 10:00 AM",
  "Tue, 4:00 PM",
  "Wed, 11:00 AM",
  "Thu, 2:00 PM",
  "Thu, 5:00 PM",
  "Fri, 9:00 AM",
];

export function ProposeCallSheet({
  name,
  onPropose,
  onClose,
}: {
  name: string;
  onPropose: (slot: string) => void;
  onClose: () => void;
}) {
  const [slot, setSlot] = useState<string | null>(null);

  return (
    <Sheet
      title={`Propose a call with ${name}`}
      onClose={onClose}
      footer={
        <button className="btn btn-primary btn-block" disabled={!slot} onClick={() => slot && onPropose(slot)}>
          Send invite
        </button>
      }
    >
      <p className="tiny" style={{ margin: "0 0 12px" }}>Pick a 20-minute slot. They'll confirm or suggest another time.</p>
      <div className="slots">
        {SLOTS.map((s) => (
          <button key={s} className={`slot ${slot === s ? "on" : ""}`} onClick={() => setSlot(s)}>
            {s}
          </button>
        ))}
      </div>
    </Sheet>
  );
}
