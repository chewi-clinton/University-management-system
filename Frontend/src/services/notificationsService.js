import { getToken } from './authService';
const API = 'http://localhost:5000/api';

export const notificationsAPI = {
  getNotifications: async () => {
    const token = getToken();
    const res = await fetch(`${API}/notifications`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed');
    return data;
  }
};