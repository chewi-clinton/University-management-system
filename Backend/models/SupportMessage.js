const mongoose = require('mongoose');

const supportMessageSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  from: { type: String, enum: ['student','admin','system'], default: 'student' },
  text: { type: String, required: true },
  read: { type: Boolean, default: false },
  metadata: Object
}, { timestamps: true });

module.exports = mongoose.model('SupportMessage', supportMessageSchema);