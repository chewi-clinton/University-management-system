import React, { useState, useEffect } from 'react'
import TopBar from '../components/TopBar'
import StatCard from '../components/StatCard'
import { getPayrollData, getPayrollStats, updatePayrollStatus } from '../services/payrollService'

export default function PayrollProcessing() {
  const [payrolls, setPayrolls] = useState([])
  const [stats, setStats] = useState({ employees: 0, totalPayout: 0, deductions: 0, flaggedCount: 0 })
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchData()
  }, [filter])

  const fetchData = async () => {
    setLoading(true)
    try {
      const payrollData = await getPayrollData(filter)
      const statsData = await getPayrollStats()
      setPayrolls(payrollData)
      setStats(statsData)
    } catch (error) {
      console.error('Error fetching payroll data:', error)
    }
    setLoading(false)
  }

  const handleStatusUpdate = async (payrollId, status) => {
    try {
      await updatePayrollStatus(payrollId, status)
      fetchData()
    } catch (error) {
      console.error('Error updating payroll:', error)
    }
  }

  return (
    <div className="relative flex flex-col w-full min-h-screen bg-background-light dark:bg-background-dark pb-24">
      <TopBar title="Payroll Processing" right={<button className="flex items-center justify-center rounded-lg h-12 bg-transparent text-text-main dark:text-white gap-2 text-base font-bold min-w-0 p-0"><span className="material-symbols-outlined text-2xl">visibility</span></button>} />

      {/* Period Status Card */}
      <div className="p-4">
        <div className="flex flex-col gap-4 rounded-xl bg-surface-light dark:bg-surface-dark p-4 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-1">
              <p className="text-text-secondary dark:text-gray-400 text-xs font-semibold uppercase tracking-wider">Current Period</p>
              <p className="text-text-main dark:text-white text-xl font-bold leading-tight">October 2023</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 dark:bg-blue-900/30 px-2 py-0.5 text-xs font-medium text-blue-700 dark:text-blue-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                  Draft
                </span>
                <span className="text-text-secondary dark:text-gray-400 text-sm">• Due in 5 days</span>
              </div>
            </div>
            <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary to-blue-400 flex items-center justify-center text-white shadow-lg">
              <span className="material-symbols-outlined text-3xl">calendar_month</span>
            </div>
          </div>
          <div className="h-px bg-gray-100 dark:bg-gray-700 w-full" />
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-text-secondary dark:text-gray-400">Payroll ID: #UNIV-23-OCT</p>
            <button className="flex items-center gap-1 text-primary text-sm font-bold">
              Change Period
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="flex gap-4 p-4 pt-0 overflow-x-auto no-scrollbar snap-x">
        <StatCard icon="payments" label="Total Payout" value={`$${(stats.totalPayout / 1000).toLocaleString()}k`} className="min-w-[150px]" />
        <StatCard icon="group" label="Employees" value={stats.employees} className="min-w-[150px]" />
        <StatCard icon="account_balance_wallet" label="Deductions" value={`$${(stats.deductions / 1000).toLocaleString()}k`} className="min-w-[150px]" />
      </div>

      {/* Search Bar */}
      <div className="px-4 py-2 sticky top-[72px] z-10 bg-background-light dark:bg-background-dark/95 backdrop-blur-sm">
        <label className="flex flex-col w-full">
          <div className="flex w-full flex-1 items-stretch rounded-xl h-12 shadow-sm">
            <div className="text-text-secondary dark:text-gray-400 flex bg-white dark:bg-surface-dark items-center justify-center pl-4 rounded-l-xl border border-r-0 border-gray-200 dark:border-gray-700">
              <span className="material-symbols-outlined">search</span>
            </div>
            <input className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl rounded-l-none text-text-main dark:text-white focus:outline-0 focus:ring-0 bg-white dark:bg-surface-dark border border-l-0 border-gray-200 dark:border-gray-700 h-full placeholder:text-text-secondary dark:placeholder:text-gray-500 px-4 pl-2 text-base font-normal leading-normal" placeholder="Search by name or ID" />
          </div>
        </label>
      </div>

      {/* Filter Chips */}
      <div className="flex gap-2 p-4 pt-2 overflow-x-auto no-scrollbar">
        {['all', 'draft', 'approved', 'paid'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`shrink-0 h-9 px-4 rounded-full text-sm font-medium transition-colors ${
              filter === status
                ? 'bg-primary text-white'
                : 'bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 text-text-main dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Employee List */}
      <div className="flex flex-col gap-3 px-4 pb-4">
        <h3 className="text-text-main dark:text-white text-base font-bold px-1">Employees ({stats.employees})</h3>
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : payrolls.length === 0 ? (
          <p className="text-center text-gray-500">No payroll records found</p>
        ) : (
          payrolls.map((payroll) => (
            <div key={payroll._id} className="flex items-center justify-between gap-4 p-4 rounded-xl bg-surface-light dark:bg-surface-dark shadow-sm border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-colors cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-gray-400">person</span>
                  </div>
                  <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-surface-dark ${
                    payroll.status === 'paid' ? 'bg-green-500' :
                    payroll.status === 'approved' ? 'bg-blue-500' :
                    'bg-yellow-500'
                  }`} />
                </div>
                <div className="flex flex-col">
                  <p className="text-text-main dark:text-white text-base font-bold leading-tight group-hover:text-primary transition-colors">{payroll.employeeId?.name || 'Unknown'}</p>
                  <p className="text-text-secondary dark:text-gray-400 text-sm font-normal">{payroll.employeeId?.position || 'Position'}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <p className="text-text-main dark:text-white text-base font-bold tabular-nums">${payroll.netPay?.toLocaleString()}</p>
                <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
                  payroll.status === 'paid' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' :
                  payroll.status === 'approved' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' :
                  'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400'
                }`}>
                  {payroll.status.charAt(0).toUpperCase() + payroll.status.slice(1)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 dark:bg-surface-dark/90 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 flex gap-4 z-50">
        <button className="flex-1 flex items-center justify-center h-12 px-6 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary text-base font-bold transition-colors">Simulate</button>
        <button 
          onClick={() => handleStatusUpdate(payrolls[0]?._id, 'approved')}
          className="flex-[2] flex items-center justify-center gap-2 h-12 px-6 rounded-xl bg-primary hover:bg-blue-600 text-white text-base font-bold shadow-lg shadow-blue-500/30 transition-colors"
        >
          <span>Approve &amp; Pay</span>
          <span className="material-symbols-outlined text-xl">check_circle</span>
        </button>
      </div>
    </div>
  );
}
