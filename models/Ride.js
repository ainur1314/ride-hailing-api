const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
  passengerName: String,
  pickupLocation: String,
  dropoffLocation: String,
  status: { type: String, default: 'pending' }
});

module.exports = mongoose.model('Ride', rideSchema);
