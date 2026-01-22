const mongoose = require('mongoose');

const busRegistrationSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  routeId: { type: mongoose.Schema.Types.ObjectId, ref: 'BusRoute', required: true },
  term: String,
  status: { type: String, enum: ['PENDING','ACTIVE','CANCELLED'], default: 'PENDING' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('BusRegistration', busRegistrationSchema);
