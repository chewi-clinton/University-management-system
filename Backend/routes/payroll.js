const express = require('express');
const router = express.Router();
const payrollController = require('../controllers/payrollController');
const auth = require('../middleware/auth');

router.get('/', auth, payrollController.getAllPayroll);
router.get('/stats', auth, payrollController.getPayrollStats);
router.post('/', auth, payrollController.createPayroll);
router.put('/:id', auth, payrollController.updatePayrollStatus);

module.exports = router;