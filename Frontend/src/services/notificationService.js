import { getToken } from './authService';
const API = 'http://localhost:5000/api';

const authFetch = async (path, method = 'GET', body) => {
  const token = getToken();
  const res = await fetch(`${API}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

export const notificationAPI = {
  getUnreadCount: () => authFetch('/notifications/unread-count'),
  list: (limit = 10, category) => {
    const params = new URLSearchParams()
    if (limit) params.set('limit', String(limit))
    if (category) params.set('category', category)
    return authFetch(`/notifications?${params.toString()}`)
  },
  markRead: (ids = []) => authFetch('/notifications/mark-read', 'POST', { ids }),
};