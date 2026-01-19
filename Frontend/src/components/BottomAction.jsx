import React from 'react'

export default function BottomAction({ text = 'Action', icon = 'add' }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-surface-light/90 dark:bg-surface-dark/90 backdrop-blur-md border-t border-border-light dark:border-border-dark z-20">
      <button className="flex items-center justify-center w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold text-base rounded-xl gap-2 shadow-lg transition-transform active:scale-[0.98]">
        <span className="material-symbols-outlined">{icon}</span>
        {text}
      </button>
    </div>
  )
}
