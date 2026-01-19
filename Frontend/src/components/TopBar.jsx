import React from 'react'

export default function TopBar({ title, right }) {
  return (
    <header className="sticky top-0 z-10 flex items-center bg-surface-light dark:bg-surface-dark p-4 pb-2 justify-between border-b border-border-light dark:border-border-dark shadow-sm">
      <div
        className="flex size-12 shrink-0 items-center justify-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
        onClick={() => window.history.back()}
        role="button"
        tabIndex={0}
      >
        <span className="material-symbols-outlined text-text-main-light dark:text-text-main-dark" style={{ fontSize: 24 }}>
          arrow_back
        </span>
      </div>
      <h2 className="text-text-main-light dark:text-text-main-dark text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">{title}</h2>
      <div className="absolute right-4 flex items-center justify-end">{right}</div>
    </header>
  )
}
