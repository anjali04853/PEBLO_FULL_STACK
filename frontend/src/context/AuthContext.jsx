import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { api, tokenStore } from '../api/client.js';

const AuthContext = createContext(null);

/**
 * Holds the authenticated user and exposes login/signup/logout.
 * On mount it restores the session from a stored token by calling /auth/me.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = tokenStore.get();
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .me()
      .then((res) => setUser(res.user))
      .catch(() => tokenStore.clear()) // stale/expired token
      .finally(() => setLoading(false));
  }, []);

  const handleAuth = useCallback((res) => {
    tokenStore.set(res.token);
    setUser(res.user);
    return res.user;
  }, []);

  const login = useCallback(
    async (email, password) => handleAuth(await api.login({ email, password })),
    [handleAuth]
  );

  const signup = useCallback(
    async (name, email, password) =>
      handleAuth(await api.signup({ name, email, password })),
    [handleAuth]
  );

  const logout = useCallback(() => {
    tokenStore.clear();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
