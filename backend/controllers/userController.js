const userService = require('../services/userService');

/**
 * Handle create user (admin only)
 * POST /api/users
 */
const handleCreateUser = async (req, res) => {
  try {
    const { firstname, lastname, companyname, email, password, role } = req.body;

    // Validate required fields
    if (!firstname || !email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide firstname and email'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Validate role if provided
    if (role && !['admin', 'recruiter'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Role must be either "admin" or "recruiter"'
      });
    }

    // Validate password if provided
    if (password && password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    const user = await userService.createUser({
      firstname,
      lastname,
      companyname,
      email,
      password,
      role
    });

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: user
    });
  } catch (error) {
    if (error.message === 'User with this email already exists') {
      return res.status(409).json({
        success: false,
        message: error.message
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error creating user',
      error: error.message
    });
  }
};

/**
 * Handle get all users (admin only)
 * GET /api/users
 */
const handleGetAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json({
      success: true,
      message: 'Users retrieved successfully',
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving users',
      error: error.message
    });
  }
};

/**
 * Handle get user by ID (admin only)
 * GET /api/users/:id
 */
const handleGetUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userService.getUserById(id);
    res.status(200).json({
      success: true,
      message: 'User retrieved successfully',
      data: user
    });
  } catch (error) {
    if (error.message === 'User not found') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error retrieving user',
      error: error.message
    });
  }
};

/**
 * Handle update user (admin only)
 * PUT /api/users/:id
 */
const handleUpdateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Validate email format if provided
    if (updateData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(updateData.email)) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid email address'
        });
      }
    }

    // Validate role if provided
    if (updateData.role && !['admin', 'recruiter'].includes(updateData.role)) {
      return res.status(400).json({
        success: false,
        message: 'Role must be either "admin" or "recruiter"'
      });
    }

    // Validate password length if provided
    if (updateData.password && updateData.password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    const user = await userService.updateUser(id, updateData);
    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: user
    });
  } catch (error) {
    if (error.message === 'User not found') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    if (error.message === 'Email is already taken by another user') {
      return res.status(409).json({
        success: false,
        message: error.message
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error updating user',
      error: error.message
    });
  }
};

/**
 * Handle delete user (admin only)
 * DELETE /api/users/:id
 */
const handleDeleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userService.deleteUser(id);
    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
      data: user
    });
  } catch (error) {
    if (error.message === 'User not found') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: error.message
    });
  }
};

const handleGetCurrentUser = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const user = await userService.getCurrentUser(userId);
    
    const userObject = user.toObject ? user.toObject() : user;
    if (userObject.picture && userObject.picture.data) {
      userObject.picture = {
        data: userObject.picture.data.toString('base64'),
        contentType: userObject.picture.contentType
      };
    }
    
    res.status(200).json({
      success: true,
      message: 'Current user retrieved successfully',
      data: userObject
    });
  } catch (error) {
    if (error.message === 'User not found') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error retrieving current user',
      error: error.message
    });
  }
};

const handleUpdateCurrentUser = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const companyname = req.body.companyname;
    const email = req.body.email;
    const password = req.body.password;
    const currentPassword = req.body.currentPassword;

    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid email address'
        });
      }
    }

    if (password) {
      if (!currentPassword) {
        return res.status(400).json({
          success: false,
          message: 'Current password is required to change password'
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'Password must be at least 6 characters long'
        });
      }

      const user = await require('../model/user').findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      const { comparePassword } = require('../utils/password');
      const isPasswordValid = await comparePassword(currentPassword, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({
          success: false,
          message: 'Current password is incorrect'
        });
      }
    }

    const updateData = {};
    if (firstname !== undefined) updateData.firstname = firstname;
    if (lastname !== undefined) updateData.lastname = lastname;
    if (companyname !== undefined) updateData.companyname = companyname;
    if (email !== undefined) updateData.email = email;
    if (password) updateData.password = password;

    if (req.file) {
      updateData.picture = {
        data: req.file.buffer,
        contentType: req.file.mimetype
      };
    }

    const updatedUser = await userService.updateUser(userId, updateData);
    
    const userObject = updatedUser.toObject ? updatedUser.toObject() : updatedUser;
    if (userObject.picture && userObject.picture.data) {
      userObject.picture = {
        data: userObject.picture.data.toString('base64'),
        contentType: userObject.picture.contentType
      };
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: userObject
    });
  } catch (error) {
    if (error.message === 'User not found') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    if (error.message === 'Email is already taken by another user') {
      return res.status(409).json({
        success: false,
        message: error.message
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message
    });
  }
};

module.exports = {
  handleCreateUser,
  handleGetAllUsers,
  handleGetUserById,
  handleUpdateUser,
  handleDeleteUser,
  handleGetCurrentUser,
  handleUpdateCurrentUser
};

