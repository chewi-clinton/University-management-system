import React from 'react'

export default function StatCard({ icon, label, value, note, className = '' }) {
  return (
    <div className={`bg-surface-light dark:bg-surface-dark p-4 rounded-xl shadow-sm border border-border-light dark:border-border-dark flex flex-col ${className}`}>
      {icon && (
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600">
            <span className="material-symbols-outlined text-lg">{icon}</span>
          </div>
          <p className="text-text-sub-light dark:text-text-sub-dark text-sm font-medium">{label}</p>
        </div>
      )}
      <p className="text-text-main-light dark:text-text-main-dark text-xl font-bold">{value}</p>
      {note && <p className="text-xs text-green-600 dark:text-green-400 font-medium mt-1">{note}</p>}
    </div>
  )
}
