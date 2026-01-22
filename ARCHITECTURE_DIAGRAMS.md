# System Architecture Diagrams - Notifications RBAC

## 1. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    UNIVERSITY MANAGEMENT SYSTEM                  │
│                   Role-Based Notifications                       │
└─────────────────────────────────────────────────────────────────┘

                         ┌──────────────┐
                         │   Frontend   │
                         │    React     │
                         └──────┬───────┘
                                │
                    ┌───────────┴───────────┐
                    │                       │
            GET /api/notifications    PUT /api/notifications/:id/read
            GET /api/notifications/summary
                    │                       │
                    ▼                       ▼
        ┌───────────────────────────────────────────┐
        │         Backend Express.js Server         │
        │  http://localhost:5000/api/notifications   │
        └───────────────┬─────────────────────────┬─┘
                        │                         │
            ┌───────────▼──────────┐   ┌────────▼──────────┐
            │   Auth Middleware    │   │ Role Detection    │
            │  - Verify JWT Token  │   │ - Determine Role  │
            │  - Extract User ID   │   │ - Student/Finance │
            └───────────┬──────────┘   └────────┬──────────┘
                        │                        │
                        └────────────┬───────────┘
                                     │
                    ┌────────────────▼──────────────────┐
                    │   Query Builder (Controller)      │
                    │  - Role-based queries             │
                    │  - Category filtering             │
                    │  - Pagination                     │
                    └────────────────┬──────────────────┘
                                     │
                    ┌────────────────▼──────────────────┐
                    │    MongoDB Database               │
                    │  - Notification Collection        │
                    │  - Indexed on: role, userId       │
                    │  - 12+ Sample records             │
                    └──────────────────────────────────┘
```

---

## 2. Request-Response Flow

```
USER (Student)
      │
      ├─ Has JWT token stored in localStorage
      │
      ▼
LOGIN VERIFIED
      │
      ├─ Token sent in Authorization header
      │
      ▼
BACKEND: GET /api/notifications
      │
      ├─ Extract user._id from token
      │
      ▼
ROLE DETECTION
      │
      ├─ Query User collection
      ├─ Check user.role or user.isFinance
      ├─ Result: "student"
      │
      ▼
BUILD QUERY
      │
      ├─ $or: [
      │   { role: 'all' },        ← System-wide
      │   { role: 'student' },    ← Student role
      │   { userId: user._id }    ← User-specific
      │ ]
      │
      ├─ Add category filter if provided
      │ └─ category: "Finance"
      │
      ▼
DATABASE QUERY
      │
      ├─ db.notifications.find(query)
      │   .sort({ createdAt: -1 })
      │   .limit(50)
      │
      ▼
RESULTS (Student only sees)
      │
      ├─ "Your tuition invoice ready" (role: student, cat: Finance)
      ├─ "Payment $500 confirmed" (role: student, cat: Finance)
      ├─ "Bus route discount" (role: student, cat: Marketing)
      ├─ "Exam schedule" (role: all, cat: System)
      │
      ├─ NOT showing:
      │ ├─ Payroll notifications (role: finance_officer)
      │ ├─ Budget warnings (role: finance_officer)
      │ └─ Leave requests (role: finance_officer)
      │
      ▼
RESPONSE JSON
      │
      ├─ {
      │   success: true,
      │   userRole: "student",
      │   unreadCount: 3,
      │   notifications: [...]
      │ }
      │
      ▼
FRONTEND RENDERING
      │
      ├─ Detect userRole = "student"
      ├─ For each notification:
      │  ├─ Show category badge
      │  ├─ Show urgency color (red/orange/yellow/blue)
      │  ├─ Render action button based on role:
      │  │  └─ "Pay Now" for pay_now action
      │  ├─ Show metadata (amount, dates, etc.)
      │  └─ Add "Mark Read" button
      │
      ▼
USER SEES
      │
      ├─ "Your tuition invoice for Fall 2024 is ready" 🔴 HIGH
      │  Amount: $5,000
      │  [💚 Pay Now] [Mark Read]
      │
      └─ Clean, role-appropriate interface
```

---

## 3. Role Comparison Matrix

```
┌────────────────────────────────────────────────────────────────┐
│            ROLE-BASED NOTIFICATION VISIBILITY                  │
├─────────────────────────┬──────────────┬──────────────┬────────┤
│ Notification Type       │   Student    │   Finance    │ Admin  │
├─────────────────────────┼──────────────┼──────────────┼────────┤
│ Tuition Invoice         │     ✅       │      ❌      │   ✅   │
│ Payment Confirmation    │     ✅       │      ❌      │   ✅   │
│ Payroll Ready           │     ❌       │      ✅      │   ✅   │
│ Budget Alert (Critical) │     ❌       │      ✅      │   ✅   │
│ Leave Approval Request  │     ❌       │      ✅      │   ✅   │
│ Bus Route Promotion     │     ✅       │      ❌      │   ✅   │
│ Campaign Performance    │     ❌       │      ✅      │   ✅   │
│ Exam Schedule           │     ✅       │      ✅      │   ✅   │
│ System Maintenance      │     ✅       │      ✅      │   ✅   │
│ Payment Gateway Error   │     ❌       │      ✅      │   ✅   │
└─────────────────────────┴──────────────┴──────────────┴────────┘

✅ = Can see and act on
❌ = Cannot see
```

---

## 4. Action Button Routing

```
STUDENT SEES
├─ "Pay Now" Button
│  └─ onClick()
│     ├─ getActionButton() returns:
│     │  ├─ label: "Pay Now"
│     │  ├─ color: "bg-green-500"
│     │  └─ onClick: "/payment-checkout?invoiceId=invoice_123"
│     │
│     └─ navigate(url)
│        └─ Route to: /payment-checkout
│           └─ Pre-fill: invoiceId=invoice_123
│
└─ "View" Button
   └─ onClick()
      ├─ getActionButton() returns:
      │  ├─ label: "View"
      │  ├─ color: "bg-blue-500"
      │  └─ onClick: "/dashboard"
      │
      └─ navigate("/dashboard")

FINANCE OFFICER SEES
├─ "Review" Button (for Payroll)
│  └─ onClick()
│     ├─ getActionButton() returns:
│     │  ├─ label: "Review"
│     │  ├─ color: "bg-purple-500"
│     │  └─ onClick: "/payroll-processing?month=january_2024"
│     │
│     └─ navigate(url)
│        └─ Route to: /payroll-processing
│           └─ Pre-fill: month=january_2024
│
└─ "Approve" Button (for Leave Request)
   └─ onClick()
      ├─ getActionButton() returns:
      │  ├─ label: "Approve"
      │  ├─ color: "bg-purple-500"
      │  └─ onClick: "/leave-management?requestId=leave_456"
      │
      └─ navigate(url)
         └─ Route to: /leave-management
            └─ Pre-fill: requestId=leave_456
```

---

## 5. Database Query Patterns

```
PATTERN 1: Get All Notifications for Student Role
┌──────────────────────────────────────────────────────┐
│ db.notifications.find({                              │
│   $or: [                                             │
│     { role: 'all' },        ← System notifications   │
│     { role: 'student' },    ← Student only           │
│     { userId: ObjectId(...) }   ← User-specific      │
│   ]                                                  │
│ })                                                   │
└──────────────────────────────────────────────────────┘
      │
      ▼
   RETURNS: 5 notifications
   ├─ Tuition invoice (role: student)
   ├─ Payment confirmed (role: student)
   ├─ Bus promotion (role: student)
   ├─ Exam schedule (role: all)
   └─ Library alert (userId: specific)


PATTERN 2: Get Finance Officer Notifications with Category Filter
┌──────────────────────────────────────────────────────┐
│ db.notifications.find({                              │
│   $and: [                                            │
│     {                                                │
│       $or: [                                         │
│         { role: 'all' },                             │
│         { role: 'finance_officer' },                 │
│         { userId: ObjectId(...) }                    │
│       ]                                              │
│     },                                               │
│     { category: 'HR' }  ← Added filter               │
│   ]                                                  │
│ })                                                   │
└──────────────────────────────────────────────────────┘
      │
      ▼
   RETURNS: 2 notifications
   ├─ Payroll ready (role: finance_officer, category: HR)
   └─ Leave request (role: finance_officer, category: HR)


PATTERN 3: Get Unread Count by Category
┌──────────────────────────────────────────────────────┐
│ db.notifications.aggregate([                         │
│   {                                                  │
│     $match: {                                        │
│       $or: [                                         │
│         { role: 'student' },                         │
│         { role: 'all' }                              │
│       ],                                             │
│       read: false                                    │
│     }                                                │
│   },                                                 │
│   {                                                  │
│     $group: {                                        │
│       _id: '$category',                              │
│       count: { $sum: 1 }                             │
│     }                                                │
│   }                                                  │
│ ])                                                   │
└──────────────────────────────────────────────────────┘
      │
      ▼
   RETURNS:
   ├─ { _id: "Finance", count: 2 }
   ├─ { _id: "Marketing", count: 2 }
   └─ { _id: "System", count: 1 }
```

---

## 6. Component Hierarchy

```
Notifications Page
├─ Notifications.jsx (Lazy Load Wrapper)
│  │
│  └─ Notifications.impl.jsx (Main Implementation)
│     │
│     ├─ TopBar (Header)
│     │  └─ Title: "Notifications (student)"
│     │
│     ├─ Category Filter Bar (Sticky)
│     │  ├─ [All] [Finance] [HR] [Marketing] [System]
│     │  └─ onClick: setCategory()
│     │
│     ├─ Grouped Notifications
│     │  ├─ "Today" Section
│     │  │  └─ NotificationCard (Component)
│     │  │     ├─ Category Icon
│     │  │     ├─ Title
│     │  │     ├─ Body
│     │  │     ├─ Metadata (conditionally)
│     │  │     ├─ Action Button (role-specific)
│     │  │     └─ Mark Read Button
│     │  │
│     │  ├─ "Yesterday" Section
│     │  │  └─ NotificationCard (x multiple)
│     │  │
│     │  └─ "Older" Section
│     │     └─ NotificationCard (x multiple)
│     │
│     └─ Empty State (if no notifications)
│        └─ "No notifications"
```

---

## 7. State Management Flow

```
useState Hooks:
├─ [category, setCategory]
│  └─ Current filter: "All" | "Finance" | "HR" | "Marketing" | "System"
│
├─ [loading, setLoading]
│  └─ API request in progress: true | false
│
├─ [error, setError]
│  └─ Error message or null
│
├─ [notifications, setNotifications]
│  └─ Array of notification objects
│
└─ [userRole, setUserRole]
   └─ User's role from API: "student" | "finance_officer" | "admin"

useEffect Hooks:
├─ useEffect(() => load(category), [category])
│  └─ Runs when category changes → Fetch notifications
│
└─ useEffect(() => fetchData(), [])
   └─ Runs on mount → Load initial data

useMemo Hooks:
└─ useMemo(() => groupByDay(notifications), [notifications])
   └─ Group notifications by date (Today/Yesterday/Older)
```

---

## 8. Urgency Color Coding

```
URGENCY SYSTEM
├─ 🔴 CRITICAL (Red)
│  │  Background: bg-red-100 dark:bg-red-900/30
│  │  Text: text-red-700 dark:text-red-300
│  │  Examples:
│  │  ├─ Budget limit exceeded
│  │  ├─ Payment gateway error
│  │  └─ System critical alert
│  │
│  └─ Display: Bold red icon, prominent styling
│
├─ 🟠 HIGH (Orange)
│  │  Background: bg-orange-100 dark:bg-orange-900/30
│  │  Text: text-orange-700 dark:text-orange-300
│  │  Examples:
│  │  ├─ Tuition invoice due
│  │  ├─ Payroll ready for review
│  │  └─ Library book overdue
│  │
│  └─ Display: Bold orange icon, clear styling
│
├─ 🟡 MEDIUM (Yellow)
│  │  Background: bg-yellow-100 dark:bg-yellow-900/30
│  │  Text: text-yellow-700 dark:text-yellow-300
│  │  Examples:
│  │  ├─ Leave request approval
│  │  ├─ Early discount ending soon
│  │  └─ Exam schedule released
│  │
│  └─ Display: Moderate styling
│
└─ 🔵 LOW (Blue) [Default]
   │  Background: bg-blue-100 dark:bg-blue-900/30
   │  Text: text-blue-700 dark:text-blue-300
   │  Examples:
   │  ├─ Payment confirmed
   │  ├─ Bus route available
   │  └─ General information
   │
   └─ Display: Subtle styling, informational only
```

---

## 9. User Journey - Student

```
START: Student Login
       │
       ├─ Enter credentials
       ├─ Backend validates
       └─ Returns JWT token
       
STORE: Save token to localStorage
       │
       └─ fetch('api/notifications')
           ├─ Header: Authorization: Bearer TOKEN
           └─ Backend determines: role = "student"

FILTER: User navigates to Notifications page
        │
        ├─ Default view: "All" category
        │  Sees:
        │  ├─ Tuition invoice
        │  ├─ Payment confirmation
        │  ├─ Marketing promos
        │  └─ System alerts
        │
        └─ Click "Finance" filter
           Sees:
           ├─ Tuition invoice
           └─ Payment confirmation

ACTION: User clicks "Pay Now"
        │
        ├─ Frontend calls: navigate(url)
        ├─ URL: /payment-checkout?invoiceId=invoice_123
        └─ Pre-filled checkout form

MARK READ: User clicks "Mark Read"
           │
           └─ PUT /api/notifications/ID/read
              ├─ Backend updates: read = true
              └─ Frontend refreshes notifications
                 └─ Notification appears faded
```

---

## 10. User Journey - Finance Officer

```
START: Finance Officer Login
       │
       ├─ Enter credentials
       ├─ Backend validates
       └─ Returns JWT token (with role: finance_officer)
       
STORE: Save token to localStorage
       │
       └─ fetch('api/notifications')
           ├─ Header: Authorization: Bearer TOKEN
           └─ Backend determines: role = "finance_officer"

DASHBOARD: Lands on Notifications page
           │
           ├─ Default view: "All" category
           │  Sees:
           │  ├─ Payroll ready for review (🔴 HIGH)
           │  ├─ 50 payments processed (🔵 LOW)
           │  ├─ Budget limit reached (🔴 CRITICAL)
           │  ├─ Leave approval needed (🟡 MEDIUM)
           │  └─ System maintenance (🟡 MEDIUM)
           │
           └─ Click "HR" filter
              Sees:
              ├─ Payroll ready for review
              └─ Leave approval needed

PRIORITY: User focuses on 🔴 CRITICAL
          │
          ├─ Reads: "Budget limit reached for Marketing"
          └─ Sees: 95% of budget used

ACTION: User clicks "Review"
        │
        ├─ Frontend calls: navigate(url)
        ├─ URL: /payroll-processing?month=january_2024
        └─ Payroll page loads pre-filtered

REVIEW: Completes payroll review
        │
        ├─ Returns to Notifications
        └─ Clicks "Mark Read" on payroll notification

APPROVE: Finds Leave Request notification
         │
         ├─ Clicks "Approve"
         ├─ URL: /leave-management?requestId=leave_456
         └─ Leave page shows approval form
```

---

## 11. Error Handling Flow

```
USER REQUEST
├─ GET /api/notifications
│
└─ CHECK: Is token valid?
   │
   ├─ NO → Return 401 Unauthorized
   │   └─ Frontend error message: "No authentication token"
   │
   └─ YES → Continue
      │
      ├─ CHECK: Can extract user ID?
      │  │
      │  ├─ NO → Return 500 Error
      │  │   └─ Backend logs error
      │  │
      │  └─ YES → Continue
      │     │
      │     ├─ CHECK: Is category valid?
      │     │  │
      │     │  ├─ NO → Use default "All"
      │     │  │
      │     │  └─ YES → Use provided category
      │     │     │
      │     │     ├─ CHECK: Database query successful?
      │     │     │  │
      │     │     │  ├─ NO → Return 500 Error
      │     │     │  │   └─ Frontend shows: "Failed to load..."
      │     │     │  │
      │     │     │  └─ YES → Continue
      │     │     │     │
      │     │     │     └─ Return 200 OK
      │     │     │        └─ JSON: { notifications: [...] }
      │     │     │
      │     │     └─ FRONTEND: Render notifications
      │     │        └─ If empty: Show "No notifications"
      │     │
```

---

## 12. Feature Timeline

```
DEVELOPMENT TIMELINE

Week 1: Planning & Design
├─ Requirements analysis
├─ Schema design
└─ API architecture

Week 2: Backend Implementation
├─ Model creation
├─ Controller logic
└─ Route setup

Week 3: Frontend Integration
├─ Component design
├─ State management
└─ Navigation setup

Week 4: Testing & Documentation
├─ Integration testing
├─ Documentation writing
└─ Seed data preparation

DEPLOYMENT READY ✅
├─ Code complete
├─ Tests passing
├─ Documentation complete
└─ Ready for production
```

---

## Summary

This architecture provides:
✅ **Security**: JWT-based authentication  
✅ **Scalability**: Efficient database queries  
✅ **Usability**: Role-appropriate content  
✅ **Performance**: Optimized response times  
✅ **Maintainability**: Clean code structure  

**Status**: Production Ready 🚀
