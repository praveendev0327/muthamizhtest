// routes/users.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getAllUsers, getUserById, updateUser, deleteUser, searchMember, getAllJobPost, getJobPostByEmail, createMemberProfile, getProfileByEmail, getBannerByEmail, getCvByEmail, createBannerByEmail, createJobPostByEmail, createCvByEmail, deleteMemberBanners } = require('../controllers/userController');
const socketIo = require('socket.io');
// Apply auth middleware to all routes in this router
router.use(auth);

// @route   GET /api/users
// @desc    Get all users
// @access  Private
router.get('/', getAllUsers);

//Get All Job Post
router.get('/getAllJobPost', getAllJobPost);

// Get List By ID
router.post('/getsearchMember', searchMember);
router.post('/getJobPostByEmail', getJobPostByEmail);
router.post('/getProfileByEmail', getProfileByEmail);
router.post('/getBannerByEmail', getBannerByEmail);
router.post('/getCvByEmail', getCvByEmail);

// Post Create
router.post('/createMemberProfile', createMemberProfile);
router.post('/createBannerByEmail', createBannerByEmail);
router.post('/createJobPostByEmail', createJobPostByEmail);
router.post('/createCvByEmail', createCvByEmail);

//Delete by ID
router.post('/deleteMemberBanners', deleteMemberBanners);




// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Private
router.get('/:id', getUserById);

// @route   PUT /api/users/:id
// @desc    Update user by ID
// @access  Private
router.put('/:id', updateUser);

// @route   DELETE /api/users/:id
// @desc    Delete user by ID
// @access  Private
router.delete('/:id', deleteUser);

module.exports = router;
