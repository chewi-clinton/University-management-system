import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppShell from '../components/shared/layout/AppShell.jsx';
import Spinner from '../components/shared/feedback/Spinner.jsx';

// Lazy load all pages
const Dashboard = lazy(() => import('../pages/Dashboard.jsx'));
const Courses = lazy(() => import('../pages/Courses.jsx'));
const CourseDetails = lazy(() => import('../pages/CourseDetails.jsx'));
const Attendance = lazy(() => import('../pages/Attendance.jsx'));
const Grades = lazy(() => import('../pages/Grades.jsx'));
const Exams = lazy(() => import('../pages/Exams.jsx'));
const VirtualClasses = lazy(() => import('../pages/VirtualClasses.jsx'));
const Materials = lazy(() => import('../pages/Materials.jsx'));
const Notices = lazy(() => import('../pages/Notices.jsx'));
const Profile = lazy(() => import('../pages/Profile.jsx'));
const NotFound = lazy(() => import('../pages/NotFound.jsx'));

const StudentRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AppShell />}>
        {/* Redirect root to dashboard */}
        <Route index element={<Navigate to="/dashboard" replace />} />
        
        {/* Main pages */}
        <Route path="dashboard" element={
          <Suspense fallback={<Spinner size="large" center />}>
            <Dashboard />
          </Suspense>
        } />
        
        <Route path="courses" element={
          <Suspense fallback={<Spinner size="large" center />}>
            <Courses />
          </Suspense>
        } />
        
        <Route path="courses/:id" element={
          <Suspense fallback={<Spinner size="large" center />}>
            <CourseDetails />
          </Suspense>
        } />
        
        <Route path="attendance" element={
          <Suspense fallback={<Spinner size="large" center />}>
            <Attendance />
          </Suspense>
        } />
        
        <Route path="grades" element={
          <Suspense fallback={<Spinner size="large" center />}>
            <Grades />
          </Suspense>
        } />
        
        <Route path="exams" element={
          <Suspense fallback={<Spinner size="large" center />}>
            <Exams />
          </Suspense>
        } />
        
        <Route path="virtual-classes" element={
          <Suspense fallback={<Spinner size="large" center />}>
            <VirtualClasses />
          </Suspense>
        } />
        
        <Route path="materials" element={
          <Suspense fallback={<Spinner size="large" center />}>
            <Materials />
          </Suspense>
        } />
        
        <Route path="notices" element={
          <Suspense fallback={<Spinner size="large" center />}>
            <Notices />
          </Suspense>
        } />
        
        <Route path="profile" element={
          <Suspense fallback={<Spinner size="large" center />}>
            <Profile />
          </Suspense>
        } />
        
        {/* 404 page */}
        <Route path="*" element={
          <Suspense fallback={<Spinner size="large" center />}>
            <NotFound />
          </Suspense>
        } />
      </Route>
    </Routes>
  );
};

export default StudentRoutes;