const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  tuitionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tuition' },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'XAF' },
  status: { type: String, enum: ['PENDING','SUCCESS','FAILED'], default: 'PENDING' },
  providerUrl: String, // payment processor url (if any)
  createdAt: { type: Date, default: Date.now },
  paidAt: Date,
  metadata: Object
});

module.exports = mongoose.model('Transaction', transactionSchema);