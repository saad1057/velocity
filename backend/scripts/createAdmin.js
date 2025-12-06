require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../model/user');
const { hashPassword } = require('../utils/password');

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/Velocity";

async function createAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@velocity.com' });
    if (existingAdmin) {
      console.log('Admin user already exists!');
      console.log('Email: admin@velocity.com');
      console.log('You can use this account or delete it first to create a new one.');
      process.exit(0);
    }

    // Create admin user
    const hashedPassword = await hashPassword('admin123');
    const admin = await User.create({
      firstname: 'Admin',
      lastname: 'User',
      email: 'admin@velocity.com',
      password: hashedPassword,
      role: 'admin'
    });

    console.log('✅ Admin user created successfully!');
    console.log('Email: admin@velocity.com');
    console.log('Password: admin123');
    console.log('Role: admin');
    console.log('\n⚠️  Please change the password after first login!');

    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error.message);
    process.exit(1);
  }
}

createAdmin();

