const User = require('../model/user');
const { hashPassword, comparePassword } = require('../utils/password');
const { generateToken } = require('../utils/jwt');

/**
 * Register a new user (recruiter)
 * @param {Object} userData - User registration data
 * @param {string} userData.firstname - User first name
 * @param {string} userData.lastname - User last name
 * @param {string} userData.companyname - Company name
 * @param {string} userData.email - User email
 * @param {string} userData.password - Plain text password
 * @returns {Promise<Object>} - Created user object (without password)
 */
const signup = async (userData) => {
  const { firstname, lastname, companyname, email, password } = userData;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  // Hash the password
  const hashedPassword = await hashPassword(password);

  // Create new user (default role is recruiter)
  const user = await User.create({
    firstname,
    lastname,
    companyname,
    email,
    password: hashedPassword,
    role: 'recruiter'
  });

  // Return user without password
  const userObject = user.toObject();
  delete userObject.password;
  return userObject;
};

/**
 * Authenticate user and generate token
 * @param {string} email - User email
 * @param {string} password - Plain text password
 * @returns {Promise<Object>} - User object and JWT token
 */
const signin = async (email, password) => {
  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Invalid email or password');
  }

  // Compare passwords
  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  // Generate JWT token
  const token = generateToken({
    userId: user._id.toString(),
    email: user.email,
    role: user.role
  });

  // Return user without password and token
  const userObject = user.toObject();
  delete userObject.password;
  return {
    user: userObject,
    token
  };
};

module.exports = {
  signup,
  signin
};

