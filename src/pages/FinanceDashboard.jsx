

import React from 'react';
import StatCard from '../components/StatCard';
import Sidebar from '../components/Sidebar';

export default function FinanceDashboard() {
  return (
    <div className="flex min-h-screen bg-background-light dark:bg-background-dark">
      <Sidebar isFinance />
      <div className="relative min-h-screen w-full mx-auto max-w-md bg-background-light dark:bg-background-dark pb-24 shadow-2xl">
      {/* Top App Bar */}
      <header className="sticky top-0 z-10 bg-surface-light dark:bg-surface-dark px-4 py-3 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div
              className="bg-center bg-no-repeat bg-cover rounded-full size-10 border-2 border-primary/20"
              data-alt="Profile picture of finance officer"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB3V988YVLFftCcUDU9vU_1MW1UBa8E5dWTU2ZOFMzszmX993zJjwSOAvtR9ajLdTTYuYwCeHKAhXueSUueHWrdSdzht_rdpmnwAPdEtYF8n1Di24DKZVclp9T--_IwYeB5OflhzEyxwYwXUxoTxat0wBaIT0LLo2DyHORR1-5mmar_Bg_tV43S7cn8TuSUacQwzlZGdKqdPeuuoNRScL3X9X3fi2aoWEdUDkitKbHZ3lS59gFnXZTUKJ0egaA7DfNqiny5GG1aBbs')",
              }}
            />
            <div className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full border-2 border-white dark:border-[#1a222b]"></div>
          </div>
          <div>
            <h1 className="text-sm font-semibold text-text-sub dark:text-gray-400 leading-tight">Good Morning,</h1>
            <h2 className="text-base font-bold text-text-main dark:text-white leading-tight">Officer James</h2>
          </div>
        </div>
        <button className="relative flex items-center justify-center size-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <span className="material-symbols-outlined text-text-main dark:text-white">notifications</span>
          <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full animate-pulse"></span>
        </button>
      </header>

      {/* Main Scrollable Content */}
      <main className="flex flex-col gap-5 pt-5">
        {/* KPI Grid */}
        <section className="px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <StatCard title="Outstanding Tuition" value="$450,200" delta="+5.2% vs last mo" icon="warning" variant="orange" />
            <StatCard title="YTD Revenue" value="$12.5M" delta="+12% YTD" icon="account_balance_wallet" variant="blue" />
            <StatCard title="Pending Approvals" value="14" delta="Needs Action" icon="pending_actions" variant="purple" />
          </div>
        </section>

        {/* Quick Actions Grid */}
        <section className="px-4">
          <h3 className="text-text-main dark:text-white text-lg font-bold mb-3">Quick Actions</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button className="flex flex-col items-center gap-2 group">
              <div className="size-14 rounded-xl bg-primary/10 dark:bg-primary/20 group-active:bg-primary/20 flex items-center justify-center transition-colors">
                <span className="material-symbols-outlined text-primary dark:text-blue-400 text-2xl">summarize</span>
              </div>
              <span className="text-xs font-medium text-text-sub dark:text-gray-400 text-center leading-tight">Reports</span>
            </button>
            <button className="flex flex-col items-center gap-2 group">
              <div className="size-14 rounded-xl bg-primary/10 dark:bg-primary/20 group-active:bg-primary/20 flex items-center justify-center transition-colors">
                <span className="material-symbols-outlined text-primary dark:text-blue-400 text-2xl">school</span>
              </div>
              <span className="text-xs font-medium text-text-sub dark:text-gray-400 text-center leading-tight">Tuition</span>
            </button>
            <button className="flex flex-col items-center gap-2 group">
              <div className="size-14 rounded-xl bg-primary/10 dark:bg-primary/20 group-active:bg-primary/20 flex items-center justify-center transition-colors">
                <span className="material-symbols-outlined text-primary dark:text-blue-400 text-2xl">approval</span>
              </div>
              <span className="text-xs font-medium text-text-sub dark:text-gray-400 text-center leading-tight">Approve PO</span>
            </button>
            <button className="flex flex-col items-center gap-2 group">
              <div className="size-14 rounded-xl bg-primary/10 dark:bg-primary/20 group-active:bg-primary/20 flex items-center justify-center transition-colors">
                <span className="material-symbols-outlined text-primary dark:text-blue-400 text-2xl">campaign</span>
              </div>
              <span className="text-xs font-medium text-text-sub dark:text-gray-400 text-center leading-tight">Marketing</span>
            </button>
          </div>
        </section>

        {/* Budget Chart Widget */}
        <section className="px-4">
          <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-5 border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-text-main dark:text-white text-lg font-bold">Budget vs Actuals</h3>
                <p className="text-text-sub dark:text-gray-400 text-sm">Q3 Budget Utilization</p>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-2xl font-bold text-text-main dark:text-white">82%</span>
                <span className="text-xs text-text-sub dark:text-gray-500">Utilized</span>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2 h-[160px] items-end">
              <div className="flex flex-col items-center gap-2 h-full justify-end group cursor-pointer">
                <div className="relative w-full flex items-end justify-center h-[80%] bg-transparent rounded-t-sm">
                  <div className="w-2 bg-gray-200 dark:bg-gray-700 h-full rounded-full absolute"></div>
                  <div className="w-2 bg-primary h-[65%] rounded-full z-10 absolute bottom-0"></div>
                </div>
                <span className="text-[11px] font-semibold text-text-sub dark:text-gray-400">MKT</span>
              </div>
              <div className="flex flex-col items-center gap-2 h-full justify-end group cursor-pointer">
                <div className="relative w-full flex items-end justify-center h-[90%] bg-transparent rounded-t-sm">
                  <div className="w-2 bg-gray-200 dark:bg-gray-700 h-full rounded-full absolute"></div>
                  <div className="w-2 bg-primary h-[85%] rounded-full z-10 absolute bottom-0"></div>
                </div>
                <span className="text-[11px] font-semibold text-text-sub dark:text-gray-400">OPS</span>
              </div>
              <div className="flex flex-col items-center gap-2 h-full justify-end group cursor-pointer">
                <div className="relative w-full flex items-end justify-center h-[70%] bg-transparent rounded-t-sm">
                  <div className="w-2 bg-gray-200 dark:bg-gray-700 h-full rounded-full absolute"></div>
                  <div className="w-2 bg-primary h-[40%] rounded-full z-10 absolute bottom-0"></div>
                </div>
                <span className="text-[11px] font-semibold text-text-sub dark:text-gray-400">IT</span>
              </div>
              <div className="flex flex-col items-center gap-2 h-full justify-end group cursor-pointer">
                <div className="relative w-full flex items-end justify-center h-[75%] bg-transparent rounded-t-sm">
                  <div className="w-2 bg-gray-200 dark:bg-gray-700 h-full rounded-full absolute"></div>
                  <div className="w-2 bg-red-500 h-[85%] rounded-full z-10 absolute bottom-0"></div>
                </div>
                <span className="text-[11px] font-semibold text-text-sub dark:text-gray-400">FAC</span>
              </div>
            </div>
          </div>
        </section>

        {/* Tuition Collection Widget */}
        <section className="px-4">
          <div className="bg-primary rounded-xl p-5 text-white shadow-lg relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold">Tuition Collection</h3>
                <span className="bg-white/20 px-2 py-1 rounded text-xs font-medium backdrop-blur-sm">Fall 2023</span>
              </div>
              <div className="flex items-end gap-2 mb-2">
                <span className="text-4xl font-bold">78%</span>
                <span className="text-blue-100 mb-1 text-sm">Collected</span>
              </div>
              <div className="w-full bg-black/20 h-2 rounded-full overflow-hidden">
                <div className="bg-white h-full rounded-full" style={{ width: '78%' }} />
              </div>
              <div className="flex justify-between mt-2 text-xs text-blue-100/80">
                <span>$8.2M Collected</span>
                <span>$2.3M Pending</span>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Payroll Activity */}
        <section className="px-4 pb-4">
          <div className="flex items-center justify-between mb-3 pt-2">
            <h3 className="text-text-main dark:text-white text-lg font-bold">Recent Payroll</h3>
            <button className="text-primary text-sm font-semibold">View All</button>
          </div>
          <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800 shadow-sm">
            <div className="p-4 flex items-center gap-3">
              <div className="size-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-gray-500 dark:text-gray-400">group</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-text-main dark:text-white">Faculty Dept</p>
                <p className="text-xs text-text-sub dark:text-gray-500">Oct 24 • Batch #9923</p>
              </div>
              <span className="text-sm font-bold text-text-main dark:text-white">$120,500</span>
            </div>
            <div className="p-4 flex items-center gap-3">
              <div className="size-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-gray-500 dark:text-gray-400">badge</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-text-main dark:text-white">Admin Staff</p>
                <p className="text-xs text-text-sub dark:text-gray-500">Oct 24 • Batch #9924</p>
              </div>
              <span className="text-sm font-bold text-text-main dark:text-white">$45,200</span>
            </div>
            <div className="p-4 flex items-center gap-3">
              <div className="size-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-gray-500 dark:text-gray-400">engineering</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-text-main dark:text-white">Operations</p>
                <p className="text-xs text-text-sub dark:text-gray-500">Oct 23 • Batch #9920</p>
              </div>
              <span className="text-sm font-bold text-text-main dark:text-white">$32,100</span>
            </div>
          </div>
        </section>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 w-full max-w-md bg-surface-light dark:bg-surface-dark border-t border-gray-200 dark:border-gray-800 pb-safe pt-2 px-2 z-50">
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