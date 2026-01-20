const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const supportController = require('../controllers/supportController');

router.get('/messages', auth, supportController.getMessages);
router.post('/messages', auth, supportController.sendMessage);
router.post('/messages/mark-read', auth, supportController.markRead);

module.exports = router;