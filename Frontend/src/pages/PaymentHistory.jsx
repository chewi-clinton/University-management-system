import React, { useState, useEffect } from 'react'
import TopBar from '../components/TopBar'
import { financeAPI } from '../services/financeService'
import { getCurrentUser } from '../services/authService'

export default function PaymentHistory() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterCategory, setFilterCategory] = useState('all')
  const [search, setSearch] = useState('')

  const [totalOutstanding, setTotalOutstanding] = useState(0)
  const [balanceDebug, setBalanceDebug] = useState(null)

  const formatCurrency = (v) => `XAF ${Number(v || 0).toLocaleString()}`

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const user = getCurrentUser() || {}
        console.log('PaymentHistory: user ->', user)
        const studentId = user.studentId || user.student?.id || user.id || undefined
        console.log('PaymentHistory: studentId ->', studentId)

        const data = await financeAPI.getTransactions(studentId)
        const txs = Array.isArray(data) ? data : (data.transactions || [])
        setTransactions(txs)

        // --- apply same balance logic as StudentDashboard ---
        try {
          // try student-specific balance first, then fallback to no-student default
          const b = await financeAPI.getBalance(studentId)
          console.log('finance.getBalance (dashboard) ->', b)
          setBalanceDebug(b)

          const pickNumber = (obj) => {
            if (obj == null) return 0
            if (typeof obj === 'number') return obj
            if (typeof obj === 'string' && !Number.isNaN(Number(obj))) return Number(obj)
            if (typeof obj === 'object') {
              const keys = ['totalDue','total_due','totalOutstanding','total_outstanding','balance','total','amount','due']
              for (const k of keys) if (obj[k] != null && !Number.isNaN(Number(obj[k]))) return Number(obj[k])
              // nested fallbacks
              if (obj.data) {
                const v = pickNumber(obj.data); if (v) return v
              }
              if (obj.result) {
                const v = pickNumber(obj.result); if (v) return v
              }
            }
            return 0
          }

          let amt = pickNumber(b)

          // final fallback: compute from transactions if API provided nothing
          if (!amt && txs.length) {
            amt = txs.reduce((s, t) => s + Number(t.amount || 0), 0)
          }

          setTotalOutstanding(amt)
        } catch (e) {
          console.error('Failed to load balance', e)
          setTotalOutstanding(0)
        }
      } catch (e) {
        console.error('PaymentHistory load error', e)
        setTransactions([])
        setTotalOutstanding(0)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const matches = (t) => {
    if (!t) return false
    const q = search.trim().toLowerCase()
    if (filterCategory !== 'all' && (t.category || '').toLowerCase() !== filterCategory) return false
    if (!q) return true
    return (
      (t.description || '').toLowerCase().includes(q) ||
      (t._id || t.id || '').toString().toLowerCase().includes(q) ||
      (t.category || '').toLowerCase().includes(q)
    )
  }

  const iconFor = (cat) => {
    const c = (cat || '').toLowerCase()
    if (c.includes('tuition')) return { icon: 'school', bg: 'bg-orange-100 text-orange-600' }
    if (c.includes('housing') || c.includes('dorm')) return { icon: 'apartment', bg: 'bg-blue-100 text-blue-600' }
    if (c.includes('library')) return { icon: 'menu_book', bg: 'bg-purple-100 text-purple-600' }
    if (c.includes('bus') || c.includes('transport')) return { icon: 'directions_bus', bg: 'bg-green-100 text-green-600' }
    return { icon: 'receipt_long', bg: 'bg-gray-100 text-gray-600' }
  }

  const filtered = transactions.filter(matches)

  return (
    <div className="relative flex flex-col min-h-screen w-full mx-auto bg-background-light dark:bg-background-dark overflow-hidden md:max-w-none md:shadow-none md:ring-0">
      <TopBar title="Payment History" right={<button className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"><span className="material-symbols-outlined">filter_list</span></button>} />

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-24 md:pb-6 md:p-6">
        <div className="max-w-4xl mx-auto">
          {/* Balance Card (ActionPanel) */}
          <div className="p-4 md:p-0 md:mb-6">
            <div className="flex flex-col items-start justify-between gap-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-surface-light dark:bg-surface-dark p-5 shadow-sm">
              <div className="flex w-full justify-between items-start">
                <div className="flex flex-col gap-1">
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wide">Total Outstanding</p>
                  <p className="text-slate-900 dark:text-white text-3xl font-bold leading-tight tracking-tight">{formatCurrency(totalOutstanding)}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">account_balance</span>
                </div>
              </div>
              {balanceDebug !== null && (
                <div className="mt-2 text-xs text-gray-500">
                  Debug: <pre className="whitespace-pre-wrap">{JSON.stringify(balanceDebug, null, 2)}</pre>
                </div>
              )}
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
              <input value={search} onChange={(e) => setSearch(e.target.value)} className="w-full h-full bg-transparent border-none focus:ring-0 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 px-3 text-base font-normal" placeholder="Search invoice # or description" />
            </div>
          </div>

          {/* Chips (Filters) */}
          <div className="flex gap-3 px-4 py-2 overflow-x-auto no-scrollbar">
            {['all','tuition','housing','library','bus'].map(c => (
              <button
                key={c}
                onClick={() => setFilterCategory(c)}
                className={`flex h-9 shrink-0 items-center justify-center px-4 rounded-full text-sm font-medium transition-transform active:scale-95 ${filterCategory===c ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200'}`}
              >
                {c === 'all' ? 'All' : c.charAt(0).toUpperCase() + c.slice(1)}
              </button>
            ))}

          </div>

          {/* Recent Activity Title */}
          <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] px-4 pt-6 pb-3">Recent Activity</h2>

          {/* Transactions List */}
          <div className="px-4 flex flex-col gap-3">
            {loading ? (
              <div className="p-4 text-center text-sm text-gray-500">Loading...</div>
            ) : filtered.length === 0 ? (
              <div className="p-4 text-center text-sm text-gray-500">No transactions found</div>
            ) : filtered.map((t) => {
              const meta = iconFor(t.category)
              return (
                <div key={t._id || t.id} className="group flex flex-col gap-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-surface-light dark:bg-surface-dark p-4 shadow-sm hover:border-primary/30 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full ${meta.bg} dark:bg-opacity-30`}>
                        <span className="material-symbols-outlined text-[20px]">{meta.icon}</span>
                      </div>
                      <div>
                        <p className="text-slate-900 dark:text-white text-sm font-bold">{t.description || (t.category || 'Transaction')}</p>
                        <p className="text-slate-500 dark:text-slate-400 text-xs">{new Date(t.date || t.createdAt || Date.now()).toLocaleDateString()} • #{t._id?.toString?.().slice(0,8) || ''}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-slate-900 dark:text-white text-sm font-bold">XAF {Number(t.amount || 0).toLocaleString()}</p>
                      <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${t.status === 'paid' ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 ring-green-600/20' : t.status === 'overdue' ? 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 ring-red-600/10' : 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-500 ring-yellow-600/20'}`}>{t.status ? t.status.charAt(0).toUpperCase()+t.status.slice(1) : 'Pending'}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Bottom spacing */}
          <div className="h-6" />
        </div>
      </div>

      {/* Bottom Navigation - Hidden on desktop */}
      <nav className="absolute bottom-0 left-0 right-0 z-30 flex md:hidden items-center justify-around bg-surface-light dark:bg-surface-dark border-t border-slate-200 dark:border-slate-800 h-[80px] pb-4">
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

