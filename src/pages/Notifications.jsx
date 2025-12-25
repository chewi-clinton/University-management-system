import React from 'react'
import TopBar from '../components/TopBar'


export default function Notifications() {
  return (
    <div className="bg-background-light dark:bg-background-dark text-[#111418] dark:text-white overflow-x-hidden min-h-screen flex flex-col relative">
      <div className="h-12 w-full bg-surface-light dark:bg-surface-dark shrink-0" />
      <TopBar title="Notifications" right={<button className="text-primary text-sm font-semibold hover:text-blue-600 transition-colors">Mark all read</button>} />

      <div className="sticky top-[69px] z-10 w-full bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm py-3 px-4 border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          <button className="flex h-9 shrink-0 items-center justify-center rounded-full bg-primary px-5 shadow-sm transition-transform active:scale-95">
            <p className="text-white text-sm font-medium">All</p>
          </button>
          <button className="flex h-9 shrink-0 items-center justify-center rounded-full bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 px-5 transition-transform active:scale-95">
            <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">Finance</p>
          </button>
          <button className="flex h-9 shrink-0 items-center justify-center rounded-full bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 px-5 transition-transform active:scale-95">
            <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">HR</p>
          </button>
          <button className="flex h-9 shrink-0 items-center justify-center rounded-full bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 px-5 transition-transform active:scale-95">
            <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">Marketing</p>
          </button>
          <button className="flex h-9 shrink-0 items-center justify-center rounded-full bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 px-5 transition-transform active:scale-95">
            <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">System</p>
          </button>
        </div>
      </div>

      <main className="flex-1 flex flex-col w-full max-w-lg mx-auto pb-24">
        <div className="px-4 py-4">
          <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 ml-1">Today</h3>
          <div className="flex flex-col gap-3">
            <div className="group relative flex flex-col gap-3 rounded-2xl bg-white dark:bg-surface-dark p-4 shadow-sm border border-transparent hover:border-gray-100 dark:hover:border-gray-700 transition-all active:scale-[0.99]">
              <div className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full bg-primary shadow-sm" />
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-900/20 shrink-0 w-12 h-12 text-primary">
                  <span className="material-symbols-outlined text-[24px]">payments</span>
                </div>
                <div className="flex flex-1 flex-col pr-4">
                  <div className="flex justify-between items-start">
                    <p className="text-[#111418] dark:text-white text-base font-semibold leading-tight">Tuition Payment Due</p>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal mt-1 line-clamp-2">Your tuition payment for the Spring 2024 semester is pending. Please clear it by Friday.</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-xs font-medium text-primary bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded">Action Required</span>
                    <span className="text-gray-400 text-xs">2h ago</span>
                  </div>
                </div>
              </div>
              <button className="w-full mt-1 py-2 rounded-lg bg-background-light dark:bg-background-dark text-sm font-medium text-[#111418] dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">Pay Now</button>
            </div>

            <div className="group relative flex gap-4 rounded-2xl bg-white dark:bg-surface-dark p-4 shadow-sm border border-transparent transition-all active:scale-[0.99]">
              <div className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full bg-primary shadow-sm" />
              <div className="flex items-center justify-center rounded-xl bg-green-50 dark:bg-green-900/20 shrink-0 w-12 h-12 text-green-600 dark:text-green-400">
                <span className="material-symbols-outlined text-[24px]">event_available</span>
              </div>
              <div className="flex flex-1 flex-col justify-center pr-4">
                <p className="text-[#111418] dark:text-white text-base font-semibold leading-tight">Leave Request Approved</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal mt-1">Your leave request for Dec 15 - Dec 20 has been approved by HR.</p>
                <p className="text-gray-400 text-xs mt-2">5h ago</p>
              </div>
            </div>

            <div className="group relative flex gap-4 rounded-2xl bg-white dark:bg-surface-dark p-4 shadow-sm border border-transparent transition-all active:scale-[0.99]">
              <div className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full bg-primary shadow-sm" />
              <div className="flex items-center justify-center rounded-xl bg-orange-50 dark:bg-orange-900/20 shrink-0 w-12 h-12 text-orange-600 dark:text-orange-400">
                <span className="material-symbols-outlined text-[24px]">lock_reset</span>
              </div>
              <div className="flex flex-1 flex-col justify-center pr-4">
                <p className="text-[#111418] dark:text-white text-base font-semibold leading-tight">Password Expiry</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal mt-1">Your password will expire in 3 days. Please update it soon.</p>
                <p className="text-gray-400 text-xs mt-2">6h ago</p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 py-2">
          <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 ml-1">Yesterday</h3>
          <div className="flex flex-col gap-3">
            <div className="group relative flex gap-4 rounded-2xl bg-white dark:bg-surface-dark p-4 shadow-sm border border-transparent opacity-80 hover:opacity-100 transition-all active:scale-[0.99]">
              <div className="flex items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-900/20 shrink-0 w-12 h-12 text-purple-600 dark:text-purple-400">
                <span className="material-symbols-outlined text-[24px]">campaign</span>
              </div>
              <div className="flex flex-1 flex-col justify-center">
                <p className="text-[#111418] dark:text-white text-base font-medium leading-tight">Campus Event Invitation</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal mt-1">Join us for the Annual Science Fair at the Main Hall this Saturday.</p>
                <p className="text-gray-400 text-xs mt-2">1d ago</p>
              </div>
            </div>

            <div className="group relative flex gap-4 rounded-2xl bg-white dark:bg-surface-dark p-4 shadow-sm border border-transparent opacity-80 hover:opacity-100 transition-all active:scale-[0.99]">
              <div className="flex items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-900/20 shrink-0 w-12 h-12 text-primary">
                <span className="material-symbols-outlined text-[24px]">receipt_long</span>
              </div>
              <div className="flex flex-1 flex-col justify-center">
                <p className="text-[#111418] dark:text-white text-base font-medium leading-tight">Library Fine Paid</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal mt-1">Receipt #40292. Amount: $12.00. Thank you for clearing your dues.</p>
                <p className="text-gray-400 text-xs mt-2">1d ago</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 w-full bg-surface-light dark:bg-surface-dark border-t border-gray-100 dark:border-gray-800 pb-safe pt-2 px-6 pb-6 z-30">
        <div className="flex justify-between items-center max-w-lg mx-auto">
          <button className="flex flex-col items-center gap-1 text-gray-400 hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-[24px]">home</span>
            <span className="text-[10px] font-medium">Home</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-gray-400 hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-[24px]">calendar_month</span>
            <span className="text-[10px] font-medium">Schedule</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-primary transition-colors">
            <span className="material-symbols-outlined text-[24px] fill-current">notifications</span>
            <span className="text-[10px] font-medium">Alerts</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-gray-400 hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-[24px]">person</span>
            <span className="text-[10px] font-medium">Profile</span>
          </button>
        </div>
      </nav>
    </div>
  );
}

