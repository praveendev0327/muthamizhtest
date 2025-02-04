// controllers/userController.js
const User = require('../models/User');
const bcrypt = require('../utils/hash');


const getAllUsers = async (req, res) => {
  try {
    const users = await User.getAll();
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

const getAllJobPost = async (req, res) => {
    try {
      const users = await User.getAllJobPostQuery();
      res.json({ users });
    } catch (err) {
      res.status(500).json({ message: 'Server Error', error: err.message });
    }
  };

const searchMember = async (req, res) => {
    const { work} = req.body;
  
    try {
      const data = await User.searchMemberQuery(work);
      res.json({ data });
    } catch (err) {
      res.status(500).json({ message: 'Server Error', error: err.message });
    }
  };

  const getJobPostByEmail = async (req, res) => {
    const { email} = req.body;
  
    try {
      const data = await User.getJobPostByEmailQuery(email);
      res.json({ data });
    } catch (err) {
      res.status(500).json({ message: 'Server Error', error: err.message });
    }
  };

  const getProfileByEmail = async (req, res) => {
    const { email} = req.body;
  
    try {
      const data = await User.getProfileByEmailQuery(email);
      res.json({ data });
    } catch (err) {
      res.status(500).json({ message: 'Server Error', error: err.message });
    }
  };

  const getBannerByEmail = async (req, res) => {
    const { email} = req.body;
  
    try {
      const data = await User.getBannerByEmailQuery(email);
      res.json({ data });
    } catch (err) {
      res.status(500).json({ message: 'Server Error', error: err.message });
    }
  };

  const getCvByEmail = async (req, res) => {
    const { email} = req.body;
  
    try {
      const data = await User.getCvByEmailQuery(email);
      res.json({ data });
    } catch (err) {
      res.status(500).json({ message: 'Server Error', error: err.message });
    }
  };

const getUserById = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

const createMemberProfile = async (req, res) => {
    const { firstname, lastname, email, image, company, work, url, address} = req.body;
    try {
      const existingUser = await User.findByEmailProfile(email);
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists.' });
      }
      const userId = await User.createMemberProfileQuery(firstname, lastname, email, image, company, work, url, address);
      res.status(201).json({ message: 'User registered successfully.', userId });
    } catch (err) {
      res.status(500).json({ message: 'Server Error', error: err.message });
    }
  };

  const createBannerByEmail = async (req, res) => {
    const { email, image} = req.body;
    try {
      const userId = await User.createBannerByEmailQuery(email, image);
      res.status(201).json({ message: 'User registered successfully.', userId });
    } catch (err) {
      res.status(500).json({ message: 'Server Error', error: err.message });
    }
  };

  const createJobPostByEmail = async (req, res) => {
    const { email, title, description} = req.body;
    try {
      const userId = await User.createJobPostByEmailQuery(email, title, description);
      res.status(201).json({ message: 'User registered successfully.', userId });
    } catch (err) {
      res.status(500).json({ message: 'Server Error', error: err.message });
    }
  };

  const createCvByEmail = async (req, res) => {
    const {email, name, cv } = req.body;
    try {
      const userId = await User.createJobPostByEmailQuery(email, name, cv );
      res.status(201).json({ message: 'User registered successfully.', userId });
    } catch (err) {
      res.status(500).json({ message: 'Server Error', error: err.message });
    }
  };

const updateUser = async (req, res) => {
  const userId = req.params.id;
  const { username, email, password } = req.body;

  try {
    // If password is being updated, hash it
    let hashedPassword = null;
    if (password) {
      hashedPassword = await bcrypt.hashPassword(password);
    }

    const affectedRows = await User.update(userId, username, email, hashedPassword);

    if (affectedRows === 0) return res.status(404).json({ message: 'User not found or no changes made.' });

    res.json({ message: 'User updated successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

const deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const affectedRows = await User.delete(userId);
    if (affectedRows === 0) return res.status(404).json({ message: 'User not found.' });

    res.json({ message: 'User deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

const deleteMemberBanners = async (req, res) => {
  const {id } = req.body;

  try {
    const affectedRows = await User.deleteBanner(id);
    if (affectedRows === 0) return res.status(404).json({ message: 'User not found.' });

    res.json({ message: 'User deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};







module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  searchMember,
  getAllJobPost,
  getJobPostByEmail,
  createMemberProfile,
  getProfileByEmail,
  getBannerByEmail,
  getCvByEmail,
  createBannerByEmail,
  createJobPostByEmail,
  createCvByEmail,
  deleteMemberBanners
  
};
