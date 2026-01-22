const mongoose = require('mongoose');
const Payroll = require('../models/Payroll');
const Employee = require('../models/Employee');
require('dotenv').config();

async function seedPayroll() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/university-management');
    console.log('Connected to MongoDB');

    // Clear existing records completely
    await Payroll.deleteMany({});
    await Employee.deleteMany({});
    console.log('Cleared existing payroll and employee records');

    // Create sample employees first
    const employees = await Employee.insertMany([
      {
        name: 'Dr. John Smith',
        email: 'john.smith@university.edu',
        position: 'Associate Professor',
        department: 'faculty',
        employeeId: 'EMP001',
        salary: 1200000,
        phone: '+237671234501'
      },
      {
        name: 'Sarah Wilson',
        email: 'sarah.wilson@university.edu',
        position: 'Administrative Officer',
        department: 'admin',
        employeeId: 'EMP002',
        salary: 800000,
        phone: '+237671234502'
      },
      {
        name: 'Mark Davis',
        email: 'mark.davis@university.edu',
        position: 'IT Support Specialist',
        department: 'it',
        employeeId: 'EMP003',
        salary: 900000,
        phone: '+237671234503'
      },
      {
        name: 'Angela Brown',
        email: 'angela.brown@university.edu',
        position: 'Facilities Manager',
        department: 'support',
        employeeId: 'EMP004',
        salary: 750000,
        phone: '+237671234504'
      }
    ]);

    console.log('Created 4 sample employees');

    // Create payroll records with different statuses
    const now = new Date();
    const dueDate = new Date(now.getFullYear(), now.getMonth() + 1, 5);
    
    const payrollRecords = [
      {
        employeeId: employees[0]._id,
        baseSalary: 1200000,
        deductions: 200000,
        netPay: 1000000,
        status: 'ready',
        period: 'January 2026',
        dueDate: dueDate,
        createdAt: now
      },
      {
        employeeId: employees[1]._id,
        baseSalary: 800000,
        deductions: 160000,
        netPay: 640000,
        status: 'flagged',
        period: 'January 2026',
        dueDate: dueDate,
        createdAt: now
      },
      {
        employeeId: employees[2]._id,
        baseSalary: 900000,
        deductions: 150000,
        netPay: 750000,
        status: 'approved',
        period: 'January 2026',
        dueDate: dueDate,
        createdAt: now
      },
      {
        employeeId: employees[3]._id,
        baseSalary: 750000,
        deductions: 150000,
        netPay: 600000,
        status: 'paid',
        period: 'January 2026',
        dueDate: dueDate,
        paidDate: new Date(),
        createdAt: now
      }
    ];

    await Payroll.insertMany(payrollRecords);
    console.log('✅ Created 4 sample payroll records:');
    console.log('   1. Dr. John Smith (Faculty) - Status: READY');
    console.log('   2. Sarah Wilson (Admin) - Status: FLAGGED');
    console.log('   3. Mark Davis (IT) - Status: APPROVED');
    console.log('   4. Angela Brown (Support) - Status: PAID');
    console.log('\n💰 Total Payout: XAF 2,990,000');
    console.log('👥 Total Employees: 4');
    console.log('⚠️ Flagged: 1');

    await mongoose.connection.close();
    console.log('\n✅ Seeding complete! Database connection closed.');
  } catch (error) {
    console.error('❌ Error seeding payroll data:', error);
    process.exit(1);
  }
}

seedPayroll();
