const mongoose = require('mongoose');

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/university-management');

    const User = require('../models/User');
    const Student = require('../models/Student');
    const Tuition = require('../models/Tuition');

    const DEFAULT_TUITION = Number(process.env.DEFAULT_TUITION || 367000);

    const users = await User.find({ role: 'student' }).lean();
    const createdStudents = [];
    const createdTuitions = [];

    for (const u of users) {
      let student = await Student.findOne({ userId: u._id });
      if (!student) {
        // ensure required fields are present (provide a default department)
        student = await Student.create({
          userId: u._id,
          studentId: `STU${Date.now().toString().slice(-6)}`,
          name: u.name || u.email,
          email: u.email,
          department: u.department && u.department.trim() ? u.department : 'Undeclared'
        });
        createdStudents.push({ email: u.email, studentId: student._id.toString() });
        console.log('Created student profile for', u.email);
      }

      const tuitionCount = await Tuition.countDocuments({ studentId: student._id });
      if (tuitionCount === 0) {
        const t = await Tuition.create({
          studentId: student._id,
          amount: DEFAULT_TUITION,
          currency: 'XAF',
          status: 'pending',
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        });
        createdTuitions.push({ email: u.email, tuitionId: t._id.toString(), amount: t.amount });
        console.log('Created tuition for', u.email, '->', t._id.toString());
      }
    }

    console.log('Summary:');
    console.log('Students created:', createdStudents.length);
    console.table(createdStudents);
    console.log('Tuitions created:', createdTuitions.length);
    console.table(createdTuitions);

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('sync error:', err && err.stack ? err.stack : err);
    process.exit(1);
  }
})();