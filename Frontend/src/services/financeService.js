const API = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api'

const authFetch = async (path, method = 'GET', body) => {
  const token = localStorage.getItem('token') || ''
  const res = await fetch(`${API}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  })
  // try to parse JSON safely
  const text = await res.text()
  let data = null
  try { data = text ? JSON.parse(text) : null } catch (e) { data = text }
  if (!res.ok) throw new Error((data && data.message) || res.statusText || 'Request failed')
  return data
}

export const financeAPI = {
  // optional studentId -> GET /api/finance/balance?studentId=...
  getBalance: (studentId) => authFetch(`/finance/balance${studentId ? `?studentId=${encodeURIComponent(studentId)}` : ''}`),
  createTransaction: (tuitionId) => authFetch('/finance/transactions', 'POST', { tuitionId }),
  generateInvoice: (tuitionId) => fetch(`${API}/finance/generate-pdf?tuitionId=${tuitionId}`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  }),
  simulatePayment: (transactionId) => authFetch('/finance/simulate-pay', 'POST', { transactionId }),

  // new: fetch recent transactions (server should support this route)
  getTransactionHistory: (limit = 5) => authFetch(`/finance/transactions/history?limit=${limit}`),
  getTransactions: (studentId) => authFetch(`/finance/transactions${studentId ? `?studentId=${encodeURIComponent(studentId)}` : ''}`),
};