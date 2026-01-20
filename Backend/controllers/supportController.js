const SupportMessage = require('../models/SupportMessage');

exports.sendMessage = async (req, res) => {
  try {
    const { text, from } = req.body;
    if (!text || !text.trim()) return res.status(400).json({ message: 'Message required' });

    const msg = await SupportMessage.create({
      userId: req.user.id,
      from: from || 'student',
      text: text.trim(),
      metadata: { ip: req.ip }
    });

    // return recent messages
    const messages = await SupportMessage.find({ userId: req.user.id }).sort({ createdAt: 1 }).limit(100);
    res.status(201).json({ message: msg, messages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const msgs = await SupportMessage.find({ userId: req.user.id }).sort({ createdAt: 1 }).limit(200);
    const unreadCount = await SupportMessage.countDocuments({ userId: req.user.id, from: 'admin', read: false });
    res.json({ unreadCount, messages: msgs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.markRead = async (req, res) => {
  try {
    await SupportMessage.updateMany({ userId: req.user.id, from: 'admin', read: false }, { $set: { read: true } });
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};