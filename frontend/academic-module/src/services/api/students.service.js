import apiClient from "./client";

const studentService = {
  getDashboard: () =>
    apiClient.get("/student/dashboard").then((res) => res.data),

  getCourses: () => apiClient.get("/student/courses").then((res) => res.data),

  getCourseDetails: (id) =>
    apiClient.get(`/student/courses/${id}`).then((res) => res.data),

  getAttendance: () =>
    apiClient.get("/student/attendance").then((res) => res.data),

  getGrades: () => apiClient.get("/student/grades").then((res) => res.data),

  getExams: () => apiClient.get("/student/exams").then((res) => res.data),

  getVirtualClasses: () =>
    apiClient.get("/student/virtual-classes").then((res) => res.data),

  getNotices: () => apiClient.get("/student/notices").then((res) => res.data),

  getProfile: () => apiClient.get("/student/profile").then((res) => res.data),

  updateProfile: (data) =>
    apiClient.put("/student/profile", data).then((res) => res.data),
};

export default studentService;
