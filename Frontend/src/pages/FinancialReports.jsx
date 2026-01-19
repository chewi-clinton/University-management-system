import React from 'react'
import TopBar from '../components/TopBar'
import StatCard from '../components/StatCard'
import BottomAction from '../components/BottomAction'

export default function FinancialReports(){
  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-primary dark:text-white overflow-x-hidden transition-colors duration-200">
      <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root">
        <TopBar
          title="Financial Reports"
          right={
            <button className="flex items-center gap-1 text-primary font-bold text-base leading-normal hover:opacity-80">
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
            <button className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-primary pl-4 pr-4 transition-colors">
              <p className="text-white text-sm font-medium leading-normal">All</p>
            </button>
            <button className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-surface-light dark:bg-surface-dark pl-4 pr-4 transition-colors hover:bg-hover-light dark:hover:bg-hover-dark">
              <p className="text-primary dark:text-text-main-dark text-sm font-medium leading-normal">Income</p>
            </button>
            <button className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-surface-light dark:bg-surface-dark pl-4 pr-4 transition-colors hover:bg-hover-light dark:hover:bg-hover-dark">
              <p className="text-text-main-light dark:text-text-main-dark text-sm font-medium leading-normal">Expenses</p>
            </button>
            <button className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-surface-light dark:bg-surface-dark pl-4 pr-4 transition-colors hover:bg-hover-light dark:hover:bg-hover-dark">
              <p className="text-text-main-light dark:text-text-main-dark text-sm font-medium leading-normal">Payroll</p>
            </button>
          </div>

          {/* Date Range Inputs */}
          <div className="flex flex-wrap items-end gap-4 px-4 pb-3">
            <label className="flex flex-col min-w-0 flex-1">
                <p className="text-primary dark:text-text-sub-dark text-sm font-medium leading-normal pb-1.5">Start Date</p>
              <div className="relative">
                <input className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-primary dark:text-text-main-dark focus:outline-0 focus:ring-2 focus:ring-primary/20 border border-muted dark:border-border-dark bg-surface dark:bg-surface-dark h-12 p-[15px] text-base font-normal leading-normal appearance-none" type="date" defaultValue="2023-10-01" />
              </div>
            </label>
            <label className="flex flex-col min-w-0 flex-1">
                <p className="text-primary dark:text-text-sub-dark text-sm font-medium leading-normal pb-1.5">End Date</p>
              <div className="relative">
                <input className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-primary dark:text-text-main-dark focus:outline-0 focus:ring-2 focus:ring-primary/20 border border-muted dark:border-border-dark bg-surface dark:bg-surface-dark h-12 p-[15px] text-base font-normal leading-normal appearance-none" type="date" defaultValue="2023-10-31" />
              </div>
            </label>
          </div>

          {/* Department Select */}
          <div className="px-4">
            <label className="flex flex-col w-full">
              <p className="text-primary dark:text-text-sub-dark text-sm font-medium leading-normal pb-1.5">Department</p>
              <div className="relative">
                <select defaultValue="all" className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-primary dark:text-text-main-dark focus:outline-0 focus:ring-2 focus:ring-primary/20 border border-muted dark:border-border-dark bg-surface dark:bg-surface-dark h-12 px-[15px] text-base font-normal leading-normal appearance-none pr-10">
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
        <main className="flex-1 flex flex-col gap-6 px-4 pb-24">
          {/* Summary Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-1 md:col-span-3 bg-primary rounded-xl p-5 shadow-lg text-white relative overflow-hidden">
              <div className="absolute right-[-20px] top-[-20px] opacity-10">
                <span className="material-symbols-outlined" style={{fontSize: 140}}>account_balance_wallet</span>
              </div>
              <p className="text-white/80 text-sm font-medium mb-1">Net Balance</p>
              <h2 className="text-3xl font-bold mb-2">XAF 1,250,000.00</h2>
              <div className="flex items-center gap-1 bg-white/20 w-fit px-2 py-1 rounded-md text-xs font-semibold backdrop-blur-sm">
                <span className="material-symbols-outlined text-sm">trending_up</span>
                <span>+12.5% vs last month</span>
              </div>
            </div>

            <StatCard icon="arrow_downward" label="Total Income" value="XAF 3,450,200" note="+8% Tuition Fees" />

            <StatCard icon="arrow_upward" label="Total Expenses" value="XAF 2,200,200" note="+2% Payroll Increase" />
          </div>

          {/* Recent Reports List */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-text-main-light dark:text-text-main-dark text-lg font-bold">Generated Reports</h3>
              <button className="text-primary text-sm font-bold">View All</button>
            </div>
            <div className="flex flex-col gap-3">
              {/* Report Item 1 */}
              <div className="bg-surface-light dark:bg-surface-dark p-4 rounded-xl shadow-sm border border-border-light dark:border-border-dark flex items-center gap-4 group">
                <div className="size-10 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-red-500">picture_as_pdf</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-text-main-light dark:text-text-main-dark text-base font-semibold truncate">Payroll Summary - Oct 2023</p>
                  <p className="text-text-sub-light dark:text-text-sub-dark text-sm truncate">Engineering Dept • Generated Oct 31</p>
                </div>
                <button className="size-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-text-sub-light dark:text-text-sub-dark transition-colors">
                  <span className="material-symbols-outlined">more_vert</span>
                </button>
              </div>

              {/* Report Item 2 */}
              <div className="bg-surface-light dark:bg-surface-dark p-4 rounded-xl shadow-sm border border-border-light dark:border-border-dark flex items-center gap-4 group">
                <div className="size-10 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-green-600">table_view</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-text-main-light dark:text-text-main-dark text-base font-semibold truncate">Tuition Collection Q3</p>
                  <p className="text-text-sub-light dark:text-text-sub-dark text-sm truncate">University Wide • Generated Oct 28</p>
                </div>
                <button className="size-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-text-sub-light dark:text-text-sub-dark transition-colors">
                  <span className="material-symbols-outlined">more_vert</span>
                </button>
              </div>

              {/* Report Item 3 */}
              <div className="bg-surface-light dark:bg-surface-dark p-4 rounded-xl shadow-sm border border-border-light dark:border-border-dark flex items-center gap-4 group">
                <div className="size-10 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-red-500">picture_as_pdf</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-text-main-light dark:text-text-main-dark text-base font-semibold truncate">Bus Fees &amp; Maintenance</p>
                  <p className="text-text-sub-light dark:text-text-sub-dark text-sm truncate">Transport Dept • Generated Oct 25</p>
                </div>
                <button className="size-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-text-sub-light dark:text-text-sub-dark transition-colors">
                  <span className="material-symbols-outlined">more_vert</span>
                </button>
              </div>

              {/* Report Item 4 */}
              <div className="bg-surface-light dark:bg-surface-dark p-4 rounded-xl shadow-sm border border-border-light dark:border-border-dark flex items-center gap-4 group opacity-60">
                <div className="size-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-gray-500">hourglass_top</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-text-main-light dark:text-text-main-dark text-base font-semibold truncate">Facilities Audit</p>
                  <p className="text-text-sub-light dark:text-text-sub-dark text-sm truncate">Admin • Pending...</p>
                </div>
                <button className="size-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-text-sub-light dark:text-text-sub-dark transition-colors">
                  <span className="material-symbols-outlined">refresh</span>
                </button>
              </div>
            </div>
          </div>
        </main>

        <BottomAction text="Generate New Report" icon="add_chart" />
      </div>
    </div>
  )
}

