// Lightweight API client for communicating with the server-side API at /api
// Replaces the mock API used during local-only development.

const TOKEN_KEY = 'rbac_access_token';

let _token = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;

export function setToken(t) {
  _token = t;
  if (typeof window !== 'undefined') {
    if (t) localStorage.setItem(TOKEN_KEY, t);
    else localStorage.removeItem(TOKEN_KEY);
  }
}

function buildHeaders(extra = {}) {
  const headers = { 'Content-Type': 'application/json', ...extra };
  if (_token) headers['Authorization'] = 'Bearer ' + _token;
  return headers;
}

async function request(path, opts = {}) {
  const res = await fetch('/api' + path, { // Will be proxied by Vite
    method: opts.method || 'GET',
    headers: buildHeaders(opts.headers),
    body: opts.body ? JSON.stringify(opts.body) : undefined,
    credentials: opts.credentials || 'same-origin',
  });

  const text = await res.text();
  let payload = null;
  
  if (res.status === 204) return null; // Handle No Content for DELETE

  try { payload = JSON.parse(text); } catch { payload = text; }
  
  if (!res.ok) {
    const message = (payload && payload.error) || res.statusText || 'Request failed';
    throw new Error(message);
  }
  return payload;
}

export const api = {
  setToken,
  post: (path, body) => request(path, { method: 'POST', body }),
  get: (path) => request(path, { method: 'GET' }),
  put: (path, body) => request(path, { method: 'PUT', body }),
  del: (path) => request(path, { method: 'DELETE' }),
};
