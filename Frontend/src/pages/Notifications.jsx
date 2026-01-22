import React, { lazy, Suspense } from 'react'
import ErrorBoundary from '../components/ErrorBoundary'

const LazyNotificationsImpl = lazy(() => import('./Notifications.impl.jsx'))

export default function Notifications() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<div className="p-6 text-center">Loading notifications...</div>}>
        <LazyNotificationsImpl />
      </Suspense>
    </ErrorBoundary>
  )
}
