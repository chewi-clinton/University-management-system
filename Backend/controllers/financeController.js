const Tuition = require('../models/Tuition');
const Student = require('../models/Student');
const Transaction = require('../models/Transaction');
const PDFDocument = require('pdfkit');

exports.getBalance = async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user.id });
    if (!student) return res.status(404).json({ message: 'Student not found' });
    const tuitions = await Tuition.find({ studentId: student._id });
    const totalDue = tuitions.reduce((s, t) => s + ((t.status !== 'paid') ? (t.amount||0) : 0), 0);
    res.json({ studentId: student._id, totalDue, tuitions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.createTransaction = async (req, res) => {
  try {
    const { tuitionId } = req.body;
    const student = await Student.findOne({ userId: req.user.id });
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const tuition = await Tuition.findById(tuitionId);
    if (!tuition) return res.status(404).json({ message: 'Tuition not found' });

    const tx = new Transaction({
      studentId: student._id,
      tuitionId: tuition._id,
      amount: tuition.amount,
      metadata: { initiatedBy: req.user.id }
    });
    await tx.save();

    // In real implementation create payment intent with provider and set providerUrl
    // For now return a fake providerUrl that the frontend can open
    tx.providerUrl = `${process.env.FRONTEND_URL}/mock-pay/${tx._id}`;
    await tx.save();

    res.status(201).json({ transactionId: tx._id, providerUrl: tx.providerUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.generateInvoicePDF = async (req, res) => {
  try {
    let PDFDocument;
    try {
      PDFDocument = require('pdfkit');
    } catch (e) {
      return res.status(500).json({ message: 'PDF generator not installed. Run `npm install pdfkit` in Backend.' });
    }

    const { tuitionId } = req.query;
    const student = await Student.findOne({ userId: req.user.id });
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const tuition = await Tuition.findById(tuitionId);
    if (!tuition) return res.status(404).json({ message: 'Tuition not found' });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${tuitionId}.pdf`);

    const doc = new PDFDocument({ size: 'A4', margin: 50 });

    // Pipe first, then write content, then end
    doc.pipe(res);

    doc.fontSize(20).text('Invoice', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Student: ${student.name || student.email}`);
    doc.text(`Student ID: ${student.studentId || ''}`);
    doc.text(`Tuition Ref: ${tuition._id}`);
    doc.text(`Amount: XAF ${Number(tuition.amount || 0).toLocaleString()}`);
    doc.text(`Status: ${tuition.status}`);
    doc.text(`Due Date: ${tuition.dueDate ? new Date(tuition.dueDate).toLocaleDateString() : '—'}`);
    doc.moveDown();
    doc.text('Thank you.', { align: 'left' });

    doc.end();
    // do not call res.end() here; pdfkit stream ends the response
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.simulatePayment = async (req, res) => {
  try {
    const { transactionId } = req.body;
    const tx = await Transaction.findById(transactionId);
    if (!tx) return res.status(404).json({ message: 'Transaction not found' });

    // mark transaction success
    tx.status = 'SUCCESS';
    tx.paidAt = new Date();
    await tx.save();

    // update tuition
    if (tx.tuitionId) {
      const tuition = await Tuition.findById(tx.tuitionId);
      if (tuition) {
        tuition.status = 'paid';
        tuition.paidDate = new Date();
        await tuition.save();
      }
    }

    // respond with updated balance
    const student = await Student.findById(tx.studentId);
    const tuitions = await Tuition.find({ studentId: student._id });
    const totalDue = tuitions.reduce((s, t) => s + ((t.status !== 'paid') ? (t.amount||0) : 0), 0);

    res.json({ message: 'Payment simulated', transaction: tx, totalDue, tuitions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};