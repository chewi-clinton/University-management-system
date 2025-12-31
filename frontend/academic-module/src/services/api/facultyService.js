import api from "./api";

const facultyService = {
  async getDashboardData() {
    try {
      const profileResponse = await api.get("/faculty-members/me/");
      const facultyProfile = profileResponse.data;
      const facultyId = facultyProfile.id;

      const [
        coursesResponse,
        attendanceResponse,
        gradesResponse,
        scheduleResponse,
        noticesResponse,
      ] = await Promise.all([
        api.get("course-offerings/", {
          params: { faculty: facultyId, is_visible: true },
        }),
        api.get("attendance/", {
          params: { offering__faculty: facultyId },
        }),
        api.get("grades/", {
          params: { offering__faculty: facultyId, is_finalized: false },
        }),
        api.get("exam-schedules/", {
          params: { exam__offering__faculty: facultyId },
        }),
        api.get("notices/my-notices/"),
      ]);

      const courses = coursesResponse.data.results || coursesResponse.data;
      const totalCourses = courses.length;

      const totalStudents = courses.reduce(
        (sum, course) => sum + (course.current_enrollment || 0),
        0
      );

      const attendanceRecords =
        attendanceResponse.data.results || attendanceResponse.data;
      const presentCount = attendanceRecords.filter(
        (record) => record.status === "present"
      ).length;
      const attendanceRate =
        attendanceRecords.length > 0
          ? (presentCount / attendanceRecords.length) * 100
          : 0;

      const pendingGrades = gradesResponse.data.results || gradesResponse.data;
      const pendingGrading = pendingGrades.length;

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
        isRead: false,
      }));

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

  async getProfile() {
    try {
      const response = await api.get("/faculty-members/me/");
      return response.data;
    } catch (error) {
      console.error("Error fetching faculty profile:", error);
      throw error;
    }
  },

  async getCourses(params = {}) {
    try {
      const response = await api.get("course-offerings/", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching courses:", error);
      throw error;
    }
  },

  async getCoursesWithStats(params = {}) {
    try {
      const coursesResponse = await api.get("course-offerings/", { params });
      const courses = coursesResponse.data.results || coursesResponse.data;

      const enrichedCourses = await Promise.all(
        courses.map(async (course) => {
          try {
            const registrationsResponse = await api.get(
              "course-registrations/",
              {
                params: { offering: course.id, status: "registered" },
              }
            );
            const registrations =
              registrationsResponse.data.results || registrationsResponse.data;

            const gradesResponse = await api.get("grades/", {
              params: { offering: course.id, is_finalized: false },
            });
            const pendingGrades =
              gradesResponse.data.results || gradesResponse.data;

            const finalizedGradesResponse = await api.get("grades/", {
              params: { offering: course.id, is_finalized: true },
            });
            const finalizedGrades =
              finalizedGradesResponse.data.results ||
              finalizedGradesResponse.data;

            const avgGrade =
              finalizedGrades.length > 0
                ? finalizedGrades.reduce(
                    (sum, g) => sum + (g.marks_obtained || 0),
                    0
                  ) / finalizedGrades.length
                : 0;

            const attendanceResponse = await api.get("attendance/", {
              params: { offering: course.id },
            });
            const attendanceRecords =
              attendanceResponse.data.results || attendanceResponse.data;

            const presentCount = attendanceRecords.filter(
              (r) => r.status === "present"
            ).length;
            const avgAttendance =
              attendanceRecords.length > 0
                ? (presentCount / attendanceRecords.length) * 100
                : 0;

            return {
              id: course.id,
              code: course.course?.course_code || "N/A",
              name: course.course?.course_name || "Untitled Course",
              section: course.section || "A",
              enrolled: course.current_enrollment || registrations.length,
              capacity: course.max_capacity || 50,
              avgGrade: Math.round(avgGrade),
              avgAttendance: Math.round(avgAttendance),
              schedule: this.formatSchedule(course.schedule),
              room: course.room_number || "TBA",
              color: this.getRandomColor(),
              semester: course.semester?.semester_name || "Current",
              credits: course.course?.credit_hours || 3,
              pendingGrades: pendingGrades.length,
              description:
                course.course?.description || "No description available",
            };
          } catch (error) {
            console.error(`Error enriching course ${course.id}:`, error);
            return {
              id: course.id,
              code: course.course?.course_code || "N/A",
              name: course.course?.course_name || "Untitled Course",
              section: course.section || "A",
              enrolled: course.current_enrollment || 0,
              capacity: course.max_capacity || 50,
              avgGrade: 0,
              avgAttendance: 0,
              schedule: this.formatSchedule(course.schedule),
              room: course.room_number || "TBA",
              color: this.getRandomColor(),
              semester: course.semester?.semester_name || "Current",
              credits: course.course?.credit_hours || 3,
              pendingGrades: 0,
              description:
                course.course?.description || "No description available",
            };
          }
        })
      );

      return {
        results: enrichedCourses,
        count: coursesResponse.data.count,
        next: coursesResponse.data.next,
        previous: coursesResponse.data.previous,
      };
    } catch (error) {
      console.error("Error fetching courses with stats:", error);
      throw error;
    }
  },

  async getCourseById(courseId) {
    try {
      const response = await api.get(`course-offerings/${courseId}/`);
      return response.data;
    } catch (error) {
      console.error("Error fetching course details:", error);
      throw error;
    }
  },

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

  async markAttendance(attendanceData) {
    try {
      const response = await api.post("attendance/", attendanceData);
      return response.data;
    } catch (error) {
      console.error("Error marking attendance:", error);
      throw error;
    }
  },

  async updateAttendance(attendanceId, attendanceData) {
    try {
      const response = await api.patch(
        `attendance/${attendanceId}/`,
        attendanceData
      );
      return response.data;
    } catch (error) {
      console.error("Error updating attendance:", error);
      throw error;
    }
  },

  async getAttendance(params = {}) {
    try {
      const response = await api.get("attendance/", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching attendance:", error);
      throw error;
    }
  },

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

  async submitGrade(gradeData) {
    try {
      const response = await api.post("grades/", gradeData);
      return response.data;
    } catch (error) {
      console.error("Error submitting grade:", error);
      throw error;
    }
  },

  async updateGrade(gradeId, gradeData) {
    try {
      const response = await api.patch(`grades/${gradeId}/`, gradeData);
      return response.data;
    } catch (error) {
      console.error("Error updating grade:", error);
      throw error;
    }
  },

  async getGrades(params = {}) {
    try {
      const response = await api.get("grades/", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching grades:", error);
      throw error;
    }
  },

  async finalizeGrade(gradeId) {
    try {
      const response = await api.post(`grades/${gradeId}/finalize/`);
      return response.data;
    } catch (error) {
      console.error("Error finalizing grade:", error);
      throw error;
    }
  },

  async createZoomClass(classData) {
    try {
      const response = await api.post("zoom-classes/", classData);
      return response.data;
    } catch (error) {
      console.error("Error creating Zoom class:", error);
      throw error;
    }
  },

  async startZoomMeeting(classId) {
    try {
      const response = await api.post(`zoom-classes/${classId}/start-meeting/`);
      return response.data;
    } catch (error) {
      console.error("Error starting Zoom meeting:", error);
      throw error;
    }
  },

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

  async getMaterials(params = {}) {
    try {
      const response = await api.get("study-materials/", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching materials:", error);
      throw error;
    }
  },

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

  formatSchedule(scheduleJson) {
    if (!scheduleJson) return "Schedule TBA";

    try {
      const schedule =
        typeof scheduleJson === "string"
          ? JSON.parse(scheduleJson)
          : scheduleJson;

      if (schedule.days && schedule.time) {
        const days = Array.isArray(schedule.days)
          ? schedule.days.join(", ")
          : schedule.days;
        return `${days} ${schedule.time}`;
      }

      return "Schedule TBA";
    } catch (error) {
      return "Schedule TBA";
    }
  },

  getRandomColor() {
    const colors = [
      "#3b82f6",
      "#8b5cf6",
      "#10b981",
      "#f59e0b",
      "#ef4444",
      "#06b6d4",
      "#ec4899",
      "#14b8a6",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  },
};

export default facultyService;
