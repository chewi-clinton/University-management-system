const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  employeeId: { type: String, unique: true, required: true },
  department: { type: String, required: true },
  position: { type: String, required: true },
  salary: { type: Number, required: true },
  email: { type: String, required: true },
  phone: String,
  profileImage: String,
  hireDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Employee', employeeSchema);