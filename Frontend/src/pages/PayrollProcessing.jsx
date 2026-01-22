import React, { useState, useEffect } from 'react'
import TopBar from '../components/TopBar'
import StatCard from '../components/StatCard'
import { getPayrollData, getPayrollStats, updatePayrollStatus } from '../services/payrollService'

export default function PayrollProcessing() {
  const [payrolls, setPayrolls] = useState([])
  const [filteredPayrolls, setFilteredPayrolls] = useState([])
  const [stats, setStats] = useState({ employees: 0, totalPayout: 0, deductions: 0, flaggedCount: 0 })
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('all')
  const [maskSalaries, setMaskSalaries] = useState(false)
  const [showFlaggedModal, setShowFlaggedModal] = useState(false)
  const [selectedFlaggedEmployee, setSelectedFlaggedEmployee] = useState(null)
  const [showSimulateResult, setShowSimulateResult] = useState(false)
  const [simulateResult, setSimulateResult] = useState(null)
  const [period, setPeriod] = useState('January 2026')
  const [showPeriodPicker, setShowPeriodPicker] = useState(false)

  useEffect(() => {
    fetchData()
  }, [filter])

  useEffect(() => {
    applyFilters()
  }, [payrolls, searchQuery, departmentFilter, maskSalaries])

  const fetchData = async () => {
    setLoading(true)
    try {
      console.log('Fetching payroll data with filter:', filter)
      const payrollData = await getPayrollData(filter)
      console.log('Payroll data received:', payrollData)
      const statsData = await getPayrollStats()
      console.log('Stats data received:', statsData)
      setPayrolls(payrollData)
      setStats(statsData)
    } catch (error) {
      console.error('Error fetching payroll data:', error)
      console.error('Token:', localStorage.getItem('token'))
      alert(`API Error: ${error.message}`)
    }
    setLoading(false)
  }

  const applyFilters = () => {
    let filtered = payrolls

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(p =>
        p.employeeId?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.employeeId?.employeeId?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Department filter
    if (departmentFilter !== 'all') {
      filtered = filtered.filter(p => p.employeeId?.department === departmentFilter)
    }

    setFilteredPayrolls(filtered)
  }

  const handleStatusUpdate = async (payrollId, status) => {
    try {
      await updatePayrollStatus(payrollId, status)
      fetchData()
    } catch (error) {
      console.error('Error updating payroll:', error)
    }
  }

  const handleSimulate = async () => {
    try {
      const flaggedCount = filteredPayrolls.filter(p => p.status === 'flagged').length
      const readyCount = filteredPayrolls.filter(p => p.status === 'ready').length
      
      setShowSimulateResult(true)
      setSimulateResult({
        success: true,
        totalProcessed: readyCount,
        errors: flaggedCount,
        warnings: flaggedCount > 0 ? flaggedCount : 0,
        message: flaggedCount > 0 
          ? `${readyCount} ready to process, ${flaggedCount} flagged - resolve issues first`
          : readyCount > 0
          ? `All ${readyCount} employees ready for payroll processing`
          : `No employees ready for processing`
      })
    } catch (error) {
      console.error('Error simulating payroll:', error)
    }
  }

  const handleApprovePay = async () => {
    if (filteredPayrolls.some(p => p.status === 'flagged')) {
      alert('Please resolve all flagged employees before approving payroll')
      return
    }
    try {
      alert('Payroll approved and payment instructions sent to bank')
      fetchData()
    } catch (error) {
      console.error('Error approving payroll:', error)
    }
  }

  const handleResolveFlagged = (employee) => {
    setSelectedFlaggedEmployee(employee)
    setShowFlaggedModal(true)
  }

  const formatSalary = (amount) => {
    if (maskSalaries) {
      return '••••••'
    }
    return `XAF ${amount?.toLocaleString()}`
  }

  return (
    <div className="relative flex flex-col w-full min-h-screen bg-background-light dark:bg-background-dark pb-24">
      <TopBar 
        title="Payroll Processing" 
        right={
          <button 
            onClick={() => setMaskSalaries(!maskSalaries)}
            className="flex items-center justify-center rounded-lg h-12 bg-primary/10 hover:bg-primary/20 text-primary gap-2 text-base font-bold px-3 transition-colors"
          >
            <span className="material-symbols-outlined text-2xl">{maskSalaries ? 'visibility_off' : 'visibility'}</span>
          </button>
        } 
      />

      {/* Period Status Card */}
      <div className="p-4">
        <div className="flex flex-col gap-4 rounded-xl bg-surface-light dark:bg-surface-dark p-4 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-1">
              <p className="text-text-secondary dark:text-gray-400 text-xs font-semibold uppercase tracking-wider">Current Period</p>
              <p className="text-text-main dark:text-white text-xl font-bold leading-tight">{period}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 dark:bg-yellow-900/30 px-2 py-0.5 text-xs font-medium text-yellow-700 dark:text-yellow-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-600" />
                  Draft
                </span>
                <span className="text-text-secondary dark:text-gray-400 text-sm">• Due in 3 days</span>
              </div>
            </div>
            <button
              onClick={() => setShowPeriodPicker(!showPeriodPicker)}
              className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary to-blue-400 flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
            >
              <span className="material-symbols-outlined text-3xl">calendar_month</span>
            </button>
          </div>
          <div className="h-px bg-gray-100 dark:bg-gray-700 w-full" />
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-text-secondary dark:text-gray-400">Payroll ID: #UNIV-26-JAN</p>
            <button 
              onClick={() => setShowPeriodPicker(!showPeriodPicker)}
              className="flex items-center gap-1 text-primary text-sm font-bold hover:text-blue-600 transition-colors">
              Change Period
              <span className="material-symbols-outlined text-sm">edit</span>
            </button>
          </div>
        </div>

        {/* Period Picker Modal */}
        {showPeriodPicker && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
            <div 
              className="w-full bg-white dark:bg-surface-dark rounded-t-2xl p-6 space-y-4 max-h-[70vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-text-main dark:text-white">Select Payroll Period</h3>
                <button
                  onClick={() => setShowPeriodPicker(false)}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  'January 2026', 'February 2026', 'March 2026', 'April 2026',
                  'May 2026', 'June 2026', 'July 2026', 'August 2026',
                  'September 2026', 'October 2026', 'November 2026', 'December 2026'
                ].map((m) => (
                  <button
                    key={m}
                    onClick={() => {
                      setPeriod(m)
                      setShowPeriodPicker(false)
                    }}
                    className={`p-3 rounded-lg font-medium transition-colors ${
                      period === m
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-text-main dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setShowPeriodPicker(false)}
                className="w-full py-3 bg-primary text-white font-bold rounded-lg hover:bg-blue-600 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Stats Row */}
      <div className="flex gap-4 p-4 pt-0 overflow-x-auto no-scrollbar snap-x">
        <StatCard icon="payments" label="Total Payout" value={formatSalary(stats.totalPayout)} className="min-w-[150px]" />
        <StatCard icon="group" label="Employees" value={stats.employees} className="min-w-[150px]" />
        <StatCard icon="warning" label="Flagged" value={stats.flaggedCount} className="min-w-[150px]" />
      </div>

      {/* Search Bar */}
      <div className="px-4 py-2 sticky top-[72px] z-10 bg-background-light dark:bg-background-dark/95 backdrop-blur-sm">
        <label className="flex flex-col w-full">
          <div className="flex w-full flex-1 items-stretch rounded-xl h-12 shadow-sm">
            <div className="text-text-secondary dark:text-gray-400 flex bg-white dark:bg-surface-dark items-center justify-center pl-4 rounded-l-xl border border-r-0 border-gray-200 dark:border-gray-700">
              <span className="material-symbols-outlined">search</span>
            </div>
            <input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl rounded-l-none text-text-main dark:text-white focus:outline-0 focus:ring-0 bg-white dark:bg-surface-dark border border-l-0 border-gray-200 dark:border-gray-700 h-full placeholder:text-text-secondary dark:placeholder:text-gray-500 px-4 pl-2 text-base font-normal leading-normal" 
              placeholder="Search by name or ID" 
            />
          </div>
        </label>
      </div>

      {/* Filter Chips */}
      <div className="flex gap-2 p-4 pt-2 overflow-x-auto no-scrollbar">
        {['all', 'ready', 'flagged', 'approved', 'paid'].map(status => (
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

      {/* Department Filter */}
      <div className="px-4 py-2 flex gap-2 overflow-x-auto no-scrollbar">
        <span className="text-sm text-gray-500 shrink-0 flex items-center">Dept:</span>
        {['all', 'faculty', 'admin', 'support', 'it'].map(dept => (
          <button
            key={dept}
            onClick={() => setDepartmentFilter(dept)}
            className={`shrink-0 h-7 px-3 rounded-full text-xs font-medium transition-colors ${
              departmentFilter === dept
                ? 'bg-primary/20 text-primary'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300'
            }`}
          >
            {dept.charAt(0).toUpperCase() + dept.slice(1)}
          </button>
        ))}
      </div>

      {/* Employee List */}
      <div className="flex flex-col gap-3 px-4 py-4">
        <h3 className="text-text-main dark:text-white text-base font-bold px-1">Employees ({filteredPayrolls.length})</h3>
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : filteredPayrolls.length === 0 ? (
          <p className="text-center text-gray-500">No payroll records found</p>
        ) : (
          filteredPayrolls.map((payroll) => (
            <div 
              key={payroll._id} 
              className={`flex items-center justify-between gap-4 p-4 rounded-xl shadow-sm border transition-all cursor-pointer group ${
                payroll.status === 'flagged'
                  ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700 hover:border-red-300'
                  : 'bg-surface-light dark:bg-surface-dark border-transparent hover:border-gray-200 dark:hover:border-gray-700'
              }`}
              onClick={() => payroll.status === 'flagged' && handleResolveFlagged(payroll)}
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="relative">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    payroll.status === 'flagged' 
                      ? 'bg-red-200 dark:bg-red-900/50' 
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`}>
                    <span className="material-symbols-outlined text-gray-400">{payroll.status === 'flagged' ? 'warning' : 'person'}</span>
                  </div>
                  <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-surface-dark ${
                    payroll.status === 'paid' ? 'bg-green-500' :
                    payroll.status === 'flagged' ? 'bg-red-500' :
                    payroll.status === 'approved' ? 'bg-blue-500' :
                    'bg-yellow-500'
                  }`} />
                </div>
                <div className="flex flex-col flex-1">
                  <p className="text-text-main dark:text-white text-base font-bold leading-tight group-hover:text-primary transition-colors">{payroll.employeeId?.name || 'Unknown'}</p>
                  <p className="text-text-secondary dark:text-gray-400 text-sm font-normal">{payroll.employeeId?.position || 'Position'}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1 min-w-[120px]">
                <p className="text-text-main dark:text-white text-base font-bold tabular-nums">{formatSalary(payroll.netPay)}</p>
                <span className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium ${
                  payroll.status === 'paid' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' :
                  payroll.status === 'flagged' ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400' :
                  payroll.status === 'approved' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' :
                  'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400'
                }`}>
                  {payroll.status === 'flagged' && <span className="material-symbols-outlined text-sm">error</span>}
                  {payroll.status.charAt(0).toUpperCase() + payroll.status.slice(1)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Simulate Result Modal */}
      {showSimulateResult && simulateResult && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 max-w-md w-full space-y-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Simulation Results</h3>
            <div className={`p-4 rounded-lg ${simulateResult.success ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
              <p className={`text-sm font-medium ${simulateResult.success ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
                {simulateResult.message}
              </p>
            </div>
            <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <p><strong>Processed:</strong> {simulateResult.totalProcessed} employees</p>
              <p><strong>Errors:</strong> {simulateResult.errors}</p>
              <p><strong>Warnings:</strong> {simulateResult.warnings}</p>
            </div>
            <button
              onClick={() => setShowSimulateResult(false)}
              className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Flagged Employee Resolution Modal */}
      {showFlaggedModal && selectedFlaggedEmployee && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 max-w-md w-full space-y-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Resolve Flagged Employee</h3>
            <div className="space-y-2 text-gray-700 dark:text-gray-300">
              <p><strong>Employee:</strong> {selectedFlaggedEmployee.employeeId?.name}</p>
              <p><strong>Position:</strong> {selectedFlaggedEmployee.employeeId?.position}</p>
              <p><strong>Net Pay:</strong> XAF {selectedFlaggedEmployee.netPay?.toLocaleString()}</p>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
              <p className="text-sm text-red-700 dark:text-red-300">
                <strong>Issue:</strong> Missing timesheet submission for January 2026
              </p>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => {
                  handleStatusUpdate(selectedFlaggedEmployee._id, 'ready')
                  setShowFlaggedModal(false)
                }}
                className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Mark as Ready
              </button>
              <button
                onClick={() => setShowFlaggedModal(false)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 dark:bg-surface-dark/90 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 flex gap-4 z-50">
        <button 
          onClick={handleSimulate}
          className="flex-1 flex items-center justify-center h-12 px-6 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary text-base font-bold transition-colors"
        >
          Simulate
        </button>
        <button 
          onClick={handleApprovePay}
          className="flex-[2] flex items-center justify-center gap-2 h-12 px-6 rounded-xl bg-primary hover:bg-blue-600 text-white text-base font-bold shadow-lg shadow-blue-500/30 transition-colors"
        >
          <span>Approve &amp; Pay</span>
          <span className="material-symbols-outlined text-xl">check_circle</span>
        </button>
      </div>
    </div>
  );
}
