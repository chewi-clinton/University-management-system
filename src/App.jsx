import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import TuitionManagement from './pages/TuitionManagement'
import PayrollProcessing from './pages/PayrollProcessing'
import PaymentHistory from './pages/PaymentHistory'
import FinancialReports from './pages/FinancialReports'
import Notifications from './pages/Notifications'
import BusRegistration from './pages/BusRegistration'
import LeaveManagement from './pages/LeaveManagement'

export default function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="tuition" element={<TuitionManagement />} />
          <Route path="bus" element={<BusRegistration />} />
          <Route path="payroll" element={<PayrollProcessing />} />
          <Route path="payments" element={<PaymentHistory />} />
          <Route path="reports" element={<FinancialReports />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="leave" element={<LeaveManagement />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
