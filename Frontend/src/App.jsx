import React from 'react'
import { Suspense, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/FinanceDashboard'
import TuitionManagement from './pages/TuitionManagement'
import PayrollProcessing from './pages/PayrollProcessing'
import PaymentHistory from './pages/PaymentHistory'
import FinancialReports from './pages/FinancialReports'
const Notifications = React.lazy(() => import('./pages/Notifications'))
import ErrorBoundary from './components/ErrorBoundary'

function SafeNotificationsWrapper() {
  const [load, setLoad] = useState(false)
  const [err, setErr] = useState(null)
  if (err) return <div className="p-6 max-w-3xl mx-auto">Failed to load notifications: {String(err)}</div>
  if (!load) return <div className="p-6 max-w-3xl mx-auto"><button onClick={() => setLoad(true)} className="px-4 py-2 bg-primary text-white rounded">Open Notifications</button></div>
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <ErrorBoundary>
        <Notifications />
      </ErrorBoundary>
    </Suspense>
  )
}
import BusRegistration from './pages/BusRegistration'
import LeaveManagement from './pages/LeaveManagement'
import LoginPage from './pages/LoginPage'
import StudentDashboard from './pages/StudentDashboard'
import SignupPage from './pages/SignupPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import MockPay from './pages/MockPay';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/finance-dashboard" element={<Navigate to="/tuition" />} />
        <Route path="/" element={<Layout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="tuition" element={<TuitionManagement />} />
          <Route path="bus-registration" element={<BusRegistration />} />
          <Route path="payroll" element={<PayrollProcessing />} />
          <Route path="payment-history" element={<PaymentHistory />} />
          <Route path="financial-reports" element={<FinancialReports />} />
          <Route path="notifications" element={<SafeNotificationsWrapper />} />
          <Route path="finance/notifications" element={<SafeNotificationsWrapper />} />
          <Route path="leave-management" element={<LeaveManagement />} />
        </Route>
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="/mock-pay/:txId" element={<MockPay />} />
      </Routes>
    </BrowserRouter>
  );
}
