const mongoose = require('mongoose');

const payrollSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  period: { type: String, required: true }, // e.g., "October 2023"
  baseSalary: { type: Number, required: true },
  deductions: { type: Number, default: 0 },
  netPay: { type: Number, required: true },
  status: { type: String, enum: ['ready', 'flagged', 'approved', 'paid'], default: 'ready' },
  dueDate: { type: Date, required: true },
  paidDate: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Payroll', payrollSchema);