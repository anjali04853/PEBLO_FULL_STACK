/**
 * Thin fetch wrapper around the backend API.
 * - Injects the Bearer token from localStorage.
 * - Normalises errors into thrown Error objects with a readable message.
 */
const BASE = import.meta.env.VITE_API_URL || '/api';

const TOKEN_KEY = 'peblo_token';

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (t) => localStorage.setItem(TOKEN_KEY, t),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

async function request(path, { method = 'GET', body, auth = true } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) {
    const token = tokenStore.get();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  // 204 / empty bodies are valid responses.
  const text = await res.text();
  const data = text ? JSON.parse(text) : {};

  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return data;
}

export const api = {
  // Auth
  signup: (body) => request('/auth/signup', { method: 'POST', body, auth: false }),
  login: (body) => request('/auth/login', { method: 'POST', body, auth: false }),
  me: () => request('/auth/me'),

  // Notes
  listNotes: (params = {}) => {
    const qs = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v != null && v !== '')
    ).toString();
    return request(`/notes${qs ? `?${qs}` : ''}`);
  },
  getNote: (id) => request(`/notes/${id}`),
  createNote: (body) => request('/notes', { method: 'POST', body }),
  updateNote: (id, body) => request(`/notes/${id}`, { method: 'PATCH', body }),
  deleteNote: (id) => request(`/notes/${id}`, { method: 'DELETE' }),

  // Sharing
  shareNote: (id) => request(`/notes/${id}/share`, { method: 'POST' }),
  unshareNote: (id) => request(`/notes/${id}/share`, { method: 'DELETE' }),
  getSharedNote: (shareId) => request(`/shared/${shareId}`, { auth: false }),

  // AI
  generateSummary: (id) =>
    request(`/notes/${id}/generate-summary`, { method: 'POST' }),

  // Insights
  getInsights: () => request('/insights'),
};
