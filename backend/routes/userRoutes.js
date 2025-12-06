const express = require('express');
const router = express.Router();
const {
  handleCreateUser,
  handleGetAllUsers,
  handleGetUserById,
  handleUpdateUser,
  handleDeleteUser,
  handleGetCurrentUser
} = require('../controllers/userController');
const { authenticate, isAdmin } = require('../middleware/auth');

// Get current user - accessible to all authenticated users
router.get('/me', authenticate, handleGetCurrentUser);

// Admin only routes - require both authentication and admin role
router.post('/', authenticate, isAdmin, handleCreateUser);
router.get('/', authenticate, isAdmin, handleGetAllUsers);
router.get('/:id', authenticate, isAdmin, handleGetUserById);
router.put('/:id', authenticate, isAdmin, handleUpdateUser);
router.delete('/:id', authenticate, isAdmin, handleDeleteUser);

module.exports = router;

