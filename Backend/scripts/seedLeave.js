const mongoose = require('mongoose')
const Employee = require('../models/Employee')
const User = require('../models/User')
const Leave = require('../models/Leave')
const LeaveRequest = require('../models/LeaveRequest')

require('dotenv').config()

const CALENDAR_EVENTS = {
  'Budget Review': { start: new Date(2024, 0, 27), end: new Date(2024, 0, 31) }, // Jan 27-31
  'End of Semester': { start: new Date(2024, 1, 15), end: new Date(2024, 1, 28) } // Feb 15-28
}

// Function to calculate working days between two dates
function calculateWorkingDays(start, end) {
  let count = 0
  const current = new Date(start)
  
  while (current <= end) {
    const day = current.getDay()
    if (day !== 0 && day !== 6) { // Exclude weekends
      count++
    }
    current.setDate(current.getDate() + 1)
  }
  
  return count
}

// Function to check calendar conflicts
function checkCalendarConflict(startDate, endDate) {
  for (const [eventName, eventDates] of Object.entries(CALENDAR_EVENTS)) {
    const eventStart = new Date(eventDates.start)
    const eventEnd = new Date(eventDates.end)
    
    // Check if leave overlaps with event
    if (startDate <= eventEnd && endDate >= eventStart) {
      return { hasConflict: true, conflictReason: eventName }
    }
  }
  
  return { hasConflict: false, conflictReason: null }
}

async function seedLeaveData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    // Get sample employees
    const employees = await Employee.find()
    if (employees.length === 0) {
      console.log('❌ No employees found in database')
      return
    }

    console.log(`Found ${employees.length} employees`)

    // Delete existing leave and leave requests
    await Leave.deleteMany({})
    await LeaveRequest.deleteMany({})
    console.log('🗑️  Cleared existing leave records')

    // Create leave balances for each employee
    const leaveBalances = []
    for (const employee of employees) {
      const leave = new Leave({
        employeeId: employee._id,
        annualBalance: 12,
        sickBalance: 5,
        studyBalance: 3,
        totalTaken: 0
      })
      leaveBalances.push(leave)
    }
    
    await Leave.insertMany(leaveBalances)
    console.log(`✅ Created ${leaveBalances.length} leave balance records`)

    // Create sample leave requests (using available employees)
    const now = new Date()
    const leaveRequests = []

    // Request 1: Pending annual leave (with calendar conflict)
    const start1 = new Date(now.getFullYear(), 0, 27) // Jan 27
    const end1 = new Date(now.getFullYear(), 0, 30)   // Jan 30
    const duration1 = calculateWorkingDays(start1, end1)
    const conflict1 = checkCalendarConflict(start1, end1)

    leaveRequests.push(new LeaveRequest({
      employeeId: employees[0]._id,
      leaveType: 'annual',
      startDate: start1,
      endDate: end1,
      duration: duration1,
      reason: 'Taking a short break to attend my brother\'s wedding out of state.',
      status: 'pending',
      calendarConflict: conflict1.hasConflict,
      conflictReason: conflict1.conflictReason
    }))

    // Request 2: Pending sick leave with document
    if (employees.length > 1) {
      const start2 = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const end2 = new Date(start2)
      const duration2 = calculateWorkingDays(start2, end2)
      const conflict2 = checkCalendarConflict(start2, end2)

      leaveRequests.push(new LeaveRequest({
        employeeId: employees[1]._id,
        leaveType: 'sick',
        startDate: start2,
        endDate: end2,
        duration: duration2,
        reason: 'Not feeling well, severe migraine. Will be unavailable on Slack.',
        documentUrl: '/documents/medical_cert_sarah.pdf',
        status: 'pending',
        calendarConflict: conflict2.hasConflict,
        conflictReason: conflict2.conflictReason
      }))
    }

    // Request 3: Approved study leave
    if (employees.length > 2) {
      const start3 = new Date(now.getFullYear(), 2, 10) // Mar 10
      const end3 = new Date(now.getFullYear(), 2, 12)   // Mar 12
      const duration3 = calculateWorkingDays(start3, end3)
      const conflict3 = checkCalendarConflict(start3, end3)

      leaveRequests.push(new LeaveRequest({
        employeeId: employees[2]._id,
        leaveType: 'study',
        startDate: start3,
        endDate: end3,
        duration: duration3,
        reason: 'Attending professional development conference on AI and Machine Learning.',
        status: 'approved',
        approvedBy: 'manager@university.edu',
        approvalReason: 'Good opportunity for professional growth in relevant field.',
        calendarConflict: conflict3.hasConflict,
        conflictReason: conflict3.conflictReason
      }))
    }

    // Request 4: Approved annual leave
    if (employees.length > 3) {
      const start4 = new Date(now.getFullYear(), 3, 15) // Apr 15
      const end4 = new Date(now.getFullYear(), 3, 18)   // Apr 18
      const duration4 = calculateWorkingDays(start4, end4)
      const conflict4 = checkCalendarConflict(start4, end4)

      leaveRequests.push(new LeaveRequest({
        employeeId: employees[3]._id,
        leaveType: 'annual',
        startDate: start4,
        endDate: end4,
        duration: duration4,
        reason: 'Family vacation planned in advance.',
        status: 'approved',
        approvedBy: 'manager@university.edu',
        approvalReason: 'Approved - advance notice provided and no conflicts.',
        calendarConflict: conflict4.hasConflict,
        conflictReason: conflict4.conflictReason
      }))
    }

    // Request 5: Denied leave
    if (employees.length > 4) {
      const start5 = new Date(now.getFullYear(), 1, 20) // Feb 20
      const end5 = new Date(now.getFullYear(), 1, 22)   // Feb 22
      const duration5 = calculateWorkingDays(start5, end5)
      const conflict5 = checkCalendarConflict(start5, end5)

      leaveRequests.push(new LeaveRequest({
        employeeId: employees[4]._id,
        leaveType: 'annual',
        startDate: start5,
        endDate: end5,
        duration: duration5,
        reason: 'Personal travel.',
        status: 'denied',
        approvedBy: 'manager@university.edu',
        approvalReason: 'Cannot approve - overlaps with critical semester end activities and insufficient notice.',
        calendarConflict: conflict5.hasConflict,
        conflictReason: conflict5.conflictReason
      }))
    }

    await LeaveRequest.insertMany(leaveRequests)
    console.log(`✅ Created ${leaveRequests.length} sample leave requests`)

    console.log('\n📊 Leave Request Summary:')
    console.log('─'.repeat(50))
    leaveRequests.forEach((req, idx) => {
      console.log(`${idx + 1}. Employee: ${employees[idx].name}`)
      console.log(`   Type: ${req.leaveType} | Status: ${req.status}`)
      console.log(`   Date: ${req.startDate.toDateString()} to ${req.endDate.toDateString()} (${req.duration} days)`)
      if (req.calendarConflict) {
        console.log(`   ⚠️  Conflict: ${req.conflictReason}`)
      }
      console.log('')
    })

    console.log('\n✅ Leave seeding completed successfully!')
    process.exit(0)

  } catch (error) {
    console.error('❌ Error seeding leave data:', error.message)
    process.exit(1)
  }
}

seedLeaveData()
