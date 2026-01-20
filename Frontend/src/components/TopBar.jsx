import React, { useEffect, useState } from 'react';
import { getCurrentUser } from '../services/authService';
import { timeGreeting } from '../utils/greeting';

export default function TopBar({ title, right }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = () => {
      const u = getCurrentUser() || JSON.parse(localStorage.getItem('user') || 'null');
      setUser(u);
      // console.log('TopBar user:', u);
    };
    loadUser();
    window.addEventListener('storage', loadUser);
    window.addEventListener('userChanged', loadUser);
    return () => {
      window.removeEventListener('storage', loadUser);
      window.removeEventListener('userChanged', loadUser);
    };
  }, []);

  return (
    <div className="relative flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-900">
      <div>
        <p className="text-sm text-gray-500">{timeGreeting(user?.name)}</p>
        <h1 className="text-lg font-bold">{title}</h1>
      </div>
      <div>{right}</div>
    </div>
  );
}
