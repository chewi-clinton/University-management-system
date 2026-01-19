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

module.exports = router;