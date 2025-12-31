import api from "./api";

/**
 * Faculty Service
 * Handles all faculty-related API calls
 */

const facultyService = {
  /**
   * Get faculty dashboard data
   * Aggregates multiple endpoints to build complete dashboard
   */
  async getDashboardData() {
    try {
      // Fetch all required data in parallel
      const [
        coursesResponse,
        attendanceResponse,
        gradesResponse,
        scheduleResponse,
        noticesResponse,
      ] = await Promise.all([
        api.get("course-offerings/", {
          params: { is_visible: true },
        }),
        api.get("attendance/"),
        api.get("grades/", {
          params: { is_finalized: false },
        }),
        api.get("exam-schedules/"),
        api.get("notices/my-notices/"),
      ]);

      // Process courses data
      const courses = coursesResponse.data.results || coursesResponse.data;
      const totalCourses = courses.length;

      // Calculate total students across all courses
      const totalStudents = courses.reduce(
        (sum, course) => sum + (course.current_enrollment || 0),
        0
      );

      // Calculate attendance rate
      const attendanceRecords =
        attendanceResponse.data.results || attendanceResponse.data;
      const presentCount = attendanceRecords.filter(
        (record) => record.status === "present"
      ).length;
      const attendanceRate =
        attendanceRecords.length > 0
          ? (presentCount / attendanceRecords.length) * 100
          : 0;

      // Count pending grading
      const pendingGrades = gradesResponse.data.results || gradesResponse.data;
      const pendingGrading = pendingGrades.length;

      // Process today's schedule from exam schedules
      const today = new Date().toISOString().split("T")[0];
      const schedules = scheduleResponse.data.results || scheduleResponse.data;
      const todaySchedule = schedules
        .filter((schedule) => schedule.exam_date === today)
        .map((schedule) => ({
          time: `${schedule.start_time} - ${schedule.end_time}`,
          courseName: schedule.exam?.offering?.course?.course_name || "N/A",
          courseCode: schedule.exam?.offering?.course?.course_code || "N/A",
          room: schedule.room?.room_number || "TBA",
          studentCount: schedule.exam?.offering?.current_enrollment || 0,
        }));

      // Process upcoming deadlines from exam schedules
      const upcomingDeadlines = schedules
        .filter((schedule) => new Date(schedule.exam_date) >= new Date())
        .sort((a, b) => new Date(a.exam_date) - new Date(b.exam_date))
        .slice(0, 5)
        .map((schedule) => ({
          id: schedule.schedule_id,
          title: schedule.exam?.exam_name || "Exam",
          course: schedule.exam?.offering?.course?.course_name || "N/A",
          date: schedule.exam_date,
          priority: this.calculatePriority(schedule.exam_date),
        }));

      // Process recent notices
      const notices = noticesResponse.data.results || noticesResponse.data;
      const recentNotices = notices.slice(0, 5).map((notice) => ({
        id: notice.notice_id,
        title: notice.title,
        content: notice.content,
        postedBy: notice.posted_by_user?.first_name
          ? `${notice.posted_by_user.first_name} ${notice.posted_by_user.last_name}`
          : "Administration",
        postedDate: notice.post_date,
        priority: notice.priority || "normal",
        isRead: false, // You might want to track this separately
      }));

      // Get recent activities (last 10 attendance records)
      const recentActivities = attendanceRecords
        .sort((a, b) => new Date(b.marked_at) - new Date(a.marked_at))
        .slice(0, 10)
        .map((record) => ({
          id: record.attendance_id,
          type: "attendance",
          student: record.student?.full_name || "Student",
          course: record.offering?.course?.course_code || "N/A",
          action: `marked ${record.status}`,
          time: this.formatTimeAgo(record.marked_at),
        }));

      return {
        stats: {
          totalCourses,
          totalStudents,
          attendanceRate: parseFloat(attendanceRate.toFixed(1)),
          pendingGrading,
        },
        todaySchedule,
        upcomingDeadlines,
        recentNotices,
        recentActivities,
      };
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      throw error;
    }
  },

  /**
   * Get faculty member profile
   */
  async getProfile() {
    try {
      const response = await api.get("auth/me/");
      return response.data;
    } catch (error) {
      console.error("Error fetching faculty profile:", error);
      throw error;
    }
  },

  /**
   * Get all courses taught by faculty
   */
  async getCourses(params = {}) {
    try {
      const response = await api.get("course-offerings/", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching courses:", error);
      throw error;
    }
  },

  /**
   * Get course details by ID
   */
  async getCourseById(courseId) {
    try {
      const response = await api.get(`course-offerings/${courseId}/`);
      return response.data;
    } catch (error) {
      console.error("Error fetching course details:", error);
      throw error;
    }
  },

  /**
   * Get students enrolled in a course
   */
  async getCourseStudents(offeringId) {
    try {
      const response = await api.get("course-registrations/", {
        params: { offering: offeringId, status: "registered" },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching course students:", error);
      throw error;
    }
  },

  /**
   * Mark attendance
   */
  async markAttendance(attendanceData) {
    try {
      const response = await api.post("attendance/", attendanceData);
      return response.data;
    } catch (error) {
      console.error("Error marking attendance:", error);
      throw error;
    }
  },

  /**
   * Get attendance records
   */
  async getAttendance(params = {}) {
    try {
      const response = await api.get("attendance/", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching attendance:", error);
      throw error;
    }
  },

  /**
   * Generate QR code for attendance
   */
  async generateAttendanceQR(offeringId, date) {
    try {
      const response = await api.post("attendance/generate-qr/", {
        offering_id: offeringId,
        attendance_date: date,
      });
      return response.data;
    } catch (error) {
      console.error("Error generating QR code:", error);
      throw error;
    }
  },

  /**
   * Create or update grade
   */
  async submitGrade(gradeData) {
    try {
      const response = await api.post("grades/", gradeData);
      return response.data;
    } catch (error) {
      console.error("Error submitting grade:", error);
      throw error;
    }
  },

  /**
   * Get grades
   */
  async getGrades(params = {}) {
    try {
      const response = await api.get("grades/", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching grades:", error);
      throw error;
    }
  },

  /**
   * Finalize grade
   */
  async finalizeGrade(gradeId) {
    try {
      const response = await api.post(`grades/${gradeId}/finalize/`);
      return response.data;
    } catch (error) {
      console.error("Error finalizing grade:", error);
      throw error;
    }
  },

  /**
   * Create Zoom class
   */
  async createZoomClass(classData) {
    try {
      const response = await api.post("zoom-classes/", classData);
      return response.data;
    } catch (error) {
      console.error("Error creating Zoom class:", error);
      throw error;
    }
  },

  /**
   * Start Zoom meeting
   */
  async startZoomMeeting(classId) {
    try {
      const response = await api.post(`zoom-classes/${classId}/start-meeting/`);
      return response.data;
    } catch (error) {
      console.error("Error starting Zoom meeting:", error);
      throw error;
    }
  },

  /**
   * Upload study material
   */
  async uploadMaterial(materialData) {
    try {
      const formData = new FormData();
      Object.keys(materialData).forEach((key) => {
        formData.append(key, materialData[key]);
      });

      const response = await api.post("study-materials/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error uploading material:", error);
      throw error;
    }
  },

  /**
   * Get study materials
   */
  async getMaterials(params = {}) {
    try {
      const response = await api.get("study-materials/", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching materials:", error);
      throw error;
    }
  },

  /**
   * Get class performance analytics
   */
  async getClassPerformance(offeringId) {
    try {
      const response = await api.get("gpa/class-performance/", {
        params: { offering_id: offeringId },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching class performance:", error);
      throw error;
    }
  },

  // Helper methods
  calculatePriority(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    const diffDays = Math.ceil((date - today) / (1000 * 60 * 60 * 24));

    if (diffDays <= 2) return "urgent";
    if (diffDays <= 7) return "important";
    return "normal";
  },

  formatTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60)
      return `${diffMins} minute${diffMins !== 1 ? "s" : ""} ago`;
    if (diffHours < 24)
      return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
    return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
  },
};

export default facultyService;
