import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Spinner from "../components/shared/feedback/Spinner";

// Lazy load all faculty pages
const FacultyDashboard = lazy(() =>
  import("../pages/faculty/FacultyDashboard")
);
const FacultyCourses = lazy(() => import("../pages/faculty/FacultyCourses"));
const CourseManagement = lazy(() =>
  import("../pages/faculty/CourseManagement")
);
const AttendanceMarking = lazy(() =>
  import("../pages/faculty/AttendanceMarking")
);
const Grading = lazy(() => import("../pages/faculty/Grading"));
const StudentDirectory = lazy(() =>
  import("../pages/faculty/StudentDirectory")
);
const ExamManagement = lazy(() => import("../pages/faculty/ExamManagement"));
const VirtualClassSetup = lazy(() =>
  import("../pages/faculty/VirtualClassSetup")
);
const Reports = lazy(() => import("../pages/faculty/Reports"));

const FacultyRoutes = () => {
  return (
    <Suspense
      fallback={
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
      }
    >
      <Routes>
        {/* Redirect /faculty to /faculty/dashboard */}
        <Route index element={<Navigate to="dashboard" replace />} />

        {/* Faculty pages - paths are relative to /faculty */}
        <Route path="dashboard" element={<FacultyDashboard />} />
        <Route path="courses" element={<FacultyCourses />} />
        <Route path="course-management/:id" element={<CourseManagement />} />
        <Route path="attendance-marking" element={<AttendanceMarking />} />
        <Route path="grading" element={<Grading />} />
        <Route path="student-directory" element={<StudentDirectory />} />
        <Route path="exam-management" element={<ExamManagement />} />
        <Route path="virtual-class-setup" element={<VirtualClassSetup />} />
        <Route path="reports" element={<Reports />} />
      </Routes>
    </Suspense>
  );
};

export default FacultyRoutes;
