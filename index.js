const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

let rides = [];
let users = []; // 👈 user array added here

// 🚗 RIDE ROUTES

// GET /rides – Fetch all rides
app.get('/rides', (req, res) => {
    res.status(200).json(rides);
});

// POST /rides – Create a new ride
app.post('/rides', (req, res) => {
    const newRide = {
        id: Date.now().toString(),
        pickupLocation: req.body.pickupLocation,
        destination: req.body.destination,
        driverId: req.body.driverId,
        status: req.body.status || "pending"
    };
    rides.push(newRide);
    res.status(201).json(newRide);
});

// PATCH /rides/:id – Update Ride Status
app.patch('/rides/:id', (req, res) => {
    const rideId = req.params.id;
    const ride = rides.find(r => r.id === rideId);
    if (!ride) {
        return res.status(404).json({ error: "Ride not found" });
    }
    if (req.body.status) {
        ride.status = req.body.status;
    }
    res.status(200).json({ message: "Ride updated", ride });
});

// PUT /rides/:id – Full Update Ride Info
app.put('/rides/:id', (req, res) => {
    const rideId = req.params.id;
    const ride = rides.find(r => r.id === rideId);
    if (!ride) {
        return res.status(404).json({ error: "Ride not found" });
    }
    ride.pickupLocation = req.body.pickupLocation || ride.pickupLocation;
    ride.destination = req.body.destination || ride.destination;
    ride.driverId = req.body.driverId || ride.driverId;
    ride.status = req.body.status || ride.status;

    res.status(200).json({ message: "Ride fully updated", ride });
});

// DELETE /rides/:id – Cancel a ride
app.delete('/rides/:id', (req, res) => {
    const rideId = req.params.id;
    const index = rides.findIndex(r => r.id === rideId);
    if (index === -1) {
        return res.status(404).json({ error: "Ride not found" });
    }
    const deletedRide = rides.splice(index, 1);
    res.status(200).json({ message: "Ride deleted", ride: deletedRide[0] });
});


// 👤 USER ROUTES

// GET /users – Fetch all users
app.get('/users', (req, res) => {
    res.status(200).json(users);
});

// POST /users – Create a new user
app.post('/users', (req, res) => {
    const newUser = {
        id: Date.now().toString(),
        name: req.body.name,
        email: req.body.email,
        role: req.body.role || "rider"
    };
    users.push(newUser);
    res.status(201).json(newUser);
});

// PUT /users/:id – Update user info
app.put('/users/:id', (req, res) => {
    const userId = req.params.id;
    const user = users.find(u => u.id === userId);
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.role = req.body.role || user.role;

    res.status(200).json({ message: "User updated", user });
});

// DELETE /users/:id – Delete user
app.delete('/users/:id', (req, res) => {
    const userId = req.params.id;
    const index = users.findIndex(u => u.id === userId);
    if (index === -1) {
        return res.status(404).json({ error: "User not found" });
    }
    const deletedUser = users.splice(index, 1);
    res.status(200).json({ message: "User deleted", user: deletedUser[0] });
});


// Run the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
