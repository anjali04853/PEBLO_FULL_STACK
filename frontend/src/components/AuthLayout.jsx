import { BrandLogo, AuthHeroArt } from './Illustration.jsx';

/** Split-screen layout shared by Login and Signup. */
export default function AuthLayout({ children }) {
  return (
    <div className="auth-wrap">
      <div className="auth-hero">
        <AuthHeroArt />
        <div className="auth-hero-text">
          <h2>Think it. Note it. Summarise it.</h2>
          <p className="muted">
            A calm, AI-powered workspace for capturing ideas, extracting
            action items and sharing your best thinking.
          </p>
        </div>
      </div>

      <div className="auth-form-side">
        <div className="auth-card">
          <div className="brand" style={{ marginBottom: 22 }}>
            <BrandLogo size={26} />
            Peblo Notes
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
