const mongoose = require('mongoose');
const User = require('../models/User');
const Student = require('../models/Student');
const Tuition = require('../models/Tuition');

const email = process.argv[2];
if (!email) { console.error('Usage: node scripts/showTuitionForUser.js <email>'); process.exit(1); }

(async () => {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/university-management');
  const user = await User.findOne({ email }).lean();
  if (!user) return console.log('User not found');
  const student = await Student.findOne({ userId: user._id }).lean();
  console.log('User:', { id: user._id.toString(), email: user.email });
  console.log('Student record:', student ? { id: student._id.toString(), userId: student.userId } : 'no student profile');
  const tuitions = await Tuition.find({ studentId: student ? student._id : null }).lean();
  const totalDue = tuitions.reduce((s, t) => s + ((t.status !== 'paid') ? (t.amount || 0) : 0), 0);
  console.log('Total due calculated:', totalDue);
  console.table(tuitions.map(t => ({ id: t._id.toString(), amount: t.amount, status: t.status, dueDate: t.dueDate })));
  await mongoose.disconnect();
  process.exit(0);
})();