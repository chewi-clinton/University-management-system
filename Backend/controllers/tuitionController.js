const Tuition = require('../models/Tuition');
const Student = require('../models/Student');

// Get all tuition records
exports.getAllTuition = async (req, res) => {
  try {
    const { status, search } = req.query;
    let filter = {};

    if (status) filter.status = status;

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