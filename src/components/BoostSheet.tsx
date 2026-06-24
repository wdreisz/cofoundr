import { Sheet } from "./Sheet";

export function BoostSheet({
  active,
  onActivate,
  onClose,
}: {
  active: boolean;
  onActivate: () => void;
  onClose: () => void;
}) {
  return (
    <Sheet
      title="Boost"
      onClose={onClose}
      footer={
        active ? (
          <button className="btn btn-block" onClick={onClose}>Boost is running</button>
        ) : (
          <button className="btn btn-primary btn-block" onClick={onActivate}>
            <i className="ti ti-bolt" /> Boost for 30 minutes
          </button>
        )
      }
    >
      <div className="boost-hero">
        <div className="b-ring"><i className="ti ti-bolt" /></div>
        <p>
          Jump to the front of the deck. For the next 30 minutes your profile is shown
          to <strong>3× more</strong> founders who match your criteria — the fastest way
          to get in front of the right co-founder.
        </p>
      </div>
    </Sheet>
  );
}
