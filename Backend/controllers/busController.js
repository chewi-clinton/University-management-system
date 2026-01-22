const BusRoute = require('../models/BusRoute');
const BusRegistration = require('../models/BusRegistration');
const Student = require('../models/Student');
const Transaction = require('../models/Transaction');
const mongoose = require('mongoose');

// GET /api/bus/routes
exports.listRoutes = async (req, res) => {
  try {
    const routes = await BusRoute.find().lean();
    // If expected Yaoundé routes are not present, replace current routes with the Yaoundé set.
    const desiredNames = ['Post - Yaoundé Central', 'Nlongkak Route', 'Bastos Express'];
    const existingNames = (routes || []).map(r => String(r.name || ''))
    const missing = desiredNames.some(n => !existingNames.includes(n))

    if (missing) {
      const samples = [
        {
          name: 'Post - Yaoundé Central', term: '2026-01', basePrice: 25000, pickupTime: '06:30', dropTime: '17:00', seatsAvailable: 40, popularity: 200,
          geometry: {
            type: 'LineString', coordinates: [
              [11.517, 3.866], [11.5175, 3.868], [11.518, 3.87], [11.52, 3.873]
            ]
          },
          stops: [
            { id: 's1', label: 'Post', lat: 3.866, lng: 11.517, pickupTime: '06:30' },
            { id: 's2', label: 'Mfoundi', lat: 3.87, lng: 11.518, pickupTime: '06:45' },
            { id: 's3', label: 'Central', lat: 3.873, lng: 11.52, pickupTime: '07:00' }
          ]
        },
        {
          name: 'Nlongkak Route', term: '2026-01', basePrice: 25000, pickupTime: '07:00', dropTime: '17:30', seatsAvailable: 35, popularity: 150,
          geometry: { type: 'LineString', coordinates: [[11.522,3.86],[11.523,3.862],[11.524,3.865],[11.525,3.868]] },
          stops: [ { id: 'n1', label: 'Nlongkak', lat:3.86, lng:11.522, pickupTime:'07:00' }, { id:'n2', label:'Biyem-Assi', lat:3.865, lng:11.524, pickupTime:'07:15' } ]
        },
        {
          name: 'Bastos Express', term: '2026-01', basePrice: 25000, pickupTime: '06:00', dropTime: '16:45', seatsAvailable: 30, popularity: 180,
          geometry: { type: 'LineString', coordinates: [[11.513,3.865],[11.514,3.867],[11.515,3.869],[11.516,3.871]] },
          stops: [ { id:'b1', label:'Bastos', lat:3.865, lng:11.513, pickupTime:'06:00' }, { id:'b2', label:'Etoudi', lat:3.871, lng:11.516, pickupTime:'06:20' } ]
        }
      ];
      // remove existing and insert the desired set
      await BusRoute.deleteMany({});
      await BusRoute.insertMany(samples);
      const r = await BusRoute.find().lean();
      return res.json(r);
    }

    res.json(routes);
  } catch (err) {
    console.error('listRoutes', err);
    res.status(500).json({ message: err.message });
  }
};

// GET /api/bus/public/seed -> force-insert demo routes with geometry (debug helper)
exports.seedRoutes = async (req, res) => {
  try {
    const samples = [
      {
        name: 'Post - Yaoundé Central', term: '2026-01', basePrice: 20000, pickupTime: '06:30', dropTime: '17:00', seatsAvailable: 40, popularity: 200,
        geometry: { type: 'LineString', coordinates: [[11.517, 3.866], [11.5175, 3.868], [11.518, 3.87], [11.52, 3.873]] },
        stops: [ { id: 's1', label: 'Post', lat: 3.866, lng: 11.517, pickupTime: '06:30' }, { id: 's2', label: 'Mfoundi', lat: 3.87, lng: 11.518, pickupTime: '06:45' }, { id: 's3', label: 'Central', lat: 3.873, lng: 11.52, pickupTime: '07:00' } ]
      },
      {
        name: 'Nlongkak Route', term: '2026-01', basePrice: 16000, pickupTime: '07:00', dropTime: '17:30', seatsAvailable: 35, popularity: 150,
        geometry: { type: 'LineString', coordinates: [[11.522,3.86],[11.523,3.862],[11.524,3.865],[11.525,3.868]] },
        stops: [ { id: 'n1', label: 'Nlongkak', lat:3.86, lng:11.522, pickupTime:'07:00' }, { id:'n2', label:'Biyem-Assi', lat:3.865, lng:11.524, pickupTime:'07:15' } ]
      },
      {
        name: 'Bastos Express', term: '2026-01', basePrice: 22000, pickupTime: '06:00', dropTime: '16:45', seatsAvailable: 30, popularity: 180,
        geometry: { type: 'LineString', coordinates: [[11.513,3.865],[11.514,3.867],[11.515,3.869],[11.516,3.871]] },
        stops: [ { id:'b1', label:'Bastos', lat:3.865, lng:11.513, pickupTime:'06:00' }, { id:'b2', label:'Etoudi', lat:3.871, lng:11.516, pickupTime:'06:20' } ]
      }
    ];
    await BusRoute.deleteMany({});
    await BusRoute.insertMany(samples);
    const r = await BusRoute.find().lean();
    return res.json(r);
  } catch (err) {
    console.error('seedRoutes', err);
    res.status(500).json({ message: err.message });
  }
}

// POST /api/bus/register
// body: { routeId, term, paymentMethod }
exports.register = async (req, res) => {
  try {
    const { routeId, term, paymentMethod } = req.body;
    const student = await Student.findOne({ userId: req.user.id });
    if (!student) return res.status(404).json({ message: 'Student not found' });
    const route = await BusRoute.findById(routeId);
    if (!route) return res.status(404).json({ message: 'Route not found' });
    if (route.seatsAvailable <= 0) return res.status(400).json({ message: 'No seats available' });

    // compute total with tax (3.3%)
    const base = Number(route.basePrice || 0);
    const tax = Math.round(base * 0.033);
    const total = base + tax;

    // create a registration record (PENDING until paid)
    const reg = new BusRegistration({ studentId: student._id, routeId: route._id, term, status: 'PENDING' });
    await reg.save();

    // handle wallet payment atomically
    if (paymentMethod === 'wallet') {
      // attempt to use a transaction if the MongoDB deployment supports it
      let session = null
      try {
        session = await mongoose.startSession()
      } catch (err) {
        console.warn('Transactions not available; falling back to non-transactional wallet processing', err && err.message)
        session = null
      }

      if (session) {
        try {
          let resultTx = null;
          await session.withTransaction(async () => {
            const s = await Student.findById(student._id).session(session);
            if (!s) throw new Error('Student not found during wallet payment');
            const amount = Number(total || 0);
            if ((s.walletBalance || 0) < amount) throw new Error('Insufficient wallet balance');
            s.walletBalance = (s.walletBalance || 0) - amount;
            await s.save({ session });

            const tx = new Transaction({ studentId: s._id, amount: amount, status: 'SUCCESS', paidAt: new Date(), metadata: { type: 'bus', route: route.name, registrationId: reg._id, method: 'wallet' } });
            await tx.save({ session });
            resultTx = tx;

            // finalize registration and decrement seat
            reg.status = 'ACTIVE';
            await reg.save({ session });
            route.seatsAvailable = Math.max(0, route.seatsAvailable - 1);
            await route.save({ session });
          });
          const freshStudent = await Student.findById(student._id);
          return res.json({ message: 'Registered', registration: reg, transaction: resultTx, walletBalance: freshStudent.walletBalance });
        } catch (err) {
          console.error('bus.wallet.register error', err);
          // If the failure is due to transactions not being supported, fall back
          if (err && (err.code === 20 || String(err.message || '').includes('Transaction numbers are only allowed'))) {
            console.warn('withTransaction failed due to unsupported transactions, falling back to non-transactional flow')
            try {
              const s = await Student.findById(student._id);
              if (!s) throw new Error('Student not found during wallet payment (fallback)');
              const amount = Number(total || 0);
              if ((s.walletBalance || 0) < amount) throw new Error('Insufficient wallet balance');
              s.walletBalance = (s.walletBalance || 0) - amount;
              await s.save();

              const tx = new Transaction({ studentId: s._id, amount: amount, status: 'SUCCESS', paidAt: new Date(), metadata: { type: 'bus', route: route.name, registrationId: reg._id, method: 'wallet' } });
              await tx.save();

              // finalize registration and decrement seat
              reg.status = 'ACTIVE';
              await reg.save();
              route.seatsAvailable = Math.max(0, route.seatsAvailable - 1);
              await route.save();

              const freshStudent = await Student.findById(student._id);
              return res.json({ message: 'Registered (no-transactions-fallback)', registration: reg, transaction: tx, walletBalance: freshStudent.walletBalance });
            } catch (fallbackErr) {
              console.error('bus.wallet.fallback error', fallbackErr);
              return res.status(400).json({ message: fallbackErr.message || 'Wallet payment failed' });
            }
          }
          return res.status(400).json({ message: err.message || 'Wallet payment failed' });
        } finally {
          try { session.endSession(); } catch (e) {}
        }
      } else {
        // fallback: non-transactional sequential processing
        try {
          const s = await Student.findById(student._id);
          if (!s) throw new Error('Student not found during wallet payment');
          const amount = Number(total || 0);
          if ((s.walletBalance || 0) < amount) throw new Error('Insufficient wallet balance');
          s.walletBalance = (s.walletBalance || 0) - amount;
          await s.save();

          const tx = new Transaction({ studentId: s._id, amount: amount, status: 'SUCCESS', paidAt: new Date(), metadata: { type: 'bus', route: route.name, registrationId: reg._id, method: 'wallet' } });
          await tx.save();

          // finalize registration and decrement seat
          reg.status = 'ACTIVE';
          await reg.save();
          route.seatsAvailable = Math.max(0, route.seatsAvailable - 1);
          await route.save();

          const freshStudent = await Student.findById(student._id);
          return res.json({ message: 'Registered (no-transactions)', registration: reg, transaction: tx, walletBalance: freshStudent.walletBalance });
        } catch (err) {
          console.error('bus.wallet.fallback error', err);
          return res.status(400).json({ message: err.message || 'Wallet payment failed' });
        }
      }
    }

    // otherwise simulate external provider by returning a providerUrl
    const tx = new Transaction({ studentId: student._id, amount: total, metadata: { type: 'bus', route: route.name, registrationId: reg._id } });
    tx.status = 'PENDING';
    tx.providerUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/mock-pay/${tx._id}`;
    await tx.save();
    return res.status(201).json({ registration: reg, transaction: tx, providerUrl: tx.providerUrl });
  } catch (err) {
    console.error('bus.register', err);
    res.status(500).json({ message: err.message });
  }
};

// GET /api/bus/route/:id  -> returns geometry + stops + route data
exports.getRoute = async (req, res) => {
  try {
    const id = req.params.id;
    const route = await BusRoute.findById(id).lean();
    if (!route) return res.status(404).json({ message: 'Route not found' });
    res.json(route);
  } catch (err) {
    console.error('getRoute', err);
    res.status(500).json({ message: err.message });
  }
};

// GET /api/bus/vehicles?routeId= -> returns simulated vehicle positions along route geometry
exports.getVehicles = async (req, res) => {
  try {
    const { routeId } = req.query;
    if (!routeId) return res.status(400).json({ message: 'routeId required' });
    const route = await BusRoute.findById(routeId).lean();
    if (!route) return res.status(404).json({ message: 'Route not found' });

    // simple deterministic simulation: positions move along geometry based on time
    const coords = (route.geometry && route.geometry.coordinates) || [];
    if (!coords.length) return res.json([]);

    const now = Date.now();
    const period = 60 * 1000; // one full loop per 60s for demo
    const vehicles = [];
    const vehicleCount = Math.max(1, Math.min(3, Math.floor((route.popularity || 50) / 80)) );
    for (let i = 0; i < Math.max(1, Math.floor((route.popularity||100)/100)); i++) {
      const offset = (i * 0.25);
      const progress = ((now / period) + offset) % 1;
      // compute position along coords
      const segCount = coords.length - 1;
      const idx = Math.floor(progress * segCount);
      const frac = (progress * segCount) - idx;
      const a = coords[idx];
      const b = coords[Math.min(idx+1, coords.length-1)];
      const lat = (a[1] + (b[1]-a[1]) * frac);
      const lng = (a[0] + (b[0]-a[0]) * frac);
      vehicles.push({ vehicleId: `v-${i}`, routeId, lat, lng, updatedAt: new Date().toISOString(), seatsAvailable: Math.max(0, (route.seatsAvailable || 30) - i) });
    }

    res.json(vehicles);
  } catch (err) {
    console.error('getVehicles', err);
    res.status(500).json({ message: err.message });
  }
};

// GET /api/bus/status -> returns current student's active bus registration status
exports.getRegistrationStatus = async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user.id });
    if (!student) return res.status(404).json({ message: 'Student not found' });

    // find the most recent ACTIVE registration
    const registration = await BusRegistration.findOne({ studentId: student._id, status: 'ACTIVE' })
      .populate('routeId')
      .sort({ createdAt: -1 });

    if (registration) {
      return res.json({ status: 'Active', registration, message: 'You are registered for the bus service.' });
    }

    // check for PENDING registrations (awaiting payment)
    const pendingReg = await BusRegistration.findOne({ studentId: student._id, status: 'PENDING' })
      .populate('routeId')
      .sort({ createdAt: -1 });

    if (pendingReg) {
      return res.json({ status: 'Pending', registration: pendingReg, message: 'Your registration is awaiting payment.' });
    }

    res.json({ status: 'Not Registered', registration: null, message: 'You have no active bus pass.' });
  } catch (err) {
    console.error('getRegistrationStatus', err);
    res.status(500).json({ message: err.message });
  }
};
