const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const auth = require('../middleware/auth');

router.get('/profile', auth, studentController.getStudentProfile);
router.post('/profile', auth, studentController.createStudentProfile);
router.get('/tuition', auth, studentController.getStudentTuition);

module.exports = router;