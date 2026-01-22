const Student = require('../models/Student');
const User = require('../models/User');

// Get student profile
exports.getStudentProfile = async (req, res) => {
  try {
    console.log('[studentController] getStudentProfile called for userId=', req.user && req.user.id)
    let student = await Student.findOne({ userId: req.user.id }).populate('userId');

    // Fallback: some demo/seeded student records may not have `userId` set.
    // Try to locate by the authenticated user's email as a fallback so walletBalance and profile are returned.
    if (!student) {
      const user = await User.findById(req.user.id);
      if (user && user.email) {
        student = await Student.findOne({ email: user.email }).populate('userId');
        console.log('[studentController] fallback lookup by email=', user.email, 'found=', !!student)
      }
    }

    if (!student) {
      return res.status(404).json({ message: 'Student profile not found' });
    }

    console.log('[studentController] returning student id=', student._id, 'walletBalance=', student.walletBalance)
    return res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create student profile
exports.createStudentProfile = async (req, res) => {
  try {
    const { studentId, department } = req.body;
    const exists = await Student.findOne({ userId: req.user.id });
    if (exists) return res.status(400).json({ message: 'Profile already exists' });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const student = new Student({
      userId: req.user.id,
      studentId,
      name: user.name,
      email: user.email,
      department
    });
    await student.save();

    // create initial tuition record using DEFAULT_TUITION from .env (fallback to 367000)
    const DEFAULT_TUITION = Number(process.env.DEFAULT_TUITION || 367000);
    const Tuition = require('../models/Tuition');
    const tuition = new Tuition({
      studentId: student._id,
      amount: DEFAULT_TUITION,
      currency: 'XAF',
      status: 'pending',
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // due in 30 days
    });
    await tuition.save();

    res.status(201).json({ message: 'Student profile created', student, initialTuition: tuition });
  } catch (err) {
    console.error('createStudentProfile error:', err && err.stack ? err.stack : err);
    res.status(500).json({ message: err.message });
  }
};

// Get student tuition records
exports.getStudentTuition = async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user.id });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    const Tuition = require('../models/Tuition');
    const tuitions = await Tuition.find({ studentId: student._id });
    
    res.json(tuitions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};