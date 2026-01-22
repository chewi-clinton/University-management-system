const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  role: { 
    type: String, 
    enum: ['student', 'finance_officer', 'admin', 'all'],
    default: 'all'
  },
  title: { type: String, required: true },
  body: String,
  category: {
    type: String,
    enum: ['Finance', 'HR', 'Marketing', 'System'],
    default: 'System'
  },
  read: { type: Boolean, default: false },
  // Action metadata for role-specific buttons
  action: {
    type: String,
    enum: ['pay_now', 'review', 'approve', 'view', 'dismiss'],
    default: 'view'
  },
  actionTarget: {
    type: String,
    ref: String // e.g., invoiceId, payrollId, leaveRequestId
  },
  actionPage: String, // e.g., 'payment-checkout', 'payroll-processing'
  // Metadata for context
  meta: {
    studentId: String,
    invoiceId: String,
    payrollMonth: String,
    leaveRequestId: String,
    amount: Number,
    departmentName: String,
    employeeName: String
  },
  urgency: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'low'
  }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);