import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { BrandLogo } from '../components/Illustration.jsx';
import HeroScene from '../components/HeroScene.jsx';
import AIDemoVideo from '../components/AIDemoVideo.jsx';
import Icon from '../components/Icon.jsx';
import {
  ArtNotes,
  ArtAI,
  ArtSearch,
  ArtShare,
  ArtTags,
  ArtInsights,
} from '../components/FeatureArt.jsx';

const FEATURES = [
  {
    art: <ArtAI />,
    title: 'AI that actually helps',
    body: 'Turn any note into a clean summary, a list of action items and a sharp suggested title — in one click.',
  },
  {
    art: <ArtNotes />,
    title: 'A calm place to write',
    body: 'A distraction-free editor with markdown, instant auto-save and a paper-like feel that stays out of your way.',
  },
  {
    art: <ArtTags />,
    title: 'Organised effortlessly',
    body: 'Group notes with tags and categories, archive what you are done with, and keep your workspace tidy.',
  },
  {
    art: <ArtSearch />,
    title: 'Find anything, fast',
    body: 'Live keyword search, tag filters and smart sorting make every note one keystroke away.',
  },
  {
    art: <ArtShare />,
    title: 'Share with a link',
    body: 'Publish any note to a clean public page — readable by anyone, no account required.',
  },
  {
    art: <ArtInsights />,
    title: 'See your progress',
    body: 'A productivity dashboard with most-used tags, AI usage and a weekly activity overview.',
  },
];

const STEPS = [
  { n: '01', title: 'Write your note', body: 'Jot down meeting notes, ideas or research — however messy.' },
  { n: '02', title: 'Let the AI work', body: 'Generate a summary, extract action items and get a title instantly.' },
  { n: '03', title: 'Organise & share', body: 'Tag it, search it later, or publish it as a public page.' },
];

/** Public marketing landing page — the front door to Peblo Notes. */
export default function Landing() {
  const { user } = useAuth();
  const { theme, toggle } = useTheme();
  const primaryTo = user ? '/app' : '/signup';

  return (
    <div className="landing">
      {/* ---- Nav ---- */}
      <header className="lp-nav">
        <Link to="/" className="brand" style={{ textDecoration: 'none' }}>
          <BrandLogo size={26} />
          Peblo Notes
        </Link>
        <nav className="lp-nav-links">
          <a href="#features">Features</a>
          <a href="#how">How it works</a>
          <button
            className="btn-ghost lp-theme-btn"
            onClick={toggle}
            aria-label="Toggle theme"
          >
            <Icon name={theme === 'light' ? 'moon' : 'sun'} size={18} />
          </button>
          {user ? (
            <Link to="/app" className="btn btn-primary btn-sm">
              Open workspace
            </Link>
          ) : (
            <>
              <Link to="/login" className="btn btn-sm">
                Log in
              </Link>
              <Link to="/signup" className="btn btn-primary btn-sm">
                Get started
              </Link>
            </>
          )}
        </nav>
      </header>

      {/* ---- Hero ---- */}
      <section className="lp-hero">
        <div className="lp-hero-text">
          <span className="lp-pill">
            <Icon name="sparkle" size={13} /> AI-powered notes workspace
          </span>
          <h1>
            Your thoughts,{' '}
            <span className="lp-accent-word">beautifully organised</span>.
          </h1>
          <p className="lp-lead">
            Peblo Notes is a calm, collaborative workspace where your notes
            summarise themselves. Write freely — let the AI handle the
            structure.
          </p>
          <div className="lp-hero-cta">
            <Link to={primaryTo} className="btn btn-primary lp-btn-lg">
              <Icon name="sparkle" size={17} />
              {user ? 'Open your workspace' : 'Start writing free'}
            </Link>
            <a href="#demo" className="btn lp-btn-lg">
              <Icon name="eye" size={17} /> See it in action
            </a>
          </div>
          <p className="lp-hero-note muted">
            No credit card · Includes a ready demo account
          </p>
        </div>
        <div className="lp-hero-art">
          <HeroScene />
        </div>
      </section>

      {/* ---- AI demo "video" ---- */}
      <section id="demo" className="lp-section lp-demo">
        <div className="lp-section-head">
          <span className="lp-eyebrow">Watch the magic</span>
          <h2>From a messy note to clear actions</h2>
          <p className="muted">
            This is the real product loop — a note comes in, and the AI hands
            back a summary, action items and a title.
          </p>
        </div>
        <AIDemoVideo />
      </section>

      {/* ---- Features ---- */}
      <section id="features" className="lp-section">
        <div className="lp-section-head">
          <span className="lp-eyebrow">Everything you need</span>
          <h2>Built for the way you think</h2>
        </div>
        <div className="lp-feature-grid">
          {FEATURES.map((f) => (
            <article key={f.title} className="card lp-feature-card">
              <div className="lp-feature-art">{f.art}</div>
              <h3>{f.title}</h3>
              <p className="muted">{f.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ---- How it works ---- */}
      <section id="how" className="lp-section lp-how">
        <div className="lp-section-head">
          <span className="lp-eyebrow">How it works</span>
          <h2>Three steps to clearer notes</h2>
        </div>
        <div className="lp-steps">
          {STEPS.map((s) => (
            <div key={s.n} className="lp-step">
              <div className="lp-step-num">{s.n}</div>
              <h3>{s.title}</h3>
              <p className="muted">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---- CTA ---- */}
      <section className="lp-section">
        <div className="lp-cta card">
          <div className="lp-cta-glow" />
          <h2>Ready to think clearly?</h2>
          <p>
            Join Peblo Notes and let your ideas organise themselves.
          </p>
          <Link to={primaryTo} className="btn lp-btn-lg lp-cta-btn">
            <Icon name="sparkle" size={17} />
            {user ? 'Open your workspace' : 'Get started — it’s free'}
          </Link>
        </div>
      </section>

      {/* ---- Footer ---- */}
      <footer className="lp-footer">
        <div className="brand" style={{ fontSize: 16 }}>
          <BrandLogo size={22} />
          Peblo Notes
        </div>
        <p className="muted">
          A collaborative AI notes workspace · Built for the Peblo challenge
        </p>
      </footer>
    </div>
  );
}
