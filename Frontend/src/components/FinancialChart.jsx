import React from 'react'

export function IncomeBreakdown({ data }) {
  if (!data || Object.keys(data).length === 0) {
    return (
      <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl shadow-sm border border-border-light dark:border-border-dark">
        <h3 className="text-text-main-light dark:text-text-main-dark font-semibold mb-4">Income Breakdown</h3>
        <p className="text-text-sub-light dark:text-text-sub-dark text-sm">No income data available</p>
      </div>
    )
  }

  const entries = Object.entries(data).filter(([_, value]) => value > 0)
  const total = entries.reduce((sum, [_, value]) => sum + value, 0)

  return (
    <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl shadow-sm border border-border-light dark:border-border-dark">
      <h3 className="text-text-main-light dark:text-text-main-dark font-semibold mb-4">Income Breakdown</h3>
      <div className="space-y-3">
        {entries.map(([source, amount]) => {
          const percentage = total > 0 ? (amount / total) * 100 : 0
          return (
            <div key={source}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-text-main-light dark:text-text-main-dark text-sm font-medium capitalize">{source}</span>
                <span className="text-text-sub-light dark:text-text-sub-dark text-xs font-semibold">{percentage.toFixed(1)}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-blue-600 transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <p className="text-text-sub-light dark:text-text-sub-dark text-xs mt-1">XAF {amount.toLocaleString()}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function ExpenseBreakdown({ data }) {
  if (!data || Object.keys(data).length === 0) {
    return (
      <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl shadow-sm border border-border-light dark:border-border-dark">
        <h3 className="text-text-main-light dark:text-text-main-dark font-semibold mb-4">Expense Breakdown</h3>
        <p className="text-text-sub-light dark:text-text-sub-dark text-sm">No expense data available</p>
      </div>
    )
  }

  const entries = Object.entries(data).filter(([_, value]) => value > 0)
  const total = entries.reduce((sum, [_, value]) => sum + value, 0)

  return (
    <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl shadow-sm border border-border-light dark:border-border-dark">
      <h3 className="text-text-main-light dark:text-text-main-dark font-semibold mb-4">Expense Breakdown</h3>
      <div className="space-y-3">
        {entries.map(([source, amount]) => {
          const percentage = total > 0 ? (amount / total) * 100 : 0
          return (
            <div key={source}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-text-main-light dark:text-text-main-dark text-sm font-medium capitalize">{source}</span>
                <span className="text-text-sub-light dark:text-text-sub-dark text-xs font-semibold">{percentage.toFixed(1)}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-red-500 to-orange-600 transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <p className="text-text-sub-light dark:text-text-sub-dark text-xs mt-1">XAF {amount.toLocaleString()}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function FinancialSummaryGrid({ metrics }) {
  const items = [
    {
      label: 'Total Income',
      value: metrics.income,
      icon: 'trending_up',
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      label: 'Total Expenses',
      value: metrics.expenses,
      icon: 'trending_down',
      color: 'text-red-600',
      bgColor: 'bg-red-50 dark:bg-red-900/20'
    },
    {
      label: 'Net Balance',
      value: metrics.netBalance,
      icon: 'account_balance_wallet',
      color: metrics.netBalance >= 0 ? 'text-blue-600' : 'text-orange-600',
      bgColor: metrics.netBalance >= 0 ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-orange-50 dark:bg-orange-900/20'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {items.map((item, idx) => (
        <div
          key={idx}
          className="bg-surface-light dark:bg-surface-dark p-4 rounded-xl shadow-sm border border-border-light dark:border-border-dark"
        >
          <div className="flex items-start gap-3">
            <div className={`${item.bgColor} p-3 rounded-lg`}>
              <span className={`material-symbols-outlined ${item.color}`}>{item.icon}</span>
            </div>
            <div className="flex-1">
              <p className="text-text-sub-light dark:text-text-sub-dark text-xs font-medium uppercase tracking-wider mb-1">
                {item.label}
              </p>
              <p className="text-text-main-light dark:text-text-main-dark text-2xl font-bold">
                XAF {item.value.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
