export const mockAttendanceRecords = [
  {
    id: 1,
    student: { id: 1, name: 'Alice Johnson', regNumber: 'UNI-2024-0001' },
    course: { code: 'CS301', name: 'Data Structures' },
    date: '2025-01-01',
    status: 'present',
    markedBy: 'Dr. Jane Smith',
    markedAt: '2025-01-01T09:15:00',
    notes: null
  },
  {
    id: 2,
    student: { id: 2, name: 'Bob Smith', regNumber: 'UNI-2024-0002' },
    course: { code: 'CS301', name: 'Data Structures' },
    date: '2025-01-01',
    status: 'absent',
    markedBy: 'Dr. Jane Smith',
    markedAt: '2025-01-01T09:15:00',
    notes: 'Medical leave'
  },
  {
    id: 3,
    student: { id: 3, name: 'Charlie Brown', regNumber: 'UNI-2024-0003' },
    course: { code: 'MATH201', name: 'Calculus II' },
    date: '2025-01-01',
    status: 'late',
    markedBy: 'Dr. Michael Chen',
    markedAt: '2025-01-01T09:20:00',
    notes: 'Arrived 15 minutes late'
  },
  {
    id: 4,
    student: { id: 4, name: 'Diana Prince', regNumber: 'UNI-2024-0004' },
    course: { code: 'BUS101', name: 'Business Fundamentals' },
    date: '2025-01-01',
    status: 'present',
    markedBy: 'Prof. Robert Williams',
    markedAt: '2025-01-01T11:00:00',
    notes: null
  },
  {
    id: 5,
    student: { id: 5, name: 'Ethan Hunt', regNumber: 'UNI-2024-0005' },
    course: { code: 'CS302', name: 'Algorithms' },
    date: '2025-01-01',
    status: 'present',
    markedBy: 'Dr. Jane Smith',
    markedAt: '2025-01-01T10:30:00',
    notes: null
  }
];

export const mockAttendanceSummary = [
  {
    id: 1,
    student: { id: 1, name: 'Alice Johnson' },
    course: { code: 'CS301', name: 'Data Structures' },
    totalClasses: 40,
    present: 36,
    absent: 3,
    late: 1,
    percentage: 90,
    warningLevel: null, // null, 'low', 'medium', 'critical'
    lastUpdated: '2025-01-01'
  },
  {
    id: 2,
    student: { id: 2, name: 'Bob Smith' },
    course: { code: 'CS301', name: 'Data Structures' },
    totalClasses: 40,
    present: 32,
    absent: 6,
    late: 2,
    percentage: 80,
    warningLevel: 'low',
    lastUpdated: '2025-01-01'
  },
  {
    id: 3,
    student: { id: 3, name: 'Charlie Brown' },
    course: { code: 'MATH201', name: 'Calculus II' },
    totalClasses: 38,
    present: 35,
    absent: 2,
    late: 1,
    percentage: 92,
    warningLevel: null,
    lastUpdated: '2025-01-01'
  },
  {
    id: 4,
    student: { id: 4, name: 'Diana Prince' },
    course: { code: 'BUS101', name: 'Business Fundamentals' },
    totalClasses: 42,
    present: 40,
    absent: 1,
    late: 1,
    percentage: 95,
    warningLevel: null,
    lastUpdated: '2025-01-01'
  },
  {
    id: 5,
    student: { id: 5, name: 'Ethan Hunt' },
    course: { code: 'CS302', name: 'Algorithms' },
    totalClasses: 35,
    present: 30,
    absent: 4,
    late: 1,
    percentage: 86,
    warningLevel: null,
    lastUpdated: '2025-01-01'
  }
];

// Attendance Analytics
export const mockAttendanceTrends = {
  daily: [
    { date: '2024-12-26', rate: 88 },
    { date: '2024-12-27', rate: 92 },
    { date: '2024-12-30', rate: 85 },
    { date: '2024-12-31', rate: 89 },
    { date: '2025-01-01', rate: 87 }
  ],
  byDepartment: [
    { department: 'Computer Science', rate: 89 },
    { department: 'Mathematics', rate: 92 },
    { department: 'Engineering', rate: 85 },
    { department: 'Business', rate: 88 }
  ],
  byCourse: [
    { course: 'CS301 - Data Structures', rate: 91 },
    { course: 'MATH201 - Calculus II', rate: 94 },
    { course: 'BUS101 - Business Fundamentals', rate: 96 },
    { course: 'CS302 - Algorithms', rate: 88 }
  ]
};

// Attendance status distribution
export const mockAttendanceDistribution = {
  present: 1245,
  absent: 156,
  late: 89,
  excused: 34
};

// Weekly attendance pattern
export const mockWeeklyAttendance = [
  { day: 'Monday', rate: 92 },
  { day: 'Tuesday', rate: 89 },
  { day: 'Wednesday', rate: 91 },
  { day: 'Thursday', rate: 88 },
  { day: 'Friday', rate: 85 }
];