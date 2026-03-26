const userService = require('../services/userService');

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
  handleGetCurrentUser,
  handleUpdateCurrentUser
};

