import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TopBar from '../components/TopBar'

const CATEGORY_LIST = ['All','Finance','HR','Marketing','System']

// Helper to get icon based on category
const getCategoryIcon = (category) => {
  switch(category) {
    case 'Finance': return 'wallet'
    case 'HR': return 'people'
    case 'Marketing': return 'campaign'
    case 'System': return 'notifications_active'
    default: return 'notifications'
  }
}

// Helper to get icon color based on urgency
const getUrgencyColor = (urgency) => {
  switch(urgency) {
    case 'critical': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
    case 'high': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
    case 'medium': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
    default: return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
  }
}

// Helper to get action button config based on role and action type
const getActionButton = (notification, userRole) => {
  const { action, actionPage, actionTarget, meta } = notification
  
  // Student-specific actions
  if (userRole === 'student') {
    if (action === 'pay_now') {
      return {
        label: 'Pay Now',
        color: 'bg-green-500 hover:bg-green-600',
        onClick: () => `/payment-checkout?invoiceId=${meta?.invoiceId || actionTarget}`
      }
    }
    if (action === 'view') {
      return {
        label: 'View',
        color: 'bg-blue-500 hover:bg-blue-600',
        onClick: () => actionPage || '/dashboard'
      }
    }
  }
  
  // Finance Officer-specific actions
  if (userRole === 'finance_officer') {
    if (action === 'review' || action === 'approve') {
      return {
        label: action === 'approve' ? 'Approve' : 'Review',
        color: 'bg-purple-500 hover:bg-purple-600',
        onClick: () => actionPage || '/payroll-processing'
      }
    }
  }
  
  // Default action
  return {
    label: 'View',
    color: 'bg-gray-500 hover:bg-gray-600',
    onClick: () => '#'
  }
}

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
  const navigate = useNavigate()
  const [category, setCategory] = useState('All')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [notifications, setNotifications] = useState([])
  const [userRole, setUserRole] = useState('student')

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
      if (data.userRole) setUserRole(data.userRole)
    } catch (e) {
      console.error('load notifications simple', e)
      setError(e?.message || String(e))
    } finally { setLoading(false) }
  }

  useEffect(() => { load(category) }, [category])

  const grouped = useMemo(() => groupByDay(notifications), [notifications])

  const handleActionClick = (notification) => {
    const actionBtn = getActionButton(notification, userRole)
    const target = actionBtn.onClick()
    if (target && target !== '#') {
      navigate(target)
    }
  }

  const handleMarkAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('token')
      await fetch(`${(import.meta.env.VITE_API_BASE || 'http://localhost:5000')}/api/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      })
      // Refresh notifications
      load(category)
    } catch (e) {
      console.error('Error marking as read:', e)
    }
  }

  const NotificationCard = ({ notification }) => {
    const actionBtn = getActionButton(notification, userRole)
    const urgencyColor = getUrgencyColor(notification.urgency || 'low')
    
    return (
      <div key={notification._id || notification.id} className={`group relative flex gap-3 rounded-2xl p-4 shadow-sm border transition-all ${notification.read ? 'bg-surface dark:bg-surface-dark opacity-70' : 'bg-surface dark:bg-surface-dark border-primary/20'}`}>
        {/* Icon */}
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${urgencyColor}`}>
          <span className="material-symbols-outlined text-lg">{getCategoryIcon(notification.category)}</span>
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div className="flex-1">
              <p className={`font-semibold leading-tight ${notification.read ? 'text-gray-600 dark:text-gray-400' : 'text-primary dark:text-white'}`}>
                {notification.title}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(notification.createdAt).toLocaleTimeString()}
              </p>
            </div>
            {notification.category && (
              <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 whitespace-nowrap">
                {notification.category}
              </span>
            )}
          </div>
          
          {notification.body && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">
              {notification.body}
            </p>
          )}

          {/* Metadata display */}
          {notification.meta && (
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-500 space-y-1">
              {notification.meta.employeeName && (
                <p>👤 {notification.meta.employeeName}</p>
              )}
              {notification.meta.amount && (
                <p>💰 ${notification.meta.amount.toFixed(2)}</p>
              )}
              {notification.meta.departmentName && (
                <p>🏢 {notification.meta.departmentName}</p>
              )}
              {notification.meta.payrollMonth && (
                <p>📅 {notification.meta.payrollMonth}</p>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-3 flex gap-2">
            {actionBtn.label && (
              <button
                onClick={() => handleActionClick(notification)}
                className={`text-xs font-semibold py-2 px-4 rounded-lg text-white transition-all ${actionBtn.color}`}
              >
                {actionBtn.label}
              </button>
            )}
            {!notification.read && (
              <button
                onClick={() => handleMarkAsRead(notification._id)}
                className="text-xs font-semibold py-2 px-4 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Mark Read
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-background-light dark:bg-background-dark text-primary dark:text-white overflow-x-hidden min-h-screen flex flex-col relative">
      <div className="h-12 w-full bg-surface dark:bg-surface-dark shrink-0" />
      <TopBar title={`Notifications ${userRole ? `(${userRole})` : ''}`} />

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
            <div className="flex flex-col gap-3">{grouped.Today.map(n => <NotificationCard key={n._id} notification={n} />)}</div>
          </div>
        )}

        {grouped.Yesterday?.length > 0 && (
          <div className="px-4 py-2 md:px-0">
            <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 ml-1">Yesterday</h3>
            <div className="flex flex-col gap-3">{grouped.Yesterday.map(n => <NotificationCard key={n._id} notification={n} />)}</div>
          </div>
        )}

        {grouped.Older?.length > 0 && (
          <div className="px-4 py-2 md:px-0">
            <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 ml-1">Older</h3>
            <div className="flex flex-col gap-3">{grouped.Older.map(n => <NotificationCard key={n._id} notification={n} />)}</div>
          </div>
        )}
      </main>
    </div>
  )
}
