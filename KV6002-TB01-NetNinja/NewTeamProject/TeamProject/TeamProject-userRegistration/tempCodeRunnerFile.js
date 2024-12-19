// Import required modules
const express = require('express');
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Create an Express app
const app = express();
const PORT = 5000;
// Serve static files from the "public" directory
app.use(express.static('public'));
// Middleware to parse JSON requests
app.use(express.json());

app.get('/', (req, res) => { res.sendFile(__dirname + '/signup.html'); });

// Get MongoDB connection URI from environment variables
const uri = process.env.MONGODB_URI;
if (!uri) {
    console.error("MONGO_URI is not defined in the .env file.");
    process.exit(1);
}

// Create a MongoDB client
const client = new MongoClient(uri);

// Connect to MongoDB and cache the database connection
let db;
async function connectToDatabase() {
    try {
        await client.connect();
        console.log("Connected to MongoDB Atlas!");
        db = client.db("user_data"); // Replace with your database name
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
}

// Start the database connection
connectToDatabase();

// Define a route for /register
app.post('/register', async (req, res) => {
    try {
        const { firstName, lastName, email, password, age } = req.body;

        // Basic validation
        if (!firstName || !lastName || !email || !password || !age) {
            return res.status(400).json({ error: "All fields are required." });
        }

        if (age < 18 || age > 110) {
            return res.status(400).json({ error: "Age must be between 18 and 110." });
        }

        // Insert user data into the database
        const usersCollection = db.collection("userData");
        const result = await usersCollection.insertOne({
            firstName,
            lastName,
            email,
            password, 
            age
        });

        res.status(201).json({ message: "User registered successfully!", userId: result.insertedId });

    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// Gracefully handle shutdown
process.on("SIGINT", async () => {
    console.log("Closing MongoDB connection...");
    await client.close();
    process.exit(0);
});
