import { useState } from "react";
import type { Commitment, Profile, Role, Stage } from "../types";
import { commitmentLabel, roleLabel, stageLabel } from "../data/labels";
import { DatingPrefsForm, datingPrefsValid, emptyDatingPrefs } from "../components/DatingPrefsForm";

const roleOptions: { value: Role; icon: string; desc: string }[] = [
  { value: "technical", icon: "ti-code", desc: "Engineering — you build the product" },
  { value: "business", icon: "ti-briefcase", desc: "GTM, sales, fundraising, strategy" },
  { value: "design", icon: "ti-palette", desc: "Product & experience design" },
  { value: "operator", icon: "ti-settings", desc: "Ops, hiring, growth, execution" },
];

const stageOptions: { value: Stage; icon: string; desc: string }[] = [
  { value: "idea", icon: "ti-bulb", desc: "Still validating the idea" },
  { value: "pre-seed", icon: "ti-seeding", desc: "Committed, raising or bootstrapping" },
  { value: "building", icon: "ti-tools", desc: "Product in progress, early users" },
  { value: "revenue", icon: "ti-coin", desc: "Live and generating revenue" },
];

const commitmentOptions: { value: Commitment; icon: string; desc: string }[] = [
  { value: "full-time", icon: "ti-flame", desc: "All in, right now" },
  { value: "nights-weekends", icon: "ti-moon", desc: "Building on the side for now" },
  { value: "exploring", icon: "ti-compass", desc: "Open and looking, no rush" },
];

const allIndustries = [
  "Fintech", "AI", "SaaS", "Consumer", "Healthtech", "Climate",
  "Developer tools", "Marketplace", "Infrastructure", "Hardware",
];

const TOTAL_STEPS = 8;

export function Onboarding({ onComplete }: { onComplete: (p: Profile) => void }) {
  const [step, setStep] = useState(0); // 0 = welcome
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [remoteOk, setRemoteOk] = useState(true);
  const [brings, setBrings] = useState<Role | null>(null);
  const [seeking, setSeeking] = useState<Role | null>(null);
  const [stage, setStage] = useState<Stage | null>(null);
  const [commitment, setCommitment] = useState<Commitment | null>(null);
  const [industries, setIndustries] = useState<string[]>([]);
  const [pitch, setPitch] = useState("");
  const [datingOpen, setDatingOpen] = useState(false);
  const [datingPrefs, setDatingPrefs] = useState(emptyDatingPrefs);

  const canAdvance = (): boolean => {
    switch (step) {
      case 1: return name.trim().length > 0 && location.trim().length > 0;
      case 2: return brings !== null;
      case 3: return seeking !== null;
      case 4: return stage !== null;
      case 5: return commitment !== null;
      case 6: return industries.length > 0;
      case 7: return pitch.trim().length >= 20;
      case 8: return !datingOpen || datingPrefsValid(datingPrefs);
      default: return true;
    }
  };

  const finish = () => {
    const initials = name.trim().split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "ME";
    onComplete({
      name: name.trim(),
      initials,
      location: location.trim(),
      remoteOk,
      brings: brings!,
      seeking: seeking!,
      stage: stage!,
      commitment: commitment!,
      industries,
      pitch: pitch.trim(),
      age: datingOpen ? datingPrefs.age ?? undefined : undefined,
      dating: {
        open: datingOpen,
        gender: datingPrefs.gender,
        seeking: datingPrefs.seeking,
        intent: datingPrefs.intent,
      },
    });
  };

  const next = () => (step === TOTAL_STEPS ? finish() : setStep(step + 1));
  const back = () => setStep(Math.max(0, step - 1));

  const toggleIndustry = (ind: string) =>
    setIndustries((cur) =>
      cur.includes(ind) ? cur.filter((x) => x !== ind) : [...cur, ind]
    );

  if (step === 0) {
    return (
      <div className="wizard">
        <div className="wizard-progress"><div style={{ width: "0%" }} /></div>
        <div className="wizard-body">
          <div className="brand-mark">
            <div className="logo"><i className="ti ti-bolt" /></div>
            <h1>CoFoundr</h1>
            <p>Swipe to find the person who completes your cap table. Co-founders, matched on what actually matters.</p>
          </div>
        </div>
        <div className="wizard-footer">
          <button className="btn btn-primary btn-block" onClick={() => setStep(1)}>
            Build your profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="wizard">
      <div className="wizard-progress">
        <div style={{ width: `${(step / TOTAL_STEPS) * 100}%` }} />
      </div>

      <div className="wizard-body">
        <div className="wizard-step-no">Step {step} of {TOTAL_STEPS}</div>

        {step === 1 && (
          <>
            <h2>Who are you?</h2>
            <p className="sub">The basics. Your name and where you're based.</p>
            <div className="field">
              <label>Full name</label>
              <input type="text" value={name} placeholder="e.g. Jordan Lee"
                onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="field">
              <label>Location</label>
              <input type="text" value={location} placeholder="e.g. San Francisco"
                onChange={(e) => setLocation(e.target.value)} />
            </div>
            <div className="switch-row">
              <span>Open to a remote co-founder</span>
              <button className={`toggle ${remoteOk ? "on" : ""}`} aria-label="toggle remote"
                onClick={() => setRemoteOk(!remoteOk)} />
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h2>What do you bring?</h2>
            <p className="sub">Your superpower — what you'll own in the company.</p>
            {roleOptions.map((o) => (
              <OptionCard key={o.value} icon={o.icon} title={roleLabel[o.value]}
                desc={o.desc} selected={brings === o.value} onClick={() => setBrings(o.value)} />
            ))}
          </>
        )}

        {step === 3 && (
          <>
            <h2>Who are you looking for?</h2>
            <p className="sub">We prioritise complementary matches, not clones of you.</p>
            {roleOptions.map((o) => (
              <OptionCard key={o.value} icon={o.icon} title={roleLabel[o.value]}
                desc={o.desc} selected={seeking === o.value} onClick={() => setSeeking(o.value)} />
            ))}
          </>
        )}

        {step === 4 && (
          <>
            <h2>What stage are you at?</h2>
            <p className="sub">We match founders at the same or an adjacent stage.</p>
            {stageOptions.map((o) => (
              <OptionCard key={o.value} icon={o.icon} title={stageLabel[o.value]}
                desc={o.desc} selected={stage === o.value} onClick={() => setStage(o.value)} />
            ))}
          </>
        )}

        {step === 5 && (
          <>
            <h2>How committed are you?</h2>
            <p className="sub">Be honest — a mismatch here kills partnerships.</p>
            {commitmentOptions.map((o) => (
              <OptionCard key={o.value} icon={o.icon} title={commitmentLabel[o.value]}
                desc={o.desc} selected={commitment === o.value} onClick={() => setCommitment(o.value)} />
            ))}
          </>
        )}

        {step === 6 && (
          <>
            <h2>Which spaces interest you?</h2>
            <p className="sub">Pick a few — shared interests boost your fit score.</p>
            <div className="chips">
              {allIndustries.map((ind) => (
                <button key={ind}
                  className={`chip ${industries.includes(ind) ? "selected" : ""}`}
                  onClick={() => toggleIndustry(ind)}>
                  {ind}
                </button>
              ))}
            </div>
          </>
        )}

        {step === 7 && (
          <>
            <h2>Your pitch</h2>
            <p className="sub">One short paragraph. What are you building, and what do you need?</p>
            <div className="field">
              <textarea rows={6} value={pitch}
                placeholder="e.g. Ex-product leader building developer infra. Have the market and design partners — need a technical co-founder to build it."
                onChange={(e) => setPitch(e.target.value)} />
              <div className="tiny" style={{ marginTop: 4 }}>
                {pitch.trim().length < 20
                  ? `${20 - pitch.trim().length} more characters`
                  : "Looks good"}
              </div>
            </div>
          </>
        )}

        {step === 8 && (
          <>
            <h2>Open to dating, too?</h2>
            <p className="sub">
              Building a company is a lifestyle. Meet founders who get it — entirely optional,
              and separate from your co-founder search.
            </p>
            <div className="switch-row" style={{ borderBottom: "0.5px solid var(--border-tertiary)" }}>
              <span>Also let me date fellow founders</span>
              <button className={`toggle ${datingOpen ? "on" : ""}`} aria-label="toggle dating"
                onClick={() => setDatingOpen(!datingOpen)} />
            </div>
            {datingOpen && (
              <div style={{ marginTop: 16 }}>
                <DatingPrefsForm value={datingPrefs} onChange={setDatingPrefs} />
              </div>
            )}
          </>
        )}
      </div>

      <div className="wizard-footer">
        <button className="btn" onClick={back} style={{ flex: "0 0 auto" }}>
          <i className="ti ti-arrow-left" /> Back
        </button>
        <button className="btn btn-primary" style={{ flex: 1 }}
          disabled={!canAdvance()} onClick={next}>
          {step === TOTAL_STEPS ? "Start matching" : "Continue"}
        </button>
      </div>
    </div>
  );
}

function OptionCard({
  icon, title, desc, selected, onClick,
}: {
  icon: string; title: string; desc: string; selected: boolean; onClick: () => void;
}) {
  return (
    <button className={`option ${selected ? "selected" : ""}`} onClick={onClick}>
      <span className="opt-icon"><i className={`ti ${icon}`} /></span>
      <span>
        <div className="opt-title">{title}</div>
        <div className="opt-desc">{desc}</div>
      </span>
      {selected && <i className="ti ti-circle-check opt-check" />}
    </button>
  );
}
