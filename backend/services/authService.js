const User = require('../model/user');
const { hashPassword, comparePassword } = require('../utils/password');
const { generateToken } = require('../utils/jwt');

const generateUniqueCode = async () => {
  let code;
  let exists = true;
  while (exists) {
    code = Math.floor(1000 + Math.random() * 9000).toString();
    const existing = await User.findOne({ companyCode: code });
    if (!existing) exists = false;
  }
  return code;
};

const signup = async (userData) => {
  const { firstname, lastname, companyname, email, password, role, companyCode } = userData;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  const hashedPassword = await hashPassword(password);

  let userRole = role || 'recruiter';
  let status = 'approved';
  let isApproved = true;
  let newCompanyCode = null;
  let adminId = null;

  if (userRole === 'admin') {
    newCompanyCode = await generateUniqueCode();
  } else if (userRole === 'employee') {
    if (!companyCode) {
      throw new Error('Company code is required for employee signup');
    }
    const admin = await User.findOne({ companyCode, role: 'admin' });
    if (!admin) {
      throw new Error('Invalid company code');
    }
    adminId = admin._id;
    status = 'pending';
    isApproved = false;
  }

  const user = await User.create({
    firstname,
    lastname,
    companyname,
    email,
    password: hashedPassword,
    role: userRole,
    companyCode: newCompanyCode,
    adminId,
    status,
    isApproved
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

  if (user.status !== 'approved') {
    if (user.status === 'pending') {
      throw new Error('Pending approval');
    }
    if (user.status === 'rejected') {
      throw new Error('Rejected by admin');
    }
  }

  const tokenParams = {
    userId: user._id.toString(),
    email: user.email,
    role: user.role
  };
  
  if (user.adminId) {
    tokenParams.adminId = user.adminId.toString();
  }

  const token = generateToken(tokenParams);

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

