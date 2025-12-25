import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

export default function Layout() {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-text-main-light dark:text-text-main-dark">
      <div className="flex">
        <Sidebar />
        <div className="flex-1 min-h-screen">
          <main className="p-0 md:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
