import React, { useState, useEffect } from 'react'
import TopBar from '../components/TopBar'
import { financeAPI } from '../services/financeService'
import { getCurrentUser, setCurrentUser, getToken, fetchProfile } from '../services/authService'

export default function PaymentHistory() {
  const [transactions, setTransactions] = useState([])
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [expandedId, setExpandedId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [filterCategory, setFilterCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [filterStatus, setFilterStatus] = useState('all')
  const [sortMode, setSortMode] = useState('newest')

  const [totalOutstanding, setTotalOutstanding] = useState(0)
  const [balanceDebug, setBalanceDebug] = useState(null)
  const [walletBalance, setWalletBalance] = useState(0)

  const REQUIRED_FEE = 367000
  const showPayNow = Number(totalOutstanding || 0) > 0 && Number(walletBalance || 0) < REQUIRED_FEE

  const formatCurrency = (v) => `XAF ${Number(v || 0).toLocaleString()}`

  // load transactions with optional date range
  const loadTransactions = async () => {
    setLoading(true)
    try {
      const user = getCurrentUser() || {}
      let studentId = user?.studentId || user?.student?.id || user?.student?._id || undefined

      // Ensure we have the latest student profile (walletBalance) regardless
      try {
        // centralized profile fetch (keeps localStorage user in sync)
        const stu = await fetchProfile()
        if (stu && typeof stu.walletBalance !== 'undefined') setWalletBalance(Number(stu.walletBalance || 0))
        if (!studentId && stu) studentId = stu._id
      } catch (e) { /* ignore */ }

      const data = await financeAPI.getTransactions(studentId, startDate || undefined, endDate || undefined)
      const txs = Array.isArray(data) ? data : (data.transactions || [])
      setTransactions(txs)

      // ask server for authoritative balance (totalDue)
      try {
        const bal = await financeAPI.getBalance(studentId)
        setBalanceDebug(bal)
        setTotalOutstanding(Number(bal?.totalDue ?? bal?.total ?? 0))
        // if backend returns authoritative walletBalance, prefer it
        if (bal && typeof bal.walletBalance !== 'undefined') setWalletBalance(Number(bal.walletBalance || 0))
      } catch (e) {
        // fallback to computed ledger totals
        const totalCharged = txs.filter(i=>i.type==='invoice').reduce((s,i)=>s+Number(i.amount||0),0)
        const totalPaid = txs.filter(i=>i.type==='payment' && (String(i.status).toLowerCase()==='success' || String(i.status).toLowerCase()==='paid' || String(i.status).toLowerCase()==='completed')).reduce((s,i)=>s+Number(i.amount||0),0)
        const balance = totalCharged - totalPaid
        setTotalOutstanding(balance)
      }

      return txs

    } catch (e) {
      console.error('PaymentHistory load error', e)
      setTransactions([])
      setTotalOutstanding(0)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadTransactions() }, [])

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

  // base filter by search/category
  const baseFiltered = transactions.filter(matches)

  // filter by status
  const statusFiltered = baseFiltered.filter(t => {
    if (!filterStatus || filterStatus === 'all') return true
    const s = String(t.status || '').toLowerCase()
    if (filterStatus === 'completed') return (s === 'success' || s === 'paid' || s === 'completed')
    if (filterStatus === 'pending') return s === 'pending'
    if (filterStatus === 'failed') return !(s === 'success' || s === 'paid' || s === 'completed' || s === 'pending')
    return true
  })

  // apply sorting
  const filtered = [...statusFiltered].sort((a,b) => {
    if (sortMode === 'amount-desc') return (Number(b.amount||0) - Number(a.amount||0))
    if (sortMode === 'amount-asc') return (Number(a.amount||0) - Number(b.amount||0))
    // date sort (newest default)
    const da = new Date(a.date || a.createdAt || 0)
    const db = new Date(b.date || b.createdAt || 0)
    if (sortMode === 'oldest') return da - db
    return db - da
  })
  const handleToggle = (id) => setExpandedId(expandedId === id ? null : id)

  const handleDownloadReceipt = async (transactionId) => {
    try {
      const blob = await financeAPI.getReceipt(transactionId)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `receipt-${transactionId}.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
    } catch (e) { console.error('download receipt failed', e) }
  }

  const downloadSchoolDetails = async () => {
    try {
      const url = `${window.location.origin}/university-details.pdf`
      const res = await fetch(url)
      if (!res.ok) throw new Error('School details PDF not found')
      const blob = await res.blob()
      const a = document.createElement('a')
      const blobUrl = URL.createObjectURL(blob)
      a.href = blobUrl
      a.download = `university-details.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(blobUrl)
    } catch (err) {
      console.error('download school details failed', err)
      alert(err.message || 'Failed to download school details')
    }
  }

  const handleExport = async () => {
    try {
      const user = getCurrentUser() || {}
      const studentId = user?.studentId || user?.student?._id || undefined
      const info = await financeAPI.exportHistory(studentId, { start: startDate || undefined, end: endDate || undefined })
      const res = await fetch(info.url, { headers: info.headers })
      if (!res.ok) throw new Error('Export failed')
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `statement-${studentId || 'user'}.csv`
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
    } catch (e) { console.error('export failed', e) }
  }

  const handlePayInvoice = async (tuitionId) => {
    try {
      const res = await financeAPI.createTransaction(tuitionId)
      if (res && res.providerUrl) window.open(res.providerUrl, '_blank')
      // refresh ledger immediately and poll until invoice is marked paid
      let attempts = 0
      const poll = setInterval(async () => {
        attempts++
        try {
          const latest = await loadTransactions()
          const found = (latest || []).find(i => i.type === 'invoice' && String(i.tuitionId) === String(tuitionId))
          if (found && String(found.status).toLowerCase() === 'paid') {
            clearInterval(poll)
          }
        } catch (e) {
          // ignore
        }
        if (attempts >= 10) clearInterval(poll)
      }, 3000)
    } catch (e) { console.error('pay invoice failed', e) }
  }

  const toggleFilters = () => setShowFilters(v => !v)

  return (
    <div className="relative flex flex-col min-h-screen w-full mx-auto bg-background-light dark:bg-background-dark overflow-hidden md:max-w-none md:shadow-none md:ring-0">
      <TopBar title="Payment History" right={<button onClick={toggleFilters} className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"><span className="material-symbols-outlined">filter_list</span></button>} />

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-24 md:pb-6 md:p-6">
        <div className="max-w-4xl mx-auto">
          {/* Balance Card (ActionPanel) - show wallet balance as primary */}
          <div className="p-4 md:p-0 md:mb-6">
            <div className="flex flex-col items-start justify-between gap-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-surface-light dark:bg-surface-dark p-5 shadow-sm">
              <div className="flex w-full justify-between items-start">
                <div className="flex flex-col gap-1">
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wide">Account Balance</p>
                    <p className="text-slate-900 dark:text-white text-3xl font-bold leading-tight tracking-tight">{formatCurrency(walletBalance)}</p>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Outstanding: <span className="text-slate-900 dark:text-white font-semibold">{formatCurrency(totalOutstanding)}</span></p>
                </div>
                <button onClick={downloadSchoolDetails} title="Download school details" className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20">
                  <span className="material-symbols-outlined">account_balance</span>
                </button>
              </div>
              <div className="w-full pt-2">
                {showPayNow ? (
                  <button className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 bg-primary hover:bg-blue-600 transition-colors text-white text-base font-bold leading-normal shadow-md shadow-blue-500/20">
                    <span className="truncate">Pay Now</span>
                  </button>
                ) : (
                  <div className="text-sm text-slate-500">{Number(totalOutstanding || 0) > 0 ? 'Sufficient wallet balance — no action needed' : 'No outstanding balance'}</div>
                )}
              </div>
            </div>
          </div>

          {/* Search Bar + Date Filters */}
          <div className="px-4 pb-2">
            <div className="flex gap-3 items-center">
              <div className="flex-1 flex w-full items-center rounded-lg h-12 bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-700 overflow-hidden focus-within:ring-2 focus-within:ring-primary/50 transition-all">
                <div className="text-slate-400 dark:text-slate-500 flex items-center justify-center pl-4">
                  <span className="material-symbols-outlined">search</span>
                </div>
                <input value={search} onChange={(e) => setSearch(e.target.value)} className="w-full h-full bg-transparent border-none focus:ring-0 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 px-3 text-base font-normal" placeholder="Search invoice # or description" />
              </div>

              <input type="date" value={startDate} onChange={e=>setStartDate(e.target.value)} className="h-10 rounded-lg border px-2" />
              <input type="date" value={endDate} onChange={e=>setEndDate(e.target.value)} className="h-10 rounded-lg border px-2" />
              <button onClick={loadTransactions} className="h-10 px-3 rounded-lg bg-primary text-white text-sm">Filter</button>
            </div>

            {/* Filter panel (toggleable) */}
            {showFilters && (
              <div className="mt-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-dark shadow-sm">
                <div className="flex gap-3 items-center">
                  <div className="flex flex-col">
                    <label className="text-xs text-slate-500">Status</label>
                    <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)} className="h-9 rounded-lg border px-2">
                      <option value="all">All</option>
                      <option value="completed">Completed</option>
                      <option value="pending">Pending</option>
                      <option value="failed">Failed</option>
                    </select>
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs text-slate-500">Sort</label>
                    <select value={sortMode} onChange={e=>setSortMode(e.target.value)} className="h-9 rounded-lg border px-2">
                      <option value="newest">Newest</option>
                      <option value="oldest">Oldest</option>
                      <option value="amount-desc">Amount (High→Low)</option>
                      <option value="amount-asc">Amount (Low→High)</option>
                    </select>
                  </div>
                  <div className="flex-1" />
                  <div className="flex items-end gap-2">
                    <button onClick={() => { setShowFilters(false); loadTransactions(); }} className="h-9 px-3 rounded-lg bg-primary text-white text-sm">Apply</button>
                    <button onClick={() => { setFilterStatus('all'); setSortMode('newest'); setShowFilters(false); }} className="h-9 px-3 rounded-lg border text-sm">Reset</button>
                  </div>
                </div>
              </div>
            )}
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
              const isPayment = t.type === 'payment'
              const amountClass = isPayment ? 'text-green-600' : 'text-red-700'
              const statusLabel = (() => {
                if (isPayment) {
                  const s = String(t.status || '').toLowerCase()
                  if (s === 'success' || s === 'paid' || s === 'completed') return 'Completed'
                  if (s === 'pending') return 'Pending'
                  return 'Failed'
                }
                return t.status ? (t.status.charAt(0).toUpperCase() + t.status.slice(1)) : 'Pending'
              })()

              return (
                <div key={t._id || t.id} className="group flex flex-col gap-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-surface-light dark:bg-surface-dark p-4 shadow-sm hover:border-primary/30 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3" onClick={() => handleToggle(t._id)}>
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full ${meta.bg} dark:bg-opacity-30`}>
                        <span className="material-symbols-outlined text-[20px]">{meta.icon}</span>
                      </div>
                      <div>
                        <p className="text-slate-900 dark:text-white text-sm font-bold">{t.description || (t.category || 'Transaction')}</p>
                        <p className="text-slate-500 dark:text-slate-400 text-xs">{new Date(t.date || t.createdAt || Date.now()).toLocaleDateString()} • #{t._id?.toString?.().slice(0,8) || ''}</p>
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end gap-2">
                      <p className={`text-sm font-bold ${amountClass}`}>{isPayment ? '-' : ''} XAF {Number(t.amount || 0).toLocaleString()}</p>
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${statusLabel === 'Completed' ? 'bg-green-50 text-green-700 ring-green-600/20' : statusLabel === 'Pending' ? 'bg-yellow-50 text-yellow-800 ring-yellow-600/20' : 'bg-red-50 text-red-700 ring-red-600/10'}`}>{statusLabel}</span>
                        {isPayment && (String(t.status).toLowerCase() === 'success' || String(t.status).toLowerCase() === 'paid' || String(t.status).toLowerCase() === 'completed') && (
                          <button onClick={() => handleDownloadReceipt(t.transactionId)} className="text-sm text-primary">Download</button>
                        )}
                        {!isPayment && (String(t.status || '').toLowerCase() !== 'paid') && (
                          <button onClick={() => handlePayInvoice(t.tuitionId)} className="text-sm text-white bg-primary px-2 py-1 rounded">Pay</button>
                        )}
                      </div>
                    </div>
                  </div>

                  {expandedId === t._id && (
                    <div className="mt-2 text-sm text-slate-700 dark:text-slate-300">
                      {isPayment ? (
                        <div>
                          <div>Payment Method: {t.metadata?.paymentMethod || t.metadata?.method || '—'}</div>
                          <div>Reference: {t.metadata?.reference || t.transactionId || '—'}</div>
                        </div>
                      ) : (
                        <div>
                          <div>Due Date: {t.raw?.dueDate ? new Date(t.raw.dueDate).toLocaleDateString() : '—'}</div>
                          <div>Breakdown: Tuition: XAF {Number(t.raw?.amount||0).toLocaleString()}</div>
                        </div>
                      )}
                    </div>
                  )}
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

