const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Get all students
router.get('/', auth, async (req, res) => {
  try {
    const Student = require('../models/Student');
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create student
router.post('/', auth, async (req, res) => {
  try {
    const Student = require('../models/Student');
    const student = new Student(req.body);
    await student.save();
    res.status(201).json({ message: 'Student created', student });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Public debug endpoint: set wallet balance for a student by email
router.post('/public/seed-wallet', async (req, res) => {
  try {
    const { email, walletBalance } = req.body;
    if (!email) return res.status(400).json({ message: 'email required' });
    const Student = require('../models/Student');
    const student = await Student.findOne({ email });
    if (!student) return res.status(404).json({ message: 'student not found' });
    student.walletBalance = Number(walletBalance || 0);
    await student.save();
    res.json({ message: 'seeded', student });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;