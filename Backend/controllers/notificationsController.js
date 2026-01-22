const Notification = require('../models/Notification');
const User = require('../models/User');

// Get user role
const getUserRole = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) return 'student';
    // Determine role based on user properties
    if (user.role === 'admin' || user.isAdmin) return 'admin';
    if (user.role === 'finance' || user.isFinance) return 'finance_officer';
    return 'student';
  } catch (e) {
    return 'student';
  }
};

/**
 * Get notifications based on user role
 * - Students see: personal finance alerts, marketing, academic alerts
 * - Finance Officers see: system tasks, escalations, HR integration
 * - Admins see: all
 */
exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = await getUserRole(userId);
    const category = req.query.category || 'All';
    const limit = parseInt(req.query.limit) || 50;

    let query = {
      $or: [
        { role: 'all' },
        { role: userRole }
      ]
    };

    // If specific user, also include user-specific notifications
    if (userId) {
      query.$or.push({ userId });
    }

    // Filter by category if specified and not 'All'
    if (category && category !== 'All') {
      query.category = category;
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(limit);

    const unreadCount = await Notification.countDocuments({
      ...query,
      read: false
    });

    res.json({
      success: true,
      userRole,
      unreadCount,
      notifications,
      total: notifications.length
    });
  } catch (err) {
    console.error('Error fetching notifications:', err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Get role-specific notification summary
 */
exports.getNotificationSummary = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = await getUserRole(userId);

    const summary = {
      total: 0,
      byCategory: {}
    };

    const query = {
      $or: [
        { role: 'all' },
        { role: userRole }
      ]
    };

    if (userId) {
      query.$or.push({ userId });
    }

    const notifications = await Notification.find(query);

    summary.total = notifications.length;
    notifications.forEach(n => {
      if (!summary.byCategory[n.category]) {
        summary.byCategory[n.category] = 0;
      }
      summary.byCategory[n.category]++;
    });

    res.json({
      success: true,
      userRole,
      summary
    });
  } catch (err) {
    console.error('Error fetching notification summary:', err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Mark notification as read
 */
exports.markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    
    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json({
      success: true,
      notification
    });
  } catch (err) {
    console.error('Error marking notification as read:', err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Mark all notifications as read
 */
exports.markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = await getUserRole(userId);

    const query = {
      $or: [
        { role: 'all' },
        { role: userRole }
      ]
    };

    if (userId) {
      query.$or.push({ userId });
    }

    const result = await Notification.updateMany(
      query,
      { read: true }
    );

    res.json({
      success: true,
      modifiedCount: result.modifiedCount
    });
  } catch (err) {
    console.error('Error marking all as read:', err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Get notifications by role (for admin/testing)
 */
exports.getNotificationsByRole = async (req, res) => {
  try {
    const { role } = req.params;
    const validRoles = ['student', 'finance_officer', 'admin'];

    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const notifications = await Notification.find({
      $or: [
        { role },
        { role: 'all' }
      ]
    })
    .sort({ createdAt: -1 })
    .limit(50);

    res.json({
      success: true,
      role,
      notifications
    });
  } catch (err) {
    console.error('Error fetching notifications by role:', err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Create a new notification (Finance Officers only)
 * Allows finance officers to send notifications to students or all roles
 */
exports.createNotification = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = await getUserRole(userId);

    // Only finance officers and admins can create notifications
    if (userRole !== 'finance_officer' && userRole !== 'admin') {
      return res.status(403).json({ 
        message: 'Only finance officers and admins can create notifications' 
      });
    }

    const {
      title,
      body,
      role = 'student', // default to student notifications
      category = 'Finance',
      action = 'view',
      actionTarget = null,
      actionPage = null,
      urgency = 'medium',
      meta = {}
    } = req.body;

    // Validation
    if (!title || !body) {
      return res.status(400).json({ 
        message: 'Title and body are required' 
      });
    }

    const validRoles = ['student', 'finance_officer', 'admin', 'all'];
    const validCategories = ['Finance', 'HR', 'Marketing', 'System'];
    const validActions = ['pay_now', 'review', 'approve', 'view', 'dismiss'];
    const validUrgencies = ['low', 'medium', 'high', 'critical'];

    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    if (!validCategories.includes(category)) {
      return res.status(400).json({ message: 'Invalid category' });
    }

    if (!validActions.includes(action)) {
      return res.status(400).json({ message: 'Invalid action' });
    }

    if (!validUrgencies.includes(urgency)) {
      return res.status(400).json({ message: 'Invalid urgency' });
    }

    // Create notification
    const notification = new Notification({
      title,
      body,
      role,
      category,
      action,
      actionTarget,
      actionPage,
      urgency,
      meta: {
        ...meta,
        createdBy: userId,
        createdByRole: userRole,
        createdAt: new Date()
      },
      read: false
    });

    const savedNotification = await notification.save();

    res.status(201).json({
      success: true,
      message: `Notification created and sent to ${role} users`,
      notification: savedNotification
    });
  } catch (err) {
    console.error('Error creating notification:', err);
    res.status(500).json({ message: err.message });
  }
};