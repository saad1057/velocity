const authService = require('../services/authService');

/**
 * Handle user signup (recruiter registration)
 * POST /api/auth/signup
 */
const handleSignup = async (req, res) => {
  try {
    const { firstname, lastname, companyname, email, password } = req.body;

    // Validate required fields
    if (!firstname || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide firstname, email, and password'
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

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Create user
    const user = await authService.signup({
      firstname,
      lastname,
      companyname,
      email,
      password
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
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
      message: 'Error during signup',
      error: error.message
    });
  }
};

/**
 * Handle user signin (recruiter login)
 * POST /api/auth/signin
 */
const handleSignin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Authenticate user
    const { user, token } = await authService.signin(email, password);

    // Set token in cookie (optional, can also send in response)
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user,
        token
      }
    });
  } catch (error) {
    if (error.message === 'Invalid email or password') {
      return res.status(401).json({
        success: false,
        message: error.message
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error during signin',
      error: error.message
    });
  }
};

module.exports = {
  handleSignup,
  handleSignin
};

