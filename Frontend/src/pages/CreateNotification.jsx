import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { notificationService } from '../services/notificationService';

export default function CreateNotification() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    body: '',
    role: 'student',
    category: 'Finance',
    action: 'view',
    actionTarget: '',
    actionPage: '',
    urgency: 'medium',
    meta: {}
  });

  const [metaKey, setMetaKey] = useState('');
  const [metaValue, setMetaValue] = useState('');

  const categories = ['Finance', 'HR', 'Marketing', 'System'];
  const roles = ['student', 'finance_officer', 'admin', 'all'];
  const actions = ['pay_now', 'review', 'approve', 'view', 'dismiss'];
  const urgencies = ['low', 'medium', 'high', 'critical'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addMetaField = () => {
    if (metaKey.trim() && metaValue.trim()) {
      setFormData(prev => ({
        ...prev,
        meta: {
          ...prev.meta,
          [metaKey]: metaValue
        }
      }));
      setMetaKey('');
      setMetaValue('');
    }
  };

  const removeMetaField = (key) => {
    setFormData(prev => ({
      ...prev,
      meta: Object.fromEntries(
        Object.entries(prev.meta).filter(([k]) => k !== key)
      )
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const payload = {
        ...formData,
        actionTarget: formData.actionTarget || null,
        actionPage: formData.actionPage || null
      };

      const response = await notificationService.createNotification(payload);
      
      if (response.success) {
        setSuccess(`✅ Notification sent to ${formData.role} users!`);
        setFormData({
          title: '',
          body: '',
          role: 'student',
          category: 'Finance',
          action: 'view',
          actionTarget: '',
          actionPage: '',
          urgency: 'medium',
          meta: {}
        });

        setTimeout(() => {
          navigate('/finance/notifications');
        }, 2000);
      }
    } catch (err) {
      setError(err.message || 'Failed to create notification');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            📢 Create Notification
          </h1>
          <p className="text-gray-600">
            Send notifications to students and other roles
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Success Alert */}
        {success && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {success}
          </div>
        )}

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8 space-y-6">
          
          {/* Basic Information */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">📝 Basic Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Your tuition invoice is ready"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Body *
                </label>
                <textarea
                  name="body"
                  value={formData.body}
                  onChange={handleInputChange}
                  placeholder="Enter notification message"
                  required
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Targeting Options */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">🎯 Targeting & Category</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Send To *
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {roles.map(r => (
                    <option key={r} value={r}>
                      {r.charAt(0).toUpperCase() + r.slice(1).replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Action & Urgency */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">⚡ Action & Priority</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Action Button
                </label>
                <select
                  name="action"
                  value={formData.action}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {actions.map(act => (
                    <option key={act} value={act}>
                      {act.charAt(0).toUpperCase() + act.slice(1).replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Urgency
                </label>
                <select
                  name="urgency"
                  value={formData.urgency}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {urgencies.map(urg => (
                    <option key={urg} value={urg}>
                      {urg.charAt(0).toUpperCase() + urg.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Navigation Page
                </label>
                <input
                  type="text"
                  name="actionPage"
                  value={formData.actionPage}
                  onChange={handleInputChange}
                  placeholder="e.g., /payment-checkout"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Action Target ID
              </label>
              <input
                type="text"
                name="actionTarget"
                value={formData.actionTarget}
                onChange={handleInputChange}
                placeholder="e.g., invoice ID, payroll ID"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Metadata */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">📋 Additional Information</h2>
            
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={metaKey}
                  onChange={(e) => setMetaKey(e.target.value)}
                  placeholder="Key (e.g., amount, employeeName)"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="text"
                  value={metaValue}
                  onChange={(e) => setMetaValue(e.target.value)}
                  placeholder="Value"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={addMetaField}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                  Add
                </button>
              </div>

              {/* Display added metadata */}
              {Object.entries(formData.meta).length > 0 && (
                <div className="space-y-2">
                  {Object.entries(formData.meta).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex justify-between items-center p-3 bg-gray-100 rounded-lg"
                    >
                      <span className="text-sm">
                        <strong>{key}:</strong> {String(value)}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeMetaField(key)}
                        className="text-red-500 hover:text-red-700 text-sm font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : '📤 Send Notification'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/notifications')}
              className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition"
            >
              Cancel
            </button>
          </div>
        </form>

        {/* Help Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-3">💡 Tips</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>• <strong>Title:</strong> Keep it short and descriptive (20-50 characters)</li>
            <li>• <strong>Send To:</strong> Select who should see this notification</li>
            <li>• <strong>Action:</strong> Choose what button appears (Pay Now, Review, Approve, etc.)</li>
            <li>• <strong>Urgency:</strong> Higher urgency shows with more prominent colors</li>
            <li>• <strong>Metadata:</strong> Add context like amount, employee name, or department</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
