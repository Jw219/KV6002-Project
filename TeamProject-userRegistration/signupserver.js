// Import required modules
const express = require('express');
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

//james
const path = require('path');
const { exec } = require('child_process'); // Import exec from child_process

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

        //EMAIL BIT
        // Send the response after successful registration
        res.status(201).json({ message: "User registered successfully!", userId: result.insertedId });

        // Correctly point to the send_phishing_email.py script in the "public" folder
        const pythonScriptPath = path.join(__dirname, 'public', 'send_phishing_email.py');
        
        // Log the path to make sure it's correct
        console.log('Resolved Python script path:', pythonScriptPath);

        // After successful registration, send phishing email to the user
        exec(`python3 ${pythonScriptPath} ${email}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing Python script: ${error.message}`);
                return; // Do not send another response here
            }
            if (stderr) {
                console.error(`stderr: ${stderr}`);
                return; // Do not send another response here
            }
            console.log(`Phishing email sent successfully to ${email}`);
        });
        //EMAIL END

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
