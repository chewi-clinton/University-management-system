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

export const adminService = {
  getDashboardStats: () => authFetch('/admin/stats'),
  getAllUsers: () => authFetch('/admin/users'),
  getActivityLogs: () => authFetch('/admin/logs'),
};
