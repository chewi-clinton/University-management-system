const mongoose = require('mongoose');
const Student = require('../models/Student');
const Tuition = require('../models/Tuition');

(async () => {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/university-management');
  const DEFAULT_TUITION = Number(process.env.DEFAULT_TUITION || 367000);
  const students = await Student.find().lean();
  let created = 0;
  for (const s of students) {
    const existing = await Tuition.countDocuments({ studentId: s._id });
    if (existing === 0) {
      const t = new Tuition({
        studentId: s._id,
        amount: DEFAULT_TUITION,
        currency: 'XAF',
        status: 'pending',
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      });
      await t.save();
      created++;
      console.log('Created tuition for', s.email, t._id.toString());
    }
  }
  console.log('Total created:', created);
  await mongoose.disconnect();
  process.exit(0);
})();