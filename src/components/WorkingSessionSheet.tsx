import { Sheet } from "./Sheet";

export const SESSION_AGENDA = [
  "Why this problem, why now, why you — 5 min each",
  "Equity, vesting & roles: get the awkward stuff out early",
  "Decision-making — how do we break a deadlock?",
  "Working style, hours, and runway expectations",
  "What would make each of us walk away?",
];

export function WorkingSessionSheet({
  name,
  onSend,
  onClose,
}: {
  name: string;
  onSend: (agenda: string[]) => void;
  onClose: () => void;
}) {
  return (
    <Sheet
      title="Working session"
      onClose={onClose}
      footer={
        <button className="btn btn-primary btn-block" onClick={() => onSend(SESSION_AGENDA)}>
          Send agenda to {name}
        </button>
      }
    >
      <p className="tiny" style={{ margin: "0 0 10px" }}>
        A focused 30-minute agenda to pressure-test fit before you commit. Share it to set up
        your first real conversation.
      </p>
      <ol className="agenda-list">
        {SESSION_AGENDA.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ol>
    </Sheet>
  );
}
