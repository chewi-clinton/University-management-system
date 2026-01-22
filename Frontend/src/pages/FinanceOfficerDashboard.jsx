import React, { useEffect, useState } from 'react'
import { getCurrentUser, getToken } from '../services/authService'
import { useNavigate } from 'react-router-dom'
import TopBar from '../components/TopBar'
import Sidebar from '../components/Sidebar'

export default function FinanceOfficerDashboard() {
  const navigate = useNavigate()
  const user = getCurrentUser()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCollected: 0,
    totalPending: 0,
    totalBusRevenue: 0
  })
  const [recentTransactions, setRecentTransactions] = useState([])

  useEffect(() => {
    if (!user || user.role !== 'finance') {
      navigate('/')
      return
    }

    const loadData = async () => {
      setLoading(true)
      try {
        const token = getToken()
        // Fetch finance statistics
        const res = await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:5000'}/api/finance/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (res.ok) {
          const data = await res.json()
          setStats(data)
        }

        // Fetch recent transactions
        const txRes = await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:5000'}/api/finance/transactions?limit=10`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (txRes.ok) {
          const txData = await txRes.json()
          setRecentTransactions(Array.isArray(txData) ? txData.slice(0, 10) : (txData.transactions || []).slice(0, 10))
        }
      } catch (e) {
        console.error('Failed to load finance data', e)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [user, navigate])

  const formatCurrency = (val) => `XAF ${Number(val || 0).toLocaleString()}`

  return (
    <div className="flex min-h-screen bg-background-light dark:bg-background-dark">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <TopBar title="Finance Officer Dashboard" />

        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-gray-500">Loading finance data...</div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-6xl mx-auto">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white dark:bg-surface-dark rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-2">Total Students</div>
                  <div className="text-3xl font-bold text-primary">{stats.totalStudents}</div>
                </div>
                <div className="bg-white dark:bg-surface-dark rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-2">Total Collected</div>
                  <div className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalCollected)}</div>
                </div>
                <div className="bg-white dark:bg-surface-dark rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-2">Total Pending</div>
                  <div className="text-2xl font-bold text-orange-600">{formatCurrency(stats.totalPending)}</div>
                </div>
                <div className="bg-white dark:bg-surface-dark rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-2">Bus Revenue</div>
                  <div className="text-2xl font-bold text-blue-600">{formatCurrency(stats.totalBusRevenue)}</div>
                </div>
              </div>

              {/* Recent Transactions */}
              <div className="bg-white dark:bg-surface-dark rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-bold text-primary dark:text-white">Recent Transactions</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left p-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Date</th>
                        <th className="text-left p-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Type</th>
                        <th className="text-left p-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Amount</th>
                        <th className="text-left p-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentTransactions.length === 0 ? (
                        <tr>
                          <td colSpan="4" className="p-4 text-center text-gray-500">No transactions found</td>
                        </tr>
                      ) : (
                        recentTransactions.map((tx) => (
                          <tr key={tx._id || tx.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                            <td className="p-4 text-sm">{new Date(tx.date || tx.createdAt).toLocaleDateString()}</td>
                            <td className="p-4 text-sm font-medium">{tx.category || tx.type || 'Payment'}</td>
                            <td className="p-4 text-sm font-semibold">{formatCurrency(tx.amount)}</td>
                            <td className="p-4 text-sm">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                String(tx.status).toLowerCase() === 'success' ? 'bg-green-100 text-green-800' :
                                String(tx.status).toLowerCase() === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {tx.status || 'Pending'}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
