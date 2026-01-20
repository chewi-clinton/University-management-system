const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Student = require('../models/Student');
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

// GET /api/auth/profile - return authenticated user and attach studentId if available
router.get('/profile', auth, async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id || req.user;
    const user = await User.findById(userId).lean();
    if (!user) return res.status(404).json({ message: 'User not found' });

    const student = await Student.findOne({ userId: user._id }).lean();
    if (student) user.studentId = student._id;

    return res.json(user);
  } catch (err) {
    console.error('GET /api/auth/profile error', err);
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;