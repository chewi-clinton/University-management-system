// Admin Users
export const mockAdmins = [
  {
    id: 1,
    email: 'admin@university.edu',
    firstName: 'John',
    lastName: 'Anderson',
    role: 'super_admin',
    department: null,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    isActive: true,
    createdAt: '2024-01-15',
    lastLogin: '2025-01-01T08:30:00'
  },
  {
    id: 2,
    email: 'academic.admin@university.edu',
    firstName: 'Sarah',
    lastName: 'Mitchell',
    role: 'academic_admin',
    department: 'Computer Science',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    isActive: true,
    createdAt: '2024-02-10',
    lastLogin: '2025-01-01T09:15:00'
  },
  {
    id: 3,
    email: 'finance.admin@university.edu',
    firstName: 'David',
    lastName: 'Wilson',
    role: 'finance_admin',
    department: 'Finance',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
    isActive: true,
    createdAt: '2024-03-05',
    lastLogin: '2025-01-01T07:45:00'
  },
  {
    id: 4,
    email: 'student.admin@university.edu',
    firstName: 'Emily',
    lastName: 'Brown',
    role: 'student_admin',
    department: 'Student Affairs',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
    isActive: true,
    createdAt: '2024-04-12',
    lastLogin: '2025-01-01T10:20:00'
  }
];

// Dashboard Stats
export const mockDashboardStats = {
  totalStudents: 1247,
  totalFaculty: 89,
  totalCourses: 156,
  activeEnrollments: 3421,
  attendanceRate: 87.5,
  averageGPA: 3.42,
  upcomingExams: 12,
  pendingAdmissions: 34,
  trends: {
    students: { value: '+12%', isPositive: true },
    faculty: { value: '+5%', isPositive: true },
    attendance: { value: '-2%', isPositive: false },
    gpa: { value: '+0.3', isPositive: true }
  }
};

// Department Analytics
export const mockDepartmentStats = [
  {
    id: 1,
    name: 'Computer Science',
    code: 'CS',
    students: 450,
    faculty: 25,
    courses: 45,
    avgAttendance: 89,
    avgGPA: 3.65,
    color: '#3b82f6'
  },
  {
    id: 2,
    name: 'Mathematics',
    code: 'MATH',
    students: 320,
    faculty: 18,
    courses: 32,
    avgAttendance: 92,
    avgGPA: 3.58,
    color: '#8b5cf6'
  },
  {
    id: 3,
    name: 'Engineering',
    code: 'ENG',
    students: 380,
    faculty: 28,
    courses: 52,
    avgAttendance: 85,
    avgGPA: 3.42,
    color: '#10b981'
  },
  {
    id: 4,
    name: 'Business',
    code: 'BUS',
    students: 290,
    faculty: 15,
    courses: 38,
    avgAttendance: 88,
    avgGPA: 3.51,
    color: '#f59e0b'
  },
  {
    id: 5,
    name: 'Physics',
    code: 'PHY',
    students: 180,
    faculty: 12,
    courses: 24,
    avgAttendance: 91,
    avgGPA: 3.62,
    color: '#ef4444'
  },
  {
    id: 6,
    name: 'Chemistry',
    code: 'CHEM',
    students: 165,
    faculty: 10,
    courses: 22,
    avgAttendance: 89,
    avgGPA: 3.55,
    color: '#06b6d4'
  }
];

// Recent Activities
export const mockRecentActivities = [
  {
    id: 1,
    type: 'student_registered',
    message: 'New student Alice Johnson registered for Computer Science',
    timestamp: '2025-01-01T10:30:00',
    user: 'Alice Johnson'
  },
  {
    id: 2,
    type: 'grade_updated',
    message: 'Grade updated for CS301 - Data Structures',
    timestamp: '2025-01-01T09:45:00',
    user: 'Dr. Jane Smith'
  },
  {
    id: 3,
    type: 'attendance_marked',
    message: 'Attendance marked for MATH201 - Calculus II',
    timestamp: '2025-01-01T09:15:00',
    user: 'Dr. Michael Chen'
  },
  {
    id: 4,
    type: 'exam_scheduled',
    message: 'Final exam scheduled for ENG101 - Engineering Basics',
    timestamp: '2025-01-01T08:30:00',
    user: 'Admin'
  },
  {
    id: 5,
    type: 'notice_published',
    message: 'Winter break notice published',
    timestamp: '2024-12-31T16:00:00',
    user: 'Academic Office'
  }
];

// System Notifications
export const mockSystemNotifications = [
  {
    id: 1,
    type: 'warning',
    title: 'Low Attendance Alert',
    message: '15 students have attendance below 75%',
    timestamp: '2025-01-01T11:00:00',
    isRead: false
  },
  {
    id: 2,
    type: 'info',
    title: 'Grade Submission Reminder',
    message: 'Final grades for Fall 2024 due in 3 days',
    timestamp: '2025-01-01T08:00:00',
    isRead: false
  },
  {
    id: 3,
    type: 'success',
    title: 'Enrollment Complete',
    message: 'Spring 2025 enrollment period closed successfully',
    timestamp: '2024-12-30T17:00:00',
    isRead: true
  }
];