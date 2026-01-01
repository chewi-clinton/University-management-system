export const mockExaminations = [
  {
    id: 1,
    examName: 'CS301 Final Exam',
    course: {
      code: 'CS301',
      name: 'Data Structures',
      instructor: 'Dr. Jane Smith'
    },
    examType: 'final',
    totalMarks: 100,
    weightage: 40,
    duration: 180,
    instructions: 'Closed book exam. Calculators allowed. No electronic devices.',
    syllabus: ['Chapters 1-10', 'All lab assignments', 'Lecture notes'],
    isActive: true,
    createdAt: '2024-12-01T10:00:00',
    createdBy: 'Dr. Jane Smith'
  },
  {
    id: 2,
    examName: 'MATH201 Midterm Exam',
    course: {
      code: 'MATH201',
      name: 'Calculus II',
      instructor: 'Dr. Michael Chen'
    },
    examType: 'midterm',
    totalMarks: 100,
    weightage: 35,
    duration: 120,
    instructions: 'Open book exam. Formula sheet allowed.',
    syllabus: ['Chapters 1-5', 'Integration techniques', 'Series and sequences'],
    isActive: true,
    createdAt: '2024-11-15T09:00:00',
    createdBy: 'Dr. Michael Chen'
  },
  {
    id: 3,
    examName: 'ENG101 Quiz 1',
    course: {
      code: 'ENG101',
      name: 'Engineering Basics',
      instructor: 'Dr. Sarah Johnson'
    },
    examType: 'quiz',
    totalMarks: 50,
    weightage: 15,
    duration: 45,
    instructions: 'Closed book. Multiple choice questions only.',
    syllabus: ['Chapter 1', 'Basic concepts'],
    isActive: false,
    createdAt: '2024-10-01T14:00:00',
    createdBy: 'Dr. Sarah Johnson'
  },
  {
    id: 4,
    examName: 'BUS101 Final Exam',
    course: {
      code: 'BUS101',
      name: 'Business Fundamentals',
      instructor: 'Prof. Robert Williams'
    },
    examType: 'final',
    totalMarks: 100,
    weightage: 40,
    duration: 150,
    instructions: 'Case study analysis required. Bring calculators.',
    syllabus: ['All chapters', 'Case studies', 'Business models'],
    isActive: true,
    createdAt: '2024-12-10T11:00:00',
    createdBy: 'Prof. Robert Williams'
  }
];

export const mockExamSchedules = [
  {
    id: 1,
    exam: {
      id: 1,
      name: 'CS301 Final Exam',
      course: 'CS301 - Data Structures'
    },
    date: '2025-01-25',
    startTime: '09:00',
    endTime: '12:00',
    room: {
      id: 1,
      roomNumber: 'A-101',
      building: 'Engineering Block',
      capacity: 60
    },
    invigilator: {
      id: 1,
      name: 'Dr. Jane Smith'
    },
    enrolledStudents: 45,
    admitCardsGenerated: 45,
    status: 'scheduled'
  },
  {
    id: 2,
    exam: {
      id: 2,
      name: 'MATH201 Midterm Exam',
      course: 'MATH201 - Calculus II'
    },
    date: '2025-01-20',
    startTime: '14:00',
    endTime: '16:00',
    room: {
      id: 2,
      roomNumber: 'B-205',
      building: 'Mathematics Building',
      capacity: 40
    },
    invigilator: {
      id: 2,
      name: 'Dr. Michael Chen'
    },
    enrolledStudents: 32,
    admitCardsGenerated: 32,
    status: 'scheduled'
  },
  {
    id: 3,
    exam: {
      id: 4,
      name: 'BUS101 Final Exam',
      course: 'BUS101 - Business Fundamentals'
    },
    date: '2025-01-30',
    startTime: '10:00',
    endTime: '12:30',
    room: {
      id: 3,
      roomNumber: 'C-301',
      building: 'Business Building',
      capacity: 50
    },
    invigilator: {
      id: 4,
      name: 'Prof. Robert Williams'
    },
    enrolledStudents: 38,
    admitCardsGenerated: 35,
    status: 'scheduled'
  }
];

export const mockAdmitCards = [
  {
    id: 1,
    student: {
      id: 1,
      name: 'Alice Johnson',
      regNumber: 'UNI-2024-0001',
      program: 'Computer Science'
    },
    exam: {
      id: 1,
      name: 'CS301 Final Exam',
      date: '2025-01-25',
      time: '09:00 AM - 12:00 PM',
      room: 'A-101'
    },
    seatNumber: '45',
    eligibilityStatus: 'eligible',
    issuedDate: '2025-01-10',
    qrCode: 'QR_CODE_DATA_HERE',
    isDownloaded: true,
    downloadedAt: '2025-01-12T10:30:00'
  },
  {
    id: 2,
    student: {
      id: 2,
      name: 'Bob Smith',
      regNumber: 'UNI-2024-0002',
      program: 'Mathematics'
    },
    exam: {
      id: 1,
      name: 'CS301 Final Exam',
      date: '2025-01-25',
      time: '09:00 AM - 12:00 PM',
      room: 'A-101'
    },
    seatNumber: '23',
    eligibilityStatus: 'eligible',
    issuedDate: '2025-01-10',
    qrCode: 'QR_CODE_DATA_HERE',
    isDownloaded: false,
    downloadedAt: null
  },
  {
    id: 3,
    student: {
      id: 1,
      name: 'Alice Johnson',
      regNumber: 'UNI-2024-0001',
      program: 'Computer Science'
    },
    exam: {
      id: 2,
      name: 'MATH201 Midterm Exam',
      date: '2025-01-20',
      time: '02:00 PM - 04:00 PM',
      room: 'B-205'
    },
    seatNumber: '12',
    eligibilityStatus: 'eligible',
    issuedDate: '2025-01-08',
    qrCode: 'QR_CODE_DATA_HERE',
    isDownloaded: true,
    downloadedAt: '2025-01-09T14:15:00'
  }
];

// Exam rooms
export const mockExamRooms = [
  {
    id: 1,
    roomNumber: 'A-101',
    building: 'Engineering Block',
    capacity: 60,
    isAvailable: true,
    facilities: ['AC', 'Projector', 'Whiteboard']
  },
  {
    id: 2,
    roomNumber: 'B-205',
    building: 'Mathematics Building',
    capacity: 40,
    isAvailable: true,
    facilities: ['AC', 'Whiteboard']
  },
  {
    id: 3,
    roomNumber: 'C-301',
    building: 'Business Building',
    capacity: 50,
    isAvailable: true,
    facilities: ['AC', 'Projector', 'Whiteboard']
  },
  {
    id: 4,
    roomNumber: 'D-102',
    building: 'Science Building',
    capacity: 35,
    isAvailable: false,
    facilities: ['Whiteboard']
  }
];

// Exam invigilators
export const mockInvigilators = [
  {
    id: 1,
    name: 'Dr. Jane Smith',
    department: 'Computer Science',
    employeeId: 'FAC-2020-001',
    isAvailable: true,
    totalExams: 5
  },
  {
    id: 2,
    name: 'Dr. Michael Chen',
    department: 'Mathematics',
    employeeId: 'FAC-2019-015',
    isAvailable: true,
    totalExams: 4
  },
  {
    id: 3,
    name: 'Dr. Sarah Johnson',
    department: 'Engineering',
    employeeId: 'FAC-2021-008',
    isAvailable: false,
    totalExams: 3
  },
  {
    id: 4,
    name: 'Prof. Robert Williams',
    department: 'Business',
    employeeId: 'FAC-2018-022',
    isAvailable: true,
    totalExams: 6
  }
];