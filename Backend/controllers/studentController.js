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
    
    // Check if student already exists
    let student = await Student.findOne({ userId: req.user.id });
    if (student) {
      return res.status(400).json({ message: 'Student profile already exists' });
    }
    
    // Get user details
    const user = await User.findById(req.user.id);
    
    student = new Student({
      userId: req.user.id,
      studentId,
      name: user.name,
      email: user.email,
      department
    });
    
    await student.save();
    res.status(201).json({ message: 'Student profile created', student });
  } catch (error) {
    res.status(500).json({ message: error.message });
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