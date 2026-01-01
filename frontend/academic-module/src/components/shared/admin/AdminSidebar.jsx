import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Briefcase,
  Building2,
  BookOpen,
  ClipboardList,
  Calendar,
  TrendingUp,
  Video,
  FileText,
  Bell,
  UserPlus,
  BarChart3
} from 'lucide-react';

const menuItems = [
  { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/admin/students', icon: GraduationCap, label: 'Students' },
  { path: '/admin/faculty', icon: Briefcase, label: 'Faculty' },
  { path: '/admin/departments', icon: Building2, label: 'Departments' },
  { path: '/admin/programs', icon: BookOpen, label: 'Programs' },
  { path: '/admin/courses', icon: BookOpen, label: 'Courses' },
  { path: '/admin/enrollments', icon: ClipboardList, label: 'Enrollments' },
  { path: '/admin/attendance', icon: Calendar, label: 'Attendance' },
  { path: '/admin/grades', icon: TrendingUp, label: 'Grades' },
  { path: '/admin/exams', icon: FileText, label: 'Exams' },
  { path: '/admin/virtual-classes', icon: Video, label: 'Virtual Classes' },
  { path: '/admin/materials', icon: FileText, label: 'Materials' },
  { path: '/admin/notices', icon: Bell, label: 'Notices' },
  { path: '/admin/admissions', icon: UserPlus, label: 'Admissions' },
  { path: '/admin/reports', icon: BarChart3, label: 'Reports' }
];

export default function AdminSidebar() {
  const location = useLocation();

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar__logo">
        <GraduationCap size={32} />
        <span>Admin Portal</span>
      </div>

      <nav className="admin-sidebar__nav">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`admin-sidebar__link ${isActive ? 'admin-sidebar__link--active' : ''}`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
              {isActive && (
                <motion.div
                  className="admin-sidebar__indicator"
                  layoutId="sidebar-indicator"
                  transition={{ duration: 0.3 }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="admin-sidebar__footer">
        <div className="admin-sidebar__user">
          <img 
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" 
            alt="Admin" 
            className="admin-sidebar__user-avatar"
          />
          <div className="admin-sidebar__user-info">
            <span className="admin-sidebar__user-name">John Anderson</span>
            <span className="admin-sidebar__user-role">Super Admin</span>
          </div>
        </div>
      </div>
    </aside>
  );
}