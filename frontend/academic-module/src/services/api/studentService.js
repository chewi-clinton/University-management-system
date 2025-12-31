import api from "./api";

const studentService = {
  getDashboard: async () => {
    try {
      const response = await api.get("/my/dashboard/");
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Error fetching student dashboard:", error);
      return {
        success: false,
        error: error.response?.data?.detail || "Failed to load dashboard",
      };
    }
  },

  getMyProfile: async () => {
    try {
      const response = await api.get("/my/profile/");
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Error fetching student profile:", error);
      return {
        success: false,
        error: error.response?.data?.detail || "Failed to load profile",
      };
    }
  },

  getCourses: async () => {
    try {
      const response = await api.get("/course-registrations/my-courses/");
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Error fetching courses:", error);
      return {
        success: false,
        error: error.response?.data?.detail || "Failed to load courses",
      };
    }
  },

  getAttendance: async (studentId) => {
    try {
      const response = await api.get(`/my/attendance_summary/${studentId}/`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Error fetching attendance:", error);
      return {
        success: false,
        error: error.response?.data?.detail || "Failed to load attendance",
      };
    }
  },

  getTranscript: async (studentId) => {
    try {
      const response = await api.get(`/my/transcript/${studentId}/`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Error fetching transcript:", error);
      return {
        success: false,
        error: error.response?.data?.detail || "Failed to load transcript",
      };
    }
  },

  // NEW METHODS FOR ACTUAL API CALLS

  // Get all notices for the current student
  getNotices: async () => {
    try {
      const response = await api.get("/notices/my-notices/");
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Error fetching notices:", error);
      return {
        success: false,
        error: error.response?.data?.detail || "Failed to load notices",
      };
    }
  },

  // Get course offerings (available courses)
  getCourseOfferings: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters);
      const response = await api.get(`/course-offerings/?${params}`);
      return {
        success: true,
        data: response.data,
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

  // Get specific course details
  getCourseDetails: async (courseId) => {
    try {
      const response = await api.get(`/course-offerings/${courseId}/`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Error fetching course details:", error);
      return {
        success: false,
        error: error.response?.data?.detail || "Failed to load course details",
      };
    }
  },

  // Get study materials for a course
  getCourseMaterials: async (offeringId) => {
    try {
      const response = await api.get(
        `/course-offerings/${offeringId}/materials/`
      );
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Error fetching course materials:", error);
      return {
        success: false,
        error: error.response?.data?.detail || "Failed to load materials",
      };
    }
  },

  // Get Zoom classes for a course
  getZoomClasses: async (offeringId) => {
    try {
      const response = await api.get(
        `/course-offerings/${offeringId}/zoom_classes/`
      );
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Error fetching Zoom classes:", error);
      return {
        success: false,
        error: error.response?.data?.detail || "Failed to load Zoom classes",
      };
    }
  },

  // Get grades for current student
  getGrades: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters);
      const response = await api.get(`/grades/my-grades/?${params}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Error fetching grades:", error);
      return {
        success: false,
        error: error.response?.data?.detail || "Failed to load grades",
      };
    }
  },

  // Get exam schedules
  getExamSchedules: async () => {
    try {
      const response = await api.get("/exam-schedules/");
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Error fetching exam schedules:", error);
      return {
        success: false,
        error: error.response?.data?.detail || "Failed to load exam schedules",
      };
    }
  },

  // Get admit cards
  getAdmitCards: async () => {
    try {
      const response = await api.get("/admit-cards/");
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Error fetching admit cards:", error);
      return {
        success: false,
        error: error.response?.data?.detail || "Failed to load admit cards",
      };
    }
  },

  // Get attendance records - IMPORTANT FOR ATTENDANCE PAGE
  getAttendanceRecords: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters);
      const response = await api.get(`/attendance/my-attendance/?${params}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Error fetching attendance records:", error);
      return {
        success: false,
        error:
          error.response?.data?.detail || "Failed to load attendance records",
      };
    }
  },

  // Mark attendance using QR code
  markAttendanceByQR: async (qrData) => {
    try {
      const response = await api.post("/attendance/mark-by-qr/", qrData);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Error marking attendance:", error);
      return {
        success: false,
        error: error.response?.data?.detail || "Failed to mark attendance",
      };
    }
  },

  // Get all semesters
  getSemesters: async () => {
    try {
      const response = await api.get("/semesters/");
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Error fetching semesters:", error);
      return {
        success: false,
        error: error.response?.data?.detail || "Failed to load semesters",
      };
    }
  },

  // Get enrollments
  getEnrollments: async () => {
    try {
      const response = await api.get("/enrollments/");
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Error fetching enrollments:", error);
      return {
        success: false,
        error: error.response?.data?.detail || "Failed to load enrollments",
      };
    }
  },
};

export { studentService };
