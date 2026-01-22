# Testing Guide - Notifications RBAC

## Quick Testing Checklist

### ✅ Environment Setup
- [ ] Backend running on port 5000
- [ ] Frontend running on port 5174
- [ ] MongoDB connected
- [ ] Seed data populated (12 notifications)

### Run Backend
```bash
cd Backend
node server.js
```

### Run Frontend  
```bash
cd Frontend
npm run dev
```

### Populate Test Data
```bash
cd Backend
node scripts/seedNotifications.js
```

---

## Test Scenarios

### Test 1: Student View - Finance Notifications

**Steps**:
1. Login as **student** account
2. Navigate to `/notifications`
3. Click **"Finance"** filter

**Expected Results**:
- ✅ See "Your tuition invoice for Fall 2024 is ready"
- ✅ See "Payment of $500 confirmed"
- ✅ Do NOT see payroll or budget notifications
- ✅ Button shows **"Pay Now"** (blue color)

**Action Test**:
1. Click **"Pay Now"** button on invoice notification
2. Should navigate to `/payment-checkout?invoiceId=invoice_123`

**Database Query**:
```bash
curl http://localhost:5000/api/notifications/role/student
```

---

### Test 2: Student View - Marketing Notifications

**Steps**:
1. Logged in as **student**
2. Navigate to `/notifications`
3. Click **"Marketing"** filter

**Expected Results**:
- ✅ See "New Bus Route available for your area!"
- ✅ See "Early Bird discount ends in 2 days"
- ✅ Do NOT see campaign performance metrics
- ✅ Button shows **"View"** (blue color)

---

### Test 3: Finance Officer View - HR Notifications

**Steps**:
1. Login as **finance_officer** account
2. Navigate to `/notifications`
3. Click **"HR"** filter

**Expected Results**:
- ✅ See "Payroll for January 2024 is ready for final review"
- ✅ See "New leave request from John Smith requires approval"
- ✅ Do NOT see student notifications
- ✅ Buttons show **"Review"** or **"Approve"** (purple color)
- ✅ Urgency badges show (high/medium priority)

**Action Test**:
1. Click **"Review"** on payroll notification
2. Should navigate to `/payroll-processing`

---

### Test 4: Finance Officer View - Critical Alerts

**Steps**:
1. Logged in as **finance_officer**
2. Navigate to `/notifications`
3. View all notifications

**Expected Results**:
- ✅ See "Budget limit reached for Marketing Department" with 🔴 **CRITICAL** badge
- ✅ See "Critical error in payment gateway sync" with 🔴 **CRITICAL** badge
- ✅ These appear with RED/urgent styling
- ✅ Other high-priority items appear with 🟠 **HIGH** badge

---

### Test 5: System-Wide Notifications

**Steps**:
1. Login as **any user** (student or finance_officer)
2. Navigate to `/notifications`
3. View "System" category

**Expected Results**:
- ✅ Both users see "System maintenance scheduled"
- ✅ Both users see "New security update available"
- ✅ These are visible to all roles

---

### Test 6: Category Filtering

**Steps**:
1. Logged in as **finance_officer**
2. Click each filter button in order:
   - "All"
   - "Finance"
   - "HR"
   - "Marketing"
   - "System"

**Expected Results**:

| Filter | Count | Items |
|--------|-------|-------|
| All | 6 | All finance officer notifications |
| Finance | 2 | Payments, campaign success |
| HR | 2 | Payroll, leave request |
| Marketing | 1 | Campaign metrics |
| System | 2 | Budget warning, gateway error |

---

### Test 7: Mark as Read

**Steps**:
1. Logged in as **student**
2. Click **"Mark Read"** on any unread notification
3. Refresh page

**Expected Results**:
- ✅ Notification becomes semi-transparent/faded
- ✅ Remains marked as read after refresh
- ✅ Unread count decreases

**API Test**:
```bash
curl -X PUT \
  -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/notifications/NOTIFICATION_ID/read
```

---

### Test 8: Mark All as Read

**Steps**:
1. Logged in with some unread notifications
2. Open browser dev console
3. Run:
```javascript
const token = localStorage.getItem('token');
fetch('http://localhost:5000/api/notifications/read/all', {
  method: 'PUT',
  headers: { 'Authorization': `Bearer ${token}` }
}).then(r => r.json()).then(console.log)
```

**Expected Results**:
- ✅ API returns `{ success: true, modifiedCount: X }`
- ✅ All notifications become faded
- ✅ Unread count becomes 0

---

### Test 9: Metadata Display

**Steps**:
1. Navigate to notifications page
2. Look for notifications with metadata

**Verify Metadata Shows**:
- ✅ **Amount**: "$5,000" displayed for tuition invoice
- ✅ **Employee Name**: "John Smith" for leave requests
- ✅ **Department**: "Marketing" for budget alerts
- ✅ **Month**: "January 2024" for payroll

---

### Test 10: Deep Linking

**Test A: Student Deep Link**
1. Login as student
2. Find tuition invoice notification
3. Click **"Pay Now"**
4. Verify URL changed to: `http://localhost:5174/payment-checkout?invoiceId=invoice_123`

**Test B: Finance Officer Deep Link**
1. Login as finance_officer
2. Find payroll notification
3. Click **"Review"**
4. Verify URL changed to: `http://localhost:5174/payroll-processing`

---

## API Testing with cURL

### Get Student Notifications
```bash
TOKEN="your_jwt_token_here"

curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:5000/api/notifications?category=Finance
```

### Get Finance Officer Notifications
```bash
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:5000/api/notifications?category=HR
```

### Get Notification Summary
```bash
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:5000/api/notifications/summary
```

**Response**:
```json
{
  "success": true,
  "userRole": "student",
  "summary": {
    "total": 5,
    "byCategory": {
      "Finance": 2,
      "Marketing": 2,
      "System": 1
    }
  }
}
```

### Mark as Read
```bash
NOTIFICATION_ID="507f1f77bcf86cd799439011"

curl -X PUT \
  -H "Authorization: Bearer $TOKEN" \
  http://localhost:5000/api/notifications/$NOTIFICATION_ID/read
```

### View Test Notifications (No Auth)
```bash
# All student-visible notifications
curl http://localhost:5000/api/notifications/role/student

# All finance officer notifications
curl http://localhost:5000/api/notifications/role/finance_officer

# System-wide notifications visible to all
curl http://localhost:5000/api/notifications/role/admin
```

---

## Database Verification

### Check Seeded Data
```bash
mongosh  # or mongo

# Connect to database
use university-management

# Count notifications
db.notifications.countDocuments()

# View all notifications
db.notifications.find().pretty()

# View student notifications only
db.notifications.find({ role: 'student' }).pretty()

# View by category
db.notifications.find({ category: 'Finance' }).pretty()
```

---

## Common Test Issues & Fixes

### Issue: "No authentication token provided"
**Solution**:
1. Ensure you're logged in
2. Check localStorage has 'token' key
3. Pass token in Authorization header

### Issue: Empty notifications array
**Solution**:
1. Run seed script: `node scripts/seedNotifications.js`
2. Check MongoDB connection
3. Verify users exist in database

### Issue: Wrong role showing
**Solution**:
1. Check User model has `role` field
2. Verify auth middleware sets user role
3. Check token contains correct user ID

### Issue: Action buttons not working
**Solution**:
1. Check browser console for errors
2. Verify routes exist (e.g., `/payment-checkout`)
3. Check actionPage is set in notification

---

## Test Data Summary

### Seeded Notifications (12 total)

**Student Notifications (5)**:
```
1. ✉️  Tuition invoice ready - $5,000 - Pay Now [HIGH]
2. ✉️  Payment $500 confirmed - View [LOW]
3. ✉️  Bus route discount - View [LOW]
4. ✉️  Exam schedule released - View [MEDIUM]
5. ✉️  Library book overdue - View [HIGH]
6. ✉️  Early bird discount ending - View [MEDIUM]
```

**Finance Officer Notifications (4)**:
```
7. 💼 Payroll ready for review - Review [HIGH]
8. 💼 50 payments processed - View [LOW]
9. 💼 Budget limit reached - Review [CRITICAL] 🔴
10. 💼 Leave request approval - Approve [MEDIUM]
11. 💼 Payment gateway error - Review [CRITICAL] 🔴
12. 💼 Campaign revenue target met - View [LOW]
```

**System Notifications (3)**:
```
13. ⚙️  Maintenance scheduled - View [MEDIUM]
14. ⚙️  Security update - View [HIGH]
```

---

## Performance Testing

### Load Test: 100 Notifications
```bash
# In Backend directory, create test script
node -e "
const mongoose = require('mongoose');
const Notification = require('./models/Notification');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI).then(() => {
  const arr = [];
  for(let i=0; i<100; i++) {
    arr.push({
      role: 'all',
      title: 'Test notification ' + i,
      body: 'Test body',
      category: 'System'
    });
  }
  return Notification.insertMany(arr);
}).then(() => {
  console.log('Created 100 test notifications');
  process.exit(0);
});
"
```

### Test Response Time
```bash
time curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:5000/api/notifications?limit=100
```

Expected: < 200ms

---

## Browser DevTools Testing

### Check API Response
1. Open DevTools (F12)
2. Go to Network tab
3. Navigate to Notifications page
4. Find `/api/notifications` request
5. Check Response tab for userRole

### Debug Rendering
1. Go to Console tab
2. Run:
```javascript
// Check localStorage
console.log(localStorage.getItem('token'));

// Check user data
console.log('User role:', JSON.parse(localStorage.getItem('user')).role);
```

---

## Sign-Off Checklist

- [ ] All 10 test scenarios pass
- [ ] API endpoints respond correctly
- [ ] Metadata displays properly
- [ ] Deep links navigate correctly
- [ ] Database queries work
- [ ] No console errors
- [ ] Notifications mark as read
- [ ] Categories filter correctly
- [ ] Urgency indicators show
- [ ] Role separation verified

**Ready for Production** ✅ when all items are checked!
