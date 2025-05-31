const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');

// GET /users
router.get('/', async (req, res) => {
  try {
    const users = await req.db.collection('users').find().toArray();
    res.status(200).json(users);
  } catch {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// POST /users
router.post('/', async (req, res) => {
  try {
    const newUser = {
      username: req.body.username,
      email: req.body.email,
      role: req.body.role || 'rider'
    };

    const result = await req.db.collection('users').insertOne(newUser);
    newUser._id = result.insertedId;

    res.status(201).json(newUser);
  } catch {
    res.status(400).json({ error: 'Invalid user data' });
  }
});

// PATCH /users/:id
router.patch('/:id', async (req, res) => {
  try {
    const result = await req.db.collection('users').findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      { $set: req.body },
      { returnDocument: 'after' }
    );

    if (!result.value) return res.status(404).json({ error: 'User not found' });

    res.status(200).json({ updated: true, user: result.value });
  } catch {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// DELETE /users/:id
router.delete('/:id', async (req, res) => {
  try {
    const result = await req.db.collection('users').deleteOne({ _id: new ObjectId(req.params.id) });

    if (result.deletedCount === 0) return res.status(404).json({ error: 'User not found' });

    res.status(200).json({ deleted: true });
  } catch {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

module.exports = router;
