import React from 'react'
import StatCard from '../components/StatCard'

export default function Dashboard(){
  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-[#111418] dark:text-white overflow-x-hidden min-h-screen pb-20">
      {/* Top App Bar */}
      <div className="sticky top-0 z-50 bg-white dark:bg-[#1a2632] shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <button className="text-[#111418] dark:text-white flex items-center justify-center rounded-full p-2 hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
            <span className="material-symbols-outlined text-2xl">menu</span>
          </button>
          <h1 className="text-lg font-bold tracking-tight text-[#111418] dark:text-white">Dashboard</h1>
          <div className="flex items-center gap-3">
            <button className="relative text-[#111418] dark:text-white p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
              <span className="material-symbols-outlined text-2xl">notifications</span>
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 border border-white dark:border-[#1a2632]"></span>
            </button>
            <div className="h-9 w-9 overflow-hidden rounded-full bg-gray-200 border border-gray-100 dark:border-gray-700">
              <img alt="Profile Avatar" className="h-full w-full object-cover" data-alt="User profile picture" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCI2xi31WeX4K8M1Ih3onZqczy-Gr6TRLqEgCeOnHFK55HozF-JI-L1VFajwHVw313oOrcOkIv8c_NMViGMQ9EROpqWdFZPlkRoZ73U4yoQMgrmaGMbHQAKycrotRjT0ELtnQUX3yVZDCP9Rm0WWs1qoFY6OTVGG5fOaVAHdj2IjzNOqwUsfM5gGPjQvB0O61d86xA4UexQSntggEo1jLj88hpV2NEUueM-wchS7rgDvS6fQg3DqIRU7KPLEu2eYIoC9YgMQjpd4_Q"/>
            </div>
          </div>
        </div>
      </div>

      {/* Greeting Section */}
      <div className="px-4 pt-6 pb-2">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Oct 24, 2023</p>
        <h2 className="text-2xl font-bold tracking-tight text-[#111418] dark:text-white mt-1">Good Morning, Sarah</h2>
        <div className="mt-4 flex items-center justify-between rounded-xl bg-primary p-4 text-white shadow-lg shadow-blue-500/20">
          <div>
            <p className="text-sm font-medium text-blue-100">Current Term</p>
            <p className="text-lg font-bold mt-0.5">Fall 2023</p>
          </div>
          <div className="h-10 w-10 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
            <span className="material-symbols-outlined">school</span>
          </div>
        </div>
      </div>

      {/* Quick Stats Carousel */}
        <div className="mt-6 pl-4">
        <h3 className="mb-3 text-base font-bold text-[#111418] dark:text-white">Overview</h3>
        <div className="flex gap-4 overflow-x-auto pb-4 pr-4 scrollbar-hide">
          <StatCard icon="attach_money" label="Total Tuition" value="$4.2M" note="+12% vs last sem" className="min-w-[160px]" />
          <StatCard icon="pending_actions" label="Pending Inv." value="124" note="Action needed" className="min-w-[160px]" />
          <StatCard icon="campaign" label="Marketing ROI" value="18%" note="+2% this month" className="min-w-[160px]" />
        </div>
      </div>

      {/* Financial Chart Section */}
      <div className="px-4 mt-2">
        <div className="rounded-xl bg-white dark:bg-[#1a2632] p-5 shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-[#111418] dark:text-white">Revenue vs Expenses</h3>
            <button className="text-xs font-medium text-primary hover:text-primary/80">View Report</button>
          </div>
          <div className="flex items-end justify-between h-32 gap-2 mt-2">
            <div className="w-full flex gap-1 items-end h-full">
              <div className="w-1/2 bg-primary/20 rounded-t-sm h-[40%] relative group"></div>
              <div className="w-1/2 bg-primary rounded-t-sm h-[60%] relative group"></div>
            </div>
            <div className="w-full flex gap-1 items-end h-full">
              <div className="w-1/2 bg-primary/20 rounded-t-sm h-[50%] relative group"></div>
              <div className="w-1/2 bg-primary rounded-t-sm h-[75%] relative group"></div>
            </div>
            <div className="w-full flex gap-1 items-end h-full">
              <div className="w-1/2 bg-primary/20 rounded-t-sm h-[45%] relative group"></div>
              <div className="w-1/2 bg-primary rounded-t-sm h-[55%] relative group"></div>
            </div>
            <div className="w-full flex gap-1 items-end h-full">
              <div className="w-1/2 bg-primary/20 rounded-t-sm h-[60%] relative group"></div>
              <div className="w-1/2 bg-primary rounded-t-sm h-[85%] relative group"></div>
            </div>
            <div className="w-full flex gap-1 items-end h-full">
              <div className="w-1/2 bg-primary/20 rounded-t-sm h-[55%] relative group"></div>
              <div className="w-1/2 bg-primary rounded-t-sm h-[90%] relative group"></div>
            </div>
            <div className="w-full flex gap-1 items-end h-full">
              <div className="w-1/2 bg-primary/20 rounded-t-sm h-[65%] relative group"></div>
              <div className="w-1/2 bg-primary rounded-t-sm h-[70%] relative group"></div>
            </div>
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-400 font-medium">
            <span>May</span>
            <span>Jun</span>
            <span>Jul</span>
            <span>Aug</span>
            <span>Sep</span>
            <span>Oct</span>
          </div>
        </div>
      </div>

      {/* Recent Invoices List */}
      <div className="px-4 mt-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-bold text-[#111418] dark:text-white">Recent Invoices</h3>
          <button className="text-sm font-medium text-primary hover:text-primary/80">See All</button>
        </div>
        <div className="flex flex-col gap-3">
          {/* Item 1 */}
          <div className="flex items-center justify-between rounded-xl bg-white dark:bg-[#1a2632] p-4 shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300">
                <span className="material-symbols-outlined text-xl">description</span>
              </div>
              <div>
                <p className="text-sm font-bold text-[#111418] dark:text-white">Liam Thompson</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">ID: #INV-2094 • Engineering</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-[#111418] dark:text-white">$12,450</p>
              <span className="inline-flex items-center rounded-full bg-green-50 dark:bg-green-900/20 px-2 py-0.5 text-xs font-medium text-green-700 dark:text-green-400 ring-1 ring-inset ring-green-600/20">Paid</span>
            </div>
          </div>
          {/* Item 2 */}
          <div className="flex items-center justify-between rounded-xl bg-white dark:bg-[#1a2632] p-4 shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300">
                <span className="material-symbols-outlined text-xl">description</span>
              </div>
              <div>
                <p className="text-sm font-bold text-[#111418] dark:text-white">Olivia Martinez</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">ID: #INV-2095 • Arts</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-[#111418] dark:text-white">$8,200</p>
              <span className="inline-flex items-center rounded-full bg-yellow-50 dark:bg-yellow-900/20 px-2 py-0.5 text-xs font-medium text-yellow-700 dark:text-yellow-400 ring-1 ring-inset ring-yellow-600/20">Pending</span>
            </div>
          </div>
          {/* Item 3 */}
          <div className="flex items-center justify-between rounded-xl bg-white dark:bg-[#1a2632] p-4 shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300">
                <span className="material-symbols-outlined text-xl">description</span>
              </div>
              <div>
                <p className="text-sm font-bold text-[#111418] dark:text-white">Noah Williams</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">ID: #INV-2096 • Business</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-[#111418] dark:text-white">$14,100</p>
              <span className="inline-flex items-center rounded-full bg-red-50 dark:bg-red-900/20 px-2 py-0.5 text-xs font-medium text-red-700 dark:text-red-400 ring-1 ring-inset ring-red-600/10">Overdue</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payroll & Marketing Grid */}
      <div className="px-4 mt-6 mb-24 grid grid-cols-1 gap-4">
        <div className="rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 p-5 shadow-lg text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <span className="material-symbols-outlined text-6xl">payments</span>
          </div>
          <div className="relative z-10">
            <p className="text-sm font-medium text-gray-300 mb-1">Upcoming Payroll</p>
            <h3 className="text-2xl font-bold mb-4">$845,000</h3>
            <div className="flex items-center justify-between border-t border-gray-700 pt-3 mt-2">
              <div className="flex flex-col">
                <span className="text-xs text-gray-400">Date</span>
                <span className="text-sm font-bold">Oct 30, 2023</span>
              </div>
              <button className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold py-1.5 px-3 rounded-lg transition-colors">Details</button>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-white dark:bg-[#1a2632] p-5 shadow-sm border border-gray-100 dark:border-gray-800">
          <h3 className="text-base font-bold text-[#111418] dark:text-white mb-4">Admissions Funnel</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-medium mb-1.5">
                <span className="text-gray-600 dark:text-gray-300">Inquiries</span>
                <span className="text-[#111418] dark:text-white">2,450</span>
              </div>
              <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 w-[100%] rounded-full"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-medium mb-1.5">
                <span className="text-gray-600 dark:text-gray-300">Applications</span>
                <span className="text-[#111418] dark:text-white">1,120</span>
              </div>
              <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 w-[65%] rounded-full"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-medium mb-1.5">
                <span className="text-gray-600 dark:text-gray-300">Enrolled</span>
                <span className="text-[#111418] dark:text-white">458</span>
              </div>
              <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 w-[25%] rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <button className="fixed bottom-24 right-4 h-14 w-14 rounded-full bg-primary text-white shadow-lg shadow-blue-500/40 flex items-center justify-center z-40 hover:scale-105 transition-transform active:scale-95">
        <span className="material-symbols-outlined text-2xl">add</span>
      </button>

      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#1a2632] border-t border-gray-200 dark:border-gray-800 px-6 py-3 pb-6 flex items-center justify-between z-50">
        <a className="flex flex-col items-center gap-1 text-primary" href="#">
          <span className="material-symbols-outlined text-2xl">dashboard</span>
          <span className="text-[10px] font-medium">Home</span>
        </a>
        <a className="flex flex-col items-center gap-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" href="#">
          <span className="material-symbols-outlined text-2xl">account_balance_wallet</span>
          <span className="text-[10px] font-medium">Finance</span>
        </a>
        <a className="flex flex-col items-center gap-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" href="#">
          <span className="material-symbols-outlined text-2xl">campaign</span>
          <span className="text-[10px] font-medium">Marketing</span>
        </a>
        <a className="flex flex-col items-center gap-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" href="#">
          <span className="material-symbols-outlined text-2xl">settings</span>
          <span className="text-[10px] font-medium">Settings</span>
        </a>
      </div>
    </div>
  )
}
