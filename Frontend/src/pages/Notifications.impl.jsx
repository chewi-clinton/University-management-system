import React, { useEffect, useMemo, useState } from 'react'
import TopBar from '../components/TopBar'

const CATEGORY_LIST = ['All','Finance','HR','Marketing','System']

function groupByDay(items) {
  const list = Array.isArray(items) ? items : (items && Array.isArray(items.notifications) ? items.notifications : [])
  const today = new Date();
  const yesterday = new Date(); yesterday.setDate(today.getDate() - 1)
  const grouped = { Today: [], Yesterday: [], Older: [] }
  list.forEach(n => {
    const d = new Date(n?.createdAt || n?.date || Date.now())
    if (d.toDateString() === today.toDateString()) grouped.Today.push(n)
    else if (d.toDateString() === yesterday.toDateString()) grouped.Yesterday.push(n)
    else grouped.Older.push(n)
  })
  return grouped
}

export default function NotificationsImpl() {
  const [category, setCategory] = useState('All')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [notifications, setNotifications] = useState([])

  const load = async (cat = 'All') => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      params.set('limit', '50')
      if (cat && cat !== 'All') params.set('category', cat)
      const token = localStorage.getItem('token')
      const res = await fetch(`${(import.meta.env.VITE_API_BASE || 'http://localhost:5000')}/api/notifications?${params.toString()}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      })
      if (!res.ok) {
        const txt = await res.text()
        throw new Error(txt || res.statusText)
      }
      const data = await res.json()
      setNotifications(data.notifications || data || [])
    } catch (e) {
      console.error('load notifications simple', e)
      setError(e?.message || String(e))
    } finally { setLoading(false) }
  }

  useEffect(() => { load(category) }, [category])

  const grouped = useMemo(() => groupByDay(notifications), [notifications])

  return (
    <div className="bg-background-light dark:bg-background-dark text-primary dark:text-white overflow-x-hidden min-h-screen flex flex-col relative">
      <div className="h-12 w-full bg-surface dark:bg-surface-dark shrink-0" />
      <TopBar title={`Notifications`} />

      <div className="sticky top-[69px] z-10 w-full bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm py-3 px-4 border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {CATEGORY_LIST.map(c => (
            <button key={c} onClick={() => setCategory(c)} className={`flex h-9 shrink-0 items-center justify-center rounded-full px-5 transition-transform active:scale-95 ${category===c ? 'bg-primary text-white' : 'bg-surface-light dark:bg-surface-dark border border-muted dark:border-border-dark text-muted'}`}>
              <p className="text-sm font-medium">{c}</p>
            </button>
          ))}
        </div>
      </div>

      <main className="flex-1 flex flex-col w-full max-w-4xl mx-auto pb-24 md:pb-6 md:p-6">
        {loading && <div className="p-6 text-center">Loading...</div>}
        {error && <div className="p-4 mb-4 bg-yellow-50 text-sm text-red-700 rounded">Failed to load notifications: {error}</div>}

        {!loading && !error && notifications.length === 0 && (
          <div className="p-6 text-center text-gray-500">No notifications</div>
        )}

        {grouped.Today?.length > 0 && (
          <div className="px-4 py-4 md:px-0">
            <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 ml-1">Today</h3>
            <div className="flex flex-col gap-3">{grouped.Today.map(n => (
              <div key={n._id || n.id} className="group relative flex gap-4 rounded-2xl p-4 shadow-sm border bg-surface dark:bg-surface-dark">
                <div className="flex-1">
                  <div className="flex justify-between"><p className="font-semibold">{n.title || n.body}</p><div className="text-xs text-gray-400">{new Date(n.createdAt).toLocaleString()}</div></div>
                  <p className="text-sm text-gray-500 mt-1">{n.body}</p>
                </div>
              </div>
            ))}</div>
          </div>
        )}

        {grouped.Yesterday?.length > 0 && (
          <div className="px-4 py-2 md:px-0">
            <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 ml-1">Yesterday</h3>
            <div className="flex flex-col gap-3">{grouped.Yesterday.map(n => (
              <div key={n._id || n.id} className="group relative flex gap-4 rounded-2xl p-4 shadow-sm border bg-surface dark:bg-surface-dark">
                <div className="flex-1">
                  <div className="flex justify-between"><p className="font-medium">{n.title || n.body}</p><div className="text-xs text-gray-400">{new Date(n.createdAt).toLocaleString()}</div></div>
                  <p className="text-sm text-gray-500 mt-1">{n.body}</p>
                </div>
              </div>
            ))}</div>
          </div>
        )}

        {grouped.Older?.length > 0 && (
          <div className="px-4 py-2 md:px-0">
            <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 ml-1">Older</h3>
            <div className="flex flex-col gap-3">{grouped.Older.map(n => (
              <div key={n._id || n.id} className="group relative flex gap-4 rounded-2xl p-4 shadow-sm border bg-surface dark:bg-surface-dark">
                <div className="flex-1">
                  <div className="flex justify-between"><p className="font-medium">{n.title || n.body}</p><div className="text-xs text-gray-400">{new Date(n.createdAt).toLocaleString()}</div></div>
                  <p className="text-sm text-gray-500 mt-1">{n.body}</p>
                </div>
              </div>
            ))}</div>
          </div>
        )}
      </main>
    </div>
  )
}
