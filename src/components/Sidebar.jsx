import React from 'react'
import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Dashboard', icon: 'home' },
  { to: '/tuition', label: 'Tuition', icon: 'account_balance_wallet' },
  { to: '/payments', label: 'Payments', icon: 'receipt_long' },
  { to: '/payroll', label: 'Payroll', icon: 'payments' },
  { to: '/reports', label: 'Reports', icon: 'summarize' },
  { to: '/notifications', label: 'Notifications', icon: 'notifications' },
  { to: '/bus', label: 'Bus', icon: 'directions_bus_filled' },
  { to: '/leave', label: 'Leave', icon: 'calendar_month' },
]

export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen hidden md:block bg-surface-light dark:bg-surface-dark border-r border-border-light dark:border-border-dark">
      <div className="p-4">
        <div className="mb-6 text-xl font-bold">University</div>
        <nav className="flex flex-col gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 ${isActive ? 'bg-primary/10 text-primary' : 'text-text-sub-light'}`
              }
            >
              <span className="material-symbols-outlined">{l.icon}</span>
              <span className="font-medium">{l.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  )
}
