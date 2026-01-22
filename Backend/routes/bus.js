const express = require('express');
const router = express.Router();
const busController = require('../controllers/busController');
const auth = require('../middleware/auth');

router.get('/routes', auth, busController.listRoutes);
router.get('/route/:id', auth, busController.getRoute);
router.get('/vehicles', auth, busController.getVehicles);
router.post('/register', auth, busController.register);

// Public endpoints (no auth) for map preview and demo clients
router.get('/public/routes', busController.listRoutes);
router.get('/public/route/:id', busController.getRoute);
router.get('/public/vehicles', busController.getVehicles);
// debug: force seed demo routes
router.get('/public/seed', busController.seedRoutes);

module.exports = router;
