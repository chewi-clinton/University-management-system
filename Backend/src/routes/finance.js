const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth') // adjust path if different
const Transaction = require('../models/Transaction') // ensure model exists / path correct

// GET /api/finance/transactions?studentId=... OR /api/finance/transactions/:id
router.get('/transactions', auth, async (req, res) => {
  try {
    const studentId = req.query.studentId || req.params.id || (req.user && (req.user.studentId || req.user.id || req.user._id))
    if (!studentId) return res.status(400).json({ message: 'studentId required' })
    const txs = await Transaction.find({ studentId }).sort({ createdAt: -1 })
    return res.json(txs)
  } catch (err) {
    console.error('GET /finance/transactions error', err)
    return res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router