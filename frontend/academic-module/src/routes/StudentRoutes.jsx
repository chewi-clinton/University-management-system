import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Spinner from "../components/shared/feedback/Spinner.jsx";

// Lazy load all pages
const Dashboard = lazy(() => import("../pages/Dashboard.jsx"));
const Courses = lazy(() => import("../pages/Courses.jsx"));
const CourseDetails = lazy(() => import("../pages/CourseDetails.jsx"));
const Attendance = lazy(() => import("../pages/Attendance.jsx"));
const Grades = lazy(() => import("../pages/Grades.jsx"));
const Exams = lazy(() => import("../pages/Exams.jsx"));
const VirtualClasses = lazy(() => import("../pages/VirtualClasses.jsx"));
const Materials = lazy(() => import("../pages/Materials.jsx"));
const Notices = lazy(() => import("../pages/Notices.jsx"));
const Profile = lazy(() => import("../pages/Profile.jsx"));

const StudentRoutes = () => {
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
        {/* Redirect /student to /student/dashboard */}
        <Route index element={<Navigate to="dashboard" replace />} />

        {/* Student pages - paths are relative to /student */}
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="courses" element={<Courses />} />
        <Route path="courses/:id" element={<CourseDetails />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="grades" element={<Grades />} />
        <Route path="exams" element={<Exams />} />
        <Route path="virtual-classes" element={<VirtualClasses />} />
        <Route path="materials" element={<Materials />} />
        <Route path="notices" element={<Notices />} />
        <Route path="profile" element={<Profile />} />
      </Routes>
    </Suspense>
  );
};

export default StudentRoutes;
