const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const financeController = require('../controllers/financeController');

router.get('/balance', auth, financeController.getBalance);
router.get('/stats', auth, financeController.getStats);
router.get('/reports', auth, financeController.getFinancialReports);
router.get('/reports/generated', financeController.getGeneratedReports);
router.post('/reports/generate', financeController.generateReport);
router.delete('/reports/:id', auth, financeController.deleteReport);
router.get('/transactions', auth, financeController.getTransactions);
router.post('/transactions', auth, financeController.createTransaction);
router.get('/generate-pdf', auth, financeController.generateInvoicePDF);
router.get('/receipt', auth, financeController.generateReceiptPDF);
router.get('/export', auth, financeController.exportTransactions);
router.post('/simulate-pay', auth, financeController.simulatePayment);

module.exports = router;