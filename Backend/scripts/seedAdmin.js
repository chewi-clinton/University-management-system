const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');

async function seedAdminUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/university-management');
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@university.edu' });
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists with email: admin@university.edu');
      console.log('Username: admin');
      console.log('Password: admin123');
      await mongoose.connection.close();
      process.exit(0);
    }

    // Create admin user
    const adminUser = new User({
      name: 'System Administrator',
      email: 'admin@university.edu',
      password: 'admin123', // Will be hashed by pre-save hook
      role: 'admin'
    });

    await adminUser.save();
    console.log('✅ Admin user created successfully!');
    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🛡️  ADMIN ACCOUNT CREATED');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    console.log('📧 Email:    admin@university.edu');
    console.log('🔑 Password: admin123');
    console.log('');
    console.log('✨ You can now login as admin and access the admin dashboard!');
    console.log('');
    console.log('IMPORTANT: Change this password after first login!');
    console.log('');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding admin user:', error.message);
    await mongoose.connection.close();
    process.exit(1);
  }
}

seedAdminUser();
