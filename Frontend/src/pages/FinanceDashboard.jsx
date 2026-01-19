import React from 'react';
import StatCard from '../components/StatCard';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';

export default function FinanceDashboard() {
  return (
    <div className="flex min-h-screen bg-background-light dark:bg-background-dark">
      <Sidebar isFinance />
      <div className="relative flex flex-col min-h-screen w-full bg-background-light dark:bg-background-dark overflow-hidden">
        <TopBar title="Finance" right={<button className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"><span className="material-symbols-outlined">filter_list</span></button>} />

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto no-scrollbar pb-24 md:pb-6">
          <div className="w-full px-4 md:px-6">
            {/* Balance Card */}
            <div className="md:mb-6">
              <div className="flex flex-col items-start justify-between gap-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-surface-light dark:bg-surface-dark p-5 shadow-sm">
                {/* ...existing content... */}
              </div>
            </div>

            {/* Search Bar */}
            <div className="pb-2">
              {/* ...existing content... */}
            </div>

            {/* Filter Chips */}
            <div className="pb-4">
              {/* ...existing content... */}
            </div>

            {/* Finance Items List */}
            <div className="space-y-3">
              {/* ...existing content... */}
            </div>
          </div>
        </div>

        {/* Bottom Navigation - Hidden on desktop */}
        <nav className="absolute bottom-0 left-0 right-0 z-30 flex md:hidden items-center justify-around bg-surface-light dark:bg-surface-dark border-t border-slate-200 dark:border-slate-800 h-[80px] pb-4">
          <div className="flex justify-around items-center h-16 pb-2">
            <button className="flex flex-col items-center gap-1 p-2 w-16 text-primary">
              <span className="material-symbols-outlined fill-current">dashboard</span>
              <span className="text-[10px] font-bold">Home</span>
            </button>
            <button className="flex flex-col items-center gap-1 p-2 w-16 text-text-sub dark:text-gray-500 hover:text-primary dark:hover:text-primary transition-colors">
              <span className="material-symbols-outlined">bar_chart</span>
              <span className="text-[10px] font-medium">Reports</span>
            </button>
            <div className="relative -top-5">
              <button className="size-14 bg-primary text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-600 transition-colors">
                <span className="material-symbols-outlined text-3xl">add</span>
              </button>
            </div>
            <button className="flex flex-col items-center gap-1 p-2 w-16 text-text-sub dark:text-gray-500 hover:text-primary dark:hover:text-primary transition-colors">
              <span className="material-symbols-outlined">receipt_long</span>
              <span className="text-[10px] font-medium">Transact</span>
            </button>
            <button className="flex flex-col items-center gap-1 p-2 w-16 text-text-sub dark:text-gray-500 hover:text-primary dark:hover:text-primary transition-colors">
              <span className="material-symbols-outlined">settings</span>
              <span className="text-[10px] font-medium">Settings</span>
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
}