const mongoose = require('mongoose');

const busRouteSchema = new mongoose.Schema({
  name: { type: String, required: true },
  term: { type: String },
  basePrice: { type: Number, required: true },
  pickupTime: String,
  dropTime: String,
  seatsAvailable: { type: Number, default: 40 },
  popularity: { type: Number, default: 0 },
  // geometry stored as GeoJSON LineString
  geometry: {
    type: { type: String, enum: ['LineString'], default: 'LineString' },
    coordinates: { type: [[Number]], default: [] }
  },
  stops: [{ id: String, label: String, lat: Number, lng: Number, pickupTime: String }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('BusRoute', busRouteSchema);
