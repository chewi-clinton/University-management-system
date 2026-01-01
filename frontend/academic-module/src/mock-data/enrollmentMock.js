export const mockEnrollments = [
  {
    id: 1,
    enrollmentNumber: 'ENR-2024-F-0001',
    student: {
      id: 1,
      name: 'Alice Johnson',
      regNumber: 'UNI-2024-0001'
    },
    semester: {
      id: 1,
      name: 'Fall 2024',
      startDate: '2024-09-01',
      endDate: '2024-12-31'
    },
    status: 'confirmed',
    enrollmentDate: '2024-08-15',
    confirmedBy: 'Sarah Mitchell',
    confirmedAt: '2024-08-20',
    totalCredits: 18,
    registeredCourses: 6
  },
  {
    id: 2,
    enrollmentNumber: 'ENR-2024-F-0002',
    student: {
      id: 2,
      name: 'Bob Smith',
      regNumber: 'UNI-2024-0002'
    },
    semester: {
      id: 1,
      name: 'Fall 2024',
      startDate: '2024-09-01',
      endDate: '2024-12-31'
    },
    status: 'confirmed',
    enrollmentDate: '2024-08-16',
    confirmedBy: 'Sarah Mitchell',
    confirmedAt: '2024-08-21',
    totalCredits: 15,
    registeredCourses: 5
  },
  {
    id: 3,
    enrollmentNumber: 'ENR-2024-F-0003',
    student: {
      id: 3,
      name: 'Charlie Brown',
      regNumber: 'UNI-2024-0003'
    },
    semester: {
      id: 1,
      name: 'Fall 2024',
      startDate: '2024-09-01',
      endDate: '2024-12-31'
    },
    status: 'pending',
    enrollmentDate: '2024-08-17',
    confirmedBy: null,
    confirmedAt: null,
    totalCredits: 17,
    registeredCourses: 6
  },
  {
    id: 4,
    enrollmentNumber: 'ENR-2024-F-0004',
    student: {
      id: 4,
      name: 'Diana Prince',
      regNumber: 'UNI-2024-0004'
    },
    semester: {
      id: 1,
      name: 'Fall 2024',
      startDate: '2024-09-01',
      endDate: '2024-12-31'
    },
    status: 'confirmed',
    enrollmentDate: '2024-08-14',
    confirmedBy: 'John Anderson',
    confirmedAt: '2024-08-19',
    totalCredits: 16,
    registeredCourses: 5
  }
];

export const mockCourseRegistrations = [
  {
    id: 1,
    student: { id: 1, name: 'Alice Johnson', regNumber: 'UNI-2024-0001' },
    course: {
      code: 'CS301',
      name: 'Data Structures',
      credits: 3,
      instructor: 'Dr. Jane Smith'
    },
    semester: 'Fall 2024',
    section: 'A',
    status: 'registered',
    registrationDate: '2024-08-20',
    grade: null,
    gradePoints: null
  },
  {
    id: 2,
    student: { id: 1, name: 'Alice Johnson', regNumber: 'UNI-2024-0001' },
    course: {
      code: 'CS302',
      name: 'Algorithms',
      credits: 3,
      instructor: 'Dr. Jane Smith'
    },
    semester: 'Fall 2024',
    section: 'A',
    status: 'registered',
    registrationDate: '2024-08-20',
    grade: null,
    gradePoints: null
  },
  {
    id: 3,
    student: { id: 1, name: 'Alice Johnson', regNumber: 'UNI-2024-0001' },
    course: {
      code: 'MATH201',
      name: 'Calculus II',
      credits: 4,
      instructor: 'Dr. Michael Chen'
    },
    semester: 'Fall 2024',
    section: 'B',
    status: 'registered',
    registrationDate: '2024-08-20',
    grade: null,
    gradePoints: null
  },
  {
    id: 4,
    student: { id: 2, name: 'Bob Smith', regNumber: 'UNI-2024-0002' },
    course: {
      code: 'MATH201',
      name: 'Calculus II',
      credits: 4,
      instructor: 'Dr. Michael Chen'
    },
    semester: 'Fall 2024',
    section: 'A',
    status: 'registered',
    registrationDate: '2024-08-21',
    grade: null,
    gradePoints: null
  },
  {
    id: 5,
    student: { id: 2, name: 'Bob Smith', regNumber: 'UNI-2024-0002' },
    course: {
      code: 'PHY101',
      name: 'Physics I',
      credits: 3,
      instructor: 'Dr. Lisa Davis'
    },
    semester: 'Fall 2024',
    section: 'A',
    status: 'registered',
    registrationDate: '2024-08-21',
    grade: null,
    gradePoints: null
  }
];

// Semester data
export const mockSemesters = [
  {
    id: 1,
    name: 'Fall 2024',
    code: 'F24',
    startDate: '2024-09-01',
    endDate: '2024-12-31',
    registrationStartDate: '2024-08-01',
    registrationEndDate: '2024-08-25',
    isActive: true,
    isCurrent: true
  },
  {
    id: 2,
    name: 'Spring 2024',
    code: 'S24',
    startDate: '2024-01-15',
    endDate: '2024-05-15',
    registrationStartDate: '2023-12-01',
    registrationEndDate: '2023-12-20',
    isActive: false,
    isCurrent: false
  },
  {
    id: 3,
    name: 'Spring 2025',
    code: 'S25',
    startDate: '2025-01-15',
    endDate: '2025-05-15',
    registrationStartDate: '2024-12-01',
    registrationEndDate: '2024-12-20',
    isActive: true,
    isCurrent: false
  }
];