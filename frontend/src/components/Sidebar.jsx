import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { BrandLogo } from './Illustration.jsx';
import Icon from './Icon.jsx';

/** Persistent left navigation for the authenticated app. */
export default function Sidebar() {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = (user?.name || '?')
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <aside className="sidebar">
      <Link to="/" className="sidebar-brand brand" style={{ textDecoration: 'none' }}>
        <BrandLogo size={26} />
        Peblo Notes
      </Link>

      <div className="nav-section">Workspace</div>
      <NavLink to="/app" end className="nav-link">
        <Icon name="note" size={18} /> All notes
      </NavLink>
      <NavLink to="/app/archived" className="nav-link">
        <Icon name="archive" size={18} /> Archived
      </NavLink>
      <NavLink to="/app/insights" className="nav-link">
        <Icon name="chart" size={18} /> Insights
      </NavLink>

      <div style={{ flex: 1 }} />

      <button className="nav-link" onClick={toggle} style={{ background: 'none', border: 'none', textAlign: 'left' }}>
        <Icon name={theme === 'light' ? 'moon' : 'sun'} size={18} />
        {theme === 'light' ? 'Dark mode' : 'Light mode'}
      </button>

      <div className="user-card row">
        <div className="avatar">{initials}</div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontSize: 13.5, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {user?.name}
          </div>
          <div className="muted" style={{ fontSize: 11.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {user?.email}
          </div>
        </div>
        <button
          className="btn-ghost"
          onClick={handleLogout}
          title="Log out"
          style={{ display: 'inline-flex', padding: 6, borderRadius: 8, color: 'var(--text-muted)' }}
        >
          <Icon name="logout" size={17} />
        </button>
      </div>
    </aside>
  );
}
