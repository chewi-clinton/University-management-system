export const mockGrades = [
  {
    id: 1,
    student: { id: 1, name: 'Alice Johnson', regNumber: 'UNI-2024-0001' },
    course: { code: 'CS301', name: 'Data Structures' },
    assessments: [
      {
        id: 1,
        name: 'Midterm Exam',
        type: 'midterm',
        marksObtained: 85,
        maxMarks: 100,
        weightage: 30,
        gradedAt: '2024-11-15',
        isFinalized: true
      },
      {
        id: 2,
        name: 'Assignment 1',
        type: 'assignment',
        marksObtained: 92,
        maxMarks: 100,
        weightage: 15,
        gradedAt: '2024-10-20',
        isFinalized: true
      },
      {
        id: 3,
        name: 'Quiz 1',
        type: 'quiz',
        marksObtained: 88,
        maxMarks: 100,
        weightage: 10,
        gradedAt: '2024-10-05',
        isFinalized: true
      },
      {
        id: 4,
        name: 'Final Exam',
        type: 'final',
        marksObtained: 90,
        maxMarks: 100,
        weightage: 40,
        gradedAt: '2024-12-20',
        isFinalized: true
      },
      {
        id: 5,
        name: 'Project',
        type: 'project',
        marksObtained: 95,
        maxMarks: 100,
        weightage: 5,
        gradedAt: '2024-12-15',
        isFinalized: true
      }
    ],
    totalMarks: 87.5,
    letterGrade: 'A',
    gradePoints: 4.0,
    semester: 'Fall 2024',
    gradedBy: 'Dr. Jane Smith',
    isFinalized: true
  },
  {
    id: 2,
    student: { id: 2, name: 'Bob Smith', regNumber: 'UNI-2024-0002' },
    course: { code: 'MATH201', name: 'Calculus II' },
    assessments: [
      {
        id: 1,
        name: 'Midterm Exam',
        type: 'midterm',
        marksObtained: 78,
        maxMarks: 100,
        weightage: 35,
        gradedAt: '2024-11-10',
        isFinalized: true
      },
      {
        id: 2,
        name: 'Assignment 1',
        type: 'assignment',
        marksObtained: 85,
        maxMarks: 100,
        weightage: 20,
        gradedAt: '2024-10-15',
        isFinalized: true
      },
      {
        id: 3,
        name: 'Quiz 1',
        type: 'quiz',
        marksObtained: 82,
        maxMarks: 100,
        weightage: 10,
        gradedAt: '2024-10-01',
        isFinalized: true
      },
      {
        id: 4,
        name: 'Final Exam',
        type: 'final',
        marksObtained: 75,
        maxMarks: 100,
        weightage: 35,
        gradedAt: '2024-12-18',
        isFinalized: true
      }
    ],
    totalMarks: 78.8,
    letterGrade: 'B+',
    gradePoints: 3.3,
    semester: 'Fall 2024',
    gradedBy: 'Dr. Michael Chen',
    isFinalized: true
  },
  {
    id: 3,
    student: { id: 3, name: 'Charlie Brown', regNumber: 'UNI-2024-0003' },
    course: { code: 'ENG101', name: 'Engineering Basics' },
    assessments: [
      {
        id: 1,
        name: 'Midterm Exam',
        type: 'midterm',
        marksObtained: 92,
        maxMarks: 100,
        weightage: 30,
        gradedAt: '2024-11-20',
        isFinalized: true
      },
      {
        id: 2,
        name: 'Lab Report 1',
        type: 'lab',
        marksObtained: 88,
        maxMarks: 100,
        weightage: 25,
        gradedAt: '2024-10-25',
        isFinalized: true
      },
      {
        id: 3,
        name: 'Final Exam',
        type: 'final',
        marksObtained: 89,
        maxMarks: 100,
        weightage: 45,
        gradedAt: '2024-12-22',
        isFinalized: true
      }
    ],
    totalMarks: 89.7,
    letterGrade: 'A-',
    gradePoints: 3.7,
    semester: 'Fall 2024',
    gradedBy: 'Dr. Sarah Johnson',
    isFinalized: true
  },
  {
    id: 4,
    student: { id: 4, name: 'Diana Prince', regNumber: 'UNI-2024-0004' },
    course: { code: 'BUS101', name: 'Business Fundamentals' },
    assessments: [
      {
        id: 1,
        name: 'Case Study 1',
        type: 'case_study',
        marksObtained: 95,
        maxMarks: 100,
        weightage: 20,
        gradedAt: '2024-10-30',
        isFinalized: true
      },
      {
        id: 2,
        name: 'Midterm Exam',
        type: 'midterm',
        marksObtained: 91,
        maxMarks: 100,
        weightage: 30,
        gradedAt: '2024-11-25',
        isFinalized: true
      },
      {
        id: 3,
        name: 'Final Exam',
        type: 'final',
        marksObtained: 93,
        maxMarks: 100,
        weightage: 40,
        gradedAt: '2024-12-25',
        isFinalized: true
      },
      {
        id: 4,
        name: 'Presentation',
        type: 'presentation',
        marksObtained: 98,
        maxMarks: 100,
        weightage: 10,
        gradedAt: '2024-12-10',
        isFinalized: true
      }
    ],
    totalMarks: 92.8,
    letterGrade: 'A',
    gradePoints: 4.0,
    semester: 'Fall 2024',
    gradedBy: 'Prof. Robert Williams',
    isFinalized: true
  }
];

// Grade Distribution Analytics
export const mockGradeDistribution = {
  overall: [
    { grade: 'A', count: 245, percentage: 28 },
    { grade: 'B', count: 312, percentage: 35 },
    { grade: 'C', count: 198, percentage: 22 },
    { grade: 'D', count: 89, percentage: 10 },
    { grade: 'F', count: 45, percentage: 5 }
  ],
  byDepartment: {
    'Computer Science': [
      { grade: 'A', count: 135 },
      { grade: 'B', count: 180 },
      { grade: 'C', count: 95 },
      { grade: 'D', count: 30 },
      { grade: 'F', count: 10 }
    ],
    'Mathematics': [
      { grade: 'A', count: 85 },
      { grade: 'B', count: 95 },
      { grade: 'C', count: 60 },
      { grade: 'D', count: 25 },
      { grade: 'F', count: 15 }
    ],
    'Engineering': [
      { grade: 'A', count: 75 },
      { grade: 'B', count: 110 },
      { grade: 'C', count: 80 },
      { grade: 'D', count: 35 },
      { grade: 'F', count: 20 }
    ],
    'Business': [
      { grade: 'A', count: 95 },
      { grade: 'B', count: 120 },
      { grade: 'C', count: 75 },
      { grade: 'D', count: 30 },
      { grade: 'F', count: 10 }
    ]
  }
};

// GPA trends by semester
export const mockGPATrends = [
  {
    semester: 'Fall 2023',
    avgGPA: 3.38,
    totalStudents: 1150
  },
  {
    semester: 'Spring 2024',
    avgGPA: 3.40,
    totalStudents: 1180
  },
  {
    semester: 'Fall 2024',
    avgGPA: 3.42,
    totalStudents: 1247
  }
];

// Assessment types and their weightages
export const mockAssessmentTypes = [
  { type: 'assignment', label: 'Assignment', defaultWeightage: 15, maxWeightage: 30 },
  { type: 'quiz', label: 'Quiz', defaultWeightage: 10, maxWeightage: 20 },
  { type: 'midterm', label: 'Midterm Exam', defaultWeightage: 30, maxWeightage: 40 },
  { type: 'final', label: 'Final Exam', defaultWeightage: 40, maxWeightage: 50 },
  { type: 'project', label: 'Project', defaultWeightage: 20, maxWeightage: 40 },
  { type: 'lab', label: 'Lab Report', defaultWeightage: 25, maxWeightage: 35 },
  { type: 'presentation', label: 'Presentation', defaultWeightage: 15, maxWeightage: 25 },
  { type: 'case_study', label: 'Case Study', defaultWeightage: 20, maxWeightage: 30 }
];