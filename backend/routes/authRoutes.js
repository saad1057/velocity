const express = require('express');
const router = express.Router();
const { handleSignup, handleSignin, handleLogout } = require('../controllers/authController');

router.post('/signup', handleSignup);
router.post('/signin', handleSignin);
router.post('/logout', handleLogout);

module.exports = router;

