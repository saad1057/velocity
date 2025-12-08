const express = require('express');
const router = express.Router();
const {
  handleCreateUser,
  handleGetAllUsers,
  handleGetUserById,
  handleUpdateUser,
  handleDeleteUser,
  handleGetCurrentUser,
  handleUpdateCurrentUser
} = require('../controllers/userController');
const { authenticate, isAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/me', authenticate, handleGetCurrentUser);
router.put('/me', authenticate, upload.single('picture'), handleUpdateCurrentUser);

router.post('/', authenticate, isAdmin, handleCreateUser);
router.get('/', authenticate, isAdmin, handleGetAllUsers);
router.get('/:id', authenticate, isAdmin, handleGetUserById);
router.put('/:id', authenticate, isAdmin, handleUpdateUser);
router.delete('/:id', authenticate, isAdmin, handleDeleteUser);

module.exports = router;

