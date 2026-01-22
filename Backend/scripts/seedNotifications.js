const mongoose = require('mongoose')
const Notification = require('../models/Notification')
const User = require('../models/User')

require('dotenv').config()

async function seedNotifications() {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    // Get sample users
    const users = await User.find().limit(5)
    if (users.length === 0) {
      console.log('❌ No users found in database')
      return
    }

    console.log(`Found ${users.length} users`)

    // Delete existing notifications
    await Notification.deleteMany({})
    console.log('🗑️  Cleared existing notifications')

    const notifications = []
    const now = new Date()

    // ============ STUDENT NOTIFICATIONS ============
    
    // Student 1: Tuition invoice ready
    notifications.push(new Notification({
      userId: users[0]._id,
      role: 'student',
      title: 'Your tuition invoice for Fall 2024 is ready',
      body: 'Please review and pay your invoice. Payment is due by December 15, 2024.',
      category: 'Finance',
      action: 'pay_now',
      actionTarget: 'invoice_123',
      actionPage: '/payment-checkout',
      urgency: 'high',
      meta: {
        invoiceId: 'invoice_123',
        amount: 5000,
        studentId: users[0]._id.toString()
      },
      createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000) // 2 hours ago
    }))

    // Student 1: Payment confirmation
    notifications.push(new Notification({
      userId: users[0]._id,
      role: 'student',
      title: 'Payment of $500 confirmed',
      body: 'Your partial payment has been successfully processed. Remaining balance: $4,500.',
      category: 'Finance',
      action: 'view',
      urgency: 'low',
      meta: {
        studentId: users[0]._id.toString(),
        amount: 500
      },
      createdAt: new Date(now.getTime() - 24 * 60 * 60 * 1000) // 1 day ago
    }))

    // Student 1: Marketing update
    notifications.push(new Notification({
      userId: users[0]._id,
      role: 'student',
      title: 'New Bus Route available for your area!',
      body: 'Route 5A now serves Downtown and University District. Get a 20% discount this month!',
      category: 'Marketing',
      action: 'view',
      urgency: 'low',
      createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
    }))

    // Student 1: Academic alert
    notifications.push(new Notification({
      role: 'all',
      title: 'Exam schedule released',
      body: 'Final exams for Spring 2024 are now available. Check the academic calendar for dates.',
      category: 'System',
      action: 'view',
      urgency: 'medium',
      createdAt: new Date(now.getTime() - 3 * 60 * 60 * 1000)
    }))

    // Student 2: Library book overdue
    if (users.length > 1) {
      notifications.push(new Notification({
        userId: users[1]._id,
        role: 'student',
        title: 'Library book overdue',
        body: 'Your book "Advanced Algorithms" is 3 days overdue. Late fees are accumulating.',
        category: 'System',
        action: 'view',
        urgency: 'high',
        createdAt: new Date(now.getTime() - 60 * 60 * 1000) // 1 hour ago
      }))

      // Student 2: Early bird discount
      notifications.push(new Notification({
        userId: users[1]._id,
        role: 'student',
        title: 'Early Bird discount ends in 2 days',
        body: 'Claim your 15% discount on on-campus housing before the offer expires!',
        category: 'Marketing',
        action: 'view',
        urgency: 'medium',
        createdAt: new Date(now.getTime() - 4 * 60 * 60 * 1000)
      }))
    }

    // ============ FINANCE OFFICER NOTIFICATIONS ============

    // Finance Officer 1: Payroll ready for review
    if (users.length > 2) {
      notifications.push(new Notification({
        userId: users[2]._id,
        role: 'finance_officer',
        title: 'Payroll for January 2024 is ready for final review',
        body: 'All staff payroll calculations are complete. Please review and approve before processing.',
        category: 'HR',
        action: 'review',
        actionTarget: 'payroll_jan_2024',
        actionPage: '/payroll-processing',
        urgency: 'high',
        meta: {
          payrollMonth: 'January 2024'
        },
        createdAt: new Date(now.getTime() - 30 * 60 * 1000) // 30 minutes ago
      }))

      // Finance Officer 1: System task
      notifications.push(new Notification({
        userId: users[2]._id,
        role: 'finance_officer',
        title: '50 student payments were processed today',
        body: 'Total amount: $127,500. All transactions completed successfully.',
        category: 'Finance',
        action: 'view',
        actionPage: '/financial-reports',
        urgency: 'low',
        meta: {
          amount: 127500
        },
        createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000)
      }))

      // Finance Officer 1: Critical escalation
      notifications.push(new Notification({
        userId: users[2]._id,
        role: 'finance_officer',
        title: 'Budget limit reached for Marketing Department',
        body: 'Marketing department has reached 95% of their quarterly budget. Please review.',
        category: 'System',
        action: 'review',
        urgency: 'critical',
        meta: {
          departmentName: 'Marketing',
          budgetPercentage: 95
        },
        createdAt: new Date(now.getTime() - 1 * 60 * 60 * 1000)
      }))

      // Finance Officer 1: Leave approval needed (HR integration)
      notifications.push(new Notification({
        userId: users[2]._id,
        role: 'finance_officer',
        title: 'New leave request from John Smith requires financial approval',
        body: 'Annual leave request for 5 days. This will affect payroll processing.',
        category: 'HR',
        action: 'approve',
        actionTarget: 'leave_req_456',
        actionPage: '/leave-management',
        urgency: 'medium',
        meta: {
          employeeName: 'John Smith',
          leaveRequestId: 'leave_req_456'
        },
        createdAt: new Date(now.getTime() - 3 * 60 * 60 * 1000)
      }))
    }

    // Finance Officer 2: Payment gateway error
    if (users.length > 3) {
      notifications.push(new Notification({
        userId: users[3]._id,
        role: 'finance_officer',
        title: 'Critical error in payment gateway sync',
        body: 'Payment gateway sync failed for 12 transactions. Manual reconciliation required.',
        category: 'System',
        action: 'review',
        urgency: 'critical',
        createdAt: new Date(now.getTime() - 15 * 60 * 1000)
      }))

      // Finance Officer 2: Marketing report
      notifications.push(new Notification({
        userId: users[3]._id,
        role: 'finance_officer',
        title: '"Early Bird" marketing campaign revenue target met',
        body: 'The Early Bird promotion has successfully reached its revenue target of $50,000.',
        category: 'Marketing',
        action: 'view',
        actionPage: '/financial-reports',
        urgency: 'low',
        meta: {
          amount: 50000
        },
        createdAt: new Date(now.getTime() - 12 * 60 * 60 * 1000)
      }))
    }

    // ============ GENERAL SYSTEM NOTIFICATIONS ============

    // System-wide notifications visible to all
    notifications.push(new Notification({
      role: 'all',
      title: 'System maintenance scheduled',
      body: 'The system will undergo maintenance on Saturday from 2:00 AM to 4:00 AM EST.',
      category: 'System',
      action: 'view',
      urgency: 'medium',
      createdAt: new Date(now.getTime() - 10 * 60 * 60 * 1000)
    }))

    notifications.push(new Notification({
      role: 'all',
      title: 'New security update available',
      body: 'A critical security patch has been released. All systems will be updated automatically.',
      category: 'System',
      action: 'view',
      urgency: 'high',
      createdAt: new Date(now.getTime() - 20 * 60 * 60 * 1000)
    }))

    await Notification.insertMany(notifications)
    console.log(`✅ Created ${notifications.length} sample notifications`)

    console.log('\n📊 Notification Summary:')
    console.log('─'.repeat(60))
    console.log(`Total: ${notifications.length}`)
    console.log(`Student notifications: ${notifications.filter(n => n.role === 'student').length}`)
    console.log(`Finance Officer notifications: ${notifications.filter(n => n.role === 'finance_officer').length}`)
    console.log(`General notifications (all): ${notifications.filter(n => n.role === 'all').length}`)
    console.log('')
    console.log('By Category:')
    const byCategory = {}
    notifications.forEach(n => {
      byCategory[n.category] = (byCategory[n.category] || 0) + 1
    })
    Object.entries(byCategory).forEach(([cat, count]) => {
      console.log(`  ${cat}: ${count}`)
    })

    console.log('\n✅ Notification seeding completed successfully!')
    process.exit(0)

  } catch (error) {
    console.error('❌ Error seeding notifications:', error.message)
    process.exit(1)
  }
}

seedNotifications()
