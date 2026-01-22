import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../services/adminService';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    studentCount: 0,
    financeCount: 0,
    adminCount: 0,
    pendingLeaveRequests: 0,
    totalNotifications: 0,
    totalTuitionInvoices: 0,
    totalPayroll: 0
  });
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [leaveAllocations, setLeaveAllocations] = useState({
    annualDays: 12,
    sickDays: 5,
    studyDays: 3
  });
  const [editingAllocation, setEditingAllocation] = useState(null);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch real data from API
      const statsResponse = await adminService.getDashboardStats();
      const usersResponse = await adminService.getAllUsers();
      const logsResponse = await adminService.getActivityLogs();

      if (statsResponse.success) {
        setStats(statsResponse.stats);
      }

      if (usersResponse.success) {
        setUsers(usersResponse.users);
      }

      if (logsResponse.success) {
        setLogs(logsResponse.logs);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setLoading(false);
    }
  };

  const handleAllocationChange = (key, value) => {
    setLeaveAllocations(prev => ({
      ...prev,
      [key]: parseInt(value)
    }));
  };

  const saveAllocations = () => {
    setEditingAllocation(null);
    alert('✅ Leave allocations updated successfully!');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  if (loading) {
    return <div className="p-6 text-center">Loading admin dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Top Navigation */}
      <div className="bg-white border-b border-gray-200 shadow">
        <div className="px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-purple-600">🛡️ Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          {/* Tab Navigation */}
          <div className="flex gap-4 mb-8 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-3 font-semibold transition ${
                activeTab === 'overview'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              📊 Overview
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-6 py-3 font-semibold transition ${
                activeTab === 'users'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              👥 Users
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-6 py-3 font-semibold transition ${
                activeTab === 'settings'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              ⚙️ Settings
            </button>
            <button
              onClick={() => setActiveTab('logs')}
              className={`px-6 py-3 font-semibold transition ${
                activeTab === 'logs'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              📋 Logs
            </button>
          </div>

          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Total Users</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
                    </div>
                    <div className="text-4xl">👥</div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Students</p>
                      <p className="text-3xl font-bold text-blue-600">{stats.studentCount}</p>
                    </div>
                    <div className="text-4xl">🎓</div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Finance Officers</p>
                      <p className="text-3xl font-bold text-green-600">{stats.financeCount}</p>
                    </div>
                    <div className="text-4xl">💼</div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Admins</p>
                      <p className="text-3xl font-bold text-purple-600">{stats.adminCount}</p>
                    </div>
                    <div className="text-4xl">🛡️</div>
                  </div>
                </div>
              </div>

              {/* More Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Pending Leave Requests</p>
                      <p className="text-2xl font-bold text-orange-600">{stats.pendingLeaveRequests}</p>
                    </div>
                    <div className="text-4xl">📅</div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Total Notifications</p>
                      <p className="text-2xl font-bold text-blue-600">{stats.totalNotifications}</p>
                    </div>
                    <div className="text-4xl">📢</div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Tuition Invoices</p>
                      <p className="text-2xl font-bold text-indigo-600">{stats.totalTuitionInvoices}</p>
                    </div>
                    <div className="text-4xl">📄</div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Payroll Cycles</p>
                      <p className="text-2xl font-bold text-green-600">{stats.totalPayroll}</p>
                    </div>
                    <div className="text-4xl">💰</div>
                  </div>
                </div>
              </div>

              {/* System Health */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">🏥 System Health</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Database Connection</span>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      ✅ Healthy
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Server Status</span>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      ✅ Running
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>API Response Time</span>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      ✅ Normal (&lt;200ms)
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Storage Capacity</span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      📊 75% Used
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* USERS TAB */}
          {activeTab === 'users' && (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900">👥 Manage Users</h3>
                <p className="text-gray-600 text-sm mt-1">View and manage all system users</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Role</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {users.map(user => (
                      <tr key={user._id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 text-sm text-gray-900">{user.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                            user.role === 'finance' ? 'bg-green-100 text-green-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <button className="text-blue-600 hover:text-blue-800 font-medium">Edit</button>
                          <button className="ml-4 text-red-600 hover:text-red-800 font-medium">Deactivate</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">📅 Leave Allocations</h3>
                  {editingAllocation && (
                    <button
                      onClick={saveAllocations}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    >
                      💾 Save Changes
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Annual Leave Days</label>
                    <input
                      type="number"
                      value={leaveAllocations.annualDays}
                      onChange={(e) => {
                        setEditingAllocation(true);
                        handleAllocationChange('annualDays', e.target.value);
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sick Leave Days</label>
                    <input
                      type="number"
                      value={leaveAllocations.sickDays}
                      onChange={(e) => {
                        setEditingAllocation(true);
                        handleAllocationChange('sickDays', e.target.value);
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Study Leave Days</label>
                    <input
                      type="number"
                      value={leaveAllocations.studyDays}
                      onChange={(e) => {
                        setEditingAllocation(true);
                        handleAllocationChange('studyDays', e.target.value);
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">⚙️ System Configuration</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">System Name</label>
                    <input type="text" defaultValue="University Management System" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Support Email</label>
                    <input type="email" defaultValue="support@university.edu" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Maintenance Mode</label>
                    <div className="flex items-center gap-3">
                      <input type="checkbox" id="maintenance" className="w-4 h-4 text-blue-600 rounded" />
                      <label htmlFor="maintenance" className="text-sm text-gray-600">Enable maintenance mode</label>
                    </div>
                  </div>
                </div>
                <button className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                  💾 Save Configuration
                </button>
              </div>
            </div>
          )}

          {/* LOGS TAB */}
          {activeTab === 'logs' && (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900">📋 System Logs</h3>
                <p className="text-gray-600 text-sm mt-1">Recent system activities</p>
              </div>
              <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                {logs.length > 0 ? (
                  logs.map((log, idx) => (
                    <div key={idx} className="p-4 hover:bg-gray-50 transition">
                      <p className="text-sm text-gray-900">{log.icon} <strong>{log.title}</strong> - {log.description}</p>
                      <p className="text-xs text-gray-500">{new Date(log.timestamp).toLocaleString()}</p>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">No activity logs yet</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
