
const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

// initialize the app and the local port
const app = express();
const port = 5002;

// CORS to deal with the middleware for the app
app.use(cors());
app.use(bodyParser.json());

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB connection URI add in the neccessary to access the cluster
const uri = 'mongodb+srv://<db_username>:<db_password>@cluster0.u0bfh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Create a new mongoDB client
const client = new MongoClient(uri);

// Database and collection references
let db;
let userCollection;

// Connect to mongoDB
client.connect()
  .then(() => {
    console.log('MongoDB connected');
    db = client.db('user_data');
    userCollection = db.collection('userData');
  })
  .catch((err) => console.error('MongoDB connection error:', err));

// Serve the userman.html file on root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'userman.html'));
});

// To update user details (Storing plaintext password)
app.put('/updateUser', async (req, res) => {
  const { email, firstName, lastName, password } = req.body;

  try {
    let user = await userCollection.findOne({ email });

    if (!user) return res.status(404).send('User not found');

    // Prepare the update data
    const updatedData = {};
    if (firstName) updatedData.firstName = firstName;
    if (lastName) updatedData.lastName = lastName;

    // If password is provided, store it as plaintext
    if (password) {
      updatedData.password = password;
    }

    // Update the user in the database
    await userCollection.updateOne({ email }, { $set: updatedData });

    res.status(200).send('User updated successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// API to delete the user
app.delete('/deleteUser', async (req, res) => {
  const { email } = req.body;

  try {
    let user = await userCollection.findOne({ email });

    if (!user) return res.status(404).send('User not found');

    await userCollection.deleteOne({ email });

    res.status(200).json({ message: 'User deleted successfully', redirect: 'http://localhost:5001/netninja/home.html' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
