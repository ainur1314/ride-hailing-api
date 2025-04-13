const express = require('express');
const Ride = require('../models/Ride'); // make sure Ride model exists
const router = express.Router();

// GET /rides - fetch all rides
router.get('/', async (req, res) => {
  try {
    const rides = await Ride.find();
    res.json(rides);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// POST /rides - create a new ride
router.post('/', async (req, res) => {
  try {
    const ride = new Ride(req.body);
    await ride.save();
    res.status(201).json(ride);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT /rides/:id - update ride status by ID
router.put('/:id', async (req, res) => {
  try {
    const rideId = req.params.id;
    const updateData = req.body;

    const updatedRide = await Ride.findByIdAndUpdate(rideId, updateData, { new: true });

    if (!updatedRide) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    res.json(updatedRide);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// DELETE /rides/:id - delete a ride by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedRide = await Ride.findByIdAndDelete(req.params.id);

    if (!deletedRide) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    res.json({ message: 'Ride deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;
