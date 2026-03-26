const express = require('express');
const router = express.Router();
const {
  handleGetCurrentUser,
  handleUpdateCurrentUser
} = require('../controllers/userController');
const { authenticate } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/me', authenticate, handleGetCurrentUser);
router.put('/me', authenticate, upload.single('picture'), handleUpdateCurrentUser);

module.exports = router;

