const mongoose = require('mongoose');

const leaveRequestSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  requestedBy: String,
  leaveType: { type: String, enum: ['annual', 'sick', 'study', 'unpaid'], required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  duration: { type: Number, required: true }, // calculated in days
  reason: { type: String },
  documentUrl: String, // PDF file path for sick leave certificates
  status: { type: String, enum: ['pending', 'approved', 'denied'], default: 'pending' },
  approvedBy: String,
  approvalReason: String,
  calendarConflict: { type: Boolean, default: false },
  conflictReason: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('LeaveRequest', leaveRequestSchema);
