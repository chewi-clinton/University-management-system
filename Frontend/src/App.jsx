import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/FinanceDashboard'
import TuitionManagement from './pages/TuitionManagement'
import PayrollProcessing from './pages/PayrollProcessing'
import PaymentHistory from './pages/PaymentHistory'
import FinancialReports from './pages/FinancialReports'
import Notifications from './pages/Notifications'
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
          <Route path="notifications" element={<Notifications />} />
          <Route path="finance/notifications" element={<Notifications />} />
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
