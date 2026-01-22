import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'

export default function Layout() {
  const location = useLocation()
  const financePaths = ['/tuition', '/payroll', '/financial-reports', '/leave-management', '/finance/notifications', '/create-notification', '/finance-dashboard']
  const isFinance = financePaths.some(p => location.pathname === p || location.pathname.startsWith(p + '/')) || financePaths.includes(location.pathname)

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-text-main-light dark:text-text-main-dark">
      <div className="flex">
        <Sidebar isFinance={isFinance} />
        <div className="flex-1 min-h-screen">
          <main className="w-full p-0">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
