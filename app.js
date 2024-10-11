// app.js
require('dotenv').config();
const express = require('express');
const app = express();
const db = require('./config/db');

// Import Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');

// Middleware
app.use(express.json());

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
