#!/usr/bin/env node
/**
 * Seed a hardcoded Finance Officer account into the database
 * Usage: node scripts/seedFinanceOfficer.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const FINANCE_OFFICER = {
  name: 'Finance Officer',
  email: 'finance@university.edu',
  password: 'FinanceOfficer@2026',
  role: 'finance'
};

async function seedFinanceOfficer() {
  try {
    // Connect to MongoDB
    const dbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/university-management';
    await mongoose.connect(dbUri);
    console.log('✓ Connected to MongoDB');

    // Check if finance officer already exists
    const existing = await User.findOne({ email: FINANCE_OFFICER.email });
    if (existing) {
      console.log('✓ Finance Officer account already exists:', FINANCE_OFFICER.email);
      await mongoose.disconnect();
      return;
    }

    // Create finance officer user
    const user = new User(FINANCE_OFFICER);
    await user.save();
    console.log('✓ Finance Officer account created successfully');
    console.log(`  Email: ${FINANCE_OFFICER.email}`);
    console.log(`  Password: ${FINANCE_OFFICER.password}`);
    console.log(`  Role: ${FINANCE_OFFICER.role}`);

    await mongoose.disconnect();
    console.log('✓ Done');
  } catch (err) {
    console.error('✗ Error seeding finance officer:', err.message);
    process.exit(1);
  }
}

seedFinanceOfficer();
