const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');

// GET /rides – Fetch all rides
router.get('/', async (req, res) => {
  try {
    const rides = await req.db.collection('rides').find().toArray();
    res.status(200).json(rides);
  } catch {
    res.status(500).json({ error: 'Failed to fetch rides' });
  }
});

// GET /rides/:id – Fetch single ride by ID
router.get('/:id', async (req, res) => {
  try {
    const ride = await req.db.collection('rides').findOne({ _id: new ObjectId(req.params.id) });
    if (!ride) return res.status(404).json({ error: 'Ride not found' });

    res.status(200).json(ride);
  } catch (err) {
    res.status(500).json({ error: 'Invalid ID or server error' });
  }
});

// POST /rides – Create a new ride
router.post('/', async (req, res) => {
  try {
    const newRide = {
      pickupLocation: req.body.pickupLocation,
      destination: req.body.destination,
      driverId: req.body.driverId,
      passengerName: req.body.passengerName || null,
      status: 'requested',
      createdAt: new Date()
    };

    const result = await req.db.collection('rides').insertOne(newRide);
    newRide._id = result.insertedId;

    res.status(201).json(newRide);
  } catch (err) {
    res.status(400).json({ error: 'Invalid ride data' });
  }
});

// PUT /rides/:id – Replace or update whole ride
router.put('/:id', async (req, res) => {
  try {
    const result = await req.db.collection('rides').findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      { $set: req.body },
      { returnDocument: 'after' }
    );

    if (!result.value) {
      return res.status(404).json({ error: 'Ride not found' });
    }

    res.status(200).json({ updated: true, ride: result.value });
  } catch {
    res.status(500).json({ error: 'Failed to update ride' });
  }
});

// PATCH /rides/:id – Update only ride status
router.patch('/:id', async (req, res) => {
  try {
    const rideId = req.params.id;
    const result = await req.db.collection('rides').findOneAndUpdate(
      { _id: new ObjectId(rideId) },
      { $set: { status: req.body.status } },
      { returnDocument: 'after' }
    );

    if (!result.value) {
      return res.status(404).json({ error: 'Ride not found' });
    }

    res.status(200).json({ updated: true, ride: result.value });
  } catch (err) {
    console.error('PATCH error:', err);
    res.status(500).json({ error: 'Failed to update ride' });
  }
});

// DELETE /rides/:id – Delete ride
router.delete('/:id', async (req, res) => {
  try {
    const result = await req.db.collection('rides').deleteOne({ _id: new ObjectId(req.params.id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Ride not found' });
    }

    res.status(200).json({ deleted: true });
  } catch {
    res.status(500).json({ error: 'Failed to delete ride' });
  }
});

module.exports = router;
