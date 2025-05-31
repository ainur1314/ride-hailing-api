const express = require('express');
const { MongoClient } = require('mongodb');
const usersRouter = require('./routes/users');
const ridesRouter = require('./routes/rides'); 
const port = 3000;

const app = express();
app.use(express.json());

let db;

// Middleware to inject db
app.use((req, res, next) => {
  if (!db) {
    return res.status(503).json({ error: 'Database not ready' });
  }
  req.db = db;
  next();
});

// Mount routes
app.use('/rides', ridesRouter);
app.use('/users', usersRouter);

// Connect to MongoDB and start server
async function connectToMongoDB() {
  const uri = "mongodb://localhost:27017";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("✅ Connected to MongoDB!");

    db = client.db("ride_hailing");

    app.listen(port, () => {
      console.log(`🚀 Server running at http://localhost:${port}`);
    });

  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
  }
}

connectToMongoDB();
