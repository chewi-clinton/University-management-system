const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tuition', require('./routes/tuition'));
app.use('/api/payroll', require('./routes/payroll'));
app.use('/api/students', require('./routes/students'));
app.use('/api/student', require('./routes/student'));
const financeRoutes = require('./routes/finance');
app.use('/api/finance', financeRoutes);
const supportRoutes = require('./routes/support');
app.use('/api/support', supportRoutes);
const notificationRoutes = require('./routes/notifications');
app.use('/api/notifications', notificationRoutes);

// Error handler (dev)
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err && err.stack ? err.stack : err);
  res.status(err?.status || 500).json({ message: err?.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));