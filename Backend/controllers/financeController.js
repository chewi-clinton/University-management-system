const Tuition = require('../models/Tuition');
const Student = require('../models/Student');
const Transaction = require('../models/Transaction');
const PDFDocument = require('pdfkit');

exports.getBalance = async (req, res) => {
  try {
    // Allow querying by studentId for admin/finance users or when the requester
    // is asking for their own student record. If no studentId provided, resolve
    // the student from the authenticated user (normal student flow).
    const queryStudentId = req.query.studentId;
    let student;
    if (queryStudentId) {
      // only allow arbitrary studentId for privileged roles
      if (req.user && (req.user.role === 'admin' || req.user.role === 'finance')) {
        student = await Student.findById(queryStudentId);
      } else {
        // if unprivileged user passed studentId, only allow if it matches their own student record
        const own = await Student.findOne({ userId: req.user.id });
        if (own && own._id.toString() === queryStudentId.toString()) student = own;
      }
    } else {
      student = await Student.findOne({ userId: req.user.id });
    }

    if (!student) return res.status(404).json({ message: 'Student not found' });

    const tuitions = await Tuition.find({ studentId: student._id });

    // Ensure amounts are numeric and only include non-paid tuitions
    const totalDue = tuitions.reduce((sum, t) => {
      const amt = Number(t.amount || 0) || 0;
      const isPaid = (t.status || '').toString().toLowerCase() === 'paid';
      return sum + (isPaid ? 0 : amt);
    }, 0);

    console.log('[financeController.getBalance] student:', student._id, 'totalDue:', totalDue, 'count:', tuitions.length);
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

// GET /api/finance/transactions?studentId=...
exports.getTransactions = async (req, res) => {
  try {
    const queryStudentId = req.query.studentId;
    const start = req.query.start ? new Date(req.query.start) : null;
    const end = req.query.end ? new Date(req.query.end) : null;

    let studentId;
    if (queryStudentId) {
      if (req.user && (req.user.role === 'admin' || req.user.role === 'finance')) {
        studentId = queryStudentId;
      } else {
        const own = await Student.findOne({ userId: req.user.id });
        if (own && own._id.toString() === queryStudentId.toString()) studentId = queryStudentId;
      }
    } else {
      const own = await Student.findOne({ userId: req.user.id });
      if (!own) return res.status(404).json({ message: 'Student not found' });
      studentId = own._id;
    }

    if (!studentId) return res.status(403).json({ message: 'Forbidden' });

    // Fetch invoices (tuitions) and payments (transactions) and merge
    const tuitionFilter = { studentId };
    const txFilter = { studentId };
    if (start) {
      tuitionFilter.createdAt = { ...(tuitionFilter.createdAt || {}), $gte: start };
      txFilter.createdAt = { ...(txFilter.createdAt || {}), $gte: start };
    }
    if (end) {
      // include whole end day
      const dayEnd = new Date(end);
      dayEnd.setHours(23,59,59,999);
      tuitionFilter.createdAt = { ...(tuitionFilter.createdAt || {}), $lte: dayEnd };
      txFilter.createdAt = { ...(txFilter.createdAt || {}), $lte: dayEnd };
    }

    const tuitions = await Tuition.find(tuitionFilter).lean();
    const txs = await Transaction.find(txFilter).lean();

    // Map to unified ledger items
    const invoices = tuitions.map(t => ({
      _id: t._id,
      type: 'invoice',
      date: t.createdAt || t.dueDate,
      description: t.description || 'Tuition',
      category: t.category || 'Tuition',
      amount: Number(t.amount || 0),
      status: t.status,
      tuitionId: t._id,
      raw: t
    }));

    const payments = txs.map(p => ({
      _id: p._id,
      type: 'payment',
      date: p.paidAt || p.createdAt,
      description: p.description || (p.metadata && p.metadata.note) || 'Payment',
      category: p.category || 'Payment',
      amount: Number(p.amount || 0),
      status: p.status,
      transactionId: p._id,
      metadata: p.metadata || {},
      raw: p
    }));

    const combined = [...invoices, ...payments].sort((a,b) => new Date(b.date || 0) - new Date(a.date || 0));
    res.json(combined);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// GET /api/finance/receipt?transactionId=...
exports.generateReceiptPDF = async (req, res) => {
  try {
    const { transactionId } = req.query;
    if (!transactionId) return res.status(400).json({ message: 'transactionId required' });

    const tx = await Transaction.findById(transactionId).lean();
    if (!tx) return res.status(404).json({ message: 'Transaction not found' });

    const student = await Student.findById(tx.studentId).lean();
    if (!student) return res.status(404).json({ message: 'Student not found' });
    // Try to include tuition breakdown if available
    let tuition = null;
    if (tx.tuitionId) {
      try { tuition = await Tuition.findById(tx.tuitionId).lean(); } catch (e) { /* ignore */ }
    }

    console.log(`[financeController.generateReceiptPDF] transaction ${transactionId} student ${student._id} amount ${tx.amount} status ${tx.status}`);

    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=receipt-${transactionId}.pdf`);
    doc.pipe(res);

    // Header
    doc.fontSize(18).text(process.env.UNIVERSITY_NAME || 'ICT UNIVERSITY', { align: 'center', underline: true });
    doc.moveDown(0.5);
    doc.fontSize(12).text(process.env.UNIVERSITY_ADDRESS || 'Messassi Zouatoupsi', { align: 'center' });
    doc.moveDown();

    // Student and transaction info
    doc.fontSize(12).text(`Receipt for: ${student.name || student.email}`);
    doc.text(`Student ID: ${student.studentId || ''}`);
    doc.text(`Email: ${student.email || '—'}`);
    doc.moveDown();

    doc.fontSize(12).text(`Transaction Reference: ${tx._id}`);
    doc.text(`Date: ${new Date(tx.paidAt || tx.createdAt).toLocaleString()}`);
    doc.text(`Status: ${String(tx.status || '').toUpperCase()}`);
    doc.moveDown();

    // Amount / breakdown
    if (tuition) {
      doc.text('Breakdown:', { underline: true });
      doc.text(` - Tuition: XAF ${Number(tuition.amount || 0).toLocaleString()}`);
      if (tuition.lateFee) doc.text(` - Late fee: XAF ${Number(tuition.lateFee||0).toLocaleString()}`);
      doc.moveDown();
    }

    doc.fontSize(14).text(`Total Paid: XAF ${Number(tx.amount || 0).toLocaleString()}`, { bold: true });
    doc.moveDown();

    // Metadata
    if (tx.metadata && Object.keys(tx.metadata).length) {
      doc.fontSize(11).text('Payment Details:', { underline: true });
      Object.entries(tx.metadata).forEach(([k,v]) => {
        doc.text(` - ${k}: ${typeof v === 'object' ? JSON.stringify(v) : String(v)}`);
      });
      doc.moveDown();
    }

    doc.moveDown();
    doc.text('This is a system-generated receipt for the above transaction.', { align: 'left' });
    doc.moveDown(2);
    doc.text('Signature: ______________________', { align: 'left' });

    doc.end();
  } catch (err) {
    console.error('generateReceiptPDF error', err);
    res.status(500).json({ message: err.message });
  }
};

// GET /api/finance/export?year=YYYY or start=&end=
exports.exportTransactions = async (req, res) => {
  try {
    const queryStudentId = req.query.studentId;
    const year = req.query.year;
    const start = req.query.start ? new Date(req.query.start) : null;
    const end = req.query.end ? new Date(req.query.end) : null;

    let studentId;
    if (queryStudentId) {
      if (req.user && (req.user.role === 'admin' || req.user.role === 'finance')) {
        studentId = queryStudentId;
      } else {
        const own = await Student.findOne({ userId: req.user.id });
        if (own && own._id.toString() === queryStudentId.toString()) studentId = queryStudentId;
      }
    } else {
      const own = await Student.findOne({ userId: req.user.id });
      if (!own) return res.status(404).json({ message: 'Student not found' });
      studentId = own._id;
    }

    if (!studentId) return res.status(403).json({ message: 'Forbidden' });

    let s = start;
    let e = end;
    if (year && !s && !e) {
      s = new Date(`${year}-01-01`);
      e = new Date(`${year}-12-31`);
      e.setHours(23,59,59,999);
    }

    const txFilter = { studentId };
    if (s || e) txFilter.createdAt = {};
    if (s) txFilter.createdAt.$gte = s;
    if (e) txFilter.createdAt.$lte = e;

    const transactions = await Transaction.find(txFilter).lean();
    const tuitions = await Tuition.find({ studentId, ...(s||e ? { createdAt: txFilter.createdAt } : {}) }).lean();

    // Build CSV
    const rows = [];
    rows.push(['Date','Type','Description','Category','Amount','Status','Reference']);
    tuitions.forEach(t => rows.push([new Date(t.createdAt).toISOString(), 'Invoice', t.description||'Tuition', t.category||'Tuition', t.amount, t.status, t._id]));
    transactions.forEach(t => rows.push([new Date(t.createdAt).toISOString(), 'Payment', t.description||'Payment', t.category||'Payment', t.amount, t.status, t._id]));

    const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g,'""')}"`).join(',')).join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=statement-${studentId}.csv`);
    res.send(csv);
  } catch (err) {
    console.error('exportTransactions error', err);
    res.status(500).json({ message: err.message });
  }
};