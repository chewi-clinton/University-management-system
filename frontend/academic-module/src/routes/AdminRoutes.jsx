import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Spinner } from '../components/shared/feedback/Spinner';
import AdminLayout from '../components/shared/layout/AdminLayout';

// Lazy load admin pages
const AdminDashboard = lazy(() => import('../admin-pages/AdminDashboard'));
const UserManagement = lazy(() => import('../admin-pages/UserManagement'));
const StudentManagement = lazy(() => import('../admin-pages/StudentManagement'));
const FacultyManagement = lazy(() => import('../admin-pages/FacultyManagement'));
const DepartmentManagement = lazy(() => import('../admin-pages/DepartmentManagement'));
const ProgramManagement = lazy(() => import('../admin-pages/ProgramManagement'));
const CourseManagement = lazy(() => import('../admin-pages/CourseManagement'));
const EnrollmentManagement = lazy(() => import('../admin-pages/EnrollmentManagement'));
const AttendanceManagement = lazy(() => import('../admin-pages/AttendanceManagement'));
const GradeManagement = lazy(() => import('../admin-pages/GradeManagement'));
const ExamManagement = lazy(() => import('../admin-pages/ExamManagement'));
const VirtualClassManagement = lazy(() => import('../admin-pages/VirtualClassManagement'));
const MaterialsManagement = lazy(() => import('../admin-pages/MaterialsManagement'));
const NoticeManagement = lazy(() => import('../admin-pages/NoticeManagement'));
const AdmissionManagement = lazy(() => import('../admin-pages/AdmissionManagement'));
const ReportsAnalytics = lazy(() => import('../admin-pages/ReportsAnalytics'));

export default function AdminRoutes() {
  return (
    <AdminLayout>
      <Suspense fallback={<Spinner size="lg" />}>
        <Routes>
          <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/students" element={<StudentManagement />} />
          <Route path="/faculty" element={<FacultyManagement />} />
          <Route path="/departments" element={<DepartmentManagement />} />
          <Route path="/programs" element={<ProgramManagement />} />
          <Route path="/courses" element={<CourseManagement />} />
          <Route path="/enrollments" element={<EnrollmentManagement />} />
          <Route path="/attendance" element={<AttendanceManagement />} />
          <Route path="/grades" element={<GradeManagement />} />
          <Route path="/exams" element={<ExamManagement />} />
          <Route path="/virtual-classes" element={<VirtualClassManagement />} />
          <Route path="/materials" element={<MaterialsManagement />} />
          <Route path="/notices" element={<NoticeManagement />} />
          <Route path="/admissions" element={<AdmissionManagement />} />
          <Route path="/reports" element={<ReportsAnalytics />} />
        </Routes>
      </Suspense>
    </AdminLayout>
  );
}