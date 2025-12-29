import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./routes/ProtectedRoute";
import AppShell from "./components/shared/layout/AppShell";
import Login from "./pages/auth/Login";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";
import ErrorBoundary from "./components/shared/feedback/ErrorBoundary";
import ToastContainer from "./components/shared/feedback/ToastContainer.jsx";
import Spinner from "./components/shared/feedback/Spinner";

import "./styles/variables.css";
import "./styles/global.css";
import "./styles/animations.css";
import "./styles/app.css";

import "./styles/components/sidebar.css";
import "./styles/components/header.css";
import "./styles/components/container.css";
import "./styles/components/card.css";
import "./styles/components/button.css";
import "./styles/components/input.css";
import "./styles/components/avatar.css";
import "./styles/components/badge.css";
import "./styles/components/progress-bar.css";
import "./styles/components/spinner.css";
import "./styles/components/nav-link.css";
import "./styles/components/tabs.css";
import "./styles/components/toast.css";
import "./styles/components/stat-card.css";

import "./styles/pages/dashboard.css";
import "./styles/pages/courses.css";
import "./styles/pages/course-details.css";
import "./styles/pages/attendance.css";
import "./styles/pages/grades.css";
import "./styles/pages/exams.css";
import "./styles/pages/virtual-classes.css";
import "./styles/pages/materials.css";
import "./styles/pages/notices.css";
import "./styles/pages/profile.css";
import "./styles/pages/not-found.css";

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
const CourseManagement = lazy(() => import("./pages/faculty/CourseManagement"));
const AttendanceMarking = lazy(() =>
  import("./pages/faculty/AttendanceMarking")
);
const Grading = lazy(() => import("./pages/faculty/Grading"));
const StudentDirectory = lazy(() => import("./pages/faculty/StudentDirectory"));
const ExamManagement = lazy(() => import("./pages/faculty/ExamManagement"));
const VirtualClassSetup = lazy(() =>
  import("./pages/faculty/VirtualClassSetup")
);
const Reports = lazy(() => import("./pages/faculty/Reports"));

// Loading fallback component
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
      <BrowserRouter>
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
                    path="/student"
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
                    path="/faculty"
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
                      element={<CourseManagement />}
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
                      element={<ExamManagement />}
                    />
                    <Route
                      path="virtual-class-setup"
                      element={<VirtualClassSetup />}
                    />
                    <Route path="reports" element={<Reports />} />
                  </Route>

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
