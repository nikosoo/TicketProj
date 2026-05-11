// routes/userRoutes.js
const express = require('express');
const { registerUser, loginUser, getUserInfo, updateUserDetails,getAllUsers,deleteUser,updateUserByAdmin } = require('../controllers/userController');
const router = express.Router();

// Registration endpoint
router.post('/register', registerUser);

// Login endpoint
router.post('/login', loginUser);

// Get user info endpoint
router.get('/user-info', getUserInfo);

// Update user details endpoint
router.put('/update', updateUserDetails);
router.get('/all-users', getAllUsers);

router.delete('/users/:id', deleteUser); // Delete user
router.put('/users/:id', updateUserByAdmin); // Update user by admin

module.exports = router;
