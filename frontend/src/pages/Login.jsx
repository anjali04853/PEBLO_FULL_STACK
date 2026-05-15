import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import AuthLayout from '../components/AuthLayout.jsx';

/** Login page — also offers one-click access to the seeded demo account. */
export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e, creds) {
    e?.preventDefault();
    setError('');
    setBusy(true);
    try {
      await login(creds?.email ?? email, creds?.password ?? password);
      navigate('/app');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthLayout>
      <form onSubmit={submit}>
        <h1>Welcome back</h1>
        <p className="muted" style={{ marginBottom: 22 }}>
          Log in to your notes workspace.
        </p>

        <div className="field">
          <label>Email address</label>
          <input
            className="input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>
        <div className="field">
          <label>Password</label>
          <input
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>

        {error && (
          <p style={{ color: 'var(--danger)', fontSize: 13, marginBottom: 12 }}>
            {error}
          </p>
        )}

        <button className="btn btn-primary" style={{ width: '100%' }} disabled={busy}>
          {busy ? <span className="spinner" /> : 'Log in'}
        </button>

        <div className="divider" />

        <button
          type="button"
          className="btn"
          style={{ width: '100%' }}
          disabled={busy}
          onClick={(e) =>
            submit(e, { email: 'demo@peblo.com', password: 'demo123' })
          }
        >
          Explore with the demo account
        </button>

        <p className="muted" style={{ fontSize: 13.5, marginTop: 18, textAlign: 'center' }}>
          New to Peblo? <Link to="/signup">Create an account</Link>
        </p>
      </form>
    </AuthLayout>
  );
}
