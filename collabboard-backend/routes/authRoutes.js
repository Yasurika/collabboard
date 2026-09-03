const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { registerUser, loginUser, getUsers } = require('../controllers/authController');

// Register Route
router.post('/register', registerUser);

// Login Route
router.post('/login', loginUser);

// Users List Route
router.get('/users', authMiddleware, getUsers);

module.exports = router;