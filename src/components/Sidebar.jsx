import React from 'react'
import { NavLink } from 'react-router-dom'

export default function Sidebar({ isFinance }) {
  return (
    <aside className="w-64 min-h-screen hidden md:block bg-surface border-r border-muted">
      <div className="p-4">
        <div className="mb-6 text-xl font-bold text-primary">University</div>
        <nav className="flex flex-col gap-1">
          {isFinance ? (
            <>
              <NavLink
                to="/tuition"
                className={({ isActive }) =>
                  `block p-2 rounded ${
                    isActive ? 'bg-primary text-white' : 'hover:bg-primary hover:text-white'
                  }`
                }
              >
                Tuition Management
              </NavLink>
              <NavLink
                to="/payroll"
                className={({ isActive }) =>
                  `block p-2 rounded ${
                    isActive ? 'bg-primary text-white' : 'hover:bg-primary hover:text-white'
                  }`
                }
              >
                Payroll Processing
              </NavLink>
              <NavLink
                to="/financial-reports"
                className={({ isActive }) =>
                  `block p-2 rounded ${
                    isActive ? 'bg-primary text-white' : 'hover:bg-primary hover:text-white'
                  }`
                }
              >
                Financial Reports
              </NavLink>
              <NavLink
                to="/leave-management"
                className={({ isActive }) =>
                  `block p-2 rounded ${
                    isActive ? 'bg-primary text-white' : 'hover:bg-primary hover:text-white'
                  }`
                }
              >
                Leave Request Management
              </NavLink>
              <NavLink
                to="/notifications"
                className={({ isActive }) =>
                  `block p-2 rounded ${
                    isActive ? 'bg-primary text-white' : 'hover:bg-primary hover:text-white'
                  }`
                }
              >
                Notifications
              </NavLink>
            </>
          ) : (
            <>
              <NavLink
                to="/student-dashboard"
                className={({ isActive }) =>
                  `block p-2 rounded ${
                    isActive ? 'bg-primary text-white' : 'hover:bg-primary hover:text-white'
                  }`
                }
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/payment-history"
                className={({ isActive }) =>
                  `block p-2 rounded ${
                    isActive ? 'bg-primary text-white' : 'hover:bg-primary hover:text-white'
                  }`
                }
              >
                Payment History
              </NavLink>
              <NavLink
                to="/bus-registration"
                className={({ isActive }) =>
                  `block p-2 rounded ${
                    isActive ? 'bg-primary text-white' : 'hover:bg-primary hover:text-white'
                  }`
                }
              >
                Bus Registration
              </NavLink>
              <NavLink
                to="/notifications"
                className={({ isActive }) =>
                  `block p-2 rounded ${
                    isActive ? 'bg-primary text-white' : 'hover:bg-primary hover:text-white'
                  }`
                }
              >
                Notifications
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </aside>
  )
}
