const mongoose = require('mongoose');

const tuitionSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'overdue', 'paid'], default: 'pending' },
  dueDate: { type: Date, required: true },
  paidDate: Date,
  paymentMethod: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Tuition', tuitionSchema);