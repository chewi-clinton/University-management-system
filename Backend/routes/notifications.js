const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const ctrl = require('../controllers/notificationController');

router.get('/unread-count', auth, ctrl.getUnreadCount);
router.get('/', auth, ctrl.list);
router.post('/mark-read', auth, ctrl.markRead);

module.exports = router;