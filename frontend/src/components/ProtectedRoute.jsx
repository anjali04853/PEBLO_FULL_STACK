import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

/** Gates a route behind authentication; redirects to /login otherwise. */
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="center-screen">
        <span className="spinner" style={{ color: 'var(--accent)' }} />
      </div>
    );
  }
  return user ? children : <Navigate to="/login" replace />;
}
