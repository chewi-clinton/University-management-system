import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./routes/ProtectedRoute";
import AppShell from "./components/shared/layout/AppShell";
import AdminLayout from "./components/shared/layout/AdminLayout";
import Login from "./pages/auth/Login";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";
import ErrorBoundary from "./components/shared/feedback/ErrorBoundary";
import ToastContainer from "./components/shared/feedback/ToastContainer.jsx";
import Spinner from "./components/shared/feedback/Spinner";

// Lazy load student pages
const Dashboard = lazy(() => import("./pages/Dashboard.jsx"));
const Courses = lazy(() => import("./pages/Courses.jsx"));
const CourseDetails = lazy(() => import("./pages/CourseDetails.jsx"));
const Attendance = lazy(() => import("./pages/Attendance.jsx"));
const Grades = lazy(() => import("./pages/Grades.jsx"));
const Exams = lazy(() => import("./pages/Exams.jsx"));
const VirtualClasses = lazy(() => import("./pages/VirtualClasses.jsx"));
const Materials = lazy(() => import("./pages/Materials.jsx"));
const Notices = lazy(() => import("./pages/Notices.jsx"));
const Profile = lazy(() => import("./pages/Profile.jsx"));

// Lazy load faculty pages
const FacultyDashboard = lazy(() => import("./pages/faculty/FacultyDashboard"));
const FacultyCourses = lazy(() => import("./pages/faculty/FacultyCourses"));
const FacultyCourseManagement = lazy(() =>
  import("./pages/faculty/CourseManagement")
);
const AttendanceMarking = lazy(() =>
  import("./pages/faculty/AttendanceMarking")
);
const Grading = lazy(() => import("./pages/faculty/Grading"));
const StudentDirectory = lazy(() => import("./pages/faculty/StudentDirectory"));
const FacultyExamManagement = lazy(() =>
  import("./pages/faculty/ExamManagement")
);
const VirtualClassSetup = lazy(() =>
  import("./pages/faculty/VirtualClassSetup")
);
const Reports = lazy(() => import("./pages/faculty/Reports"));

// Lazy load admin pages
const AdminDashboard = lazy(() => import("./admin-pages/AdminDashboard"));
const UserManagement = lazy(() => import("./admin-pages/UserManagement"));
const StudentManagement = lazy(() => import("./admin-pages/StudentManagement"));
const FacultyManagement = lazy(() => import("./admin-pages/FacultyManagement"));
const DepartmentManagement = lazy(() =>
  import("./admin-pages/DepartmentManagement")
);
const ProgramManagement = lazy(() => import("./admin-pages/ProgramManagement"));
const AdminCourseManagement = lazy(() =>
  import("./admin-pages/CourseManagement")
);
const EnrollmentManagement = lazy(() =>
  import("./admin-pages/EnrollmentManagement")
);
const AttendanceManagement = lazy(() =>
  import("./admin-pages/AttendanceManagement")
);
const GradeManagement = lazy(() => import("./admin-pages/GradeManagement"));
const AdminExamManagement = lazy(() => import("./admin-pages/ExamManagement"));
const VirtualClassManagement = lazy(() =>
  import("./admin-pages/VirtualClassManagement")
);
const MaterialsManagement = lazy(() =>
  import("./admin-pages/MaterialsManagement")
);
const NoticeManagement = lazy(() => import("./admin-pages/NoticeManagement"));
const AdmissionManagement = lazy(() =>
  import("./admin-pages/AdmissionManagement")
);
const ReportsAnalytics = lazy(() => import("./admin-pages/ReportsAnalytics"));

// Admin Routes Component
const AdminRoutes = () => {
  return (
    <AdminLayout>
      <Suspense fallback={<Spinner size="lg" />}>
        <Routes>
          <Route
            path="/"
            element={<Navigate to="/admin/dashboard" replace />}
          />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="students" element={<StudentManagement />} />
          <Route path="faculty" element={<FacultyManagement />} />
          <Route path="departments" element={<DepartmentManagement />} />
          <Route path="programs" element={<ProgramManagement />} />
          <Route path="courses" element={<AdminCourseManagement />} />
          <Route path="enrollments" element={<EnrollmentManagement />} />
          <Route path="attendance" element={<AttendanceManagement />} />
          <Route path="grades" element={<GradeManagement />} />
          <Route path="exams" element={<AdminExamManagement />} />
          <Route path="virtual-classes" element={<VirtualClassManagement />} />
          <Route path="materials" element={<MaterialsManagement />} />
          <Route path="notices" element={<NoticeManagement />} />
          <Route path="admissions" element={<AdmissionManagement />} />
          <Route path="reports" element={<ReportsAnalytics />} />
        </Routes>
      </Suspense>
    </AdminLayout>
  );
};

// Loading fallback
const LoadingFallback = () => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
    }}
  >
    <Spinner size="lg" />
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <AuthProvider>
          <ToastContainer>
            <div className="app">
              <Suspense fallback={<LoadingFallback />}>
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<Navigate to="/login" replace />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/unauthorized" element={<Unauthorized />} />

                  {/* Protected Student routes */}
                  <Route
                    path="/student/*"
                    element={
                      <ProtectedRoute allowedRoles={["student"]}>
                        <AppShell />
                      </ProtectedRoute>
                    }
                  >
                    <Route
                      index
                      element={<Navigate to="dashboard" replace />}
                    />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="courses" element={<Courses />} />
                    <Route path="courses/:id" element={<CourseDetails />} />
                    <Route path="attendance" element={<Attendance />} />
                    <Route path="grades" element={<Grades />} />
                    <Route path="exams" element={<Exams />} />
                    <Route
                      path="virtual-classes"
                      element={<VirtualClasses />}
                    />
                    <Route path="materials" element={<Materials />} />
                    <Route path="notices" element={<Notices />} />
                    <Route path="profile" element={<Profile />} />
                  </Route>

                  {/* Protected Faculty routes */}
                  <Route
                    path="/faculty/*"
                    element={
                      <ProtectedRoute allowedRoles={["faculty"]}>
                        <AppShell />
                      </ProtectedRoute>
                    }
                  >
                    <Route
                      index
                      element={<Navigate to="dashboard" replace />}
                    />
                    <Route path="dashboard" element={<FacultyDashboard />} />
                    <Route path="courses" element={<FacultyCourses />} />
                    <Route
                      path="course-management/:id"
                      element={<FacultyCourseManagement />}
                    />
                    <Route
                      path="attendance-marking"
                      element={<AttendanceMarking />}
                    />
                    <Route path="grading" element={<Grading />} />
                    <Route
                      path="student-directory"
                      element={<StudentDirectory />}
                    />
                    <Route
                      path="exam-management"
                      element={<FacultyExamManagement />}
                    />
                    <Route
                      path="virtual-class-setup"
                      element={<VirtualClassSetup />}
                    />
                    <Route path="reports" element={<Reports />} />
                  </Route>

                  {/* Protected Admin routes - Now secured with correct backend roles */}
                  <Route
                    path="/admin/*"
                    element={
                      <ProtectedRoute
                        allowedRoles={["super_admin", "academic_admin"]}
                      >
                        <AdminRoutes />
                      </ProtectedRoute>
                    }
                  />

                  {/* 404 - Catch all */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </div>
          </ToastContainer>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
