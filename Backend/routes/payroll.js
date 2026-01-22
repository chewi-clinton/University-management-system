const express = require('express');
const router = express.Router();
const payrollController = require('../controllers/payrollController');
const auth = require('../middleware/auth');

// Protected routes
router.get('/', payrollController.getAllPayroll);
router.get('/stats', payrollController.getPayrollStats);
router.post('/', auth, payrollController.createPayroll);
router.put('/:id', auth, payrollController.updatePayrollStatus);

module.exports = router;