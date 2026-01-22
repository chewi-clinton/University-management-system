# Role-Based Access Control (RBAC) for Notifications

## Overview

The Notifications system now implements **Role-Based Access Control** to ensure that each user type (Student, Finance Officer, Admin) sees contextually relevant content with appropriate actions.

---

## Architecture

### Backend Implementation

#### 1. **Enhanced Notification Model** (`Backend/models/Notification.js`)

The Notification schema now includes:

```javascript
{
  userId,                    // Target user (optional for role-based)
  role,                      // 'student' | 'finance_officer' | 'admin' | 'all'
  title,                     // Notification title
  body,                      // Notification description
  category,                  // 'Finance' | 'HR' | 'Marketing' | 'System'
  action,                    // 'pay_now' | 'review' | 'approve' | 'view'
  actionTarget,              // Reference ID (invoiceId, payrollId, etc.)
  actionPage,                // Navigation target (/payment-checkout, etc.)
  meta: {
    studentId,
    invoiceId,
    payrollMonth,
    leaveRequestId,
    amount,
    departmentName,
    employeeName
  },
  urgency,                   // 'low' | 'medium' | 'high' | 'critical'
  read,                      // Boolean
  timestamps
}
```

#### 2. **Role Detection** (`Backend/controllers/notificationsController.js`)

```javascript
const getUserRole = async (userId) => {
  const user = await User.findById(userId);
  if (user.role === 'admin' || user.isAdmin) return 'admin';
  if (user.role === 'finance' || user.isFinance) return 'finance_officer';
  return 'student';
};
```

#### 3. **Role-Based Queries**

```javascript
// Get notifications for user's role
let query = {
  $or: [
    { role: 'all' },           // System-wide notifications
    { role: userRole },        // Role-specific notifications
    { userId }                 // User-specific notifications
  ]
};

// Optional category filter
if (category !== 'All') {
  query.category = category;
}

const notifications = await Notification.find(query)
  .sort({ createdAt: -1 })
  .limit(limit);
```

#### 4. **API Endpoints**

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/notifications` | GET | Get role-based notifications |
| `/api/notifications/summary` | GET | Get notification stats by role |
| `/api/notifications/:id/read` | PUT | Mark notification as read |
| `/api/notifications/read/all` | PUT | Mark all as read |
| `/api/notifications/role/:role` | GET | Get notifications for specific role (testing) |

---

## Role-Specific Experiences

### 👨‍🎓 **Student View**

**Purpose**: Personal administrative and financial journey tracking

**Content Types**:
- **Finance Alerts**: Tuition invoices, payment confirmations, balance updates
- **Marketing Updates**: Discounts, new services, campus offers
- **Academic Alerts**: Exam schedules, library notifications, course updates

**Example Notifications**:
```javascript
{
  title: "Your tuition invoice for Fall 2024 is ready",
  body: "Please review and pay your invoice. Payment is due by December 15.",
  category: "Finance",
  action: "pay_now",
  actionPage: "/payment-checkout",
  meta: {
    invoiceId: "invoice_123",
    amount: 5000
  }
}
```

**Action Buttons**:
- **"Pay Now"** → Deep links to checkout with `invoiceId` pre-filled
- **"View"** → General information pages
- **"Mark Read"** → Dismiss notification

**Filter Behavior**:
- Finance: Personal tuition & payment notifications
- Marketing: Personalized campus offers & discounts
- HR: Leave status updates, employment info
- System: Academic alerts, library, general announcements

---

### 💼 **Finance Officer View**

**Purpose**: System health, task management, and operational oversight

**Content Types**:
- **System Tasks**: Payroll processing status, batch payment confirmations
- **Escalations**: Budget limits, payment gateway errors, critical issues
- **HR Integration**: Leave requests affecting payroll, staffing changes
- **Reports**: Marketing campaign performance, financial summaries

**Example Notifications**:
```javascript
{
  title: "Payroll for January 2024 is ready for final review",
  body: "All staff calculations complete. Please review and approve.",
  category: "HR",
  action: "review",
  actionPage: "/payroll-processing",
  meta: {
    payrollMonth: "January 2024"
  }
}
```

**Action Buttons**:
- **"Review"** → Deep links to relevant dashboard with data pre-loaded
- **"Approve"** → Takes to approval workflow
- **"Mark Read"** → Dismiss notification

**Urgency Indicators**:
- 🔴 **Critical**: Payment gateway errors, budget overruns
- 🟠 **High**: Payroll review, important approvals
- 🟡 **Medium**: Leave requests, standard updates
- 🔵 **Low**: Informational updates

**Filter Behavior**:
- Finance: Payment processing, batch confirmations, financial summaries
- HR: Leave approvals, staffing notifications
- Marketing: Campaign performance metrics, ROI reports
- System: Critical errors, system alerts

---

### 👨‍💼 **Admin View**

**Purpose**: System-wide oversight and administration

**Access**: All notifications across all roles

**Features**:
- View all notifications in the system
- User role assignment and verification
- System health monitoring
- Audit trail access

---

## Sample Data

### Seeded Notifications

**Students** receive:
- Tuition invoice ready ($5,000) → "Pay Now" button
- Payment confirmation ($500) → "View" button
- Bus route promotion → "View" button
- Exam schedule → "View" button
- Library book overdue → "View" button

**Finance Officers** receive:
- Payroll ready for review (January) → "Review" button
- 50 payments processed ($127,500) → "View" button
- Budget limit reached (Marketing 95%) → "Review" button
- Leave request approval (John Smith) → "Approve" button
- Payment gateway error (critical) → "Review" button
- Campaign revenue target met ($50,000) → "View" button

**All Users** receive:
- System maintenance scheduled
- Security update notification

---

## Implementation Guide

### Adding a New Role-Based Notification

**Backend**:
```javascript
const notification = new Notification({
  userId: targetUser._id,           // Optional: specific user
  role: 'finance_officer',          // Or 'student', 'admin', 'all'
  title: 'Monthly Payroll Review',
  body: 'October payroll is ready for approval.',
  category: 'HR',
  action: 'review',
  actionTarget: 'payroll_oct_2024',
  actionPage: '/payroll-processing',
  urgency: 'high',
  meta: {
    payrollMonth: 'October 2024'
  }
});
await notification.save();
```

**Frontend** (automatic via updated controller):
- Component reads `userRole` from API response
- Displays appropriate action button based on role
- Navigates to correct page on action click
- Shows metadata relevant to user type

---

## Testing RBAC

### Test as Different Roles

**Using test endpoint** (for development):
```bash
# Get notifications for students
GET /api/notifications/role/student

# Get notifications for finance officers
GET /api/notifications/role/finance_officer

# Get notifications for admins
GET /api/notifications/role/admin
```

### Test Workflow

1. **Student Journey**:
   - Login as student
   - See Finance: "Your invoice is ready"
   - Click "Pay Now" → Navigate to checkout
   - See Marketing: "Bus route discount"
   - See System: "Exam schedule"

2. **Finance Officer Journey**:
   - Login as finance officer
   - See HR: "Payroll review needed"
   - See System: "Budget warning" (critical)
   - Click "Review" → Navigate to payroll processing
   - See Finance: "50 payments processed"

3. **Filter Experience**:
   - Click Finance filter → See only Finance & HR categories relevant to role
   - Click Marketing → See role-specific marketing content
   - Click "All" → See all role-appropriate notifications

---

## Database Queries

### Query 1: Get All Student Notifications
```javascript
db.notifications.find({
  $or: [
    { role: 'student' },
    { role: 'all' }
  ]
})
```

### Query 2: Get User-Specific + Role Notifications
```javascript
db.notifications.find({
  $or: [
    { userId: ObjectId("user_id") },
    { role: 'all' },
    { role: 'finance_officer' }  // if user is finance officer
  ]
})
```

### Query 3: Get Unread Finance Notifications
```javascript
db.notifications.find({
  $or: [
    { role: 'finance_officer' },
    { role: 'all' }
  ],
  category: 'Finance',
  read: false
})
```

---

## File Changes Summary

### New Files
- `Backend/scripts/seedNotifications.js` - Seed script with role-based sample data

### Modified Files
1. **Backend/models/Notification.js**
   - Added role field
   - Added category, action, urgency fields
   - Added metadata structure
   - 38 lines → 48 lines (+10)

2. **Backend/controllers/notificationsController.js**
   - Completely rewritten with RBAC logic
   - Added getUserRole() function
   - Implemented role-based queries
   - Added summary endpoint
   - 10 lines → 180+ lines

3. **Backend/routes/notifications.js**
   - Updated to use notificationsController (was notificationController)
   - Added new endpoints for RBAC
   - 9 lines → 16 lines

4. **Frontend/src/pages/Notifications.impl.jsx**
   - Added role-based action button logic
   - Added urgency color coding
   - Added metadata display
   - Added proper navigation
   - 110 lines → 280+ lines

---

## Future Enhancements

1. **Notification Preferences**
   - Allow users to customize which categories they receive
   - Frequency preferences (real-time, daily digest, etc.)

2. **Email Notifications**
   - Send urgent notifications via email
   - Weekly digest emails

3. **Web Notifications**
   - Push notifications for critical alerts
   - Desktop notifications for time-sensitive tasks

4. **Notification Templates**
   - Dynamic templates with role-specific messaging
   - Localization support

5. **Analytics**
   - Track notification open rates by role
   - Measure action completion rates

---

## Status

✅ **Implementation Complete**

- [x] Notification model with RBAC support
- [x] Backend controller with role-based queries
- [x] Updated routes with new endpoints
- [x] Enhanced frontend with role-specific actions
- [x] Sample data seeded (12 notifications)
- [x] Navigation integration
- [x] Urgency indicators
- [x] Metadata display

**Ready for testing with different user roles!**
