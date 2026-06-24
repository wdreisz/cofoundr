import { useEffect, useRef, useState } from "react";
import type { ChatMessage, Founder, Match } from "../types";
import { roleLabel } from "../data/labels";
import { ProposeCallSheet } from "../components/ProposeCallSheet";
import { WorkingSessionSheet } from "../components/WorkingSessionSheet";

export function Matches({
  matches,
  activeChat,
  onOpenChat,
  onSend,
  onProposeCall,
  onSendSession,
  resolveFounder,
  twoPane = false,
}: {
  matches: Match[];
  activeChat: string | null;
  onOpenChat: (id: string | null) => void;
  onSend: (founderId: string, text: string) => void;
  onProposeCall: (founderId: string, slot: string) => void;
  onSendSession: (founderId: string, agenda: string[]) => void;
  resolveFounder: (id: string) => Founder;
  twoPane?: boolean;
}) {
  const byId = resolveFounder;
  const open = activeChat ? matches.find((m) => m.founderId === activeChat) : undefined;

  const emptyState = (
    <div className="empty">
      <i className="ti ti-message-circle" />
      <div>No matches yet.</div>
      <div className="tiny">Connect with founders in Discover. When it's mutual, they show up here.</div>
    </div>
  );

  const list = (
    <div className="match-list">
      {matches.map((m) => {
        const f = byId(m.founderId);
        const last = m.messages[m.messages.length - 1];
        const sub = last ? (last.from === "me" ? `You: ${last.text}` : last.text) : "Say hi — you matched!";
        const romance = m.mode === "romance";
        const active = twoPane && m.founderId === activeChat;
        return (
          <button
            key={`${m.mode}-${m.founderId}`}
            className={`match-row ${active ? "active" : ""}`}
            onClick={() => onOpenChat(m.founderId)}
          >
            <div className="avatar">{f.initials}</div>
            <div style={{ minWidth: 0 }}>
              <div className="mr-name">
                {f.name}
                <i className={`ti ${romance ? "ti-heart" : "ti-briefcase"} mr-mode ${romance ? "romance" : ""}`} />
              </div>
              <div className="mr-sub">{sub}</div>
            </div>
            {m.messages.length === 0 && <span className="mr-new">New</span>}
          </button>
        );
      })}
    </div>
  );

  const chat = open ? (
    <ChatView
      match={open}
      founder={byId(open.founderId)}
      onBack={() => onOpenChat(null)}
      onSend={onSend}
      onProposeCall={onProposeCall}
      onSendSession={onSendSession}
    />
  ) : null;

  if (twoPane) {
    if (matches.length === 0) return emptyState;
    return (
      <div className="matches-2pane">
        <div className="pane-list">{list}</div>
        <div className="pane-chat">
          {chat ?? (
            <div className="empty">
              <i className="ti ti-messages" />
              <div>Select a conversation</div>
              <div className="tiny">Pick a match on the left to start chatting.</div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (chat) return chat;
  if (matches.length === 0) return emptyState;
  return list;
}

function ChatView({
  match,
  founder: f,
  onBack,
  onSend,
  onProposeCall,
  onSendSession,
}: {
  match: Match;
  founder: Founder;
  onBack: () => void;
  onSend: (founderId: string, text: string) => void;
  onProposeCall: (founderId: string, slot: string) => void;
  onSendSession: (founderId: string, agenda: string[]) => void;
}) {
  const firstName = f.name.split(" ")[0];
  const [text, setText] = useState("");
  const [sheet, setSheet] = useState<"call" | "session" | null>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bodyRef.current?.scrollTo(0, bodyRef.current.scrollHeight);
  }, [match.messages.length]);

  const submit = () => {
    const t = text.trim();
    if (!t) return;
    onSend(match.founderId, t);
    setText("");
  };

  return (
    <div className="chat">
      <div className="chat-head">
        <button className="back" onClick={onBack} aria-label="back"><i className="ti ti-arrow-left" /></button>
        <div className="avatar">{f.initials}</div>
        <div>
          <div className="ch-name">{f.name}</div>
          <div className="ch-sub">
            {match.mode === "romance" ? "Dating" : roleLabel[f.brings]} · {f.location}
          </div>
        </div>
      </div>

      <div className="chat-body" ref={bodyRef}>
        <div className="icebreaker">
          <div className="ib-label"><i className="ti ti-sparkles" /> Icebreaker</div>
          <div className="ib-text">{match.icebreaker}</div>
        </div>
        {match.messages.map((msg) => (
          <MessageBubble key={msg.id} msg={msg} />
        ))}
      </div>

      <div className="chat-actions">
        <button className="chip-btn" onClick={() => setSheet("call")}>
          <i className="ti ti-calendar-plus" /> Propose a call
        </button>
        {match.mode !== "romance" && (
          <button className="chip-btn" onClick={() => setSheet("session")}>
            <i className="ti ti-clipboard-list" /> Working session
          </button>
        )}
      </div>

      <div className="chat-input">
        <input
          value={text}
          placeholder={`Message ${firstName}…`}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") submit(); }}
        />
        <button className="send" onClick={submit} disabled={!text.trim()} aria-label="send">
          <i className="ti ti-arrow-up" />
        </button>
      </div>

      {sheet === "call" && (
        <ProposeCallSheet
          name={firstName}
          onPropose={(slot) => { onProposeCall(match.founderId, slot); setSheet(null); }}
          onClose={() => setSheet(null)}
        />
      )}
      {sheet === "session" && (
        <WorkingSessionSheet
          name={firstName}
          onSend={(agenda) => { onSendSession(match.founderId, agenda); setSheet(null); }}
          onClose={() => setSheet(null)}
        />
      )}
    </div>
  );
}

function MessageBubble({ msg }: { msg: ChatMessage }) {
  if (msg.kind === "call") {
    return (
      <div className="card-msg">
        <div className="cm-head"><i className="ti ti-calendar-event" /> Call invite</div>
        <div className="cm-when">{msg.when}</div>
        <div className={`cm-status ${msg.accepted ? "ok" : "pending"}`}>
          <i className={`ti ${msg.accepted ? "ti-check" : "ti-clock"}`} />
          {msg.accepted ? "Accepted" : "Waiting for reply"}
        </div>
      </div>
    );
  }
  if (msg.kind === "session") {
    return (
      <div className="card-msg">
        <div className="cm-head"><i className="ti ti-clipboard-list" /> Working-session agenda</div>
        <ol>
          {(msg.agenda ?? []).map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      </div>
    );
  }
  return <div className={`bubble ${msg.from}`}>{msg.text}</div>;
}
