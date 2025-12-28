// src/services/api/student.service.js
import { apiClient, createMockResponse } from "./client.js";

// Mock student data
const mockStudent = {
  id: 1,
  name: "John Doe",
  regNumber: "UNI-2024-0123",
  program: "Computer Science",
  year: 3,
  semester: "Fall 2024",
  gpa: 3.84,
  email: "john.doe@university.edu",
  phone: "+1234567890",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
  address: "123 University Ave, Campus City",
  dateOfBirth: "2002-05-15",
  enrollmentDate: "2022-09-01",
};

// Mock data for development
const mockCourses = [
  {
    id: 1,
    code: "CS301",
    name: "Data Structures",
    instructor: "Dr. Jane Smith",
    instructorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
    credits: 3,
    grade: "A",
    progress: 80,
    color: "#3b82f6",
    schedule: "Mon, Wed, Fri 9:00-10:30",
    room: "A-101",
    students: 45,
    description:
      "Advanced data structures including trees, graphs, and hash tables.",
    semester: "Fall 2024",
  },
  {
    id: 2,
    code: "MA202",
    name: "Calculus II",
    instructor: "Dr. Bob Johnson",
    instructorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob",
    credits: 4,
    grade: "B+",
    progress: 75,
    color: "#8b5cf6",
    schedule: "Tue, Thu 10:30-12:00",
    room: "B-205",
    students: 38,
    description: "Integration techniques, series, and multivariable calculus.",
    semester: "Fall 2024",
  },
  {
    id: 3,
    code: "EN101",
    name: "English Composition",
    instructor: "Prof. Sarah Lee",
    instructorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    credits: 3,
    grade: "A",
    progress: 90,
    color: "#10b981",
    schedule: "Mon, Wed 2:00-3:30",
    room: "C-301",
    students: 30,
    description: "Academic writing, research papers, and communication skills.",
    semester: "Fall 2024",
  },
  {
    id: 4,
    code: "PH201",
    name: "Physics I",
    instructor: "Dr. Michael Brown",
    instructorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
    credits: 4,
    grade: "B",
    progress: 68,
    color: "#f59e0b",
    schedule: "Tue, Thu, Fri 1:00-2:30",
    room: "D-102",
    students: 42,
    description: "Classical mechanics, thermodynamics, and wave motion.",
    semester: "Fall 2024",
  },
  {
    id: 5,
    code: "CS401",
    name: "Machine Learning",
    instructor: "Dr. Emily Chen",
    instructorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
    credits: 3,
    grade: "A-",
    progress: 85,
    color: "#ef4444",
    schedule: "Wed, Fri 3:00-4:30",
    room: "E-201",
    students: 35,
    description: "Supervised and unsupervised learning algorithms.",
    semester: "Fall 2024",
  },
  {
    id: 6,
    code: "HU301",
    name: "Ethics in Technology",
    instructor: "Prof. David Wilson",
    instructorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
    credits: 2,
    grade: "A",
    progress: 95,
    color: "#06b6d4",
    schedule: "Mon 4:00-5:30",
    room: "F-305",
    students: 25,
    description: "Moral implications of technology and AI development.",
    semester: "Fall 2024",
  },
];

const mockAttendance = {
  overall: 92,
  total: 125,
  present: 115,
  absent: 10,
  calendar: [
    { date: "2024-12-01", status: "present" },
    { date: "2024-12-02", status: "present" },
    { date: "2024-12-03", status: "absent" },
    { date: "2024-12-04", status: "present" },
    { date: "2024-12-05", status: "late" },
    { date: "2024-12-06", status: "present" },
    { date: "2024-12-07", status: "holiday" },
    { date: "2024-12-08", status: "present" },
    { date: "2024-12-09", status: "present" },
    { date: "2024-12-10", status: "present" },
    // Add more dates as needed
  ],
  byCourse: [
    { courseCode: "CS301", percentage: 85, present: 34, total: 40 },
    { courseCode: "MA202", percentage: 72, present: 28, total: 38 },
    { courseCode: "EN101", percentage: 100, present: 30, total: 30 },
    { courseCode: "PH201", percentage: 90, present: 27, total: 30 },
  ],
};

const mockExams = [
  {
    id: 1,
    courseCode: "CS301",
    courseName: "Data Structures",
    type: "Midterm",
    date: "2025-01-25",
    time: "9:00 AM - 12:00 PM",
    duration: "3 hours",
    room: "Engineering Block A-101",
    seat: "45",
    syllabus: ["Chapters 1-5", "Arrays", "Linked Lists", "Trees", "Graphs"],
    status: "upcoming",
    instructions:
      "Bring calculator, pens, and ID card. No electronic devices allowed.",
  },
  {
    id: 2,
    courseCode: "MA202",
    courseName: "Calculus II",
    type: "Midterm",
    date: "2025-01-28",
    time: "2:00 PM - 5:00 PM",
    duration: "3 hours",
    room: "Math Building B-205",
    seat: "23",
    syllabus: ["Integration by parts", "Series and sequences", "Taylor series"],
    status: "upcoming",
    instructions:
      "Scientific calculator permitted. Formula sheet will be provided.",
  },
  {
    id: 3,
    courseCode: "EN101",
    courseName: "English Composition",
    type: "Final",
    date: "2024-12-15",
    time: "10:00 AM - 1:00 PM",
    duration: "3 hours",
    room: "Arts Building C-301",
    seat: "12",
    syllabus: ["Essay writing", "Research methodology", "Grammar and style"],
    status: "completed",
    grade: "A",
    score: 92,
  },
];

const mockVirtualClasses = [
  {
    id: 1,
    courseCode: "CS301",
    courseName: "Data Structures",
    title: "Lecture 12: Binary Trees",
    date: "2025-01-22",
    time: "9:00 AM",
    duration: 90,
    platform: "Zoom",
    meetingLink: "https://zoom.us/j/123456789",
    status: "upcoming",
    recordingUrl: null,
    description:
      "Introduction to binary tree data structure and traversal methods.",
  },
  {
    id: 2,
    courseCode: "MA202",
    courseName: "Calculus II",
    title: "Lecture 8: Integration Techniques",
    date: "2025-01-20",
    time: "10:30 AM",
    duration: 90,
    platform: "Google Meet",
    meetingLink: "https://meet.google.com/abc-defg-hij",
    status: "recorded",
    recordingUrl: "https://drive.google.com/recorded-video-1",
    description:
      "Advanced integration techniques including substitution and integration by parts.",
  },
  {
    id: 3,
    courseCode: "CS401",
    courseName: "Machine Learning",
    title: "Lecture 5: Neural Networks",
    date: "2025-01-21",
    time: "3:00 PM",
    duration: 90,
    platform: "Zoom",
    meetingLink: "https://zoom.us/j/987654321",
    status: "live",
    recordingUrl: null,
    description:
      "Live session on neural network fundamentals and backpropagation.",
  },
];

const mockMaterials = [
  {
    id: 1,
    courseCode: "CS301",
    title: "Assignment 1 - Arrays and Linked Lists",
    type: "pdf",
    size: "2.5 MB",
    uploadedDate: "2025-01-20",
    downloadUrl: "#",
    description:
      "First assignment covering array operations and linked list implementation.",
    dueDate: "2025-01-30",
  },
  {
    id: 2,
    courseCode: "CS301",
    title: "Lecture 1-5 Slides",
    type: "ppt",
    size: "15.2 MB",
    uploadedDate: "2025-01-15",
    downloadUrl: "#",
    description: "Complete slides for lectures 1 through 5.",
    chapters: ["1", "2", "3", "4", "5"],
  },
  {
    id: 3,
    courseCode: "MA202",
    title: "Integration Tutorial Video",
    type: "video",
    size: "125.8 MB",
    uploadedDate: "2025-01-18",
    downloadUrl: "#",
    description: "Step-by-step video tutorial on integration techniques.",
    duration: "45 minutes",
  },
  {
    id: 4,
    courseCode: "EN101",
    title: "Research Paper Guidelines",
    type: "pdf",
    size: "800 KB",
    uploadedDate: "2025-01-10",
    downloadUrl: "#",
    description: "Guidelines and requirements for the final research paper.",
    wordCount: "3000-5000 words",
  },
  {
    id: 5,
    courseCode: "CS401",
    title: "Kaggle Competition Link",
    type: "link",
    size: null,
    uploadedDate: "2025-01-12",
    downloadUrl: "https://kaggle.com/competition-url",
    description: "Join the class Kaggle competition for hands-on ML practice.",
  },
];

const mockNotices = [
  {
    id: 1,
    title: "Exam Schedule Updated",
    content:
      "The midterm exams have been rescheduled. Please check the updated timetable. CS301 exam is now on January 25th instead of January 22nd.",
    priority: "urgent",
    postedBy: "Admin",
    postedDate: "2025-01-22T10:00:00",
    isPinned: true,
    isRead: false,
    category: "Examination",
  },
  {
    id: 2,
    title: "Winter Break Announcement",
    content:
      "Winter break will start from December 23rd. Classes will resume on January 6th. Happy holidays!",
    priority: "important",
    postedBy: "Registrar",
    postedDate: "2025-01-20T09:30:00",
    isPinned: false,
    isRead: true,
    category: "Holiday",
  },
  {
    id: 3,
    title: "New Course Registration Open",
    content:
      "Registration for Spring 2025 semester is now open. Deadline: February 15th.",
    priority: "normal",
    postedBy: "Academic Office",
    postedDate: "2025-01-18T14:20:00",
    isPinned: false,
    isRead: false,
    category: "Registration",
  },
  {
    id: 4,
    title: "Library Hours Extended",
    content:
      "Library will remain open until 11 PM during exam weeks. Study rooms can be booked online.",
    priority: "normal",
    postedBy: "Library",
    postedDate: "2025-01-15T16:45:00",
    isPinned: false,
    isRead: true,
    category: "Facilities",
  },
];

const mockGrades = [
  {
    id: 1,
    courseCode: "CS301",
    courseName: "Data Structures",
    semester: "Fall 2024",
    grade: "A",
    gpa: 4.0,
    assessments: [
      { name: "Assignment 1", score: 95, weight: 15 },
      { name: "Midterm", score: 88, weight: 30 },
      { name: "Assignment 2", score: 92, weight: 15 },
      { name: "Final", score: 90, weight: 40 },
    ],
  },
  {
    id: 2,
    courseCode: "MA202",
    courseName: "Calculus II",
    semester: "Fall 2024",
    grade: "B+",
    gpa: 3.3,
    assessments: [
      { name: "Quiz 1", score: 85, weight: 10 },
      { name: "Midterm", score: 78, weight: 35 },
      { name: "Quiz 2", score: 88, weight: 10 },
      { name: "Final", score: 82, weight: 45 },
    ],
  },
  {
    id: 3,
    courseCode: "EN101",
    courseName: "English Composition",
    semester: "Fall 2024",
    grade: "A",
    gpa: 4.0,
    assessments: [
      { name: "Essay 1", score: 92, weight: 20 },
      { name: "Research Paper", score: 94, weight: 35 },
      { name: "Essay 2", score: 90, weight: 20 },
      { name: "Final Exam", score: 93, weight: 25 },
    ],
  },
];

export const studentService = {
  // Dashboard data
  getDashboard: async () => {
    return createMockResponse(
      {
        student: mockStudent,
        stats: {
          totalCourses: mockCourses.length,
          currentGPA: mockStudent.gpa,
          attendancePercentage: mockAttendance.overall,
          pendingAssignments: 5,
        },
        todaySchedule: [
          {
            courseCode: "CS301",
            courseName: "Data Structures",
            time: "9:00 AM - 10:30 AM",
            room: "A-101",
            instructor: "Dr. Jane Smith",
          },
          {
            courseCode: "MA202",
            courseName: "Calculus II",
            time: "10:30 AM - 12:00 PM",
            room: "B-205",
            instructor: "Dr. Bob Johnson",
          },
        ],
        upcomingDeadlines: [
          {
            id: 1,
            title: "Assignment 1 Due",
            course: "CS301",
            date: "2025-01-30",
            type: "assignment",
          },
          {
            id: 2,
            title: "Midterm Exam",
            course: "MA202",
            date: "2025-01-28",
            type: "exam",
          },
        ],
        recentNotices: mockNotices.slice(0, 3),
      },
      800
    );
  },

  // Get all courses
  getCourses: async () => {
    return createMockResponse({ courses: mockCourses }, 600);
  },

  // Get single course details
  getCourseDetails: async (id) => {
    const course = mockCourses.find((c) => c.id === parseInt(id));
    return createMockResponse({ course }, 400);
  },

  // Get attendance data
  getAttendance: async () => {
    return createMockResponse(mockAttendance, 500);
  },

  // Get grades data
  getGrades: async () => {
    return createMockResponse(
      {
        currentGPA: mockStudent.gpa,
        grades: mockGrades,
        gpaTrend: [
          { semester: "Fall 2023", gpa: 3.5 },
          { semester: "Spring 2024", gpa: 3.7 },
          { semester: "Fall 2024", gpa: 3.84 },
        ],
      },
      700
    );
  },

  // Get exams data
  getExams: async () => {
    return createMockResponse({ exams: mockExams }, 500);
  },

  // Get virtual classes data
  getVirtualClasses: async () => {
    return createMockResponse({ classes: mockVirtualClasses }, 400);
  },

  // Get study materials
  getMaterials: async () => {
    return createMockResponse({ materials: mockMaterials }, 600);
  },

  // Get notices
  getNotices: async () => {
    return createMockResponse({ notices: mockNotices }, 300);
  },

  // Get student profile
  getProfile: async () => {
    return createMockResponse({ student: mockStudent }, 400);
  },

  // Update profile
  updateProfile: async (data) => {
    return createMockResponse(
      {
        message: "Profile updated successfully",
        student: { ...mockStudent, ...data },
      },
      600
    );
  },
};
