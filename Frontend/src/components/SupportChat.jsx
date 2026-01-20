import React, { useEffect, useRef, useState } from 'react';
import { getToken } from '../services/authService';

export default function SupportChat({ open, onClose }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const scroller = useRef();
  const pollRef = useRef();

  const fetchMessages = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/support/messages', {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      if (!res.ok) return;
      const data = await res.json();
      setMessages(data.messages || []);
    } catch (e) { /* ignore */ }
  };

  useEffect(() => {
    if (!open) return;
    fetchMessages();
    pollRef.current = setInterval(fetchMessages, 2500);
    return () => clearInterval(pollRef.current);
  }, [open]);

  useEffect(() => {
    if (scroller.current) scroller.current.scrollTop = scroller.current.scrollHeight;
  }, [messages]);

  const send = async () => {
    if (!text.trim()) return;
    try {
      const res = await fetch('http://localhost:5000/api/support/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ text })
      });
      if (res.ok) {
        setText('');
        fetchMessages();
      } else {
        const err = await res.json();
        alert(err.message || 'Send failed');
      }
    } catch (e) {
      alert('Send failed');
    }
  };

  if (!open) return null;
  return (
    <div className="fixed right-4 bottom-20 w-80 bg-white dark:bg-surface-dark shadow-lg rounded-md z-50 flex flex-col overflow-hidden">
      <div className="flex items-center justify-between p-3 border-b">
        <div className="font-bold">Help Desk</div>
        <button onClick={onClose} className="text-sm">Close</button>
      </div>
      <div ref={scroller} className="p-3 flex-1 overflow-auto" style={{ maxHeight: 300 }}>
        {messages.map(m => (
          <div key={m._id} className={`mb-2 ${m.from === 'admin' ? 'text-left' : 'text-right'}`}>
            <div className={`inline-block px-3 py-1 rounded ${m.from === 'admin' ? 'bg-gray-100 dark:bg-gray-800' : 'bg-primary text-white'}`}>
              <div className="text-xs">{m.text}</div>
              <div className="text-[10px] text-gray-500 mt-1">{new Date(m.createdAt).toLocaleString()}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="p-2 border-t flex gap-2">
        <input value={text} onChange={e => setText(e.target.value)} className="flex-1 px-2 py-1 rounded border" placeholder="Type a message..." />
        <button onClick={send} className="px-3 py-1 bg-primary text-white rounded">Send</button>
      </div>
    </div>
  );
}