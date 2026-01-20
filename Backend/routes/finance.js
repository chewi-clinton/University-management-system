const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const financeController = require('../controllers/financeController');

router.get('/balance', auth, financeController.getBalance);
router.get('/transactions', auth, financeController.getTransactions);
router.post('/transactions', auth, financeController.createTransaction);
router.get('/generate-pdf', auth, financeController.generateInvoicePDF);
router.get('/receipt', auth, financeController.generateReceiptPDF);
router.get('/export', auth, financeController.exportTransactions);
router.post('/simulate-pay', auth, financeController.simulatePayment);

module.exports = router;