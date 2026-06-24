import type { Founder, Mode, Profile } from "../types";

export function MatchOverlay({
  profile,
  founder,
  mode,
  onMessage,
  onKeepSwiping,
}: {
  profile: Profile;
  founder: Founder;
  mode: Mode;
  onMessage: () => void;
  onKeepSwiping: () => void;
}) {
  const first = founder.name.split(" ")[0];
  const romance = mode === "romance";
  return (
    <div className={`match-overlay ${romance ? "romance" : ""}`}>
      <div className="match-avatars">
        <div className="avatar">{profile.initials}</div>
        <div className="avatar">{founder.initials}</div>
      </div>
      <div>
        <h2>{romance ? "You're a match!" : "It's a match!"}</h2>
        <p>
          {romance
            ? `You and ${first} both swiped right. Two founders who get the life.`
            : `You and ${first} both want to connect.`}
        </p>
      </div>
      <button className="btn btn-white" onClick={onMessage}>
        <i className="ti ti-message-circle" /> Send a message
      </button>
      <button className="btn btn-ghost" onClick={onKeepSwiping}>
        Keep swiping
      </button>
    </div>
  );
}
