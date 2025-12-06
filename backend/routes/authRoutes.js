const express = require('express');
const router = express.Router();
const { handleSignup, handleSignin } = require('../controllers/authController');

// Public routes - no authentication required
router.post('/signup', handleSignup);
router.post('/signin', handleSignin);

module.exports = router;

