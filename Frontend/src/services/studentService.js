import { getToken } from './authService';

const API_BASE = 'http://localhost:5000/api';

const authFetch = async (path, method = 'GET', body) => {
  const token = getToken();
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: body ? JSON.stringify(body) : undefined
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
};

export const studentAPI = {
  getDashboard: () => authFetch('/student/dashboard'),
  payTuition: (id, paidDate = new Date().toISOString()) =>
    authFetch(`/tuition/${id}`, 'PUT', { status: 'paid', paidDate })
};