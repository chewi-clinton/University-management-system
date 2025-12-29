import apiClient from './client';

const facultyService = {
  // Dashboard
  getDashboard: () => apiClient.get('/faculty/dashboard/'),

  // Courses
  getMyCourses: () => apiClient.get('/course-offerings/', { params: { faculty: 'me' } }),
  getCourseDetails: (id) => apiClient.get(`/course-offerings/${id}/`),
  getCourseStudents: (id) => apiClient.get(`/course-offerings/${id}/students/`),
  updateCourseInfo: (id, data) => apiClient.patch(`/course-offerings/${id}/`, data),

  // Attendance
  getAttendanceRecords: (offeringId, date) => 
    apiClient.get('/attendance/', { params: { offering: offeringId, attendance_date: date } }),
  markAttendance: (data) => apiClient.post('/attendance/', data),
  bulkMarkAttendance: (data) => apiClient.post('/attendance/bulk-mark/', data),
  generateQR: (data) => apiClient.post('/attendance/generate-qr/', data),
  getAttendanceStats: (offeringId) => 
    apiClient.get('/attendance/stats/', { params: { offering: offeringId } }),

  // Grading
  getGrades: (offeringId) => apiClient.get('/grades/', { params: { offering: offeringId } }),
  createAssessment: (data) => apiClient.post('/assessments/', data),
  getAssessments: (offeringId) => 
    apiClient.get('/assessments/', { params: { offering: offeringId } }),
  createGrade: (data) => apiClient.post('/grades/', data),
  updateGrade: (id, data) => apiClient.patch(`/grades/${id}/`, data),
  bulkUpdateGrades: (data) => apiClient.post('/grades/bulk-update/', data),
  finalizeGrades: (offeringId) => apiClient.post(`/grades/finalize/`, { offering: offeringId }),
  getGradeStats: (offeringId) => 
    apiClient.get('/grades/stats/', { params: { offering: offeringId } }),

  // Exams
  getExams: (offeringId) => apiClient.get('/examinations/', { params: { offering: offeringId } }),
  createExam: (data) => apiClient.post('/examinations/', data),
  updateExam: (id, data) => apiClient.patch(`/examinations/${id}/`, data),
  deleteExam: (id) => apiClient.delete(`/examinations/${id}/`),
  getExamSchedules: (examId) => apiClient.get(`/examinations/${examId}/schedules/`),
  generateAdmitCards: (examId) => apiClient.post(`/examinations/${examId}/generate-admit-cards/`),

  // Virtual Classes
  getVirtualClasses: (offeringId) => 
    apiClient.get('/zoom-classes/', { params: { offering: offeringId } }),
  createVirtualClass: (data) => apiClient.post('/zoom-classes/create-meeting/', data),
  updateVirtualClass: (id, data) => apiClient.patch(`/zoom-classes/${id}/`, data),
  deleteVirtualClass: (id) => apiClient.delete(`/zoom-classes/${id}/`),
  startMeeting: (id) => apiClient.post(`/zoom-classes/${id}/start-meeting/`),
  endMeeting: (id) => apiClient.post(`/zoom-classes/${id}/end-meeting/`),
  sendReminder: (id) => apiClient.post(`/zoom-classes/${id}/send-reminder/`),

  // Materials
  getMaterials: (offeringId) => 
    apiClient.get('/study-materials/', { params: { offering: offeringId } }),
  uploadMaterial: (data) => apiClient.post('/study-materials/', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateMaterial: (id, data) => apiClient.patch(`/study-materials/${id}/`, data),
  deleteMaterial: (id) => apiClient.delete(`/study-materials/${id}/`),
  toggleVisibility: (id) => apiClient.post(`/study-materials/${id}/toggle-visibility/`),

  // Students
  getStudentProfile: (studentId) => apiClient.get(`/students/${studentId}/`),
  getStudentCourses: (studentId) => 
    apiClient.get(`/students/${studentId}/courses/`),
  getStudentPerformance: (studentId, offeringId) => 
    apiClient.get(`/students/${studentId}/performance/`, { params: { offering: offeringId } }),
  updatePrivateNotes: (studentId, offeringId, notes) =>
    apiClient.post(`/students/${studentId}/notes/`, { offering: offeringId, notes }),

  // Reports
  getClassPerformance: (offeringId) => 
    apiClient.get('/reports/class-performance/', { params: { offering_id: offeringId } }),
  getAttendanceReport: (offeringId, startDate, endDate) => 
    apiClient.get('/reports/attendance/', { 
      params: { offering: offeringId, start_date: startDate, end_date: endDate } 
    }),
  getGradeDistribution: (offeringId) => 
    apiClient.get('/reports/grade-distribution/', { params: { offering_id: offeringId } }),
  getStudentProgressReport: (studentId, offeringId) => 
    apiClient.get('/reports/student-progress/', { 
      params: { student_id: studentId, offering_id: offeringId } 
    }),
  exportReport: (reportType, offeringId, format) => 
    apiClient.get('/reports/export/', { 
      params: { 
        type: reportType, 
        offering: offeringId, 
        format 
      }, 
      responseType: 'blob' 
    })
};

export default facultyService;