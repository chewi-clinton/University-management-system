import React from 'react'
import TopBar from '../components/TopBar'

export default function PaymentHistory() {
  return (
    <div className="relative flex flex-col min-h-screen w-full max-w-md mx-auto bg-background-light dark:bg-background-dark overflow-hidden shadow-xl ring-1 ring-slate-900/5">
      <TopBar title="Payment History" right={<button className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"><span className="material-symbols-outlined">filter_list</span></button>} />

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
        {/* Balance Card (ActionPanel) */}
        <div className="p-4">
          <div className="flex flex-col items-start justify-between gap-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-surface-light dark:bg-surface-dark p-5 shadow-sm">
            <div className="flex w-full justify-between items-start">
              <div className="flex flex-col gap-1">
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wide">Total Outstanding</p>
                <p className="text-slate-900 dark:text-white text-3xl font-bold leading-tight tracking-tight">$1,250.00</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">account_balance</span>
              </div>
            </div>
            <div className="w-full pt-2">
              <button className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 bg-primary hover:bg-blue-600 transition-colors text-white text-base font-bold leading-normal shadow-md shadow-blue-500/20">
                <span className="truncate">Pay Now</span>
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-4 pb-2">
          <div className="flex w-full items-center rounded-lg h-12 bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-700 overflow-hidden focus-within:ring-2 focus-within:ring-primary/50 transition-all">
            <div className="text-slate-400 dark:text-slate-500 flex items-center justify-center pl-4">
              <span className="material-symbols-outlined">search</span>
            </div>
            <input className="w-full h-full bg-transparent border-none focus:ring-0 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 px-3 text-base font-normal" placeholder="Search invoice # or description" defaultValue="" />
          </div>
        </div>

        {/* Chips (Filters) */}
        <div className="flex gap-3 px-4 py-2 overflow-x-auto no-scrollbar">
          <button className="flex h-9 shrink-0 items-center justify-center px-4 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-medium transition-transform active:scale-95">All</button>
          <button className="flex h-9 shrink-0 items-center justify-center px-4 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm font-medium transition-transform active:scale-95">Tuition</button>
          <button className="flex h-9 shrink-0 items-center justify-center px-4 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm font-medium transition-transform active:scale-95">Housing</button>
          <button className="flex h-9 shrink-0 items-center justify-center px-4 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm font-medium transition-transform active:scale-95">Library</button>
        </div>

        {/* Recent Activity Title */}
        <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] px-4 pt-6 pb-3">Recent Activity</h2>

        {/* Transactions List */}
        <div className="px-4 flex flex-col gap-3">
          {/* Item 1: Overdue */}
          <div className="group flex flex-col gap-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-surface-light dark:bg-surface-dark p-4 shadow-sm hover:border-primary/30 transition-colors cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400">
                  <span className="material-symbols-outlined text-[20px]">school</span>
                </div>
                <div>
                  <p className="text-slate-900 dark:text-white text-sm font-bold">Fall Semester Tuition</p>
                  <p className="text-slate-500 dark:text-slate-400 text-xs">#INV-2023-001 • Oct 24, 2023</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-slate-900 dark:text-white text-sm font-bold">$1,250.00</p>
                <span className="inline-flex items-center rounded-md bg-red-50 dark:bg-red-900/30 px-2 py-1 text-xs font-medium text-red-700 dark:text-red-400 ring-1 ring-inset ring-red-600/10">Overdue</span>
              </div>
            </div>
          </div>

          {/* Item 2: Paid */}
          <div className="group flex flex-col gap-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-surface-light dark:bg-surface-dark p-4 shadow-sm hover:border-primary/30 transition-colors cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                  <span className="material-symbols-outlined text-[20px]">apartment</span>
                </div>
                <div>
                  <p className="text-slate-900 dark:text-white text-sm font-bold">Dormitory Housing Fee</p>
                  <p className="text-slate-500 dark:text-slate-400 text-xs">#INV-2023-002 • Sep 01, 2023</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-slate-900 dark:text-white text-sm font-bold">$3,200.00</p>
                <span className="inline-flex items-center rounded-md bg-green-50 dark:bg-green-900/30 px-2 py-1 text-xs font-medium text-green-700 dark:text-green-400 ring-1 ring-inset ring-green-600/20">Paid</span>
              </div>
            </div>
          </div>

          {/* Item 3: Paid */}
          <div className="group flex flex-col gap-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-surface-light dark:bg-surface-dark p-4 shadow-sm hover:border-primary/30 transition-colors cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                  <span className="material-symbols-outlined text-[20px]">menu_book</span>
                </div>
                <div>
                  <p className="text-slate-900 dark:text-white text-sm font-bold">Library Fine</p>
                  <p className="text-slate-500 dark:text-slate-400 text-xs">#INV-2023-005 • Aug 15, 2023</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-slate-900 dark:text-white text-sm font-bold">$15.00</p>
                <span className="inline-flex items-center rounded-md bg-green-50 dark:bg-green-900/30 px-2 py-1 text-xs font-medium text-green-700 dark:text-green-400 ring-1 ring-inset ring-green-600/20">Paid</span>
              </div>
            </div>
          </div>

          {/* Item 4: Pending */}
          <div className="group flex flex-col gap-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-surface-light dark:bg-surface-dark p-4 shadow-sm hover:border-primary/30 transition-colors cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                  <span className="material-symbols-outlined text-[20px]">print</span>
                </div>
                <div>
                  <p className="text-slate-900 dark:text-white text-sm font-bold">Lab Material Fee</p>
                  <p className="text-slate-500 dark:text-slate-400 text-xs">#INV-2023-008 • Nov 01, 2023</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-slate-900 dark:text-white text-sm font-bold">$45.00</p>
                <span className="inline-flex items-center rounded-md bg-yellow-50 dark:bg-yellow-900/30 px-2 py-1 text-xs font-medium text-yellow-800 dark:text-yellow-500 ring-1 ring-inset ring-yellow-600/20">Pending</span>
              </div>
            </div>
          </div>

          {/* Item 5: Paid */}
          <div className="group flex flex-col gap-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-surface-light dark:bg-surface-dark p-4 shadow-sm hover:border-primary/30 transition-colors cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                  <span className="material-symbols-outlined text-[20px]">fitness_center</span>
                </div>
                <div>
                  <p className="text-slate-900 dark:text-white text-sm font-bold">Gym Membership</p>
                  <p className="text-slate-500 dark:text-slate-400 text-xs">#INV-2023-010 • Jul 20, 2023</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-slate-900 dark:text-white text-sm font-bold">$120.00</p>
                <span className="inline-flex items-center rounded-md bg-green-50 dark:bg-green-900/30 px-2 py-1 text-xs font-medium text-green-700 dark:text-green-400 ring-1 ring-inset ring-green-600/20">Paid</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom spacing */}
        <div className="h-6" />
      </div>

      {/* Bottom Navigation */}
      <nav className="absolute bottom-0 left-0 right-0 z-30 flex items-center justify-around bg-surface-light dark:bg-surface-dark border-t border-slate-200 dark:border-slate-800 h-[80px] pb-4">
        <button className="flex flex-col items-center justify-center gap-1 w-16 text-slate-400 dark:text-slate-500">
          <span className="material-symbols-outlined">grid_view</span>
          <span className="text-[10px] font-medium">Home</span>
        </button>
        <button className="flex flex-col items-center justify-center gap-1 w-16 text-slate-400 dark:text-slate-500">
          <span className="material-symbols-outlined">school</span>
          <span className="text-[10px] font-medium">Academics</span>
        </button>
        <button className="flex flex-col items-center justify-center gap-1 w-16 text-primary">
          <span className="material-symbols-outlined fill-current">payments</span>
          <span className="text-[10px] font-medium">Finance</span>
        </button>
        <button className="flex flex-col items-center justify-center gap-1 w-16 text-slate-400 dark:text-slate-500">
          <span className="material-symbols-outlined">person</span>
          <span className="text-[10px] font-medium">Profile</span>
        </button>
      </nav>
    </div>
  );
}

