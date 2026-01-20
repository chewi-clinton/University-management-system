const mongoose = require('mongoose');
const Student = require('../models/Student');
const Tuition = require('../models/Tuition');

(async () => {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/university-management');
  const students = await Student.find().lean();
  const missing = [];
  for (const s of students) {
    const count = await Tuition.countDocuments({ studentId: s._id });
    if (count === 0) missing.push({ studentId: s._id.toString(), name: s.name, email: s.email });
  }
  console.log('Students without tuition:', missing.length);
  console.table(missing);
  await mongoose.disconnect();
  process.exit(0);
})();