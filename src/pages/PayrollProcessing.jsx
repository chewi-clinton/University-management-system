import React from 'react'
import TopBar from '../components/TopBar'
import StatCard from '../components/StatCard'

export default function PayrollProcessing() {
  return (
    <div className="relative flex flex-col w-full min-h-screen max-w-md mx-auto bg-background-light dark:bg-background-dark pb-24 shadow-2xl">
      <TopBar title="Payroll Processing" right={<button className="flex items-center justify-center rounded-lg h-12 bg-transparent text-text-main dark:text-white gap-2 text-base font-bold min-w-0 p-0"><span className="material-symbols-outlined text-2xl">visibility</span></button>} />

      {/* Period Status Card */}
      <div className="p-4">
        <div className="flex flex-col gap-4 rounded-xl bg-surface-light dark:bg-surface-dark p-4 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-1">
              <p className="text-text-secondary dark:text-gray-400 text-xs font-semibold uppercase tracking-wider">Current Period</p>
              <p className="text-text-main dark:text-white text-xl font-bold leading-tight">October 2023</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 dark:bg-blue-900/30 px-2 py-0.5 text-xs font-medium text-blue-700 dark:text-blue-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                  Draft
                </span>
                <span className="text-text-secondary dark:text-gray-400 text-sm">• Due in 5 days</span>
              </div>
            </div>
            <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary to-blue-400 flex items-center justify-center text-white shadow-lg" data-alt="Abstract finance icon gradient">
              <span className="material-symbols-outlined text-3xl">calendar_month</span>
            </div>
          </div>
          <div className="h-px bg-gray-100 dark:bg-gray-700 w-full" />
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-text-secondary dark:text-gray-400">Payroll ID: #UNIV-23-OCT</p>
            <button className="flex items-center gap-1 text-primary text-sm font-bold">
              Change Period
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="flex gap-4 p-4 pt-0 overflow-x-auto no-scrollbar snap-x">
        <StatCard icon="payments" label="Total Payout" value="$1.2M" className="min-w-[150px]" />
        <StatCard icon="group" label="Employees" value="450" className="min-w-[150px]" />
        <StatCard icon="account_balance_wallet" label="Deductions" value="$320k" className="min-w-[150px]" />
      </div>

      {/* Search Bar */}
      <div className="px-4 py-2 sticky top-[72px] z-10 bg-background-light dark:bg-background-dark/95 backdrop-blur-sm">
        <label className="flex flex-col w-full">
          <div className="flex w-full flex-1 items-stretch rounded-xl h-12 shadow-sm">
            <div className="text-text-secondary dark:text-gray-400 flex bg-white dark:bg-surface-dark items-center justify-center pl-4 rounded-l-xl border border-r-0 border-gray-200 dark:border-gray-700">
              <span className="material-symbols-outlined">search</span>
            </div>
            <input className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl rounded-l-none text-text-main dark:text-white focus:outline-0 focus:ring-0 bg-white dark:bg-surface-dark border border-l-0 border-gray-200 dark:border-gray-700 h-full placeholder:text-text-secondary dark:placeholder:text-gray-500 px-4 pl-2 text-base font-normal leading-normal" placeholder="Search by name or ID" defaultValue="" />
          </div>
        </label>
      </div>

      {/* Filter Chips */}
      <div className="flex gap-2 p-4 pt-2 overflow-x-auto no-scrollbar">
        <div className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full bg-primary text-white pl-4 pr-4 shadow-md transition-transform active:scale-95 cursor-pointer">
          <p className="text-sm font-bold leading-normal">All Departments</p>
        </div>
        <div className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 pl-4 pr-4 transition-transform active:scale-95 cursor-pointer">
          <p className="text-text-main dark:text-white text-sm font-medium leading-normal">Faculty</p>
        </div>
        <div className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 pl-4 pr-4 transition-transform active:scale-95 cursor-pointer">
          <p className="text-text-main dark:text-white text-sm font-medium leading-normal">Admin</p>
        </div>
        <div className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30 pl-4 pr-4 transition-transform active:scale-95 cursor-pointer">
          <span className="material-symbols-outlined text-red-600 dark:text-red-400 text-sm">flag</span>
          <p className="text-red-700 dark:text-red-400 text-sm font-medium leading-normal">Flagged</p>
        </div>
      </div>

      {/* Employee List */}
      <div className="flex flex-col gap-3 px-4 pb-4">
        <h3 className="text-text-main dark:text-white text-base font-bold px-1">Employees (450)</h3>
        {/* Employee 1 */}
        <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-surface-light dark:bg-surface-dark shadow-sm border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-colors cursor-pointer group">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 bg-center bg-cover rounded-full bg-gray-200" data-alt="Portrait of Dr. Sarah Jenkins" style={{ backgroundImage: "url(\"https://lh3.googleusercontent.com/aida-public/AB6AXuAnsvC1OgZhal6Jetc1bKdusUVh6iKhcjOLBSAJ71YOrRDmzEUoANc8FiAJriRtue8Zmxq09Oww524VUWaS355S9IVijnJEp3GhVBoHjs14BboX3WEeyNi9m9-_XVMXMnBMvlqmetphNORZf7FeW4VoUasLIytjGWSc4eV_c__Lw9XoBW1sr5KmvTkUo4luxBWUETSF3vrvc7G2cBvYCG5HHYk5efyA-q4mD1r2gWDK0FLpjEz_wicJZ4mdmp5LqTBOU_HW52xASrg\" )" }} />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-surface-dark rounded-full" />
            </div>
            <div className="flex flex-col">
              <p className="text-text-main dark:text-white text-base font-bold leading-tight group-hover:text-primary transition-colors">Dr. Sarah Jenkins</p>
              <p className="text-text-secondary dark:text-gray-400 text-sm font-normal">Professor, Physics</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <p className="text-text-main dark:text-white text-base font-bold tabular-nums">$8,400.00</p>
            <span className="inline-flex items-center rounded-md bg-green-50 dark:bg-green-900/20 px-2 py-1 text-xs font-medium text-green-700 dark:text-green-400 ring-1 ring-inset ring-green-600/20">Ready</span>
          </div>
        </div>

        {/* Employee 2 */}
        <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-surface-light dark:bg-surface-dark shadow-sm border-l-4 border-red-500 cursor-pointer group">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 bg-center bg-cover rounded-full bg-gray-200" data-alt="Portrait of Mark Davis" style={{ backgroundImage: "url(\"https://lh3.googleusercontent.com/aida-public/AB6AXuDy1WwjRaZjBf0rgqds0PkZnaBF8OlIEDe5n-MMDntwSS8LLq7ID_p7Gp2kqK0FC_sSO2VdACmXw8gSFX17AUaVTJAsvYLUHEiF7PSm75rEAqwY0mgskTiZ4xBJtMXpciFUOclEopK4W-pAKicYPqgHNk-lKntn9oe_244VlIb88wcfDYboOBb7xJTCnHlfD042zSGJkeKa0_L6Y4j-pJ1fRlm3SpvoS1GRDPUWe4DoQNe3G86N_cnG7hG-VhGYDYxeiIcznP7YhtY\" )" }} />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-red-500 border-2 border-white dark:border-surface-dark rounded-full" />
            </div>
            <div className="flex flex-col">
              <p className="text-text-main dark:text-white text-base font-bold leading-tight group-hover:text-primary transition-colors">Mark Davis</p>
              <p className="text-text-secondary dark:text-gray-400 text-sm font-normal">Marketing Admin</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <p className="text-text-main dark:text-white text-base font-bold tabular-nums">$4,200.00</p>
            <span className="inline-flex items-center rounded-md bg-red-50 dark:bg-red-900/20 px-2 py-1 text-xs font-medium text-red-700 dark:text-red-400 ring-1 ring-inset ring-red-600/20">Flagged</span>
          </div>
        </div>

        {/* Employee 3 */}
        <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-surface-light dark:bg-surface-dark shadow-sm border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-colors cursor-pointer group">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 bg-center bg-cover rounded-full bg-gray-200" data-alt="Portrait of Emily Chen" style={{ backgroundImage: "url(\"https://lh3.googleusercontent.com/aida-public/AB6AXuBd4oHRz_RJVsya0rXqa1l-0_nZH6yQSsWWjupf2J4ugCsLpISxGd4wx88pJJMhLk8hj5jopcAL6xCqgwnz2HFZD66pNTl0Mx_G47Y-1hZI4vao-2DeufVq2ZWk1GaI_kD6SDMNHmnyx5BEb_DGyc9ccXIMIyDOWLXW_4jmJznSiZg1EYxfk6x3OeU6O0sgpHlDqSFzR_AK31BgaOWqZYTU4qaVT9Z5Ayy1nud4ybGyTt0BUNyPxvEBecc3rOJSVXmYsstzZB25prM\" )" }} />
            </div>
            <div className="flex flex-col">
              <p className="text-text-main dark:text-white text-base font-bold leading-tight group-hover:text-primary transition-colors">Emily Chen</p>
              <p className="text-text-secondary dark:text-gray-400 text-sm font-normal">Research Fellow</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <p className="text-text-main dark:text-white text-base font-bold tabular-nums">$6,150.00</p>
            <span className="inline-flex items-center rounded-md bg-green-50 dark:bg-green-900/20 px-2 py-1 text-xs font-medium text-green-700 dark:text-green-400 ring-1 ring-inset ring-green-600/20">Ready</span>
          </div>
        </div>

        {/* Employee 4 */}
        <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-surface-light dark:bg-surface-dark shadow-sm border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-colors cursor-pointer group">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 bg-center bg-cover rounded-full bg-gray-200" data-alt="Portrait of James Wilson" style={{ backgroundImage: "url(\"https://lh3.googleusercontent.com/aida-public/AB6AXuDdOBqIsEXIqFsZtPUR3bStvrxe-7Ed-SXrdRhkrm0C58UaImnnOZxaNPIDIrqCD-i4sQGTZdJcODcXNlj_X1iL2XqQEDKapAvAfH23Qjt-Ct_tc3_YdReo_bkX15Dbqb36SoGgYF3j1jDZ50GO8Lowo78yrd4h0LnXpaVfPGAWBytCcvoDKF7YWtWtCfiHb5Ofvq84cjmijzGrsKwtt6lpkAzCu3wSBuLgoSRo6hMxvG9dMMyqXyZhFKWiJzxEDAKDcGkvKqXx6-U\" )" }} />
            </div>
            <div className="flex flex-col">
              <p className="text-text-main dark:text-white text-base font-bold leading-tight group-hover:text-primary transition-colors">James Wilson</p>
              <p className="text-text-secondary dark:text-gray-400 text-sm font-normal">Department Head, Arts</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <p className="text-text-main dark:text-white text-base font-bold tabular-nums">$9,800.00</p>
            <span className="inline-flex items-center rounded-md bg-green-50 dark:bg-green-900/20 px-2 py-1 text-xs font-medium text-green-700 dark:text-green-400 ring-1 ring-inset ring-green-600/20">Ready</span>
          </div>
        </div>

        {/* Employee 5 */}
        <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-surface-light dark:bg-surface-dark shadow-sm border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-colors cursor-pointer group">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 bg-center bg-cover rounded-full bg-gray-200" data-alt="Portrait of Linda Martinez" style={{ backgroundImage: "url(\"https://lh3.googleusercontent.com/aida-public/AB6AXuD_QxUkRIgUGv-el7OTkjTQxXo42BOhQyzLl_aKbi3U4ge6nsOZP6xgDM4NfseMnc8LzHYbrO00__f7zr-VeF9eCo8K5hKLRAJLpRJ1Qh-hisUecDTGmcWfsFriS9_dDK3nEUig_RWu-p2IcEV0XgHq45vje7RkeupPIjQCEhhbKXuNH-KYyxHMjqaCSbZdOdoKAwDVFRKf6jwL0dpSma_4NI9AHKScted0EaM1BHbtVvvZsWS652L19VysUm4-kShroGfa844YnPs\" )" }} />
            </div>
            <div className="flex flex-col">
              <p className="text-text-main dark:text-white text-base font-bold leading-tight group-hover:text-primary transition-colors">Linda Martinez</p>
              <p className="text-text-secondary dark:text-gray-400 text-sm font-normal">Senior Admin</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <p className="text-text-main dark:text-white text-base font-bold tabular-nums">$5,300.00</p>
            <span className="inline-flex items-center rounded-md bg-green-50 dark:bg-green-900/20 px-2 py-1 text-xs font-medium text-green-700 dark:text-green-400 ring-1 ring-inset ring-green-600/20">Ready</span>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 dark:bg-surface-dark/90 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 flex gap-4 max-w-md mx-auto z-50">
        <button className="flex-1 flex items-center justify-center h-12 px-6 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary text-base font-bold transition-colors">Simulate</button>
        <button className="flex-[2] flex items-center justify-center gap-2 h-12 px-6 rounded-xl bg-primary hover:bg-blue-600 text-white text-base font-bold shadow-lg shadow-blue-500/30 transition-colors">
          <span>Approve &amp; Pay</span>
          <span className="material-symbols-outlined text-xl">check_circle</span>
        </button>
      </div>
    </div>
  );
}
