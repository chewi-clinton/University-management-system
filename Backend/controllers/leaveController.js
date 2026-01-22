const Leave = require('../models/Leave');
const LeaveRequest = require('../models/LeaveRequest');
const Employee = require('../models/Employee');

// Get current user's leave balance
exports.getLeaveBalance = async (req, res) => {
  try {
    const leave = await Leave.findOne({ employeeId: req.user?.id })
      .populate('employeeId', 'name email');
    
    if (!leave) {
      return res.status(404).json({ message: 'Leave record not found' });
    }

    res.json(leave);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all leave requests (for managers/HR)
exports.getTeamLeaveRequests = async (req, res) => {
  try {
    const { status = 'pending' } = req.query;

    const requests = await LeaveRequest.find(
      status !== 'all' ? { status } : {}
    )
      .populate('employeeId', 'name email department position')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user's own leave requests
exports.getMyLeaveRequests = async (req, res) => {
  try {
    const requests = await LeaveRequest.find({ employeeId: req.user?.id })
      .populate('employeeId', 'name email')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new leave request
exports.createLeaveRequest = async (req, res) => {
  try {
    const { leaveType, startDate, endDate, reason, documentUrl } = req.body;

    // Calculate duration (working days)
    const start = new Date(startDate);
    const end = new Date(endDate);
    let duration = 0;
    let current = new Date(start);

    while (current <= end) {
      const day = current.getDay();
      if (day !== 0 && day !== 6) { // exclude weekends
        duration++;
      }
      current.setDate(current.getDate() + 1);
    }

    // Check for calendar conflicts (simplified - check for known event dates)
    const conflictDates = [
      { name: 'Fiscal Budget Review', start: '2026-01-27', end: '2026-01-31' },
      { name: 'End of Semester Exams', start: '2026-02-15', end: '2026-02-28' }
    ];

    let calendarConflict = false;
    let conflictReason = '';

    for (const event of conflictDates) {
      if (start <= new Date(event.end) && end >= new Date(event.start)) {
        calendarConflict = true;
        conflictReason = event.name;
        break;
      }
    }

    const leaveRequest = new LeaveRequest({
      employeeId: req.user?.id,
      requestedBy: req.user?.name,
      leaveType,
      startDate: start,
      endDate: end,
      duration,
      reason,
      documentUrl,
      calendarConflict,
      conflictReason,
      status: 'pending'
    });

    await leaveRequest.save();
    await leaveRequest.populate('employeeId', 'name email');

    res.status(201).json({ message: 'Leave request created', leaveRequest });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Approve leave request
exports.approveLeaveRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { approvalReason } = req.body;

    const leaveRequest = await LeaveRequest.findByIdAndUpdate(
      id,
      {
        status: 'approved',
        approvedBy: req.user?.name,
        approvalReason,
        updatedAt: Date.now()
      },
      { new: true }
    ).populate('employeeId', 'name email');

    // Map leave type to balance field name
    const balanceFieldMap = {
      'annual': 'annualBalance',
      'sick': 'sickBalance',
      'study': 'studyBalance',
      'unpaid': null // unpaid leave doesn't deduct from balance
    };

    const balanceField = balanceFieldMap[leaveRequest.leaveType];

    // Deduct from leave balance (only if not unpaid)
    if (balanceField) {
      const updateData = {
        totalTaken: leaveRequest.duration
      };
      updateData[balanceField] = -leaveRequest.duration;

      await Leave.findOneAndUpdate(
        { employeeId: leaveRequest.employeeId._id },
        { $inc: updateData }
      );
    }

    res.json({ message: 'Leave request approved', leaveRequest });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Deny leave request
exports.denyLeaveRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const leaveRequest = await LeaveRequest.findByIdAndUpdate(
      id,
      {
        status: 'denied',
        approvedBy: req.user?.name,
        approvalReason: reason,
        updatedAt: Date.now()
      },
      { new: true }
    ).populate('employeeId', 'name email');

    res.json({ message: 'Leave request denied', leaveRequest });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get pending requests count for notifications
exports.getPendingLeaveCount = async (req, res) => {
  try {
    const count = await LeaveRequest.countDocuments({ status: 'pending' });
    res.json({ pendingCount: count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
