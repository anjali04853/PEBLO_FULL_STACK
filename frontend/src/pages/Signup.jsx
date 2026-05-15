import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import AuthLayout from '../components/AuthLayout.jsx';

/** Account creation page. */
export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await signup(form.name, form.email, form.password);
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
        <h1>Create your workspace</h1>
        <p className="muted" style={{ marginBottom: 22 }}>
          Start writing smarter notes in seconds.
        </p>

        <div className="field">
          <label>Full name</label>
          <input className="input" value={form.name} onChange={update('name')} placeholder="Jane Doe" required />
        </div>
        <div className="field">
          <label>Email address</label>
          <input
            className="input"
            type="email"
            value={form.email}
            onChange={update('email')}
            placeholder="you@example.com"
            required
          />
        </div>
        <div className="field">
          <label>Password</label>
          <input
            className="input"
            type="password"
            value={form.password}
            onChange={update('password')}
            placeholder="At least 6 characters"
            required
          />
        </div>

        {error && (
          <p style={{ color: 'var(--danger)', fontSize: 13, marginBottom: 12 }}>
            {error}
          </p>
        )}

        <button className="btn btn-primary" style={{ width: '100%' }} disabled={busy}>
          {busy ? <span className="spinner" /> : 'Create account'}
        </button>

        <p className="muted" style={{ fontSize: 13.5, marginTop: 18, textAlign: 'center' }}>
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </form>
    </AuthLayout>
  );
}
