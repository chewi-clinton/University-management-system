import React, { useState } from 'react'

export function GenerateReportModal({ isOpen, onClose, onGenerate }) {
  const [reportType, setReportType] = useState('summary')
  const [selectedDept, setSelectedDept] = useState('all')
  const [reportName, setReportName] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const reportTypes = [
    {
      id: 'summary',
      name: 'Financial Summary',
      description: 'Overview of income, expenses, and net balance',
      icon: 'summarize'
    },
    {
      id: 'student-debt',
      name: 'Student Debt Aging',
      description: 'Analyze overdue tuition payments by age',
      icon: 'trending_down'
    },
    {
      id: 'payroll-breakdown',
      name: 'Faculty Payroll Breakdown',
      description: 'Detailed payroll distribution by department',
      icon: 'groups'
    },
    {
      id: 'revenue-analysis',
      name: 'Revenue Analysis',
      description: 'Detailed breakdown of all revenue sources',
      icon: 'trending_up'
    }
  ]

  const departments = [
    { value: 'all', label: 'University Wide' },
    { value: 'eng', label: 'Engineering' },
    { value: 'arts', label: 'Arts & Humanities' },
    { value: 'sci', label: 'Science' },
    { value: 'admin', label: 'Administration' }
  ]

  const handleGenerate = async () => {
    try {
      setIsLoading(true)
      await onGenerate({
        type: reportType,
        department: selectedDept,
        name: reportName || `${reportTypes.find(t => t.id === reportType)?.name} - ${new Date().toLocaleDateString()}`
      })
      setIsLoading(false)
      onClose()
    } catch (err) {
      console.error('Error generating report:', err)
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-surface-light dark:bg-surface-dark rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-surface dark:bg-surface-dark border-b border-border-light dark:border-border-dark p-6 flex items-center justify-between">
          <div>
            <h2 className="text-text-main-light dark:text-text-main-dark text-2xl font-bold">Generate New Report</h2>
            <p className="text-text-sub-light dark:text-text-sub-dark text-sm mt-1">Create a detailed financial analysis document</p>
          </div>
          <button
            onClick={onClose}
            className="text-text-sub-light dark:text-text-sub-dark hover:text-text-main-light dark:hover:text-text-main-dark transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Report Type Selection */}
          <div>
            <h3 className="text-text-main-light dark:text-text-main-dark font-semibold mb-4">Select Report Type</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {reportTypes.map(type => (
                <button
                  key={type.id}
                  onClick={() => setReportType(type.id)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    reportType === type.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border-light dark:border-border-dark hover:border-primary'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className={`material-symbols-outlined text-2xl ${reportType === type.id ? 'text-primary' : 'text-text-sub-light dark:text-text-sub-dark'}`}>
                      {type.icon}
                    </span>
                    <div>
                      <p className="text-text-main-light dark:text-text-main-dark font-semibold">{type.name}</p>
                      <p className="text-text-sub-light dark:text-text-sub-dark text-xs mt-1">{type.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Department Filter */}
          <div>
            <h3 className="text-text-main-light dark:text-text-main-dark font-semibold mb-3">Department</h3>
            <div className="relative">
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-border-light dark:border-border-dark bg-surface dark:bg-surface-dark text-text-main-light dark:text-text-main-dark appearance-none pr-10 focus:outline-0 focus:ring-2 focus:ring-primary/20"
              >
                {departments.map(dept => (
                  <option key={dept.value} value={dept.value}>
                    {dept.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-text-sub-light dark:text-text-sub-dark">
                <span className="material-symbols-outlined">expand_more</span>
              </div>
            </div>
          </div>

          {/* Report Name */}
          <div>
            <h3 className="text-text-main-light dark:text-text-main-dark font-semibold mb-3">Report Name (Optional)</h3>
            <input
              type="text"
              value={reportName}
              onChange={(e) => setReportName(e.target.value)}
              placeholder={`${reportTypes.find(t => t.id === reportType)?.name} - ${new Date().toLocaleDateString()}`}
              className="w-full px-4 py-3 rounded-lg border border-border-light dark:border-border-dark bg-surface dark:bg-surface-dark text-text-main-light dark:text-text-main-dark placeholder-text-sub-light dark:placeholder-text-sub-dark focus:outline-0 focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Format Selection */}
          <div>
            <h3 className="text-text-main-light dark:text-text-main-dark font-semibold mb-3">Export Format</h3>
            <div className="flex gap-3">
              <label className="flex items-center gap-2 px-4 py-2 rounded-lg border border-primary bg-primary/5 cursor-pointer">
                <input type="radio" name="format" value="pdf" defaultChecked className="w-4 h-4" />
                <span className="text-text-main-light dark:text-text-main-dark text-sm font-medium">PDF</span>
              </label>
              <label className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border-light dark:border-border-dark hover:border-primary cursor-pointer transition-colors">
                <input type="radio" name="format" value="excel" className="w-4 h-4" />
                <span className="text-text-main-light dark:text-text-main-dark text-sm font-medium">Excel</span>
              </label>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-blue-700 dark:text-blue-300 text-sm">
              <span className="font-semibold">Tip:</span> Large reports may take a few moments to generate. You'll receive a notification when the report is ready.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-surface dark:bg-surface-dark border-t border-border-light dark:border-border-dark p-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-6 py-2 rounded-lg border border-border-light dark:border-border-dark text-text-main-light dark:text-text-main-dark hover:bg-hover-light dark:hover:bg-hover-dark transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="px-6 py-2 rounded-lg bg-primary text-white hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
          >
            {isLoading && <span className="animate-spin material-symbols-outlined text-sm">refresh</span>}
            {isLoading ? 'Generating...' : 'Generate Report'}
          </button>
        </div>
      </div>
    </div>
  )
}
