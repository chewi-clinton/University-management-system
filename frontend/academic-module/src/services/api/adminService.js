import api from "./api";

const adminService = {
  // Dashboard Statistics
  getDashboardStats: async () => {
    try {
      // Fetch all required data in parallel
      const [students, faculty, courses, attendance] = await Promise.all([
        api.get("/students/"),
        api.get("/faculty-members/"),
        api.get("/courses/"),
        api.get("/attendance-summaries/"),
      ]);

      // Extract results from paginated responses
      const studentsData = Array.isArray(students.data)
        ? students.data
        : students.data.results || [];
      const facultyData = Array.isArray(faculty.data)
        ? faculty.data
        : faculty.data.results || [];
      const coursesData = Array.isArray(courses.data)
        ? courses.data
        : courses.data.results || [];
      const attendanceData = Array.isArray(attendance.data)
        ? attendance.data
        : attendance.data.results || [];

      // Calculate attendance rate
      const totalAttendance = attendanceData.reduce(
        (sum, record) => sum + (record.attendance_percentage || 0),
        0
      );
      const avgAttendance =
        attendanceData.length > 0 ? totalAttendance / attendanceData.length : 0;

      return {
        success: true,
        data: {
          totalStudents: studentsData.length,
          totalFaculty: facultyData.length,
          totalCourses: coursesData.length,
          attendanceRate: avgAttendance.toFixed(1),
        },
      };
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      return {
        success: false,
        error: error.response?.data?.detail || "Failed to load statistics",
      };
    }
  },

  // Get all students with detailed info
  getStudents: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters);
      const response = await api.get(`/students/?${params}`);
      const data = Array.isArray(response.data)
        ? response.data
        : response.data.results || [];
      return {
        success: true,
        data: data,
      };
    } catch (error) {
      console.error("Error fetching students:", error);
      return {
        success: false,
        error: error.response?.data?.detail || "Failed to load students",
      };
    }
  },

  // Get all faculty members
  getFacultyMembers: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters);
      const response = await api.get(`/faculty-members/?${params}`);
      const data = Array.isArray(response.data)
        ? response.data
        : response.data.results || [];
      return {
        success: true,
        data: data,
      };
    } catch (error) {
      console.error("Error fetching faculty members:", error);
      return {
        success: false,
        error: error.response?.data?.detail || "Failed to load faculty members",
      };
    }
  },

  // Get all departments with statistics
  getDepartments: async () => {
    try {
      const response = await api.get("/departments/");
      const departments = Array.isArray(response.data)
        ? response.data
        : response.data.results || [];

      // Fetch related data for each department
      const departmentsWithStats = await Promise.all(
        departments.map(async (dept) => {
          try {
            const [students, faculty, courses] = await Promise.all([
              api.get(`/students/?program__department=${dept.department_id}`),
              api.get(`/faculty-members/?department=${dept.department_id}`),
              api.get(`/courses/?department=${dept.department_id}`),
            ]);

            // Extract results
            const studentsData = Array.isArray(students.data)
              ? students.data
              : students.data.results || [];
            const facultyData = Array.isArray(faculty.data)
              ? faculty.data
              : faculty.data.results || [];
            const coursesData = Array.isArray(courses.data)
              ? courses.data
              : courses.data.results || [];

            // Calculate average GPA
            const avgGPA =
              studentsData.length > 0
                ? studentsData.reduce(
                    (sum, s) => sum + (parseFloat(s.current_gpa) || 0),
                    0
                  ) / studentsData.length
                : 0;

            // Calculate average attendance (placeholder - implement based on your data)
            const avgAttendance = 87;

            return {
              id: dept.department_id,
              code:
                dept.department_code ||
                dept.department_name.substring(0, 3).toUpperCase(),
              name: dept.department_name,
              students: studentsData.length,
              faculty: facultyData.length,
              courses: coursesData.length,
              avgAttendance: avgAttendance,
              avgGPA: avgGPA.toFixed(2),
              color: getRandomColor(),
            };
          } catch (err) {
            console.error(
              `Error fetching stats for department ${dept.department_id}:`,
              err
            );
            return null;
          }
        })
      );

      return {
        success: true,
        data: departmentsWithStats.filter((d) => d !== null),
      };
    } catch (error) {
      console.error("Error fetching departments:", error);
      return {
        success: false,
        error: error.response?.data?.detail || "Failed to load departments",
      };
    }
  },

  // Get enrollment trends
  getEnrollmentTrends: async () => {
    try {
      const response = await api.get("/students/");
      const students = Array.isArray(response.data)
        ? response.data
        : response.data.results || [];

      // Group students by enrollment month
      const monthCounts = {};
      const currentYear = new Date().getFullYear();

      // Initialize all months
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      months.forEach((month) => (monthCounts[month] = 0));

      // Count students enrolled in current year by month
      students.forEach((student) => {
        if (student.enrollment_date) {
          const date = new Date(student.enrollment_date);
          if (date.getFullYear() === currentYear) {
            const month = months[date.getMonth()];
            monthCounts[month] = (monthCounts[month] || 0) + 1;
          }
        }
      });

      // Create cumulative data
      let cumulative = 0;
      const data = months.map((month) => {
        cumulative += monthCounts[month];
        return cumulative;
      });

      return {
        success: true,
        data: {
          labels: months,
          data: data,
        },
      };
    } catch (error) {
      console.error("Error fetching enrollment trends:", error);
      return {
        success: false,
        error:
          error.response?.data?.detail || "Failed to load enrollment trends",
      };
    }
  },

  // Get grade distribution
  getGradeDistribution: async () => {
    try {
      const response = await api.get("/grades/");
      const grades = Array.isArray(response.data)
        ? response.data
        : response.data.results || [];

      const distribution = {
        A: 0,
        B: 0,
        C: 0,
        D: 0,
        F: 0,
      };

      grades.forEach((grade) => {
        if (grade.grade && distribution.hasOwnProperty(grade.grade)) {
          distribution[grade.grade]++;
        }
      });

      const total = Object.values(distribution).reduce(
        (sum, count) => sum + count,
        0
      );

      const result = Object.entries(distribution).map(([grade, count]) => ({
        grade,
        count,
        percentage: total > 0 ? Math.round((count / total) * 100) : 0,
      }));

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error("Error fetching grade distribution:", error);
      return {
        success: false,
        error:
          error.response?.data?.detail || "Failed to load grade distribution",
      };
    }
  },

  // Get recent notices
  getRecentNotices: async (limit = 5) => {
    try {
      const response = await api.get(`/notices/?ordering=-post_date`);
      const notices = Array.isArray(response.data)
        ? response.data
        : response.data.results || [];
      return {
        success: true,
        data: notices.slice(0, limit),
      };
    } catch (error) {
      console.error("Error fetching notices:", error);
      return {
        success: false,
        error: error.response?.data?.detail || "Failed to load notices",
      };
    }
  },

  // Get all notices
  getAllNotices: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters);
      const response = await api.get(`/notices/?${params}`);
      const data = Array.isArray(response.data)
        ? response.data
        : response.data.results || [];
      return {
        success: true,
        data: data,
      };
    } catch (error) {
      console.error("Error fetching all notices:", error);
      return {
        success: false,
        error: error.response?.data?.detail || "Failed to load notices",
      };
    }
  },

  // Get upcoming events (exam schedules)
  getUpcomingEvents: async () => {
    try {
      const response = await api.get("/exam-schedules/?ordering=exam_date");
      const schedules = Array.isArray(response.data)
        ? response.data
        : response.data.results || [];

      const events = schedules.map((schedule) => ({
        id: schedule.schedule_id,
        title: schedule.exam?.exam_name || "Examination",
        date: schedule.exam_date,
        type: "exam",
      }));

      return {
        success: true,
        data: events.slice(0, 4), // Return first 4 upcoming events
      };
    } catch (error) {
      console.error("Error fetching upcoming events:", error);
      return {
        success: false,
        error: error.response?.data?.detail || "Failed to load events",
      };
    }
  },

  // Get system notifications (low attendance warnings, pending submissions, etc.)
  getSystemNotifications: async () => {
    try {
      // Get low attendance students
      const attendanceResponse = await api.get("/attendance-summaries/");
      const attendanceData = Array.isArray(attendanceResponse.data)
        ? attendanceResponse.data
        : attendanceResponse.data.results || [];

      const lowAttendance = attendanceData.filter(
        (record) => record.attendance_percentage < 75
      );

      // Get pending grade submissions
      const gradesResponse = await api.get("/grades/?is_finalized=false");
      const gradesData = Array.isArray(gradesResponse.data)
        ? gradesResponse.data
        : gradesResponse.data.results || [];

      const notifications = [
        {
          id: 1,
          type: "warning",
          title: "Low Attendance Alert",
          message: `${lowAttendance.length} students have attendance below 75% threshold`,
          timestamp: "1 hour ago",
          isRead: false,
        },
        {
          id: 2,
          type: "info",
          title: "Grade Submission Reminder",
          message: `${gradesData.length} grades have pending submissions`,
          timestamp: "3 hours ago",
          isRead: false,
        },
      ];

      return {
        success: true,
        data: notifications,
      };
    } catch (error) {
      console.error("Error fetching system notifications:", error);
      return {
        success: false,
        error: error.response?.data?.detail || "Failed to load notifications",
      };
    }
  },

  // Get all courses
  getCourses: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters);
      const response = await api.get(`/courses/?${params}`);
      const data = Array.isArray(response.data)
        ? response.data
        : response.data.results || [];
      return {
        success: true,
        data: data,
      };
    } catch (error) {
      console.error("Error fetching courses:", error);
      return {
        success: false,
        error: error.response?.data?.detail || "Failed to load courses",
      };
    }
  },

  // Get all course offerings
  getCourseOfferings: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters);
      const response = await api.get(`/course-offerings/?${params}`);
      const data = Array.isArray(response.data)
        ? response.data
        : response.data.results || [];
      return {
        success: true,
        data: data,
      };
    } catch (error) {
      console.error("Error fetching course offerings:", error);
      return {
        success: false,
        error:
          error.response?.data?.detail || "Failed to load course offerings",
      };
    }
  },

  // Get all enrollments
  getEnrollments: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters);
      const response = await api.get(`/enrollments/?${params}`);
      const data = Array.isArray(response.data)
        ? response.data
        : response.data.results || [];
      return {
        success: true,
        data: data,
      };
    } catch (error) {
      console.error("Error fetching enrollments:", error);
      return {
        success: false,
        error: error.response?.data?.detail || "Failed to load enrollments",
      };
    }
  },

  // Get all attendance records
  getAttendance: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters);
      const response = await api.get(`/attendance/?${params}`);
      const data = Array.isArray(response.data)
        ? response.data
        : response.data.results || [];
      return {
        success: true,
        data: data,
      };
    } catch (error) {
      console.error("Error fetching attendance:", error);
      return {
        success: false,
        error: error.response?.data?.detail || "Failed to load attendance",
      };
    }
  },

  // Get all grades
  getGrades: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters);
      const response = await api.get(`/grades/?${params}`);
      const data = Array.isArray(response.data)
        ? response.data
        : response.data.results || [];
      return {
        success: true,
        data: data,
      };
    } catch (error) {
      console.error("Error fetching grades:", error);
      return {
        success: false,
        error: error.response?.data?.detail || "Failed to load grades",
      };
    }
  },

  // Get all exam schedules
  getExamSchedules: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters);
      const response = await api.get(`/exam-schedules/?${params}`);
      const data = Array.isArray(response.data)
        ? response.data
        : response.data.results || [];
      return {
        success: true,
        data: data,
      };
    } catch (error) {
      console.error("Error fetching exam schedules:", error);
      return {
        success: false,
        error: error.response?.data?.detail || "Failed to load exam schedules",
      };
    }
  },

  // Get all semesters
  getSemesters: async () => {
    try {
      const response = await api.get("/semesters/");
      const data = Array.isArray(response.data)
        ? response.data
        : response.data.results || [];
      return {
        success: true,
        data: data,
      };
    } catch (error) {
      console.error("Error fetching semesters:", error);
      return {
        success: false,
        error: error.response?.data?.detail || "Failed to load semesters",
      };
    }
  },

  // Get all academic sessions
  getAcademicSessions: async () => {
    try {
      const response = await api.get("/sessions/");
      const data = Array.isArray(response.data)
        ? response.data
        : response.data.results || [];
      return {
        success: true,
        data: data,
      };
    } catch (error) {
      console.error("Error fetching academic sessions:", error);
      return {
        success: false,
        error:
          error.response?.data?.detail || "Failed to load academic sessions",
      };
    }
  },

  // Create new notice
  createNotice: async (noticeData) => {
    try {
      const response = await api.post("/notices/", noticeData);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Error creating notice:", error);
      return {
        success: false,
        error: error.response?.data?.detail || "Failed to create notice",
      };
    }
  },

  // Update notice
  updateNotice: async (noticeId, noticeData) => {
    try {
      const response = await api.patch(`/notices/${noticeId}/`, noticeData);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Error updating notice:", error);
      return {
        success: false,
        error: error.response?.data?.detail || "Failed to update notice",
      };
    }
  },

  // Delete notice
  deleteNotice: async (noticeId) => {
    try {
      await api.delete(`/notices/${noticeId}/`);
      return {
        success: true,
      };
    } catch (error) {
      console.error("Error deleting notice:", error);
      return {
        success: false,
        error: error.response?.data?.detail || "Failed to delete notice",
      };
    }
  },

  // Confirm enrollment
  confirmEnrollment: async (enrollmentId) => {
    try {
      const response = await api.post(`/enrollments/${enrollmentId}/confirm/`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Error confirming enrollment:", error);
      return {
        success: false,
        error: error.response?.data?.detail || "Failed to confirm enrollment",
      };
    }
  },

  // Activate academic session
  activateSession: async (sessionId) => {
    try {
      const response = await api.post(`/sessions/${sessionId}/activate/`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Error activating session:", error);
      return {
        success: false,
        error: error.response?.data?.detail || "Failed to activate session",
      };
    }
  },
};

// Helper function to generate random colors for departments
function getRandomColor() {
  const colors = [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#8b5cf6",
    "#ec4899",
    "#06b6d4",
    "#84cc16",
    "#f97316",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

export { adminService };
