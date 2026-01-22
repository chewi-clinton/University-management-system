const express = require('express');
const router = express.Router();
const leaveController = require('../controllers/leaveController');
const auth = require('../middleware/auth');

router.get('/balance', auth, leaveController.getLeaveBalance);
router.get('/my-requests', auth, leaveController.getMyLeaveRequests);
router.get('/team-requests', auth, leaveController.getTeamLeaveRequests);
router.get('/pending-count', auth, leaveController.getPendingLeaveCount);
router.post('/request', auth, leaveController.createLeaveRequest);
router.put('/request/:id/approve', auth, leaveController.approveLeaveRequest);
router.put('/request/:id/deny', auth, leaveController.denyLeaveRequest);

module.exports = router;
