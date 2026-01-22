const API = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api'

const authFetch = async (path, method = 'GET', body) => {
  const token = localStorage.getItem('token') || ''
  console.log('[financeService] request ->', { url: `${API}${path}`, method, hasToken: !!token, body })
  const res = await fetch(`${API}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  })
  const text = await res.text()
  let data = null
  try { data = text ? JSON.parse(text) : null } catch (e) { data = text }
  console.log('[financeService] response ->', { url: `${API}${path}`, status: res.status, ok: res.ok, data })
  if (!res.ok) {
    // include status for callers to react (401 -> redirect)
    const errMsg = (data && data.message) || res.statusText || `Request failed (${res.status})`
    const err = new Error(errMsg)
    err.status = res.status
    throw err
  }
  return data
}

export const financeAPI = {
  // optional studentId -> GET /api/finance/balance?studentId=...
  getBalance: (studentId) => authFetch(`/finance/balance${studentId ? `?studentId=${encodeURIComponent(studentId)}` : ''}`),
  createTransaction: (tuitionId) => authFetch('/finance/transactions', 'POST', { tuitionId }),
  generateInvoice: (tuitionId) => {
    const token = localStorage.getItem('token') || ''
    return fetch(`${API}/finance/generate-pdf?tuitionId=${encodeURIComponent(tuitionId)}`, {
      headers: { Authorization: token ? `Bearer ${token}` : '' }
    })
  },
  simulatePayment: (transactionId) => authFetch('/finance/simulate-pay', 'POST', { transactionId }),

  // new: fetch recent transactions (server should support this route)
  getTransactionHistory: (limit = 5) => authFetch(`/finance/transactions/history?limit=${limit}`),
  // studentId optional, start/end optional ISO dates
  getTransactions: (studentId, start, end) => {
    const params = new URLSearchParams()
    if (studentId) params.set('studentId', studentId)
    if (start) params.set('start', start)
    if (end) params.set('end', end)
    const q = params.toString()
    return authFetch(`/finance/transactions${q ? `?${q}` : ''}`)
  },
  getReceipt: async (transactionId) => {
    const token = localStorage.getItem('token') || ''
    const res = await fetch(`${API}/finance/receipt?transactionId=${encodeURIComponent(transactionId)}`, { headers: { Authorization: token ? `Bearer ${token}` : '' } })
    if (!res.ok) {
      const txt = await res.text()
      throw new Error(txt || 'Failed to fetch receipt')
    }
    const blob = await res.blob()
    return blob
  },
  exportHistory: async (studentId, opts = {}) => {
    const params = new URLSearchParams()
    if (studentId) params.set('studentId', studentId)
    if (opts.year) params.set('year', opts.year)
    if (opts.start) params.set('start', opts.start)
    if (opts.end) params.set('end', opts.end)
    const token = localStorage.getItem('token') || ''
    return { url: `${API}/finance/export?${params.toString()}`, headers: { Authorization: token ? `Bearer ${token}` : '' } }
  },

  // Financial Reports API
  getFinancialReports: (category = 'all', startDate, endDate, department = 'all') => {
    const params = new URLSearchParams()
    params.set('category', category)
    if (startDate) params.set('startDate', startDate)
    if (endDate) params.set('endDate', endDate)
    if (department) params.set('department', department)
    return authFetch(`/finance/reports?${params.toString()}`)
  },

  // Get generated reports from database
  getGeneratedReports: () => authFetch('/finance/reports/generated'),

  // Generate and save new report
  generateReport: (name, type, category, department, startDate, endDate) =>
    authFetch('/finance/reports/generate', 'POST', {
      name,
      type: type || 'pdf',
      category: category || 'all',
      department: department || 'University Wide',
      startDate,
      endDate
    }),

  // Delete report
  deleteReport: (reportId) => authFetch(`/finance/reports/${reportId}`, 'DELETE')
};