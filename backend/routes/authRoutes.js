const express = require('express');
const router = express.Router();
const { handleSignup, handleSignin, handleForgotPassword, handleLogout } = require('../controllers/authController');

router.post('/signup', handleSignup);
router.post('/signin', handleSignin);
router.post('/forgot-password', handleForgotPassword);
router.post('/logout', handleLogout);

module.exports = router;

