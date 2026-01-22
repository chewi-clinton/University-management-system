const Tuition = require('../models/Tuition');
const Student = require('../models/Student');
const emailService = require('../utils/emailService');

// Get all tuition records
exports.getAllTuition = async (req, res) => {
  try {
    const { status, search } = req.query;
    let filter = {};

    if (status && status !== 'all') filter.status = status;

    const tuitions = await Tuition.find(filter)
      .populate('studentId')
      .sort({ createdAt: -1 });

    res.json(tuitions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get tuition stats
exports.getTuitionStats = async (req, res) => {
  try {
    const pendingAmount = await Tuition.aggregate([
      { $match: { status: 'pending' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const overdueAmount = await Tuition.aggregate([
      { $match: { status: 'overdue' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const todayAmount = await Tuition.aggregate([
      { $match: { paidDate: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    res.json({
      pending: pendingAmount[0]?.total || 0,
      overdue: overdueAmount[0]?.total || 0,
      today: todayAmount[0]?.total || 0,
      overdueCount: await Tuition.countDocuments({ status: 'overdue' })
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create tuition record
exports.createTuition = async (req, res) => {
  try {
    const { studentId, amount, dueDate } = req.body;

    const tuition = new Tuition({ studentId, amount, dueDate });
    await tuition.save();

    res.status(201).json({ message: 'Tuition record created', tuition });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update tuition status
exports.updateTuitionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, paidDate } = req.body;

    const tuition = await Tuition.findByIdAndUpdate(
      id,
      { status, paidDate: status === 'paid' ? paidDate || Date.now() : null, updatedAt: Date.now() },
      { new: true }
    );

    res.json({ message: 'Tuition updated', tuition });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Generate and send invoice
exports.generateInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const tuition = await Tuition.findById(id).populate('studentId');

    if (!tuition) {
      return res.status(404).json({ message: 'Tuition record not found' });
    }

    if (!tuition.studentId?.email) {
      return res.status(400).json({ message: 'Student email not found' });
    }

    // Generate invoice email
    const invoiceHTML = `
      <h2>Invoice for Tuition Payment</h2>
      <p>Dear ${tuition.studentId.name},</p>
      <p>Please find below your tuition invoice details:</p>
      <table border="1" cellpadding="10">
        <tr>
          <td><strong>Student ID:</strong></td>
          <td>${tuition.studentId.studentId}</td>
        </tr>
        <tr>
          <td><strong>Amount Due:</strong></td>
          <td>XAF ${tuition.amount?.toLocaleString()}</td>
        </tr>
        <tr>
          <td><strong>Due Date:</strong></td>
          <td>${new Date(tuition.dueDate).toLocaleDateString()}</td>
        </tr>
        <tr>
          <td><strong>Status:</strong></td>
          <td>${tuition.status.toUpperCase()}</td>
        </tr>
      </table>
      <p>Please ensure payment is made by the due date to avoid late fees.</p>
      <p>Contact the Finance Office if you have any questions.</p>
      <p>Best regards,<br/>University Finance Office</p>
    `;

    await emailService.sendEmail(
      tuition.studentId.email,
      'Tuition Invoice - Payment Required',
      invoiceHTML
    );

    res.json({ message: 'Invoice sent successfully to student' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Send payment reminder
exports.sendReminder = async (req, res) => {
  try {
    const { id } = req.params;
    const tuition = await Tuition.findById(id).populate('studentId');

    if (!tuition) {
      return res.status(404).json({ message: 'Tuition record not found' });
    }

    if (!tuition.studentId?.email) {
      return res.status(400).json({ message: 'Student email not found' });
    }

    // Generate reminder email
    const reminderHTML = `
      <h2>Payment Reminder</h2>
      <p>Dear ${tuition.studentId.name},</p>
      <p>This is a friendly reminder that your tuition payment is due:</p>
      <table border="1" cellpadding="10">
        <tr>
          <td><strong>Amount Due:</strong></td>
          <td>XAF ${tuition.amount?.toLocaleString()}</td>
        </tr>
        <tr>
          <td><strong>Due Date:</strong></td>
          <td>${new Date(tuition.dueDate).toLocaleDateString()}</td>
        </tr>
      </table>
      <p>Please proceed with your payment to avoid additional charges.</p>
      <p>If you have already made payment, please disregard this message.</p>
      <p>Best regards,<br/>University Finance Office</p>
    `;

    await emailService.sendEmail(
      tuition.studentId.email,
      'Payment Reminder - Tuition Due Soon',
      reminderHTML
    );

    res.json({ message: 'Reminder sent successfully to student' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};