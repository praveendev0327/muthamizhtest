// controllers/authController.js
const User = require('../models/User');
const bcrypt = require('../utils/hash');
const jwt = require('../utils/jwt');

const register = async (req, res) => {
  const { email, password, company, tradeid } = req.body;

  // Simple validation
  // if (!company || !email || !activity) {
  //   return res.status(400).json({ message: 'Please enter all fields.' });
  // }

  try {
    // Check if user exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists.' });
    }

    // Hash password
    // const hashedPassword = await bcrypt.hashPassword(password);

    // Create user
    const userId = await User.create(email,password, company, tradeid);

    res.status(201).json({ message: 'User registered successfully.', userId });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

const eventRegisteration = async (req, res) => {
    const { email, company, phone, rollup, food} = req.body;

    try {
      // Check if user exists
      const existingUser = await User.findByEmailEventReg(email);
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists.' });
      }
  
      // Hash password
      // const hashedPassword = await bcrypt.hashPassword(password);
  
      // Create user
      const userId = await User.eventRegisterationQuery(email, company, phone, rollup, food);
  
      res.status(201).json({ message: 'User registered successfully.', userId });
    } catch (err) {
      res.status(500).json({ message: 'Server Error', error: err.message });
    }
  };

  const luckydrawRegisteration = async (req, res) => {
    const {name, email,  phone} = req.body;

    try {
      // Check if user exists
      const existingUser = await User.findByEmailLuckydrawReg(email);
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists.' });
      }
  
      // Hash password
      // const hashedPassword = await bcrypt.hashPassword(password);
  
      // Create user
      const userId = await User.luckydrawRegisterationQuery(name, email,  phone);
  
      res.status(201).json({ message: 'User registered successfully.', userId });
    } catch (err) {
      res.status(500).json({ message: 'Server Error', error: err.message });
    }
  };

  const BBARegisteration = async (req, res) => {
    const {name, email,  phone} = req.body;

    try {
      // Check if user exists
      const existingUser = await User.findByEmailRegBBA(email);
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists.' });
      }
  
      // Hash password
      // const hashedPassword = await bcrypt.hashPassword(password);
  
      // Create user
      const userId = await User.BBARegisterationQuery(name, email,  phone);
  
      res.status(201).json({ message: 'User registered successfully.', userId });
    } catch (err) {
      res.status(500).json({ message: 'Server Error', error: err.message });
    }
  };

const login = async (req, res) => {
  const { email, password } = req.body;

  // Simple validation
  if (!email || !password) {
    return res.status(400).json({ message: 'Please enter all fields.' });
  }

  try {
    // Check for existing user
    const user = await User.login(email, password);
    console.log(!user ? "true" : "false");
    if (!user) return res.status(400).json({ message: 'Invalid credentials.' });

    // Validate password
    // const isMatch = await bcrypt.comparePassword(password, user.password);
    // if (!isMatch) return res.status(400).json({ message: 'Invalid credentials.' });

    // Create and assign token
    const token = jwt.generateToken({ id: user.id, username: user.username, email: user.email });

    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};


const createAutoBoardBanner = async (req, res) => {
  const { email, image} = req.body;
  try {
    const userId = await User.createAutoBoardBannerQuery(email, image);
    res.status(201).json({ message: 'AutoBoardBanner added successfully.', userId });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

module.exports = {
  register,
  login,
  eventRegisteration,
  createAutoBoardBanner,
  luckydrawRegisteration,
  BBARegisteration
};
