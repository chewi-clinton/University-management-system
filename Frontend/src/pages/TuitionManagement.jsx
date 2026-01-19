import React, { useState, useEffect } from 'react'
import TopBar from '../components/TopBar'
import StatCard from '../components/StatCard'
import { getTuitionData, getTuitionStats, updateTuitionPayment } from '../services/tuitionService'

export default function TuitionManagement() {
  const [tuitions, setTuitions] = useState([])
  const [stats, setStats] = useState({ pending: 0, overdue: 0, today: 0, overdueCount: 0 })
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchData()
  }, [filter])

  const fetchData = async () => {
    setLoading(true)
    try {
      const tuitionData = await getTuitionData(filter)
      const statsData = await getTuitionStats()
      setTuitions(tuitionData)
      setStats(statsData)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
    setLoading(false)
  }

  const handlePaymentUpdate = async (tuitionId, status) => {
    try {
      await updateTuitionPayment(tuitionId, status)
      fetchData()
    } catch (error) {
      console.error('Error updating payment:', error)
    }
  }

  return (
    <div className="relative flex flex-col min-h-screen w-full bg-background-light dark:bg-background-dark pb-24">
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

      {/* Stats Overview */}
      <div className="w-full overflow-x-auto no-scrollbar pl-4 pb-4">
        <div className="flex gap-4 pr-4 min-w-max">
          <StatCard icon="account_balance_wallet" label="Pending" value={`$${stats.pending?.toLocaleString()}`} className="min-w-[160px]" />
          <StatCard icon="payments" label="Today" value={`$${stats.today?.toLocaleString()}`} className="min-w-[160px]" />
          <StatCard icon="warning" label="Overdue" value={stats.overdueCount} className="min-w-[160px]" />
        </div>
      </div>

      {/* Filter Chips */}
      <div className="sticky top-[73px] z-40 bg-background-light dark:bg-background-dark py-2">
        <div className="flex gap-2 px-4 overflow-x-auto no-scrollbar">
          {['all', 'pending', 'overdue', 'paid'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`shrink-0 h-9 px-4 rounded-full text-sm font-medium font-display transition-colors ${
                filter === status
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                  : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Recent Records Headline */}
      <div className="flex items-center justify-between px-4 py-3 mt-2">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white font-display">Recent Records</h3>
        <button className="text-sm text-primary font-medium font-display hover:text-blue-600">View All</button>
      </div>

      {/* Student Records List */}
      <div className="flex flex-col gap-3 px-4 pb-20">
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : tuitions.length === 0 ? (
          <p className="text-center text-gray-500">No tuition records found</p>
        ) : (
          tuitions.map((tuition) => (
            <div key={tuition._id} className="group relative bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 active:scale-[0.99] transition-all duration-200">
              <div className="flex justify-between items-start mb-3">
                <div className="flex gap-3">
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-full size-12 flex items-center justify-center">
                    <span className="material-symbols-outlined text-gray-400">person</span>
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-gray-900 dark:text-white font-display">{tuition.studentId?.name || 'Unknown'}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-display">ID: {tuition.studentId?.studentId || 'N/A'}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold font-display ${
                  tuition.status === 'paid' ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300' :
                  tuition.status === 'overdue' ? 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300' :
                  'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                }`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  {tuition.status.charAt(0).toUpperCase() + tuition.status.slice(1)}
                </span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700 mt-2">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Amount Due</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white font-display">${tuition.amount?.toLocaleString()}</p>
                </div>
                <button 
                  onClick={() => handlePaymentUpdate(tuition._id, 'paid')}
                  className="px-4 py-2 bg-primary hover:bg-blue-600 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm font-display flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                  Invoice
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-24 right-4 z-40">
        <button className="flex items-center justify-center size-14 bg-primary text-white rounded-full shadow-lg shadow-blue-500/30 active:scale-95 transition-all hover:bg-blue-600">
          <span className="material-symbols-outlined" style={{ fontSize: 28 }}>add</span>
        </button>
      </div>
    </div>
  );
}
