import { getToken } from './authService';
const API = 'http://localhost:5000/api';

const authFetch = async (path, method = 'GET', body) => {
  const token = getToken();
  const res = await fetch(`${API}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
};

export const marketingAPI = {
  // backend should expose an endpoint that returns the promotion tailored to the student
  getActivePromo: () => authFetch('/marketing/active-promo'),
};