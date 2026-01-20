const Student = require('../models/Student');
const User = require('../models/User');

// Get student profile
exports.getStudentProfile = async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user.id }).populate('userId');
    
    if (!student) {
      return res.status(404).json({ message: 'Student profile not found' });
    }
    
    res.json(student);
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