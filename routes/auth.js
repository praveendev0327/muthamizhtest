// routes/auth.js
const express = require('express');
const router = express.Router();
const { register, login, eventRegisteration } = require('../controllers/authController');

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', register);
//Event Registration
router.post('/eventregister', eventRegisteration);

// @route   POST /api/auth/login
// @desc    Login user and return JWT
// @access  Public
router.post('/login', login);

module.exports = router;
