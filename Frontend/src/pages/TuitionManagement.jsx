import React from 'react'
import TopBar from '../components/TopBar'
import StatCard from '../components/StatCard'


export default function TuitionManagement() {
  return (
    <div className="relative flex flex-col min-h-screen w-full bg-background-light dark:bg-background-dark pb-24 shadow-2xl">
      <TopBar title="Tuition Dashboard" right={<button className="flex items-center justify-center rounded-full size-10 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"><span className="material-symbols-outlined" style={{ fontSize: 24 }}>notifications</span><span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-background-dark" /></button>} />

      {/* SearchBar */}
      <div className="px-4 py-4 bg-background-light dark:bg-background-dark">
        <div className="flex gap-3 items-center">
          <div className="flex flex-1 items-center bg-white dark:bg-gray-800 rounded-lg h-12 shadow-sm border border-gray-200 dark:border-gray-700 focus-within:ring-2 focus-within:ring-primary transition-all">
            <div className="pl-3 text-gray-400 dark:text-gray-500 flex items-center justify-center">
              <span className="material-symbols-outlined">search</span>
            </div>
            <input className="w-full bg-transparent border-none text-base text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-0 px-3 h-full font-display" placeholder="Search student name or ID..." />
          </div>
          <button className="shrink-0 flex items-center justify-center size-12 bg-primary text-white rounded-lg shadow-md active:scale-95 transition-transform">
            <span className="material-symbols-outlined">tune</span>
          </button>
        </div>
      </div>

      {/* Stats Overview (Horizontal Scroll) */}
      <div className="w-full overflow-x-auto no-scrollbar pl-4 pb-4">
        <div className="flex gap-4 pr-4 min-w-max">
          <StatCard icon="account_balance_wallet" label="Pending" value="XAF 45,200" className="min-w-[160px]" />
          <StatCard icon="payments" label="Today" value="XAF 12,500" className="min-w-[160px]" />
          <StatCard icon="warning" label="Overdue" value="12" className="min-w-[160px]" />
        </div>
      </div>

      {/* Chips / Filter Tabs */}
      <div className="sticky top-[73px] z-40 bg-background-light dark:bg-background-dark py-2">
        <div className="flex gap-2 px-4 overflow-x-auto no-scrollbar">
          <button className="shrink-0 h-9 px-4 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-medium font-display transition-colors">All</button>
          <button className="shrink-0 h-9 px-4 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-sm font-medium font-display hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">Overdue</button>
          <button className="shrink-0 h-9 px-4 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-sm font-medium font-display hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">Pending</button>
          <button className="shrink-0 h-9 px-4 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-sm font-medium font-display hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">Paid</button>
        </div>
      </div>

      {/* Recent Records Headline */}
      <div className="flex items-center justify-between px-4 py-3 mt-2">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white font-display">Recent Records</h3>
        <button className="text-sm text-primary font-medium font-display hover:text-blue-600">View All</button>
      </div>

      {/* Student Records List */}
      <div className="flex flex-col gap-3 px-4 pb-20">
        {/* Card 1 */}
        <div className="group relative bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 active:scale-[0.99] transition-all duration-200">
          <div className="flex justify-between items-start mb-3">
            <div className="flex gap-3">
              <div className="bg-gray-100 dark:bg-gray-700 rounded-full size-12 bg-center bg-cover" data-alt="Portrait of student John Doe" style={{ backgroundImage: "url(\"https://lh3.googleusercontent.com/aida-public/AB6AXuBR8BYNVjPR5G0K5e2YIkcSGrJO6vZXJfvqUFk5F6oeI_o5hFkoc-JAgoG-b9YHYuyrJutFR-ZG3tOAEOgWGoZF2e3NutIpcw7nFY7QHY8GBdM1UkMkVsQjcuG9TEoTcOrdfM-mYNgUSxO4Qv9uBRIm7lqzQxUsH1oh2_Y6QKCkBRJ8h0d6VU8JrKEVZmWGCrIN03xzTF4_0m_CGCobH70YmuiYRymL2whO5HTHXOwbHwUE3JzmkF9mXEduPtWGe_wjtsTA78p6RF0\" )" }} />
              <div>
                <h4 className="text-base font-bold text-gray-900 dark:text-white font-display">John Doe</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-display">ID: 2023001 • Business Admin</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs font-semibold font-display"><span className="w-1.5 h-1.5 rounded-full bg-red-500" /> Overdue</span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700 mt-2">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Amount Due</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white font-display">XAF 1,200.00</p>
            </div>
            <button className="px-4 py-2 bg-primary hover:bg-blue-600 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm font-display flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">receipt_long</span>
              Invoice
            </button>
          </div>
        </div>

        {/* Card 2 */}
        <div className="group relative bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 active:scale-[0.99] transition-all duration-200">
          <div className="flex justify-between items-start mb-3">
            <div className="flex gap-3">
              <div className="bg-gray-100 dark:bg-gray-700 rounded-full size-12 bg-center bg-cover" data-alt="Portrait of student Jane Smith" style={{ backgroundImage: "url(\"https://lh3.googleusercontent.com/aida-public/AB6AXuCU0r9rdTZsKmIi-DXD5tA0oJJYbdvKRvb3c9hsbOy33KfWUQ0pbSLnEJQYlnofWtHfJPGHrzaRNCVTpZPY_jSPcxfsM8EnbpP95HHowi7HcRX_amERKjZC438ABLPw4Crji8gX7tZ2TIdYfXHydcB05FrfpK3ybXOohd5sSb8d1U5m_CzIpFCGqy1Mf-RfS7Kc4YXafolTpBCUD6Ssa9eDpeL_n4-mNdGyb5nFQWEFtkBFsYavOWjc-bhvH3qI8BbK7zZpnqT78OE\" )" }} />
              <div>
                <h4 className="text-base font-bold text-gray-900 dark:text-white font-display">Jane Smith</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-display">ID: 2023045 • Computer Science</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-semibold font-display"><span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Paid</span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700 mt-2">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Amount Due</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white font-display">XAF 0.00</p>
            </div>
            <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 text-sm font-semibold rounded-lg transition-colors font-display">Details</button>
          </div>
        </div>

        {/* Card 3 */}
        <div className="group relative bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 active:scale-[0.99] transition-all duration-200">
          <div className="flex justify-between items-start mb-3">
            <div className="flex gap-3">
              <div className="bg-gray-100 dark:bg-gray-700 rounded-full size-12 bg-center bg-cover" data-alt="Portrait of student Michael Brown" style={{ backgroundImage: "url(\"https://lh3.googleusercontent.com/aida-public/AB6AXuCU7SPz-JoH_Hj-N9XOl2EIiO4kUErarIA4v136BnGv6ICdM6rLpjTXN6IWVfmXkvdyvRyal-OeR1oHeeIquax6b7Y0yyuZPTfDhEZ7gnkR_DItRJl-ozsTfG4dnpW8-NXD86vOBKq3KMbYgXVEQIunyQfnabZBKdbN4C3zKImLry3AgFLdS-O_ontQ12-TbBNx4A1vA3_yTONozAQk6KXtuZhh-ZlUIu3BF-RO4IJdn80PN5Gw7ZZUm3FDEcEqUohZ3hQwSKgOyds\" )" }} />
              <div>
                <h4 className="text-base font-bold text-gray-900 dark:text-white font-display">Michael Brown</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-display">ID: 2023112 • Marketing</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 text-xs font-semibold font-display"><span className="w-1.5 h-1.5 rounded-full bg-yellow-500" /> Pending</span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700 mt-2">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Amount Due</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white font-display">XAF 500.00</p>
            </div>
            <button className="px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary dark:text-blue-300 text-sm font-semibold rounded-lg transition-colors font-display flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">send</span>
              Remind
            </button>
          </div>
        </div>

        {/* Card 4 */}
        <div className="group relative bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 active:scale-[0.99] transition-all duration-200">
          <div className="flex justify-between items-start mb-3">
            <div className="flex gap-3">
              <div className="bg-gray-100 dark:bg-gray-700 rounded-full size-12 bg-center bg-cover" data-alt="Portrait of student Sarah Wilson" style={{ backgroundImage: "url(\"https://lh3.googleusercontent.com/aida-public/AB6AXuBfIkwjkxDd5N3GUSF9oI5bfd1inV9B1WuYEW_xANgpfaSX01qVIR0I_cTD9prfBQHr_xnD8W0LNLqYCHhCz6yphrfbRKuKNsxVRau5Zbv2_guEJcRFWOQ-r5InOiKrJOHlpWjGiq20Pakq3Tkc7VYU8_mMUfv9_LJ7CseadujuOAFBa2TPO_rKsPsKPp0pxnIAQic8ap4LGnxW7uST44n8_uHxH1TmTFl35zybg8imUtXDG8EKTdJFVv6Wj5yRc34JStwjb5CswNA\" )" }} />
              <div>
                <h4 className="text-base font-bold text-gray-900 dark:text-white font-display">Sarah Wilson</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-display">ID: 2023221 • Design</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs font-semibold font-display"><span className="w-1.5 h-1.5 rounded-full bg-red-500" /> Overdue</span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700 mt-2">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Amount Due</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white font-display">XAF 2,800.00</p>
            </div>
            <button className="px-4 py-2 bg-primary hover:bg-blue-600 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm font-display flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">receipt_long</span>
              Invoice
            </button>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-24 right-4 z-40">
        <button className="flex items-center justify-center size-14 bg-primary text-white rounded-full shadow-lg shadow-blue-500/30 active:scale-95 transition-all hover:bg-blue-600">
          <span className="material-symbols-outlined" style={{ fontSize: 28 }}>add</span>
        </button>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 w-full max-w-md bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 pb-safe z-50">
        <div className="flex justify-around items-center h-16">
          <a className="flex flex-col items-center gap-1 w-full text-primary" href="#">
            <span className="material-symbols-outlined fill-1">account_balance_wallet</span>
            <span className="text-[10px] font-medium">Finance</span>
          </a>
          <a className="flex flex-col items-center gap-1 w-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" href="#">
            <span className="material-symbols-outlined">analytics</span>
            <span className="text-[10px] font-medium">Reports</span>
          </a>
          <a className="flex flex-col items-center gap-1 w-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" href="#">
            <span className="material-symbols-outlined">campaign</span>
            <span className="text-[10px] font-medium">Marketing</span>
          </a>
          <a className="flex flex-col items-center gap-1 w-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" href="#">
            <span className="material-symbols-outlined">settings</span>
            <span className="text-[10px] font-medium">Settings</span>
          </a>
        </div>
      </nav>
    </div>
  );
}
