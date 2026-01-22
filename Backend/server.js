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
// Admin routes
app.use('/api/admin', require('./routes/admin'));
// Bus registration routes
app.use('/api/bus', require('./routes/bus'));
// Leave management routes
app.use('/api/leave', require('./routes/leave'));

// Error handler (dev)
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err && err.stack ? err.stack : err);
  res.status(err?.status || 500).json({ message: err?.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// attach socket.io for live vehicle feed
const { Server } = require('socket.io');
const io = new Server(server, {
  cors: { origin: 'http://localhost:5173', methods: ['GET','POST'] }
});

// vehicles namespace
const vehicleNS = io.of('/vehicles');
vehicleNS.on('connection', (socket) => {
  console.log('WS connected', socket.id);
  // client should join rooms by routeId
  socket.on('subscribe', (routeId) => {
    socket.join(routeId);
    console.log('socket join', socket.id, routeId);
  });
  socket.on('unsubscribe', (routeId) => {
    socket.leave(routeId);
    console.log('socket leave', socket.id, routeId);
  });
});

// simple broadcaster: every 2s emit simulated positions for each route in DB
const BusRoute = require('./models/BusRoute');
setInterval(async () => {
  try {
    const routes = await BusRoute.find().lean();
    const now = Date.now();
    for (const route of routes) {
      const coords = (route.geometry && route.geometry.coordinates) || [];
      if (!coords.length) continue;
      const period = 60 * 1000;
      const vehicles = [];
      for (let i=0;i<Math.max(1, Math.min(3, Math.floor((route.popularity||50)/80))); i++) {
        const offset = (i * 0.25);
        const progress = ((now / period) + offset) % 1;
        const segCount = coords.length - 1;
        const idx = Math.floor(progress * segCount);
        const frac = (progress * segCount) - idx;
        const a = coords[idx]; const b = coords[Math.min(idx+1, coords.length-1)];
        const lat = (a[1] + (b[1]-a[1]) * frac);
        const lng = (a[0] + (b[0]-a[0]) * frac);
        vehicles.push({ vehicleId: `v-${i}`, routeId: String(route._id), lat, lng, updatedAt: new Date().toISOString() });
      }
      vehicleNS.to(String(route._id)).emit('positions', vehicles);
    }
  } catch (err) {
    console.error('ws broadcast error', err);
  }
}, 2000);