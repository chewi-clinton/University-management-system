const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const ctrl = require('../controllers/notificationsController');

// Get notifications based on user role
router.get('/', auth, ctrl.getNotifications);

// Get notification summary/stats
router.get('/summary', auth, ctrl.getNotificationSummary);

// Create notification (Finance Officers only)
router.post('/', auth, ctrl.createNotification);

// Mark specific notification as read
router.put('/:notificationId/read', auth, ctrl.markAsRead);

// Mark all notifications as read
router.put('/read/all', auth, ctrl.markAllAsRead);

// Get notifications by role (for testing/admin)
router.get('/role/:role', ctrl.getNotificationsByRole);

module.exports = router;