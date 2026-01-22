# Notifications API - Complete Reference

## Base URL
```
http://localhost:5000/api/notifications
```

---

## Endpoints

### 1. Get Role-Based Notifications
**Endpoint**: `GET /api/notifications`  
**Auth**: Required  
**Headers**: `Authorization: Bearer <token>`

**Query Parameters**:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `category` | String | 'All' | Filter by Finance, HR, Marketing, System, or All |
| `limit` | Number | 50 | Max notifications to return |

**Response** (200 OK):
```json
{
  "success": true,
  "userRole": "student",
  "unreadCount": 3,
  "notifications": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Your tuition invoice for Fall 2024 is ready",
      "body": "Please review and pay your invoice. Payment is due by December 15, 2024.",
      "category": "Finance",
      "action": "pay_now",
      "actionTarget": "invoice_123",
      "actionPage": "/payment-checkout",
      "urgency": "high",
      "read": false,
      "meta": {
        "invoiceId": "invoice_123",
        "amount": 5000,
        "studentId": "607f1f77bcf86cd799439012"
      },
      "createdAt": "2024-01-22T10:30:00.000Z",
      "updatedAt": "2024-01-22T10:30:00.000Z"
    }
  ],
  "total": 1
}
```

**Error Responses**:
```json
// 401 Unauthorized
{
  "message": "No authentication token provided"
}

// 500 Server Error
{
  "message": "Error fetching notifications: [details]"
}
```

**Example Requests**:
```bash
# Get all notifications
curl -H "Authorization: Bearer <token>" \
  http://localhost:5000/api/notifications

# Get only Finance notifications
curl -H "Authorization: Bearer <token>" \
  http://localhost:5000/api/notifications?category=Finance

# Get 20 most recent
curl -H "Authorization: Bearer <token>" \
  http://localhost:5000/api/notifications?limit=20

# Combine filters
curl -H "Authorization: Bearer <token>" \
  http://localhost:5000/api/notifications?category=HR&limit=10
```

---

### 2. Get Notification Summary/Stats
**Endpoint**: `GET /api/notifications/summary`  
**Auth**: Required  
**Headers**: `Authorization: Bearer <token>`

**Response** (200 OK):
```json
{
  "success": true,
  "userRole": "finance_officer",
  "summary": {
    "total": 12,
    "byCategory": {
      "Finance": 3,
      "HR": 2,
      "Marketing": 2,
      "System": 5
    }
  }
}
```

**Use Case**: Display notification count badges by category in UI

**Example**:
```bash
curl -H "Authorization: Bearer <token>" \
  http://localhost:5000/api/notifications/summary
```

---

### 3. Mark Single Notification as Read
**Endpoint**: `PUT /api/notifications/:notificationId/read`  
**Auth**: Required  
**Method**: PUT

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| `notificationId` | String | MongoDB ObjectId of notification |

**Response** (200 OK):
```json
{
  "success": true,
  "notification": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Your tuition invoice for Fall 2024 is ready",
    "read": true,
    "updatedAt": "2024-01-22T11:15:00.000Z"
  }
}
```

**Error Responses**:
```json
// 404 Not Found
{
  "message": "Notification not found"
}
```

**Example**:
```bash
curl -X PUT \
  -H "Authorization: Bearer <token>" \
  http://localhost:5000/api/notifications/507f1f77bcf86cd799439011/read
```

**Frontend Usage**:
```javascript
const markAsRead = async (notificationId) => {
  const response = await fetch(
    `/api/notifications/${notificationId}/read`,
    {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );
  return response.json();
};
```

---

### 4. Mark All Notifications as Read
**Endpoint**: `PUT /api/notifications/read/all`  
**Auth**: Required  
**Method**: PUT

**Request Body**: None required

**Response** (200 OK):
```json
{
  "success": true,
  "modifiedCount": 5
}
```

**Example**:
```bash
curl -X PUT \
  -H "Authorization: Bearer <token>" \
  http://localhost:5000/api/notifications/read/all
```

**Frontend Usage**:
```javascript
const markAllAsRead = async () => {
  const response = await fetch(
    `/api/notifications/read/all`,
    {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );
  const data = await response.json();
  console.log(`Marked ${data.modifiedCount} notifications as read`);
};
```

---

### 5. Get Notifications by Role (Admin/Testing)
**Endpoint**: `GET /api/notifications/role/:role`  
**Auth**: Not required (for testing)  
**Method**: GET

**Path Parameters**:
| Parameter | Type | Valid Values |
|-----------|------|--------------|
| `role` | String | `student`, `finance_officer`, `admin` |

**Response** (200 OK):
```json
{
  "success": true,
  "role": "student",
  "notifications": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Your tuition invoice for Fall 2024 is ready",
      "body": "Please review and pay your invoice.",
      "category": "Finance",
      "action": "pay_now",
      "urgency": "high",
      "read": false,
      "createdAt": "2024-01-22T10:30:00.000Z"
    },
    {
      "_id": "507f1f77bcf86cd799439012",
      "title": "New Bus Route available for your area!",
      "body": "Route 5A now serves Downtown. Get 20% discount!",
      "category": "Marketing",
      "action": "view",
      "urgency": "low",
      "read": false,
      "createdAt": "2024-01-21T14:20:00.000Z"
    }
  ]
}
```

**Error Responses**:
```json
// 400 Bad Request
{
  "message": "Invalid role"
}
```

**Example Requests**:
```bash
# Get all student-visible notifications
curl http://localhost:5000/api/notifications/role/student

# Get all finance officer notifications
curl http://localhost:5000/api/notifications/role/finance_officer

# Get admin notifications
curl http://localhost:5000/api/notifications/role/admin
```

**Use Case**: Testing RBAC without authentication

---

## Authentication

All endpoints (except `/role/:role`) require JWT authentication.

**Token Format**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**How to Get Token**:
```bash
# Login endpoint (example)
POST /api/auth/login
Content-Type: application/json

{
  "email": "student@university.edu",
  "password": "password123"
}

# Response includes token
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "607f1f77bcf86cd799439012",
    "name": "John Student",
    "email": "student@university.edu",
    "role": "student"
  }
}
```

---

## Role-Based Content Examples

### Student Notifications
```json
[
  {
    "title": "Your tuition invoice for Fall 2024 is ready",
    "category": "Finance",
    "action": "pay_now",
    "actionPage": "/payment-checkout",
    "urgency": "high",
    "meta": {
      "amount": 5000,
      "invoiceId": "inv_001"
    }
  },
  {
    "title": "Payment of $500 confirmed",
    "category": "Finance",
    "action": "view",
    "urgency": "low",
    "meta": {
      "amount": 500
    }
  },
  {
    "title": "New Bus Route available",
    "category": "Marketing",
    "action": "view",
    "urgency": "low"
  }
]
```

### Finance Officer Notifications
```json
[
  {
    "title": "Payroll for January 2024 is ready for final review",
    "category": "HR",
    "action": "review",
    "actionPage": "/payroll-processing",
    "urgency": "high",
    "meta": {
      "payrollMonth": "January 2024"
    }
  },
  {
    "title": "Budget limit reached for Marketing Department",
    "category": "System",
    "action": "review",
    "urgency": "critical",
    "meta": {
      "departmentName": "Marketing",
      "budgetPercentage": 95
    }
  },
  {
    "title": "New leave request from John Smith",
    "category": "HR",
    "action": "approve",
    "actionPage": "/leave-management",
    "urgency": "medium",
    "meta": {
      "employeeName": "John Smith",
      "leaveRequestId": "leave_456"
    }
  }
]
```

---

## HTTP Status Codes

| Code | Status | Description |
|------|--------|-------------|
| 200 | OK | Successful request |
| 400 | Bad Request | Invalid parameters |
| 401 | Unauthorized | Missing/invalid authentication |
| 404 | Not Found | Notification not found |
| 500 | Server Error | Internal server error |

---

## Rate Limiting

Currently: No rate limiting (development mode)

**Recommended for production**:
- 100 requests per minute per user
- 30 requests per minute for bulk endpoints

---

## Filtering & Sorting

### Category Filter Values
```
'Finance'   - Tuition, payments, financial reports
'HR'        - Leave, payroll, staffing
'Marketing' - Campaigns, promotions, discounts
'System'    - General alerts, maintenance, updates
'All'       - All categories (default)
```

### Urgency Levels
```
'low'       - Informational, general updates
'medium'    - Requires attention soon
'high'      - Requires attention today
'critical'  - Requires immediate action
```

### Action Types
```
'pay_now'   - Payment action (student)
'review'    - Review action (finance officer)
'approve'   - Approval action (finance officer)
'view'      - General view action (all)
'dismiss'   - Dismiss/close action
```

---

## Integration Examples

### React Component
```javascript
import { useEffect, useState } from 'react';

function NotificationsList() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(
          'http://localhost:5000/api/notifications?limit=20',
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        const data = await response.json();
        setNotifications(data.notifications);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [token]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {notifications.map(notification => (
        <div key={notification._id} className="notification">
          <h3>{notification.title}</h3>
          <p>{notification.body}</p>
          <button onClick={() => handleAction(notification)}>
            {notification.action === 'pay_now' ? 'Pay Now' : 'View'}
          </button>
        </div>
      ))}
    </div>
  );
}
```

### cURL Examples
```bash
# Get notifications with Finance filter
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:5000/api/notifications?category=Finance"

# Mark notification as read
curl -X PUT \
  -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:5000/api/notifications/607f1f77bcf86cd799439011/read"

# Get summary stats
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:5000/api/notifications/summary"

# View student role notifications (testing)
curl "http://localhost:5000/api/notifications/role/student"
```

---

## Common Issues & Solutions

### Issue: "No authentication token provided"
**Solution**: Add `Authorization` header with valid JWT token

### Issue: "Invalid role"
**Solution**: Use valid role: `student`, `finance_officer`, `admin`

### Issue: Empty notifications array
**Solution**: 
1. Check role has relevant data
2. Verify user is logged in
3. Check database has seeded data

### Issue: Action buttons not working
**Solution**:
1. Verify `actionPage` is correct URL
2. Check `actionTarget` has valid ID
3. Ensure navigation component is configured

---

## Database Queries (MongoDB)

### Get all student notifications
```javascript
db.notifications.find({
  $or: [
    { role: 'student' },
    { role: 'all' }
  ]
})
```

### Get unread high-priority notifications for finance officer
```javascript
db.notifications.find({
  $or: [
    { role: 'finance_officer' },
    { role: 'all' }
  ],
  read: false,
  urgency: { $in: ['high', 'critical'] }
})
```

### Get notifications by category
```javascript
db.notifications.find({
  category: 'Finance'
})
```

---

## Performance Tips

1. **Limit Results**: Always use `?limit=` to avoid fetching all notifications
2. **Cache**: Cache notification summary on client-side
3. **Polling**: Use reasonable intervals (30-60 seconds) for real-time updates
4. **WebSockets**: Consider for truly real-time notifications

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Jan 2024 | Initial RBAC implementation |

---

**Need Help?** Check NOTIFICATIONS_RBAC.md for detailed architecture documentation
