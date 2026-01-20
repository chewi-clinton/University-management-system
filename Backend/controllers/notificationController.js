const Notification = require('../models/Notification');

exports.getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const count = await Notification.countDocuments({ userId, read: false });
    res.json({ unread: count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.list = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const limit = Math.min(50, Number(req.query.limit) || 20);
    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 }).limit(limit).lean();
    res.json({ notifications });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.markRead = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const { ids } = req.body; // optional array of notification ids
    const q = { userId, read: false };
    if (Array.isArray(ids) && ids.length) q._id = { $in: ids };
    await Notification.updateMany(q, { $set: { read: true } });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};