const User = require('../models/User');
const LeaveRequest = require('../models/LeaveRequest');
const Notification = require('../models/Notification');
const Tuition = require('../models/Tuition');
const Payroll = require('../models/Payroll');

/**
 * Get admin dashboard statistics
 */
exports.getDashboardStats = async (req, res) => {
  try {
    // Count users by role
    const totalUsers = await User.countDocuments();
    const studentCount = await User.countDocuments({ role: 'student' });
    const financeCount = await User.countDocuments({ role: 'finance' });
    const adminCount = await User.countDocuments({ role: 'admin' });

    // Count pending leave requests
    const pendingLeaveRequests = await LeaveRequest.countDocuments({ status: 'pending' });

    // Count notifications
    const totalNotifications = await Notification.countDocuments();

    // Count tuition invoices (outstanding)
    const totalTuitionInvoices = await Tuition.countDocuments({ status: 'pending' });

    // Count payroll cycles
    const totalPayroll = await Payroll.countDocuments();

    res.json({
      success: true,
      stats: {
        totalUsers,
        studentCount,
        financeCount,
        adminCount,
        pendingLeaveRequests,
        totalNotifications,
        totalTuitionInvoices,
        totalPayroll
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get all users for admin management
 */
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, 'name email role createdAt').sort({ createdAt: -1 });
    
    res.json({
      success: true,
      users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get system activity logs
 */
exports.getActivityLogs = async (req, res) => {
  try {
    // Fetch recent leave requests (approvals/denials)
    const recentLeaves = await LeaveRequest.find()
      .populate('employeeId', 'name email')
      .sort({ updatedAt: -1 })
      .limit(5);

    // Fetch recent notifications created
    const recentNotifications = await Notification.find()
      .sort({ createdAt: -1 })
      .limit(5);

    const logs = [];

    // Format leave request logs
    recentLeaves.forEach(leave => {
      if (leave.status === 'approved') {
        logs.push({
          type: 'leave_approved',
          title: 'Leave Approved',
          description: `${leave.employeeId?.name || 'Unknown'} - ${leave.leaveType} leave (${leave.duration} days)`,
          timestamp: leave.updatedAt,
          icon: '✅'
        });
      }
    });

    // Format notification logs
    recentNotifications.forEach(notification => {
      logs.push({
        type: 'notification_created',
        title: 'Notification Created',
        description: notification.title,
        timestamp: notification.createdAt,
        icon: '📢'
      });
    });

    // Sort by timestamp descending
    logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    res.json({
      success: true,
      logs: logs.slice(0, 10)
    });
  } catch (error) {
    console.error('Error fetching activity logs:', error);
    res.status(500).json({ message: error.message });
  }
};
