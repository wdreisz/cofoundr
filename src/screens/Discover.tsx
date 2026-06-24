import { useEffect, useRef, useState } from "react";
import type { Mode, ScoredFounder } from "../types";
import { commitmentLabel, intentLabel, roleSeekingLabel, stageColor, stageLabel } from "../data/labels";
import { ModeSwitch } from "../components/ModeSwitch";

const THRESHOLD = 100;

type Action = "connect" | "skip" | "save";

function fmtTime(total: number): string {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function Discover({
  deck,
  onAction,
  boostLeft,
  filtersActive,
  mode,
  onSwitchMode,
  datingOpen,
  onSetupDating,
}: {
  deck: ScoredFounder[];
  onAction: (id: string, action: Action) => void;
  boostLeft: number;
  filtersActive: boolean;
  mode: Mode;
  onSwitchMode: (m: Mode) => void;
  datingOpen: boolean;
  onSetupDating: () => void;
}) {
  const front = deck[0];
  const behind = deck[1];
  const romance = mode === "romance";

  const [dx, setDx] = useState(0);
  const [exiting, setExiting] = useState(false);
  const dragging = useRef(false);
  const startX = useRef(0);

  useEffect(() => {
    setDx(0);
    setExiting(false);
  }, [front?.founder.id]);

  const commit = (action: Action) => {
    if (exiting) return;
    if (action === "save") {
      onAction(front.founder.id, "save");
      return;
    }
    setExiting(true);
    setDx(action === "connect" ? 600 : -600);
    window.setTimeout(() => onAction(front.founder.id, action), 200);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (exiting) return;
    dragging.current = true;
    startX.current = e.clientX;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    setDx(e.clientX - startX.current);
  };
  const onPointerUp = () => {
    if (!dragging.current) return;
    dragging.current = false;
    if (dx > THRESHOLD) commit("connect");
    else if (dx < -THRESHOLD) commit("skip");
    else setDx(0);
  };

  const connectOpacity = Math.max(0, Math.min(1, dx / THRESHOLD));
  const skipOpacity = Math.max(0, Math.min(1, -dx / THRESHOLD));
  const transition = dragging.current ? "none" : "transform 0.2s ease";

  let body: React.ReactNode;
  if (romance && !datingOpen) {
    body = (
      <div className="empty">
        <i className="ti ti-heart" />
        <div>Date fellow founders</div>
        <div className="tiny">
          Building a company is a lifestyle. Meet founders who already get it.
        </div>
        <button className="btn btn-primary" onClick={onSetupDating} style={{ marginTop: 6 }}>
          <i className="ti ti-heart" /> Set up dating
        </button>
      </div>
    );
  } else if (!front) {
    body = filtersActive ? (
      <div className="empty">
        <i className="ti ti-filter-off" />
        <div>No one matches your filters.</div>
        <div className="tiny">Loosen them from the controls in the top-left.</div>
      </div>
    ) : (
      <div className="empty">
        <i className="ti ti-confetti" />
        <div>You're all caught up.</div>
        <div className="tiny">
          {romance ? "Check back as more founders join." : "New founders are added daily. Check back soon."}
        </div>
      </div>
    );
  } else {
    body = (
      <>
        {boostLeft > 0 && (
          <div className="boost-banner">
            <i className="ti ti-bolt" />
            Boosted — 3× visibility
            <span className="count">{fmtTime(boostLeft)}</span>
          </div>
        )}
        <div className="deck-stack">
          {behind && <CardBody scored={behind} mode={mode} className="swipe-card behind" />}
          <div
            key={front.founder.id}
            className="swipe-card front"
            style={{ transform: `translateX(${dx}px) rotate(${dx / 22}deg)`, transition }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            <span className="stamp stamp-connect" style={{ opacity: connectOpacity }}>
              {romance ? "like" : "connect"}
            </span>
            <span className="stamp stamp-skip" style={{ opacity: skipOpacity }}>skip</span>
            <CardBody scored={front} mode={mode} />
          </div>
        </div>

        <div className="deck-actions">
          <button className="fab fab-lg fab-skip" aria-label="skip" onClick={() => commit("skip")}>
            <i className="ti ti-x" />
          </button>
          <button className="fab fab-sm fab-save" aria-label="save for later" onClick={() => commit("save")}>
            <i className="ti ti-bookmark" />
          </button>
          <button
            className={`fab fab-lg fab-connect ${romance ? "fab-romance" : ""}`}
            aria-label={romance ? "like" : "connect"}
            onClick={() => commit("connect")}
          >
            <i className={`ti ${romance ? "ti-heart" : "ti-bolt"}`} />
          </button>
        </div>
      </>
    );
  }

  return (
    <div className="deck">
      <ModeSwitch mode={mode} onChange={onSwitchMode} />
      {body}
    </div>
  );
}

function CardBody({
  scored,
  mode,
  className,
}: {
  scored: ScoredFounder;
  mode: Mode;
  className?: string;
}) {
  const { founder: f, score, reasons } = scored;
  const romance = mode === "romance";
  return (
    <div className={className}>
      <div className="card-head">
        <div className="avatar">{f.initials}</div>
        <div>
          <div className="card-name">{f.name}, {f.age}</div>
          <div className="card-loc">
            <i className="ti ti-map-pin" /> {f.location}{f.remoteOk ? " · Remote OK" : ""}
          </div>
        </div>
        <div className={`fit-badge ${romance ? "romance" : ""}`}>{score}%<small>{romance ? "match" : "fit"}</small></div>
      </div>

      <p className="card-pitch">{f.pitch}</p>

      <div className="card-tags">
        {romance ? (
          <span className="pill pill-pink">{intentLabel[f.dating.intent]}</span>
        ) : (
          <span className="pill pill-purple">{roleSeekingLabel[f.seeking]}</span>
        )}
        <span className={`pill pill-${stageColor[f.stage]}`}>{stageLabel[f.stage]}</span>
        {f.secondTime && <span className="pill pill-gray">2nd-time founder</span>}
        {f.industries.slice(0, 2).map((ind) => (
          <span key={ind} className="pill pill-teal">{ind}</span>
        ))}
      </div>

      <div className="card-stats">
        {romance ? (
          <>
            <div className="stat"><div className="k">Looking for</div><div className="v">{intentLabel[f.dating.intent]}</div></div>
            <div className="stat"><div className="k">Pace</div><div className="v">{commitmentLabel[f.commitment]}</div></div>
          </>
        ) : (
          <>
            <div className="stat"><div className="k">Commitment</div><div className="v">{commitmentLabel[f.commitment]}</div></div>
            <div className="stat"><div className="k">Equity</div><div className="v">{f.equity}</div></div>
          </>
        )}
      </div>

      {reasons.length > 0 && (
        <div className="why">
          <div className="why-title">
            <i className="ti ti-sparkles" /> {romance ? "Why you align" : "Why you're seeing this"}
          </div>
          <div className="why-list">
            {reasons.map((r) => (
              <span key={r} className="why-item"><i className="ti ti-check" />{r}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
