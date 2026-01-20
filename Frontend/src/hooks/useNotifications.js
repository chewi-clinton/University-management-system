import { useEffect, useRef, useState } from 'react';
import { notificationAPI } from '../services/notificationService';

// Polling hook: polls unread count every 60s, refreshes recent list on demand.
// To use WebSocket replace poll with socket events.
export default function useNotifications({ pollInterval = 60000 } = {}) {
  const [unread, setUnread] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const pollRef = useRef(null);

  const refreshUnread = async () => {
    try {
      const res = await notificationAPI.getUnreadCount();
      setUnread(res.unread || 0);
    } catch (e) { /* ignore */ }
  };

  const refreshList = async (limit = 5) => {
    try {
      const res = await notificationAPI.list(limit);
      setNotifications(res.notifications || []);
    } catch (e) { /* ignore */ }
  };

  useEffect(() => {
    refreshUnread();
    // start polling
    pollRef.current = setInterval(refreshUnread, pollInterval);
    return () => clearInterval(pollRef.current);
  }, [pollInterval]);

  return { unread, notifications, refreshUnread, refreshList, setNotifications };
}