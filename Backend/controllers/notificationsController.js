const Notification = require('../models/Notification'); // create simple model if missing

exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const list = await Notification.find({ userId }).sort({ createdAt: -1 }).limit(20);
    const unreadCount = await Notification.countDocuments({ userId, read: false });
    res.json({ unreadCount, list });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};