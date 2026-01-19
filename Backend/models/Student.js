const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  studentId: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  department: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  profileImage: String,
  enrollmentDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Student', studentSchema);