const steps = [
  {
    icon: "ti-user-plus",
    title: "Build your profile",
    body: "A structured profile, not a résumé. Your role, stage, commitment, industries, and what you're actually looking for — every field feeds the match.",
  },
  {
    icon: "ti-cards",
    title: "Swipe your matches",
    body: "A curated daily deck ranked by a real, explainable fit score. Connect, skip, or save — quality over an endless scroll.",
  },
  {
    icon: "ti-message-circle",
    title: "Meet and build",
    body: "A mutual match unlocks chat with a seeded icebreaker, in-app call scheduling, and a structured working-session agenda.",
  },
];

const features = [
  { icon: "ti-sparkles", title: "A real fit score", body: "Weighted matching on role, stage, commitment, industry, and location — and it tells you why." },
  { icon: "ti-shield-check", title: "Verified founders", body: "Identity-checked profiles and first-class reporting keep the network real and low-noise." },
  { icon: "ti-arrows-shuffle", title: "Two modes, one profile", body: "Switch between finding a co-founder and dating a fellow founder, any time." },
  { icon: "ti-calendar", title: "From match to meeting", body: "Propose a call and share a fit-test agenda without leaving the chat." },
  { icon: "ti-bolt", title: "Boost", body: "Jump to the front of the deck and get 3× visibility when you're ready to move fast." },
  { icon: "ti-device-laptop", title: "Web and mobile", body: "A full desktop experience and a native-feeling mobile app, from the same account." },
];

export function Landing({ onLaunch }: { onLaunch: () => void }) {
  return (
    <div className="lp">
      <div className="lp-container">
        <nav className="lp-nav">
          <div className="lp-brand">
            <span className="logo"><i className="ti ti-bolt" /></span>
            CoFoundr
          </div>
          <div className="lp-nav-links">
            <a href="#how">How it works</a>
            <a href="#modes">Two modes</a>
            <a href="#features">Why CoFoundr</a>
            <button className="lp-btn" onClick={onLaunch}>Open app</button>
          </div>
        </nav>
      </div>

      {/* Hero */}
      <header className="lp-hero">
        <div className="lp-container lp-hero-grid">
          <div className="lp-hero-copy">
            <span className="lp-eyebrow"><i className="ti ti-bolt" /> For founders</span>
            <h1 className="lp-h1">Find the person who completes your cap table.</h1>
            <p className="lp-lede">
              CoFoundr is swipe-to-match for entrepreneurs. Meet a complementary co-founder —
              or date someone who actually gets the startup life.
            </p>
            <div className="lp-cta-row">
              <button className="lp-btn lp-btn-primary lp-btn-lg" onClick={onLaunch}>
                Get started — it's free
              </button>
              <a className="lp-btn lp-btn-lg" href="#how">See how it works</a>
            </div>
            <div className="lp-trust">
              <i className="ti ti-shield-check" /> Verified founders · Under 10 minutes to your first match
            </div>
          </div>

          <div className="lp-hero-visual">
            <div className="lp-stack">
              <div className="lp-card back">
                <div className="lp-card-head">
                  <div className="avatar">TA</div>
                  <div>
                    <div className="lp-card-name">Tomas, 33</div>
                    <div className="lp-card-loc">San Francisco</div>
                  </div>
                  <div className="lp-card-fit">100%<small>fit</small></div>
                </div>
                <div className="lp-card-tags">
                  <span className="pill pill-purple">Seeking business co-founder</span>
                  <span className="pill pill-teal">AI</span>
                </div>
              </div>

              <div className="lp-card front">
                <div className="lp-card-head">
                  <div className="avatar">NH</div>
                  <div>
                    <div className="lp-card-name">Nadia, 29</div>
                    <div className="lp-card-loc">San Francisco · Remote OK</div>
                  </div>
                  <div className="lp-card-fit">94%<small>fit</small></div>
                </div>
                <p className="lp-card-pitch">
                  Ex-Square engineer building AI underwriting infra. Want a commercial co-founder
                  who loves fintech.
                </p>
                <div className="lp-card-tags">
                  <span className="pill pill-purple">Seeking business co-founder</span>
                  <span className="pill pill-coral">Pre-seed</span>
                  <span className="pill pill-teal">Fintech</span>
                </div>
                <div className="lp-card-actions">
                  <span className="lp-fab skip"><i className="ti ti-x" /></span>
                  <span className="lp-fab connect"><i className="ti ti-bolt" /></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* How it works */}
      <section className="lp-section" id="how">
        <div className="lp-container">
          <div className="lp-section-head">
            <h2 className="lp-h2">From sign-up to first conversation in minutes</h2>
            <p className="lp-sub">No endless searching. Three steps to the right person.</p>
          </div>
          <div className="lp-steps">
            {steps.map((s, i) => (
              <div className="lp-step" key={s.title}>
                <div className="n"><i className={`ti ${s.icon}`} /></div>
                <h3>{i + 1}. {s.title}</h3>
                <p>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Two modes */}
      <section className="lp-section alt" id="modes">
        <div className="lp-container">
          <div className="lp-section-head">
            <h2 className="lp-h2">Two ways to match. One profile.</h2>
            <p className="lp-sub">
              Building a company is a lifestyle — so we match you on what matters, whether you're
              looking for a co-founder or a partner.
            </p>
          </div>
          <div className="lp-modes">
            <div className="lp-mode cofounder">
              <span className="badge"><i className="ti ti-briefcase" /> Co-founder</span>
              <h3>Match on what's missing.</h3>
              <p>Our algorithm pairs you with complementary skills — not clones of you.</p>
              <ul>
                <li>Technical ↔ business pairing</li>
                <li>Aligned stage and commitment</li>
                <li>Shared industries and location</li>
              </ul>
            </div>
            <div className="lp-mode dating">
              <span className="badge"><i className="ti ti-heart" /> Dating</span>
              <h3>Date someone who gets it.</h3>
              <p>Meet founders aligned on world, pace, and place — opt-in and orientation-aware.</p>
              <ul>
                <li>Alignment, not complementarity</li>
                <li>Shared ambition and lifestyle</li>
                <li>Completely separate from your co-founder search</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="lp-section" id="features">
        <div className="lp-container">
          <div className="lp-section-head">
            <h2 className="lp-h2">Built for high-stakes matches</h2>
            <p className="lp-sub">Choosing who to build with is the most important decision you'll make. We treat it that way.</p>
          </div>
          <div className="lp-features">
            {features.map((f) => (
              <div className="lp-feature" key={f.title}>
                <i className={`ti ${f.icon}`} />
                <h3>{f.title}</h3>
                <p>{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="lp-band">
        <div className="lp-container">
          <h2>Ready to find your match?</h2>
          <p>Join the founders building — and dating — smarter.</p>
          <button className="lp-btn lp-btn-lg" onClick={onLaunch}>Get started</button>
        </div>
      </section>

      <footer className="lp-container lp-footer">
        <div className="lp-brand">
          <span className="logo"><i className="ti ti-bolt" /></span>
          CoFoundr
        </div>
        <span>© 2026 CoFoundr · A prototype.</span>
      </footer>
    </div>
  );
}
