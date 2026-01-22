const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const adminCtrl = require('../controllers/adminController');

// Get dashboard statistics
router.get('/stats', auth, adminCtrl.getDashboardStats);

// Get all users
router.get('/users', auth, adminCtrl.getAllUsers);

// Get activity logs
router.get('/logs', auth, adminCtrl.getActivityLogs);

module.exports = router;
