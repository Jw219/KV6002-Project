const express = require('express');
const { MongoClient } = require('mongodb');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(express.json());
app.use(cors());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Atlas Connection
let db;
const uri = process.env.MONGODB_URI;

MongoClient.connect(uri)
    .then(client => {
        db = client.db('user_data'); // Specify the database name
        console.log('MongoDB connected');
    })
    .catch(err => {
        console.log('MongoDB connection error:', err);
    });

// User login route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log(`Received email: ${email} and password: ${password}`); // Log to debug

    try {
        // Debugging: Log the connection to the collection
        console.log('Searching for user with email:', email);

        const user = await db.collection('userData').findOne({ email });

        if (!user) {
            console.log('User not found in the database');
            return res.status(400).json({ message: 'User not found' });
        }

        // Directly compare the plain text password
        if (user.password !== password) {
            console.log('Invalid password');
            return res.status(400).json({ message: 'Invalid password' });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ message: 'Login successful', token });
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Default route to serve login.html
app.get('/', (req, res) => {
    // Serve the login.html file
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
