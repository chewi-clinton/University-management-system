import React from 'react'
import { getCurrentUser } from '../services/authService'


export default function LeaveManagement() {
  return (
    <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden pb-20 bg-background-light dark:bg-background-dark font-display text-primary dark:text-white transition-colors duration-200">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-20 flex items-center bg-surface/95 dark:bg-surface-dark/95 backdrop-blur-sm p-4 pb-2 justify-between border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <button className="text-primary dark:text-white flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>
        <h2 className="text-primary dark:text-white text-lg font-bold leading-tight tracking-tight absolute left-1/2 -translate-x-1/2">Leave Management</h2>
        <div className="flex items-center justify-end">
          <button className="relative flex size-10 cursor-pointer items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-primary dark:text-white transition-colors">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 border border-white dark:border-surface-dark" />
          </button>
        </div>
      </div>

      {/* Dashboard Header */}
      <div className="px-4 pt-6 pb-2">
        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wide">{new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'short' })}</p>
        <h2 className="text-primary dark:text-white text-[28px] font-bold leading-tight mt-1">{(function(){try{const u = getCurrentUser(); const h = new Date().getHours(); const part = h<12 ? 'Good morning' : (h<18 ? 'Good afternoon' : 'Good evening'); return u?.name ? `${part}, ${u.name}` : part }catch(e){return 'Hello'}})()}</h2>
      </div>

      {/* Personal Balance Cards (Horizontal Scroll) */}
      <div className="flex gap-4 overflow-x-auto px-4 py-4 no-scrollbar pb-6">
        <div className="flex min-w-[160px] flex-col gap-3 rounded-2xl p-5 bg-surface dark:bg-surface-dark shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-gray-100 dark:border-gray-800">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/30 text-primary">
            <span className="material-symbols-outlined">calendar_month</span>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-normal">Annual Balance</p>
            <p className="text-gray-900 dark:text-white tracking-tight text-2xl font-bold leading-tight mt-1">12 <span className="text-sm font-normal text-gray-400">Days</span></p>
          </div>
        </div>
        <div className="flex min-w-[160px] flex-col gap-3 rounded-2xl p-5 bg-surface dark:bg-surface-dark shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-gray-100 dark:border-gray-800">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-50 dark:bg-orange-900/30 text-orange-500">
            <span className="material-symbols-outlined">sick</span>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-normal">Sick Balance</p>
            <p className="text-gray-900 dark:text-white tracking-tight text-2xl font-bold leading-tight mt-1">5 <span className="text-sm font-normal text-gray-400">Days</span></p>
          </div>
        </div>
        <div className="flex min-w-[160px] flex-col gap-3 rounded-2xl p-5 bg-surface dark:bg-surface-dark shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-gray-100 dark:border-gray-800">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-500">
            <span className="material-symbols-outlined">school</span>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-normal">Study Balance</p>
            <p className="text-gray-900 dark:text-white tracking-tight text-2xl font-bold leading-tight mt-1">15 <span className="text-sm font-normal text-gray-400">Days</span></p>
          </div>
        </div>
      </div>

      {/* View Toggle (Segmented Control) */}
      <div className="px-4 pb-2 sticky top-[73px] z-10 bg-background-light dark:bg-background-dark py-2">
        <div className="flex h-12 w-full items-center justify-center rounded-xl bg-gray-200 dark:bg-gray-800 p-1">
          <label className="flex cursor-pointer h-full flex-1 items-center justify-center overflow-hidden rounded-lg px-2 text-gray-500 dark:text-gray-400 text-sm font-bold leading-normal transition-all duration-200">
            <span className="truncate">My Leave</span>
            <input className="invisible w-0 h-0 absolute" name="view-toggle" type="radio" value="My Leave" />
          </label>
          <label className="flex cursor-pointer h-full flex-1 items-center justify-center overflow-hidden rounded-lg px-2 bg-surface dark:bg-surface-dark shadow-sm text-primary dark:text-white text-sm font-bold leading-normal transition-all duration-200">
            <span className="truncate">Team Requests</span>
            <input defaultChecked className="invisible w-0 h-0 absolute" name="view-toggle" type="radio" value="Team Requests" />
          </label>
        </div>
      </div>

      {/* Manager View Content */}
      <div className="flex flex-col px-4 gap-4 mt-2">
        <div className="flex items-center justify-between">
          <h3 className="text-gray-900 dark:text-white text-lg font-bold leading-tight tracking-tight">Pending Approvals <span className="text-primary text-base font-medium ml-1">(4)</span></h3>
          <button className="text-primary text-sm font-bold">See All</button>
        </div>

        {/* Approval Card 1: Warning Context */}
        <div className="flex flex-col bg-surface dark:bg-surface-dark rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <img alt="Portrait of John Doe" className="w-12 h-12 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDdEacdLsufHfjPbWFMzl-HdbB2BeIU5Do1Bi7P9uE0IAUq07IhN_NWljnemEXGI9ZHjksxRRVC1KparXGm1qjbKk_SRyfihrBmz6E4gcstOFRCLx1eut4VQ1olU4gaHHYIcYbyn8bhsCCuWNQQo5oCIN-sgO-EzzXq1rCrAjJGWZC6_aUPsdP4D5OLn8UNoVY8p-MLubOpf-tWYIh_EgrK_RI-arDfpnMhsRdFbhAQiS3n-IikyFRDoDU4EgwexRNle0SVx0ppOwE" />
              <div>
                <h4 className="text-base font-bold text-primary dark:text-white">John Doe</h4>
                <p className="text-xs text-muted dark:text-gray-400">Finance Dept • Senior Analyst</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-md bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-xs font-bold">Annual</span>
          </div>
          <div className="mb-4 pl-[60px]">
            <div className="flex items-center gap-2 mb-1 text-gray-900 dark:text-white font-medium">
              <span className="material-symbols-outlined text-gray-400 text-lg">calendar_today</span>
              <span>Oct 20 - Oct 23</span>
              <span className="text-gray-400 text-sm font-normal">(3 Days)</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 italic">"Taking a short break to attend my brother's wedding out of state."</p>
            <div className="mt-3 flex items-start gap-2 p-2 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-100 dark:border-red-900/20">
              <span className="material-symbols-outlined text-red-500 text-lg shrink-0">warning</span>
              <p className="text-xs text-red-600 dark:text-red-400 font-medium leading-snug">Warning: This request overlaps with the Fiscal Budget Review week.</p>
            </div>
          </div>
            <div className="flex gap-3 pt-2 border-t border-gray-100 dark:border-gray-800">
            <button className="flex-1 h-10 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 text-primary dark:text-white text-sm font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">Deny</button>
            <button className="flex-1 h-10 flex items-center justify-center rounded-lg bg-primary text-white text-sm font-bold shadow-md shadow-primary/20 hover:bg-blue-600 transition-colors">Approve</button>
          </div>
        </div>

        {/* Approval Card 2: Sick Leave */}
        <div className="flex flex-col bg-surface dark:bg-surface-dark rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <img alt="Portrait of Emily Chen" className="w-12 h-12 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBXdDim0G9iQ8Q9LsTfdYwOVD5eeKXQ-8flyh6n1wnFdCqqgbqidNDjz-gcNA0RCuidKhIXm0P9MERWFn1zR6uNQl9Trc1ut2433AEGL5Kk0x3raDMIyvckGGnH3SQB2JIHKi8QKlV4l06rnoV8TN7pfapoKTNFbNRunGCnOgBuVkaavtLx9E4P2KH4Upc7l8B8m8wfFSYiRfQGnJyEPimroDFduyx34RiZ_RCAIc33RTDV3VMfCRVpaOYQfj3ilsvl5dQzchWDEKw" />
              <div>
                <h4 className="text-base font-bold text-primary dark:text-white">Emily Chen</h4>
                <p className="text-xs text-muted dark:text-gray-400">Marketing • Brand Manager</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-md bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs font-bold">Sick</span>
          </div>
          <div className="mb-4 pl-[60px]">
            <div className="flex items-center gap-2 mb-1 text-gray-900 dark:text-white font-medium">
              <span className="material-symbols-outlined text-gray-400 text-lg">calendar_today</span>
              <span>Today, Oct 24</span>
              <span className="text-gray-400 text-sm font-normal">(1 Day)</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 italic">"Not feeling well, severe migraine. Will be unavailable on Slack."</p>
            <div className="mt-2 flex items-center gap-1">
              <span className="material-symbols-outlined text-gray-400 text-sm">attachment</span>
              <span className="text-xs text-primary font-medium underline cursor-pointer">medical_cert.pdf</span>
            </div>
          </div>
          <div className="flex gap-3 pt-2 border-t border-gray-100 dark:border-gray-800">
            <button className="flex-1 h-10 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 text-primary dark:text-white text-sm font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">Deny</button>
            <button className="flex-1 h-10 flex items-center justify-center rounded-lg bg-primary text-white text-sm font-bold shadow-md shadow-primary/20 hover:bg-blue-600 transition-colors">Approve</button>
          </div>
        </div>

        {/* Approval Card 3: Standard */}
        <div className="flex flex-col bg-surface dark:bg-surface-dark rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 opacity-60">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold text-lg">MK</div>
              <div>
                <h4 className="text-base font-bold text-primary dark:text-white">Michael Kim</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">IT Support • Lead</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-md bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-bold">Study</span>
          </div>
          <div className="pl-[60px] pb-2">
            <div className="flex items-center gap-2 mb-1 text-gray-900 dark:text-white font-medium">
              <span className="material-symbols-outlined text-gray-400 text-lg">calendar_today</span>
              <span>Nov 10 - Nov 12</span>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer for FAB */}
      <div className="h-20" />

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-30">
        <button className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/40 hover:bg-blue-600 active:scale-95 transition-all duration-200">
          <span className="material-symbols-outlined text-[28px]">add</span>
        </button>
      </div>
    </div>
  );
}
