// app.js
require('dotenv').config();
const express = require('express');
const app = express();
const db = require('./config/db');
const bodyParser = require('body-parser');
const cors = require('cors');

// Import Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
//
app.use(bodyParser.json({ limit: '50mb' }));
app.use(cors());
// Middleware
// Store the current text and connected clients
let currentText = '';
const clients = [];
const selectclients = [];
// let currentText = '';


app.use(express.json());

app.post('/upload', (req, res) => {
   
    const { email, name, phone} = req.body;
    // Insert image URL into MySQL
    const query = `INSERT INTO autoboard(email, name, phone) VALUES(?,?,?)`;
    // currentText = email; // Update currentText variable
  
    db.query(query, [email, name, phone], (err, result) => {
        if (err) {
            console.error('Error inserting image URL into database:', err);
            return res.status(500).json({ message: 'Database error.' });
        }

        res.status(200).json({ message: 'Uploaded successfully.', email });
    });
});

let clientss = [];

// SSE endpoint for client
app.get('/selectevents', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    clientss.push(res); // Add client connection

    // Send a keep-alive message every 30 seconds to avoid disconnection
    const keepAlive = setInterval(() => {
        res.write(`data: keep-alive\n\n`);
    }, 30000);

    // Remove client when disconnected
    req.on('close', () => {
        clearInterval(keepAlive);
        clientss = clientss.filter(client => client !== res);
    });
});

// Function to broadcast events to all connected clients
function sendEventToClients(randomEmail) {
  console.log(`Sending event to clients: ${randomEmail}`);
  clientss.forEach(client => {
        client.write(`data: ${JSON.stringify({ email: randomEmail })}\n\n`);
    });
}

// Admin app - fetch random email and trigger event
app.post('/select-email', (req, res) => {
    // Query to fetch a random email from the autoboard table
    db.query('SELECT email FROM autoboard ORDER BY RAND() LIMIT 1', (error, results) => {
        if (error) throw error;
        const randomEmail = results[0].email;

        // Broadcast the random email to all clients
        sendEventToClients(randomEmail);
        res.status(200).json({ email: randomEmail });
    });
});


// Routes Middleware
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);



// Root Endpoint
app.get('/', (req, res) => {
  res.send('Node.js Express.js MySQL JWT Authentication API');
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server Error', error: err.message });
});

// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
