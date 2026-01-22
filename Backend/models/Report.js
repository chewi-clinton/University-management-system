const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['pdf', 'excel', 'csv', 'summary'], default: 'pdf' },
  category: { type: String, enum: ['payroll', 'tuition', 'income', 'expenses', 'all'], default: 'all' },
  department: { type: String, default: 'University Wide' },
  startDate: Date,
  endDate: Date,
  status: { type: String, enum: ['generated', 'pending', 'failed'], default: 'generated' },
  fileUrl: String,
  generatedBy: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Report', reportSchema);
