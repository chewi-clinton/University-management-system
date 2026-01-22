const Payroll = require('../models/Payroll');
const Employee = require('../models/Employee');

// Get all payroll records
exports.getAllPayroll = async (req, res) => {
  try {
    const { status, period } = req.query;
    let filter = {};

    if (status && status !== 'all') filter.status = status;
    if (period) filter.period = period;

    const payrolls = await Payroll.find(filter)
      .populate('employeeId')
      .sort({ createdAt: -1 });

    res.json(payrolls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get payroll stats
exports.getPayrollStats = async (req, res) => {
  try {
    const employees = await Employee.countDocuments();

    const totalPayout = await Payroll.aggregate([
      { $match: { status: 'paid' } },
      { $group: { _id: null, total: { $sum: '$netPay' } } }
    ]);

    const totalDeductions = await Payroll.aggregate([
      { $group: { _id: null, total: { $sum: '$deductions' } } }
    ]);

    res.json({
      employees,
      totalPayout: totalPayout[0]?.total || 0,
      deductions: totalDeductions[0]?.total || 0,
      flaggedCount: await Payroll.countDocuments({ status: 'flagged' })
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create payroll record
exports.createPayroll = async (req, res) => {
  try {
    const { employeeId, period, baseSalary, deductions, dueDate } = req.body;

    const netPay = baseSalary - deductions;

    const payroll = new Payroll({
      employeeId,
      period,
      baseSalary,
      deductions,
      netPay,
      dueDate
    });

    await payroll.save();

    res.status(201).json({ message: 'Payroll record created', payroll });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update payroll status
exports.updatePayrollStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, paidDate } = req.body;

    const payroll = await Payroll.findByIdAndUpdate(
      id,
      { status, paidDate: status === 'paid' ? paidDate || Date.now() : null, updatedAt: Date.now() },
      { new: true }
    );

    res.json({ message: 'Payroll updated', payroll });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};