const User = require('../model/user');
const { hashPassword } = require('../utils/password');

/**
 * Create a new user (admin only)
 * @param {Object} userData - User data
 * @returns {Promise<Object>} - Created user (without password)
 */
const createUser = async (userData) => {
  const { firstname, lastname, companyname, email, password, role } = userData;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  // Hash the password if provided
  let hashedPassword = null;
  if (password) {
    hashedPassword = await hashPassword(password);
  }

  // Create user object
  const userObject = {
    firstname,
    lastname,
    companyname,
    email,
    role: role || 'recruiter'
  };

  if (hashedPassword) {
    userObject.password = hashedPassword;
  }

  const user = await User.create(userObject);

  // Return user without password
  const userObj = user.toObject();
  delete userObj.password;
  return userObj;
};

/**
 * Get all users
 * @returns {Promise<Array>} - Array of users (without passwords)
 */
const getAllUsers = async () => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  return users;
};

/**
 * Get user by ID
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - User object (without password)
 */
const getUserById = async (userId) => {
  const user = await User.findById(userId).select('-password');
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

/**
 * Update user by ID
 * @param {string} userId - User ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} - Updated user (without password)
 */
const updateUser = async (userId, updateData) => {
  const { firstname, lastname, companyname, email, password, role } = updateData;

  // Check if user exists
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  // If email is being updated, check if it's already taken
  if (email && email !== user.email) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('Email is already taken by another user');
    }
  }

  // Build update object
  const updateObject = {};
  if (firstname !== undefined) updateObject.firstname = firstname;
  if (lastname !== undefined) updateObject.lastname = lastname;
  if (companyname !== undefined) updateObject.companyname = companyname;
  if (email !== undefined) updateObject.email = email;
  if (role !== undefined) updateObject.role = role;

  // Hash password if provided
  if (password) {
    updateObject.password = await hashPassword(password);
  }

  // Update user
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    updateObject,
    { new: true, runValidators: true }
  ).select('-password');

  return updatedUser;
};

/**
 * Delete user by ID
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - Deleted user (without password)
 */
const deleteUser = async (userId) => {
  const user = await User.findByIdAndDelete(userId).select('-password');
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

/**
 * Get current user (authenticated user)
 * @param {string} userId - User ID from token
 * @returns {Promise<Object>} - User object (without password)
 */
const getCurrentUser = async (userId) => {
  const user = await User.findById(userId).select('-password');
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getCurrentUser
};

