import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Lazy load all student pages
const Dashboard = lazy(() => import("../modules/student/pages/Dashboard"));
const Courses = lazy(() => import("../modules/student/pages/Courses"));
const CourseDetails = lazy(() =>
  import("../modules/student/pages/CourseDetails")
);
const Attendance = lazy(() => import("../modules/student/pages/Attendance"));
const Grades = lazy(() => import("../modules/student/pages/Grades"));
const Exams = lazy(() => import("../modules/student/pages/Exams.jsx"));
const VirtualClasses = lazy(() =>
  import("../modules/student/pages/VirtualClasses")
);
const Materials = lazy(() => import("../modules/student/pages/Materials"));
const Notices = lazy(() => import("../modules/student/pages/Notices"));
const Profile = lazy(() => import("../modules/student/pages/Profile"));

// Simple loading fallback until Shared/Skeleton is built in Phase 2
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
  </div>
);

const StudentRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Redirect root to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Student Pages */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:id" element={<CourseDetails />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/grades" element={<Grades />} />
        <Route path="/exams" element={<Exams />} />
        <Route path="/virtual-classes" element={<VirtualClasses />} />
        <Route path="/materials" element={<Materials />} />
        <Route path="/notices" element={<Notices />} />
        <Route path="/profile" element={<Profile />} />

        {/* Fallback for unknown routes */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  );
};

export default StudentRoutes;
