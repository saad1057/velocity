const User = require('../model/user');
const { hashPassword, comparePassword } = require('../utils/password');
const { generateToken } = require('../utils/jwt');

const signup = async (userData) => {
  const { firstname, lastname, companyname, email, password } = userData;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  const hashedPassword = await hashPassword(password);

  const user = await User.create({
    firstname,
    lastname,
    companyname,
    email,
    password: hashedPassword,
    role: 'recruiter'
  });

  const userObject = user.toObject();
  delete userObject.password;
  return userObject;
};

const signin = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  const token = generateToken({
    userId: user._id.toString(),
    email: user.email,
    role: user.role
  });

  const userObject = user.toObject();
  delete userObject.password;
  return {
    user: userObject,
    token
  };
};

const resetPassword = async (email, newPassword) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('User not found');
  }

  const hashedPassword = await hashPassword(newPassword);
  user.password = hashedPassword;
  await user.save();

  const userObject = user.toObject();
  delete userObject.password;
  return userObject;
};

module.exports = {
  signup,
  signin,
  resetPassword
};

