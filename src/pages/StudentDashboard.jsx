import React from 'react';
import Sidebar from '../components/Sidebar';

const StudentDashboard = () => {
  return (
    <div className="flex min-h-screen bg-background-light dark:bg-background-dark">
      <Sidebar
        links={[
          { name: 'Dashboard', path: '/student-dashboard' },
          { name: 'Payment History', path: '/payment-history' },
          { name: 'Bus Registration', path: '/bus-registration' },
          { name: 'Notifications', path: '/notifications' },
        ]}
      />
      <div className="flex-1 bg-background-light dark:bg-background-dark font-display text-[#111418] dark:text-white overflow-x-hidden pb-24">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm p-4 pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 ring-2 ring-white dark:ring-surface-dark"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBgXt3kv-Sa_q9di6SguK38Y68ZxeHOedPgeCB0Ud8JzIC6e44S-OvGFHkCLRSPKh0blMMLI1R0Rre4vjaZT8K2CO04w2MzD-3obC6VRTcfdBSHX5eVWlBI-dDooktGUfrsQ-i0w-l80z8_kZmISuzKDN-h0Vf_s1hVPJwRo_7R_wgJJ_PzEiMFVCfPpnhN8KgPlZi6Ggl97D1psHeMXkqzemfT5uEhL5YB0TEQg4uRsrJkejNYUx16_DM9jQDRLSIgS1COXShUWmc')",
                }}
              ></div>
              <div className="flex flex-col">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Good Morning,</span>
                <h2 className="text-lg font-bold leading-tight">Alex Johnson</h2>
              </div>
            </div>
            <button className="flex size-10 items-center justify-center rounded-full bg-white dark:bg-surface-dark shadow-sm text-[#111418] dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-3 right-3 size-2 bg-red-500 rounded-full border border-white dark:border-background-dark"></span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-4 space-y-5">
          {/* Balance Card (Hero) */}
          <div className="relative overflow-hidden rounded-xl bg-primary shadow-lg shadow-primary/20">
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 100% 0%, white 0%, transparent 20%), radial-gradient(circle at 0% 100%, white 0%, transparent 20%)",
              }}
            ></div>
            <div className="relative p-5 flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <div className="flex flex-col gap-1">
                  <p className="text-white/80 text-sm font-medium">Outstanding Balance</p>
                  <div className="flex items-center gap-2">
                    <h1 className="text-white text-3xl font-bold tracking-tight">$12,450.00</h1>
                    <button className="text-white/70 hover:text-white transition-colors">
                      <span className="material-symbols-outlined text-[20px]">visibility</span>
                    </button>
                  </div>
                  <p className="text-white/90 text-sm font-medium mt-1 bg-white/10 w-fit px-2 py-0.5 rounded text-xs">Due by Oct 15, 2023</p>
                </div>
              </div>
              <div className="w-full h-px bg-white/20"></div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5 text-white/80">
                  <span className="material-symbols-outlined text-[16px]">info</span>
                  <span className="text-xs">Late fees apply after due date</span>
                </div>
                <button className="flex items-center justify-center rounded-lg h-9 px-4 bg-white text-primary text-sm font-bold shadow-sm active:scale-95 transition-transform">
                  Pay Now
                </button>
              </div>
            </div>
          </div>

          {/* Quick Actions Grid */}
          <div>
            <h3 className="text-base font-bold mb-3 text-[#111418] dark:text-white">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <button className="flex flex-col gap-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-surface-dark p-4 items-start shadow-sm hover:shadow-md transition-shadow">
                <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-primary">
                  <span className="material-symbols-outlined">history</span>
                </div>
                <span className="text-sm font-bold leading-tight">Payment History</span>
              </button>
              <button className="flex flex-col gap-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-surface-dark p-4 items-start shadow-sm hover:shadow-md transition-shadow">
                <div className="p-2 rounded-lg bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400">
                  <span className="material-symbols-outlined">directions_bus</span>
                </div>
                <span className="text-sm font-bold leading-tight">Bus Registration</span>
              </button>
              <button className="flex flex-col gap-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-surface-dark p-4 items-start shadow-sm hover:shadow-md transition-shadow">
                <div className="p-2 rounded-lg bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                  <span className="material-symbols-outlined">description</span>
                </div>
                <span className="text-sm font-bold leading-tight">Download Invoice</span>
              </button>
              <button className="flex flex-col gap-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-surface-dark p-4 items-start shadow-sm hover:shadow-md transition-shadow">
                <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                  <span className="material-symbols-outlined">support_agent</span>
                </div>
                <span className="text-sm font-bold leading-tight">Support</span>
              </button>
            </div>
          </div>

          {/* Promo Card */}
          <div className="rounded-xl overflow-hidden bg-white dark:bg-surface-dark shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="flex flex-row p-0">
              <div className="flex-1 p-4 flex flex-col justify-center gap-2">
                <div className="flex items-center gap-2">
                  <span className="bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Promo</span>
                </div>
                <p className="text-base font-bold leading-tight">Semester Bus Pass</p>
                <p className="text-gray-500 dark:text-gray-400 text-xs font-normal leading-normal">Early Bird Discount ending soon. Save 15% on total fare.</p>
              </div>
              <div
                className="w-32 bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAneQO73AmkmeLqP3AEcRghdHdvxRmPa1uBc8zKiVMOTXYOEDJFRKipvwYmpFa0kTdQaLKsr3ZI8XImDe9t9Pdz-AeVFoEKenWVFtoGJSU23-3TbFMbmAmWa8O4vItS2BM6WrEa8BxG2F_2tOGSAxgoDCq1mGTQT1hHecSlwsrtLxtCJj-Zm6uhV1ZJOBn5yoL4CJEnC9jGheUzDoPljpT2VtM4KFnPg5fqt-cDmbY46bjdx9w-z1cuWCILojsaQQeHycmft6EZOSs')",
                }}
              ></div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div>
            <div className="flex items-center justify-between mb-3 px-1">
              <h3 className="text-base font-bold text-[#111418] dark:text-white">Recent Activity</h3>
              <a className="text-primary text-sm font-medium hover:underline" href="#">
                View All
              </a>
            </div>
            <div className="flex flex-col bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800">
              {/* Transaction Item 1 */}
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 shrink-0">
                    <span className="material-symbols-outlined">check_circle</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#111418] dark:text-white">Tuition Payment</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Sep 01, 2023</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-[#111418] dark:text-white">-$5,000.00</span>
              </div>
              {/* Transaction Item 2 */}
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center text-yellow-600 dark:text-yellow-400 shrink-0">
                    <span className="material-symbols-outlined">pending</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#111418] dark:text-white">Lab Fee</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Aug 28, 2023</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-[#111418] dark:text-white">$150.00</span>
              </div>
              {/* Transaction Item 3 */}
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                    <span className="material-symbols-outlined">menu_book</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#111418] dark:text-white">Bookstore</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Aug 15, 2023</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-[#111418] dark:text-white">-$85.50</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 w-full bg-white dark:bg-surface-dark border-t border-gray-200 dark:border-gray-800 pb-safe pt-2 px-6 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-between h-14">
            <button className="flex flex-col items-center justify-center gap-1 text-primary w-16">
              <span className="material-symbols-outlined fill-1">home</span>
              <span className="text-[10px] font-bold">Home</span>
            </button>
            <button className="flex flex-col items-center justify-center gap-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 w-16 transition-colors">
              <span className="material-symbols-outlined">school</span>
              <span className="text-[10px] font-medium">Academics</span>
            </button>
            <button className="flex flex-col items-center justify-center gap-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 w-16 transition-colors">
              <span className="material-symbols-outlined">payments</span>
              <span className="text-[10px] font-medium">Finance</span>
            </button>
            <button className="flex flex-col items-center justify-center gap-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 w-16 transition-colors">
              <span className="material-symbols-outlined">person</span>
              <span className="text-[10px] font-medium">Profile</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;