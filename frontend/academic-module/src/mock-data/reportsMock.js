export const mockReports = {
  enrollmentTrends: {
    labels: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan'],
    data: [1180, 1205, 1220, 1235, 1247]
  },
  
  attendanceTrends: {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    data: [89, 87, 90, 85]
  },
  
  gpaTrends: {
    semesters: ['Fall 2023', 'Spring 2024', 'Fall 2024'],
    avgGPA: [3.38, 3.40, 3.42],
    byDepartment: {
      'Computer Science': [3.55, 3.60, 3.65],
      'Mathematics': [3.48, 3.52, 3.58],
      'Engineering': [3.32, 3.38, 3.42]
    }
  },
  
  departmentPerformance: [
    {
      department: 'Computer Science',
      students: 450,
      avgGPA: 3.65,
      attendance: 89,
      passRate: 94
    },
    {
      department: 'Mathematics',
      students: 320,
      avgGPA: 3.58,
      attendance: 92,
      passRate: 96
    },
    {
      department: 'Engineering',
      students: 380,
      avgGPA: 3.42,
      attendance: 85,
      passRate: 91
    },
    {
      department: 'Business',
      students: 290,
      avgGPA: 3.51,
      attendance: 88,
      passRate: 93
    }
  ],

  studentPerformanceMetrics: {
    totalStudents: 1247,
    activeStudents: 1189,
    graduatedStudents: 58,
    probationStudents: 23,
    averageGPA: 3.42,
    gpaDistribution: {
      '4.0': 45,
      '3.5-3.99': 312,
      '3.0-3.49': 456,
      '2.5-2.99': 298,
      '2.0-2.49': 136,
      'Below 2.0': 0
    }
  },

  facultyPerformanceMetrics: {
    totalFaculty: 89,
    fullTime: 67,
    partTime: 22,
    averageRating: 4.5,
    averageStudentsPerFaculty: 14,
    topRatedCourses: [
      { course: 'CS301', instructor: 'Dr. Jane Smith', rating: 4.8 },
      { course: 'MATH201', instructor: 'Dr. Michael Chen', rating: 4.7 },
      { course: 'BUS101', instructor: 'Prof. Robert Williams', rating: 4.6 }
    ]
  },

  financialMetrics: {
    totalRevenue: 12500000,
    tuitionRevenue: 10500000,
    otherRevenue: 2000000,
    totalExpenses: 9800000,
    netIncome: 2700000,
    monthlyTrends: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      revenue: [800000, 850000, 900000, 950000, 1000000, 1100000, 1200000, 1300000, 1400000, 1350000, 1200000, 1100000],
      expenses: [750000, 780000, 820000, 850000, 900000, 950000, 1000000, 1050000, 1100000, 1080000, 1020000, 980000]
    }
  },

  admissionMetrics: {
    totalApplications: 3456,
    accepted: 1567,
    enrolled: 1247,
    acceptanceRate: 45.3,
    enrollmentRate: 79.6,
    averageSATScore: 1285,
    averageACTScore: 28,
    topProgramsByApplications: [
      { program: 'Computer Science', applications: 890 },
      { program: 'Engineering', applications: 650 },
      { program: 'Business', applications: 545 },
      { program: 'Mathematics', applications: 432 }
    ]
  },

  infrastructureMetrics: {
    totalBuildings: 12,
    totalClassrooms: 156,
    totalLabs: 45,
    totalLibraryBooks: 125000,
    digitalResources: 25000,
    classroomUtilization: 78.5,
    labUtilization: 85.2
  },

  attendanceMetrics: {
    overallAttendance: 87.5,
    departmentWise: [
      { department: 'Computer Science', attendance: 89.2 },
      { department: 'Mathematics', attendance: 91.8 },
      { department: 'Engineering', attendance: 85.6 },
      { department: 'Business', attendance: 88.1 },
      { department: 'Physics', attendance: 90.5 },
      { department: 'Chemistry', attendance: 89.3 }
    ],
    monthlyTrends: [
      { month: 'Sep', attendance: 92.1 },
      { month: 'Oct', attendance: 89.8 },
      { month: 'Nov', attendance: 87.2 },
      { month: 'Dec', attendance: 85.4 },
      { month: 'Jan', attendance: 87.5 }
    ]
  },

  examMetrics: {
    totalExamsConducted: 156,
    totalStudentsAppeared: 12470,
    averagePassRate: 91.2,
    averageScore: 76.8,
    topPerformingCourses: [
      { course: 'CS301', passRate: 96.5, avgScore: 82.3 },
      { course: 'MATH201', passRate: 94.2, avgScore: 78.9 },
      { course: 'BUS101', passRate: 93.8, avgScore: 81.5 }
    ]
  }
};

// Export individual report types for specific components
export const mockEnrollmentReport = {
  labels: ['Fall 2023', 'Spring 2024', 'Fall 2024', 'Spring 2025'],
  datasets: [
    {
      label: 'New Admissions',
      data: [450, 380, 420, 390],
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)'
    },
    {
      label: 'Total Enrollments',
      data: [1150, 1180, 1247, 1280],
      borderColor: '#10b981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)'
    }
  ]
};

export const mockRevenueReport = {
  labels: ['Tuition Fees', 'Hostel Fees', 'Library Fees', 'Lab Fees', 'Other Fees'],
  datasets: [
    {
      data: [10500000, 1200000, 800000, 650000, 350000],
      backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']
    }
  ]
};

export const mockLibraryMetrics = {
  totalBooks: 125000,
  totalMembers: 1247,
  dailyVisitors: 245,
  booksIssued: 1890,
  digitalResources: 25000,
  mostIssuedBooks: [
    { title: 'Introduction to Algorithms', issued: 45 },
    { title: 'Calculus and Analytic Geometry', issued: 38 },
    { title: 'Engineering Mechanics', issued: 32 }
  ]
};