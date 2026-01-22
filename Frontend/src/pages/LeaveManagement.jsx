import React, { useState, useEffect } from 'react'
import TopBar from '../components/TopBar'
import StatCard from '../components/StatCard'
import { getLeaveBalance, getTeamLeaveRequests, getMyLeaveRequests, approveLeaveRequest, denyLeaveRequest, submitLeaveRequest } from '../services/leaveService'

export default function LeaveManagement() {
  const [activeTab, setActiveTab] = useState('team') // 'team' or 'my'
  const [leaveBalance, setLeaveBalance] = useState({ annualBalance: 0, sickBalance: 0, studyBalance: 0 })
  const [teamRequests, setTeamRequests] = useState([])
  const [myRequests, setMyRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('pending')
  
  // Modal states
  const [showNewRequestModal, setShowNewRequestModal] = useState(false)
  const [showDenyModal, setShowDenyModal] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [denyReason, setDenyReason] = useState('')
  
  // Form states
  const [formData, setFormData] = useState({
    leaveType: 'annual',
    startDate: '',
    endDate: '',
    reason: '',
    documentUrl: ''
  })

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (activeTab === 'team') {
      fetchTeamRequests()
    } else {
      fetchMyRequests()
    }
  }, [activeTab, filterStatus])

  const fetchData = async () => {
    setLoading(true)
    try {
      const balance = await getLeaveBalance()
      if (balance) setLeaveBalance(balance)
    } catch (error) {
      console.error('Error fetching leave balance:', error)
    }
    setLoading(false)
  }

  const fetchTeamRequests = async () => {
    try {
      const data = await getTeamLeaveRequests(filterStatus)
      setTeamRequests(data || [])
    } catch (error) {
      console.error('Error fetching team requests:', error)
    }
  }

  const fetchMyRequests = async () => {
    try {
      const data = await getMyLeaveRequests()
      setMyRequests(data || [])
    } catch (error) {
      console.error('Error fetching my requests:', error)
    }
  }

  const handleSubmitRequest = async () => {
    if (!formData.startDate || !formData.endDate) {
      alert('Please select start and end dates')
      return
    }

    try {
      await submitLeaveRequest(formData)
      alert('Leave request submitted successfully!')
      setShowNewRequestModal(false)
      setFormData({ leaveType: 'annual', startDate: '', endDate: '', reason: '', documentUrl: '' })
      await fetchMyRequests()
    } catch (error) {
      alert('Failed to submit leave request')
    }
  }

  const handleApprove = async (requestId) => {
    try {
      await approveLeaveRequest(requestId, 'Approved')
      alert('Leave request approved')
      await fetchTeamRequests()
    } catch (error) {
      alert('Failed to approve request')
    }
  }

  const handleDeny = async () => {
    if (!denyReason.trim()) {
      alert('Please provide a reason for denial')
      return
    }

    try {
      await denyLeaveRequest(selectedRequest._id, denyReason)
      alert('Leave request denied')
      setShowDenyModal(false)
      setDenyReason('')
      await fetchTeamRequests()
    } catch (error) {
      alert('Failed to deny request')
    }
  }

  const getLeaveTypeColor = (type) => {
    const colors = {
      annual: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
      sick: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
      study: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
      unpaid: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
    }
    return colors[type] || colors.annual
  }

  const getStatusBadgeColor = (status) => {
    const colors = {
      pending: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300',
      approved: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300',
      denied: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
    }
    return colors[status] || colors.pending
  }

  const requests = activeTab === 'team' ? teamRequests : myRequests
  const filteredRequests = activeTab === 'team' 
    ? requests.filter(r => filterStatus === 'all' || r.status === filterStatus)
    : requests

  return (
    <div className="relative flex flex-col w-full min-h-screen bg-background-light dark:bg-background-dark pb-24">
      <TopBar title="Leave Management" />

      {/* Leave Balance Cards */}
      <div className="flex gap-3 px-4 py-4 overflow-x-auto no-scrollbar">
        <StatCard 
          icon="calendar_month" 
          label="Annual Leave" 
          value={`${leaveBalance.annualBalance || 0} Days`}
          className="min-w-[150px]"
        />
        <StatCard 
          icon="healing" 
          label="Sick Leave" 
          value={`${leaveBalance.sickBalance || 0} Days`}
          className="min-w-[150px]"
        />
        <StatCard 
          icon="school" 
          label="Study Leave" 
          value={`${leaveBalance.studyBalance || 0} Days`}
          className="min-w-[150px]"
        />
      </div>

      {/* Tab Toggle */}
      <div className="flex gap-2 px-4 py-2 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('team')}
          className={`px-4 py-2 font-bold transition-colors ${
            activeTab === 'team'
              ? 'border-b-2 border-primary text-primary'
              : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          Team Requests
        </button>
        <button
          onClick={() => setActiveTab('my')}
          className={`px-4 py-2 font-bold transition-colors ${
            activeTab === 'my'
              ? 'border-b-2 border-primary text-primary'
              : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          My Leave
        </button>
      </div>

      {/* Filters - Show only for team tab */}
      {activeTab === 'team' && (
        <div className="flex gap-2 px-4 py-3 overflow-x-auto no-scrollbar">
          {['all', 'pending', 'approved', 'denied'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`shrink-0 px-4 py-1 rounded-full text-sm font-medium transition-colors ${
                filterStatus === status
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      )}

      {/* Requests List */}
      <div className="flex-1 px-4 py-4 space-y-3">
        {filteredRequests.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            {activeTab === 'team' ? 'No team requests found' : 'No leave requests submitted'}
          </p>
        ) : (
          filteredRequests.map(request => (
            <div 
              key={request._id} 
              className="bg-white dark:bg-surface-dark rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-bold text-text-main dark:text-white">
                    {request.employeeId?.name || 'Unknown'}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {request.employeeId?.position}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(request.status)}`}>
                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                </span>
              </div>

              {/* Leave Details */}
              <div className="flex gap-2 mb-3 text-sm">
                <span className={`px-2 py-1 rounded-md text-xs font-medium ${getLeaveTypeColor(request.leaveType)}`}>
                  {request.leaveType.charAt(0).toUpperCase() + request.leaveType.slice(1)}
                </span>
                <span className="text-gray-600 dark:text-gray-400">
                  {request.duration} Days • {new Date(request.startDate).toLocaleDateString()} to {new Date(request.endDate).toLocaleDateString()}
                </span>
              </div>

              {/* Calendar Conflict Warning */}
              {request.calendarConflict && (
                <div className="mb-3 p-2 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700 rounded-lg">
                  <p className="text-xs font-semibold text-orange-700 dark:text-orange-300">
                    ⚠️ Calendar Conflict: {request.conflictReason}
                  </p>
                </div>
              )}

              {/* Reason */}
              {request.reason && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  <strong>Reason:</strong> {request.reason}
                </p>
              )}

              {/* Document Link */}
              {request.documentUrl && (
                <div className="mb-3">
                  <a 
                    href={request.documentUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-sm">description</span>
                    View Certificate
                  </a>
                </div>
              )}

              {/* Action Buttons - Only for team tab when pending */}
              {activeTab === 'team' && request.status === 'pending' && (
                <div className="flex gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => handleApprove(request._id)}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-bold text-sm transition-colors"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => {
                      setSelectedRequest(request)
                      setShowDenyModal(true)
                    }}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-bold text-sm transition-colors"
                  >
                    Deny
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => setShowNewRequestModal(true)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-primary hover:bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center text-2xl transition-colors z-40"
      >
        <span className="material-symbols-outlined">add</span>
      </button>

      {/* New Request Modal */}
      {showNewRequestModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div 
            className="w-full bg-white dark:bg-surface-dark rounded-t-2xl p-6 space-y-4 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-text-main dark:text-white">New Leave Request</h3>
              <button
                onClick={() => setShowNewRequestModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Leave Type Selection */}
            <div>
              <label className="block text-sm font-bold mb-2 text-text-main dark:text-white">Leave Type</label>
              <select
                value={formData.leaveType}
                onChange={(e) => setFormData({ ...formData, leaveType: e.target.value })}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 dark:bg-gray-800 dark:text-white"
              >
                <option value="annual">Annual Leave</option>
                <option value="sick">Sick Leave</option>
                <option value="study">Study Leave</option>
                <option value="unpaid">Unpaid Leave</option>
              </select>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-bold mb-2 text-text-main dark:text-white">Start Date</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 dark:bg-gray-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2 text-text-main dark:text-white">End Date</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>

            {/* Reason */}
            <div>
              <label className="block text-sm font-bold mb-2 text-text-main dark:text-white">Reason</label>
              <textarea
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                placeholder="Provide reason for leave..."
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 dark:bg-gray-800 dark:text-white"
                rows="3"
              />
            </div>

            {/* Document Upload (for sick leave) */}
            {formData.leaveType === 'sick' && (
              <div>
                <label className="block text-sm font-bold mb-2 text-text-main dark:text-white">Medical Certificate</label>
                <input
                  type="text"
                  placeholder="Document URL or file path"
                  value={formData.documentUrl}
                  onChange={(e) => setFormData({ ...formData, documentUrl: e.target.value })}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 dark:bg-gray-800 dark:text-white"
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4">
              <button
                onClick={() => setShowNewRequestModal(false)}
                className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white py-2 rounded-lg font-bold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitRequest}
                className="flex-1 bg-primary text-white py-2 rounded-lg font-bold hover:bg-blue-600 transition-colors"
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Deny Reason Modal */}
      {showDenyModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 max-w-md w-full space-y-4">
            <h3 className="text-xl font-bold text-text-main dark:text-white">Deny Leave Request</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Please provide a reason for denying {selectedRequest?.employeeId?.name}'s leave request.
            </p>
            <textarea
              value={denyReason}
              onChange={(e) => setDenyReason(e.target.value)}
              placeholder="Enter reason for denial..."
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 dark:bg-gray-800 dark:text-white"
              rows="4"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setShowDenyModal(false)}
                className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white py-2 rounded-lg font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleDeny}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-bold transition-colors"
              >
                Confirm Denial
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
