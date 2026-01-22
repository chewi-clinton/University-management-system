import React, { useState, useEffect } from 'react'
import TopBar from '../components/TopBar'
import StatCard from '../components/StatCard'
import BottomAction from '../components/BottomAction'
import { IncomeBreakdown, ExpenseBreakdown, FinancialSummaryGrid } from '../components/FinancialChart'
import { GenerateReportModal } from '../components/GenerateReportModal'
import { financeAPI } from '../services/financeService'

export default function FinancialReports(){
  // Filter states
  const [category, setCategory] = useState('all')
  const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0])
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0])
  const [department, setDepartment] = useState('all')

  // Data states
  const [reportData, setReportData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showGenerateModal, setShowGenerateModal] = useState(false)
  const [generatingReport, setGeneratingReport] = useState(false)
  const [generatedReports, setGeneratedReports] = useState([])

  // Fetch financial reports and generated reports
  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await financeAPI.getFinancialReports(category, startDate, endDate, department)
        const reports = await financeAPI.getGeneratedReports()
        setReportData(data)
        setGeneratedReports(reports)
      } catch (err) {
        console.error('Failed to fetch financial reports:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchReports()
  }, [category, startDate, endDate, department])

  // Handle filter changes
  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory)
  }

  const handleExport = async () => {
    try {
      const result = await financeAPI.exportHistory(null, { start: startDate, end: endDate })
      window.open(result.url)
    } catch (err) {
      console.error('Export failed:', err)
      setError('Failed to export data')
    }
  }

  const handleGenerateReport = async (reportConfig) => {
    try {
      setGeneratingReport(true)
      // Call backend to save report
      const newReport = await financeAPI.generateReport(
        reportConfig.name,
        reportConfig.type || 'pdf',
        reportConfig.category || 'all',
        reportConfig.department === 'all' ? 'University Wide' : reportConfig.department,
        reportConfig.startDate,
        reportConfig.endDate
      )

      setGeneratedReports(prev => [newReport.report, ...prev])
      setError(null)
      setShowGenerateModal(false)
    } catch (err) {
      console.error('Failed to generate report:', err)
      setError('Failed to generate report. Please try again.')
    } finally {
      setGeneratingReport(false)
    }
  }

  const handleRefreshReport = (reportId) => {
    // Simulate refresh
    console.log('Refreshing report:', reportId)
  }

  const handleReportAction = async (reportId, action) => {
    console.log(`Report action: ${action}`, reportId)
    if (action === 'share') {
      alert('Share functionality coming soon')
    } else if (action === 'rename') {
      alert('Rename functionality coming soon')
    } else if (action === 'delete') {
      try {
        await financeAPI.deleteReport(reportId)
        setGeneratedReports(prev => prev.filter(r => r._id !== reportId))
      } catch (err) {
        setError('Failed to delete report')
      }
    }
  }

  if (loading && !reportData) {
    return (
      <div className="bg-background-light dark:bg-background-dark font-display text-primary dark:text-white overflow-x-hidden transition-colors duration-200">
        <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root">
          <TopBar title="Financial Reports" />
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-text-sub-light dark:text-text-sub-dark">Loading financial data...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const metrics = reportData?.metrics || {
    netBalance: 0,
    income: 0,
    expenses: 0,
    incomeGrowth: 0
  }

  const details = reportData?.details || {
    income: { bySource: {} },
    expenses: { bySource: {} }
  }

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-primary dark:text-white overflow-x-hidden transition-colors duration-200">
      <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root">
        <TopBar
          title="Financial Reports"
          right={
            <button 
              onClick={handleExport}
              className="flex items-center gap-1 text-primary font-bold text-base leading-normal hover:opacity-80"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                download
              </span>
            </button>
          }
        />

        {/* Filters Section */}
        <section className="bg-surface dark:bg-surface-dark pb-4 rounded-b-xl shadow-sm mb-4">
          {/* Chips */}
          <div className="flex gap-3 px-4 py-3 overflow-x-auto no-scrollbar">
            {['all', 'income', 'expenses', 'payroll'].map(cat => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full pl-4 pr-4 transition-colors capitalize ${
                  category === cat
                    ? 'bg-primary text-white'
                    : 'bg-surface-light dark:bg-surface-dark text-primary dark:text-text-main-dark hover:bg-hover-light dark:hover:bg-hover-dark'
                }`}
              >
                <p className="text-sm font-medium leading-normal">{cat}</p>
              </button>
            ))}
          </div>

          {/* Date Range Inputs */}
          <div className="flex flex-wrap items-end gap-4 px-4 pb-3">
            <label className="flex flex-col min-w-0 flex-1">
              <p className="text-primary dark:text-text-sub-dark text-sm font-medium leading-normal pb-1.5">Start Date</p>
              <div className="relative">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-primary dark:text-text-main-dark focus:outline-0 focus:ring-2 focus:ring-primary/20 border border-muted dark:border-border-dark bg-surface dark:bg-surface-dark h-12 p-[15px] text-base font-normal leading-normal appearance-none"
                />
              </div>
            </label>
            <label className="flex flex-col min-w-0 flex-1">
              <p className="text-primary dark:text-text-sub-dark text-sm font-medium leading-normal pb-1.5">End Date</p>
              <div className="relative">
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-primary dark:text-text-main-dark focus:outline-0 focus:ring-2 focus:ring-primary/20 border border-muted dark:border-border-dark bg-surface dark:bg-surface-dark h-12 p-[15px] text-base font-normal leading-normal appearance-none"
                />
              </div>
            </label>
          </div>

          {/* Department Select */}
          <div className="px-4">
            <label className="flex flex-col w-full">
              <p className="text-primary dark:text-text-sub-dark text-sm font-medium leading-normal pb-1.5">Department</p>
              <div className="relative">
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-primary dark:text-text-main-dark focus:outline-0 focus:ring-2 focus:ring-primary/20 border border-muted dark:border-border-dark bg-surface dark:bg-surface-dark h-12 px-[15px] text-base font-normal leading-normal appearance-none pr-10"
                >
                  <option value="all">All Departments</option>
                  <option value="eng">Engineering</option>
                  <option value="arts">Arts &amp; Humanities</option>
                  <option value="sci">Science</option>
                  <option value="admin">Administration</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-text-sub-light dark:text-text-sub-dark">
                  <span className="material-symbols-outlined">expand_more</span>
                </div>
              </div>
            </label>
          </div>
        </section>

        {/* Main Content */}
        <main className="flex-1 flex flex-col gap-6 px-4 pb-32">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-200">
              Error: {error}
            </div>
          )}

          {/* Primary Summary Card */}
          <div className="col-span-1 md:col-span-3 bg-primary rounded-xl p-5 shadow-lg text-white relative overflow-hidden">
            <div className="absolute right-[-20px] top-[-20px] opacity-10">
              <span className="material-symbols-outlined" style={{fontSize: 140}}>account_balance_wallet</span>
            </div>
            <p className="text-white/80 text-sm font-medium mb-1">Net Balance</p>
            <h2 className="text-3xl font-bold mb-2">XAF {metrics.netBalance.toLocaleString()}</h2>
            <div className="flex items-center gap-1 bg-white/20 w-fit px-2 py-1 rounded-md text-xs font-semibold backdrop-blur-sm">
              <span className="material-symbols-outlined text-sm">{metrics.incomeGrowth >= 0 ? 'trending_up' : 'trending_down'}</span>
              <span>{metrics.incomeGrowth >= 0 ? '+' : ''}{metrics.incomeGrowth}% vs last period</span>
            </div>
          </div>

          {/* Summary Grid */}
          <FinancialSummaryGrid metrics={metrics} />

          {/* Detailed Breakdowns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(category === 'all' || category === 'income') && (
              <IncomeBreakdown data={details.income?.bySource || {}} />
            )}
            {(category === 'all' || category === 'expenses') && (
              <ExpenseBreakdown data={details.expenses?.bySource || {}} />
            )}
          </div>

          {/* Recent Reports List */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-text-main-light dark:text-text-main-dark text-lg font-bold">Generated Reports</h3>
              <button className="text-primary text-sm font-bold">View All</button>
            </div>
            <div className="flex flex-col gap-3">
              {generatedReports.map(report => (
                <div key={report.id} className={`bg-surface-light dark:bg-surface-dark p-4 rounded-xl shadow-sm border border-border-light dark:border-border-dark flex items-center gap-4 group ${report.status === 'pending' ? 'opacity-60' : ''}`}>
                  <div className={`size-10 rounded-lg flex items-center justify-center shrink-0 ${
                    report.type === 'pdf'
                      ? 'bg-red-50 dark:bg-red-900/20'
                      : report.type === 'excel'
                      ? 'bg-green-50 dark:bg-green-900/20'
                      : 'bg-gray-100 dark:bg-gray-800'
                  }`}>
                    <span className={`material-symbols-outlined ${
                      report.type === 'pdf'
                        ? 'text-red-500'
                        : report.type === 'excel'
                        ? 'text-green-600'
                        : 'text-gray-500'
                    }`}>
                      {report.type === 'pdf' ? 'picture_as_pdf' : report.type === 'excel' ? 'table_view' : 'hourglass_top'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-text-main-light dark:text-text-main-dark text-base font-semibold truncate">{report.name}</p>
                    <p className="text-text-sub-light dark:text-text-sub-dark text-sm truncate">{report.department} • Generated {report.date}</p>
                  </div>
                  {report.status === 'pending' ? (
                    <button
                      onClick={() => handleRefreshReport(report.id)}
                      className="size-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-text-sub-light dark:text-text-sub-dark transition-colors"
                    >
                      <span className="material-symbols-outlined">refresh</span>
                    </button>
                  ) : (
                    <ReportMenu onAction={(action) => handleReportAction(report.id, action)} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </main>

        <BottomAction
          text="Generate New Report"
          icon="add_chart"
          onClick={() => setShowGenerateModal(true)}
        />

        <GenerateReportModal
          isOpen={showGenerateModal}
          onClose={() => setShowGenerateModal(false)}
          onGenerate={handleGenerateReport}
        />
      </div>
    </div>
  )
}

function ReportMenu({ onAction }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="size-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-text-sub-light dark:text-text-sub-dark transition-colors"
      >
        <span className="material-symbols-outlined">more_vert</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-surface dark:bg-surface-dark rounded-lg shadow-lg border border-border-light dark:border-border-dark z-10">
          <button
            onClick={() => {
              onAction('share')
              setIsOpen(false)
            }}
            className="w-full text-left px-4 py-2 hover:bg-hover-light dark:hover:bg-hover-dark flex items-center gap-2 text-text-main-light dark:text-text-main-dark text-sm"
          >
            <span className="material-symbols-outlined text-sm">share</span>
            Share
          </button>
          <button
            onClick={() => {
              onAction('rename')
              setIsOpen(false)
            }}
            className="w-full text-left px-4 py-2 hover:bg-hover-light dark:hover:bg-hover-dark flex items-center gap-2 text-text-main-light dark:text-text-main-dark text-sm"
          >
            <span className="material-symbols-outlined text-sm">edit</span>
            Rename
          </button>
          <button
            onClick={() => {
              onAction('delete')
              setIsOpen(false)
            }}
            className="w-full text-left px-4 py-2 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 text-red-600 dark:text-red-400 text-sm"
          >
            <span className="material-symbols-outlined text-sm">delete</span>
            Delete
          </button>
        </div>
      )}
    </div>
  )
}

