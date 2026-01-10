import api from "./api";

const adminService = {
  // ==================== Dashboard Statistics ====================
  getDashboardStats: async () => {
    try {
      const [students, faculty, courses, attendanceSummaries] =
        await Promise.all([
          api.get("/students/"),
          api.get("/faculty-members/"),
          api.get("/courses/"),
          api.get("/attendance-summaries/"),
        ]);

      const studentsData = Array.isArray(students.data)
        ? students.data
        : students.data.results || [];
      const facultyData = Array.isArray(faculty.data)
        ? faculty.data
        : faculty.data.results || [];
      const coursesData = Array.isArray(courses.data)
        ? courses.data
        : courses.data.results || [];
      const attendanceData = Array.isArray(attendanceSummaries.data)
        ? attendanceSummaries.data
        : attendanceSummaries.data.results || [];

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

  // ==================== Students ====================
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

  createStudent: async (studentData) => {
    try {
      console.log("Creating student with data:", studentData);
      const response = await api.post("/students/", studentData);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Error creating student:", error);
      console.error("Error response:", error.response?.data);
      return {
        success: false,
        error:
          error.response?.data?.error ||
          error.response?.data?.detail ||
          error.response?.data ||
          "Failed to create student",
      };
    }
  },

  updateStudent: async (studentId, studentData) => {
    try {
      const response = await api.patch(`/students/${studentId}/`, studentData);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Error updating student:", error);
      return {
        success: false,
        error: error.response?.data?.detail || "Failed to update student",
      };
    }
  },

  deleteStudent: async (studentId) => {
    try {
      await api.delete(`/students/${studentId}/`);
      return {
        success: true,
      };
    } catch (error) {
      console.error("Error deleting student:", error);
      return {
        success: false,
        error: error.response?.data?.detail || "Failed to delete student",
      };
    }
  },

  // ==================== Faculty Members ====================
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

  createFacultyMember: async (facultyData) => {
    try {
      const response = await api.post("/faculty-members/", facultyData);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Error creating faculty member:", error);
      return {
        success: false,
        error:
          error.response?.data?.detail || "Failed to create faculty member",
      };
    }
  },

  updateFacultyMember: async (facultyId, facultyData) => {
    try {
      const response = await api.patch(
        `/faculty-members/${facultyId}/`,
        facultyData
      );
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Error updating faculty member:", error);
      return {
        success: false,
        error:
          error.response?.data?.detail || "Failed to update faculty member",
      };
    }
  },

  deleteFacultyMember: async (facultyId) => {
    try {
      await api.delete(`/faculty-members/${facultyId}/`);
      return {
        success: true,
      };
    } catch (error) {
      console.error("Error deleting faculty member:", error);
      return {
        success: false,
        error:
          error.response?.data?.detail || "Failed to delete faculty member",
      };
    }
  },

  // ==================== Programs ====================
  getPrograms: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters);
      const response = await api.get(`/programs/?${params}`);
      const data = Array.isArray(response.data)
        ? response.data
        : response.data.results || [];
      return {
        success: true,
        data: data,
      };
    } catch (error) {
      console.error("Error fetching programs:", error);
      return {
        success: false,
        error: error.response?.data?.detail || "Failed to load programs",
      };
    }
  },

  createProgram: async (programData) => {
    try {
      console.log("Creating program with data:", programData); // ← What data is being sent?
      const response = await api.post("/programs/", programData);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Error creating program:", error);
      console.error("Error response:", error.response?.data); // ← What's the actual error?
      console.error("Error status:", error.response?.status);
      return {
        success: false,
        error:
          JSON.stringify(error.response?.data) ||
          error.response?.data?.detail ||
          "Failed to create program",
      };
    }
  },

  updateProgram: async (programId, programData) => {
    try {
      const response = await api.patch(`/programs/${programId}/`, programData);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Error updating program:", error);
      return {
        success: false,
        error: error.response?.data?.detail || "Failed to update program",
      };
    }
  },

  deleteProgram: async (programId) => {
    try {
      await api.delete(`/programs/${programId}/`);
      return {
        success: true,
      };
    } catch (error) {
      console.error("Error deleting program:", error);
      return {
        success: false,
        error: error.response?.data?.detail || "Failed to delete program",
      };
    }
  },

  // ==================== Departments ====================
  getDepartments: async () => {
    try {
      const response = await api.get("/departments/");
      const departments = Array.isArray(response.data)
        ? response.data
        : response.data.results || [];

      const departmentsWithStats = await Promise.all(
        departments.map(async (dept) => {
          try {
            const [students, faculty, courses] = await Promise.all([
              api.get(`/students/?program__department=${dept.department_id}`),
              api.get(`/faculty-members/?department=${dept.department_id}`),
              api.get(`/courses/?department=${dept.department_id}`),
            ]);

            const studentsData = Array.isArray(students.data)
              ? students.data
              : students.data.results || [];
            const facultyData = Array.isArray(faculty.data)
              ? faculty.data
              : faculty.data.results || [];
            const coursesData = Array.isArray(courses.data)
              ? courses.data
              : courses.data.results || [];

            const avgGPA =
              studentsData.length > 0
                ? studentsData.reduce(
                    (sum, s) => sum + (parseFloat(s.current_gpa) || 0),
                    0
                  ) / studentsData.length
                : 0;

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

  createDepartment: async (departmentData) => {
    try {
      console.log("Creating department with data:", departmentData); // Add this
      const response = await api.post("/departments/", departmentData);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Error creating department:", error);
      console.error("Error response data:", error.response?.data); // Add this
      return {
        success: false,
        error:
          error.response?.data?.detail ||
          error.response?.data ||
          "Failed to create department",
      };
    }
  },

  updateDepartment: async (departmentId, departmentData) => {
    try {
      const response = await api.patch(
        `/departments/${departmentId}/`,
        departmentData
      );
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Error updating department:", error);
      return {
        success: false,
        error: error.response?.data?.detail || "Failed to update department",
      };
    }
  },

  deleteDepartment: async (departmentId) => {
    try {
      await api.delete(`/departments/${departmentId}/`);
      return {
        success: true,
      };
    } catch (error) {
      console.error("Error deleting department:", error);
      return {
        success: false,
        error: error.response?.data?.detail || "Failed to delete department",
      };
    }
  },

  // ==================== Courses ====================
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

  createCourse: async (courseData) => {
    try {
      const response = await api.post("/courses/", courseData);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Error creating course:", error);
      return {
        success: false,
        error: error.response?.data?.detail || "Failed to create course",
      };
    }
  },

  updateCourse: async (courseId, courseData) => {
    try {
      const response = await api.patch(`/courses/${courseId}/`, courseData);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Error updating course:", error);
      return {
        success: false,
        error: error.response?.data?.detail || "Failed to update course",
      };
    }
  },

  deleteCourse: async (courseId) => {
    try {
      await api.delete(`/courses/${courseId}/`);
      return {
        success: true,
      };
    } catch (error) {
      console.error("Error deleting course:", error);
      return {
        success: false,
        error: error.response?.data?.detail || "Failed to delete course",
      };
    }
  },

  // ==================== Enrollment & Registration ====================
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

  // ==================== Attendance ====================
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

  getAttendanceSummaries: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters);
      const response = await api.get(`/attendance-summaries/?${params}`);
      const data = Array.isArray(response.data)
        ? response.data
        : response.data.results || [];
      return {
        success: true,
        data: data,
      };
    } catch (error) {
      console.error("Error fetching attendance summaries:", error);
      return {
        success: false,
        error:
          error.response?.data?.detail || "Failed to load attendance summaries",
      };
    }
  },

  // ==================== Grades ====================
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

  // ==================== Exams ====================
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
        data: events.slice(0, 4),
      };
    } catch (error) {
      console.error("Error fetching upcoming events:", error);
      return {
        success: false,
        error: error.response?.data?.detail || "Failed to load events",
      };
    }
  },

  // ==================== Examinations ====================
  getExaminations: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters);
      const response = await api.get(`/examinations/?${params}`);
      const data = Array.isArray(response.data)
        ? response.data
        : response.data.results || [];
      return {
        success: true,
        data: data,
      };
    } catch (error) {
      console.error("Error fetching examinations:", error);
      return {
        success: false,
        error: error.response?.data?.detail || "Failed to load examinations",
      };
    }
  },

  createExamination: async (examinationData) => {
    try {
      const response = await api.post("/examinations/", examinationData);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Error creating examination:", error);
      return {
        success: false,
        error: error.response?.data?.detail || "Failed to create examination",
      };
    }
  },

  updateExamination: async (examinationId, examinationData) => {
    try {
      const response = await api.patch(
        `/examinations/${examinationId}/`,
        examinationData
      );
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Error updating examination:", error);
      return {
        success: false,
        error: error.response?.data?.detail || "Failed to update examination",
      };
    }
  },

  deleteExamination: async (examinationId) => {
    try {
      await api.delete(`/examinations/${examinationId}/`);
      return {
        success: true,
      };
    } catch (error) {
      console.error("Error deleting examination:", error);
      return {
        success: false,
        error: error.response?.data?.detail || "Failed to delete examination",
      };
    }
  },

  // ==================== Exam Schedules ====================
  createExamSchedule: async (scheduleData) => {
    try {
      const response = await api.post("/exam-schedules/", scheduleData);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Error creating exam schedule:", error);
      return {
        success: false,
        error: error.response?.data?.detail || "Failed to create exam schedule",
      };
    }
  },

  updateExamSchedule: async (scheduleId, scheduleData) => {
    try {
      const response = await api.patch(
        `/exam-schedules/${scheduleId}/`,
        scheduleData
      );
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Error updating exam schedule:", error);
      return {
        success: false,
        error: error.response?.data?.detail || "Failed to update exam schedule",
      };
    }
  },

  deleteExamSchedule: async (scheduleId) => {
    try {
      await api.delete(`/exam-schedules/${scheduleId}/`);
      return {
        success: true,
      };
    } catch (error) {
      console.error("Error deleting exam schedule:", error);
      return {
        success: false,
        error: error.response?.data?.detail || "Failed to delete exam schedule",
      };
    }
  },

  // ==================== Admit Cards ====================
  getAdmitCards: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters);
      const response = await api.get(`/admit-cards/?${params}`);
      const data = Array.isArray(response.data)
        ? response.data
        : response.data.results || [];
      return {
        success: true,
        data: data,
      };
    } catch (error) {
      console.error("Error fetching admit cards:", error);
      return {
        success: false,
        error: error.response?.data?.detail || "Failed to load admit cards",
      };
    }
  },

  generateAdmitCards: async (scheduleId) => {
    try {
      const response = await api.post(
        `/exam-schedules/${scheduleId}/generate-admit-cards/`
      );
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Error generating admit cards:", error);
      return {
        success: false,
        error: error.response?.data?.detail || "Failed to generate admit cards",
      };
    }
  },

  downloadAdmitCard: async (admitCardId) => {
    try {
      const response = await api.get(`/admit-cards/${admitCardId}/download/`, {
        responseType: "blob",
      });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Error downloading admit card:", error);
      return {
        success: false,
        error: error.response?.data?.detail || "Failed to download admit card",
      };
    }
  },

  // ==================== Exam Rooms ====================
  getExamRooms: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters);
      const response = await api.get(`/exam-rooms/?${params}`);
      const data = Array.isArray(response.data)
        ? response.data
        : response.data.results || [];
      return {
        success: true,
        data: data,
      };
    } catch (error) {
      console.error("Error fetching exam rooms:", error);
      return {
        success: false,
        error: error.response?.data?.detail || "Failed to load exam rooms",
      };
    }
  },

  createExamRoom: async (roomData) => {
    try {
      const response = await api.post("/exam-rooms/", roomData);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Error creating exam room:", error);
      return {
        success: false,
        error: error.response?.data?.detail || "Failed to create exam room",
      };
    }
  },

  updateExamRoom: async (roomId, roomData) => {
    try {
      const response = await api.patch(`/exam-rooms/${roomId}/`, roomData);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Error updating exam room:", error);
      return {
        success: false,
        error: error.response?.data?.detail || "Failed to update exam room",
      };
    }
  },

  deleteExamRoom: async (roomId) => {
    try {
      await api.delete(`/exam-rooms/${roomId}/`);
      return {
        success: true,
      };
    } catch (error) {
      console.error("Error deleting exam room:", error);
      return {
        success: false,
        error: error.response?.data?.detail || "Failed to delete exam room",
      };
    }
  },

  // ==================== Faculty Members (for Invigilators) ====================
  getInvigilators: async () => {
    try {
      const response = await api.get("/faculty-members/");
      const data = Array.isArray(response.data)
        ? response.data
        : response.data.results || [];
      return {
        success: true,
        data: data,
      };
    } catch (error) {
      console.error("Error fetching invigilators:", error);
      return {
        success: false,
        error: error.response?.data?.detail || "Failed to load invigilators",
      };
    }
  },

  // ==================== Virtual Classes (Zoom/Google Meet) ====================
  getVirtualClasses: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters);
      const response = await api.get(`/zoom-classes/?${params}`);
      const data = Array.isArray(response.data)
        ? response.data
        : response.data.results || [];
      return {
        success: true,
        data: data,
      };
    } catch (error) {
      console.error("Error fetching virtual classes:", error);
      return {
        success: false,
        error: error.response?.data?.detail || "Failed to load virtual classes",
      };
    }
  },

  createVirtualClass: async (classData) => {
    try {
      const response = await api.post(
        "/zoom-classes/create-meeting/",
        classData
      );
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Error creating virtual class:", error);
      return {
        success: false,
        error:
          error.response?.data?.error ||
          error.response?.data?.detail ||
          "Failed to create virtual class",
      };
    }
  },

  updateVirtualClass: async (classId, classData) => {
    try {
      const response = await api.patch(`/zoom-classes/${classId}/`, classData);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Error updating virtual class:", error);
      return {
        success: false,
        error: error.response?.data?.detail || "Failed to update virtual class",
      };
    }
  },

  deleteVirtualClass: async (classId) => {
    try {
      await api.delete(`/zoom-classes/${classId}/`);
      return {
        success: true,
      };
    } catch (error) {
      console.error("Error deleting virtual class:", error);
      return {
        success: false,
        error: error.response?.data?.detail || "Failed to delete virtual class",
      };
    }
  },

  startVirtualClass: async (classId) => {
    try {
      const response = await api.post(
        `/zoom-classes/${classId}/start-meeting/`
      );
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Error starting virtual class:", error);
      return {
        success: false,
        error: error.response?.data?.detail || "Failed to start virtual class",
      };
    }
  },

  sendClassReminder: async (classId) => {
    try {
      const response = await api.post(
        `/zoom-classes/${classId}/send-reminder/`
      );
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Error sending class reminder:", error);
      return {
        success: false,
        error: error.response?.data?.detail || "Failed to send reminder",
      };
    }
  },

  getVirtualClassStats: async () => {
    try {
      const response = await api.get("/zoom-classes/");
      const classes = Array.isArray(response.data)
        ? response.data
        : response.data.results || [];
      const now = new Date();
      const today = now.toISOString().split("T")[0];
      const thisWeekStart = new Date(now.setDate(now.getDate() - now.getDay()));
      const stats = {
        totalClasses: classes.length,
        liveNow: classes.filter((c) => {
          if (!c.schedule_date || !c.start_time) return false;
          const classDateTime = new Date(`${c.schedule_date}T${c.start_time}`);
          const endTime = new Date(
            classDateTime.getTime() + c.duration_minutes * 60000
          );
          const currentTime = new Date();
          return (
            currentTime >= classDateTime &&
            currentTime <= endTime &&
            c.is_active
          );
        }).length,
        scheduledToday: classes.filter(
          (c) => c.schedule_date === today && c.is_active
        ).length,
        completedThisWeek: classes.filter((c) => {
          if (!c.schedule_date) return false;
          const classDate = new Date(c.schedule_date);
          return (
            classDate >= thisWeekStart && classDate < new Date() && !c.is_active
          );
        }).length,
        averageAttendance: 87,
        totalParticipants: classes.reduce(
          (sum, c) => sum + (c.current_participants || 0),
          0
        ),
      };
      return {
        success: true,
        data: stats,
      };
    } catch (error) {
      console.error("Error fetching virtual class stats:", error);
      return {
        success: false,
        error: error.response?.data?.detail || "Failed to load stats",
      };
    }
  },

  getUpcomingVirtualClasses: async (limit = 3) => {
    try {
      const response = await api.get(
        "/zoom-classes/?ordering=schedule_date,start_time"
      );
      const classes = Array.isArray(response.data)
        ? response.data
        : response.data.results || [];
      const now = new Date();
      const upcoming = classes
        .filter((c) => {
          if (!c.schedule_date || !c.start_time || !c.is_active) return false;
          const classDateTime = new Date(`${c.schedule_date}T${c.start_time}`);
          return classDateTime > now;
        })
        .slice(0, limit)
        .map((c) => ({
          id: c.id,
          title: c.topic,
          course: c.offering?.course?.course_code || "N/A",
          time: `${c.schedule_date}T${c.start_time}`,
          instructor:
            c.created_by_faculty?.user?.first_name +
              " " +
              c.created_by_faculty?.user?.last_name || "N/A",
        }));
      return {
        success: true,
        data: upcoming,
      };
    } catch (error) {
      console.error("Error fetching upcoming classes:", error);
      return {
        success: false,
        error:
          error.response?.data?.detail || "Failed to load upcoming classes",
      };
    }
  },

  // ==================== Study Materials ====================
  getStudyMaterials: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters);
      const response = await api.get(`/study-materials/?${params}`);
      const data = Array.isArray(response.data)
        ? response.data
        : response.data.results || [];
      return {
        success: true,
        data: data,
      };
    } catch (error) {
      console.error("Error fetching study materials:", error);
      return {
        success: false,
        error: error.response?.data?.detail || "Failed to load study materials",
      };
    }
  },

  getStudyMaterial: async (materialId) => {
    try {
      const response = await api.get(`/study-materials/${materialId}/`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Error fetching study material:", error);
      return {
        success: false,
        error: error.response?.data?.detail || "Failed to load study material",
      };
    }
  },

  createStudyMaterial: async (materialData) => {
    try {
      const formData = new FormData();

      Object.keys(materialData).forEach((key) => {
        if (materialData[key] !== null && materialData[key] !== undefined) {
          if (key === "tags" && Array.isArray(materialData[key])) {
            formData.append(key, materialData[key].join(","));
          } else {
            formData.append(key, materialData[key]);
          }
        }
      });
      const response = await api.post("/study-materials/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Error creating study material:", error);
      return {
        success: false,
        error:
          error.response?.data?.detail ||
          error.response?.data ||
          "Failed to create study material",
      };
    }
  },

  updateStudyMaterial: async (materialId, materialData) => {
    try {
      const formData = new FormData();

      Object.keys(materialData).forEach((key) => {
        if (materialData[key] !== null && materialData[key] !== undefined) {
          if (key === "tags" && Array.isArray(materialData[key])) {
            formData.append(key, materialData[key].join(","));
          } else {
            formData.append(key, materialData[key]);
          }
        }
      });
      const response = await api.patch(
        `/study-materials/${materialId}/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Error updating study material:", error);
      return {
        success: false,
        error:
          error.response?.data?.detail || "Failed to update study material",
      };
    }
  },

  deleteStudyMaterial: async (materialId) => {
    try {
      await api.delete(`/study-materials/${materialId}/`);
      return {
        success: true,
      };
    } catch (error) {
      console.error("Error deleting study material:", error);
      return {
        success: false,
        error:
          error.response?.data?.detail || "Failed to delete study material",
      };
    }
  },

  downloadStudyMaterial: async (materialId) => {
    try {
      const response = await api.get(
        `/study-materials/${materialId}/download/`,
        {
          responseType: "blob",
        }
      );
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Error downloading study material:", error);
      return {
        success: false,
        error: error.response?.data?.detail || "Failed to download material",
      };
    }
  },

  getStudyMaterialStats: async () => {
    try {
      const response = await api.get("/study-materials/");
      const materials = Array.isArray(response.data)
        ? response.data
        : response.data.results || [];
      const totalSizeBytes = materials.reduce((sum, m) => {
        const size = m.file_size || 0;
        return sum + size;
      }, 0);

      const totalSizeGB = (totalSizeBytes / (1024 * 1024 * 1024)).toFixed(2);
      const totalDownloads = materials.reduce(
        (sum, m) => sum + (m.download_count || 0),
        0
      );
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const recentUploads = materials.filter((m) => {
        const uploadDate = new Date(m.uploaded_at);
        return uploadDate >= sevenDaysAgo;
      }).length;
      return {
        success: true,
        data: {
          totalMaterials: materials.length,
          totalSize: `${totalSizeGB} GB`,
          totalDownloads: totalDownloads,
          recentUploads: recentUploads,
        },
      };
    } catch (error) {
      console.error("Error fetching material stats:", error);
      return {
        success: false,
        error: error.response?.data?.detail || "Failed to load stats",
      };
    }
  },

  getMaterialsByOffering: async (offeringId) => {
    try {
      const response = await api.get(
        `/course-offerings/${offeringId}/materials/`
      );
      const data = Array.isArray(response.data)
        ? response.data
        : response.data.results || [];
      return {
        success: true,
        data: data,
      };
    } catch (error) {
      console.error("Error fetching materials by offering:", error);
      return {
        success: false,
        error: error.response?.data?.detail || "Failed to load materials",
      };
    }
  },

  // ==================== Notices ====================
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

  // ==================== Academic Sessions ====================
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

  // ==================== System Notifications ====================
  getSystemNotifications: async () => {
    try {
      const attendanceResponse = await api.get("/attendance-summaries/");
      const attendanceData = Array.isArray(attendanceResponse.data)
        ? attendanceResponse.data
        : attendanceResponse.data.results || [];

      const lowAttendance = attendanceData.filter(
        (record) => record.attendance_percentage < 75
      );

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

  // ==================== Users ====================
  getUsers: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters);
      const response = await api.get(`/users/?${params}`);
      const data = Array.isArray(response.data)
        ? response.data
        : response.data.results || [];
      return {
        success: true,
        data: data,
      };
    } catch (error) {
      console.error("Error fetching users:", error);
      return {
        success: false,
        error: error.response?.data?.detail || "Failed to load users",
      };
    }
  },

  createUser: async (userData) => {
    try {
      const response = await api.post("/users/", userData);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Error creating user:", error);
      return {
        success: false,
        error:
          error.response?.data?.detail ||
          error.response?.data ||
          "Failed to create user",
      };
    }
  },

  updateUser: async (userId, userData) => {
    try {
      const response = await api.patch(`/users/${userId}/`, userData);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Error updating user:", error);
      return {
        success: false,
        error: error.response?.data?.detail || "Failed to update user",
      };
    }
  },

  deleteUser: async (userId) => {
    try {
      await api.delete(`/users/${userId}/`);
      return {
        success: true,
      };
    } catch (error) {
      console.error("Error deleting user:", error);
      return {
        success: false,
        error: error.response?.data?.detail || "Failed to delete user",
      };
    }
  },

  // ==================== Faculties (Organizations) ====================
  getFaculties: async () => {
    try {
      const response = await api.get("/faculties/"); // This should now work
      const data = Array.isArray(response.data)
        ? response.data
        : response.data.results || [];
      return {
        success: true,
        data: data,
      };
    } catch (error) {
      console.error("Error fetching faculties:", error);
      return {
        success: false,
        error: error.response?.data?.detail || "Failed to load faculties",
      };
    }
  },

  createFaculty: async (facultyData) => {
    try {
      const response = await api.post("/faculties/", facultyData);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Error creating faculty:", error);
      return {
        success: false,
        error: error.response?.data?.detail || "Failed to create faculty",
      };
    }
  },

  updateFaculty: async (facultyId, facultyData) => {
    try {
      const response = await api.patch(`/faculties/${facultyId}/`, facultyData);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Error updating faculty:", error);
      return {
        success: false,
        error: error.response?.data?.detail || "Failed to update faculty",
      };
    }
  },

  deleteFaculty: async (facultyId) => {
    try {
      await api.delete(`/faculties/${facultyId}/`);
      return {
        success: true,
      };
    } catch (error) {
      console.error("Error deleting faculty:", error);
      return {
        success: false,
        error: error.response?.data?.detail || "Failed to delete faculty",
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

// Helper function to format file size
adminService.formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

export { adminService };
