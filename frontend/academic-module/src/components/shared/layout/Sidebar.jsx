import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  BookOpen,
  CalendarCheck,
  Award,
  FileText,
  Video,
  FolderOpen,
  Bell,
  User,
  LogOut,
  ChevronLeft,
  GraduationCap,
  Users,
  ClipboardCheck,
  BarChart3,
} from "lucide-react";
import Avatar from "../ui/Avatar.jsx";
import { useAuth } from "../../../context/AuthContext.jsx";

const Sidebar = ({ isCollapsed = false }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Student navigation items
  const studentNavItems = [
    { path: "/student/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/student/courses", icon: BookOpen, label: "Courses" },
    { path: "/student/attendance", icon: CalendarCheck, label: "Attendance" },
    { path: "/student/grades", icon: Award, label: "Grades" },
    { path: "/student/exams", icon: FileText, label: "Exams" },
    { path: "/student/virtual-classes", icon: Video, label: "Virtual Classes" },
    { path: "/student/materials", icon: FolderOpen, label: "Materials" },
    { path: "/student/notices", icon: Bell, label: "Notices" },
    { path: "/student/profile", icon: User, label: "Profile" },
  ];

  // Faculty navigation items
  const facultyNavItems = [
    { path: "/faculty/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/faculty/courses", icon: BookOpen, label: "My Courses" },
    {
      path: "/faculty/attendance-marking",
      icon: ClipboardCheck,
      label: "Attendance",
    },
    { path: "/faculty/grading", icon: Award, label: "Grading" },
    { path: "/faculty/exam-management", icon: FileText, label: "Exams" },
    { path: "/faculty/student-directory", icon: Users, label: "Students" },
    {
      path: "/faculty/virtual-class-setup",
      icon: Video,
      label: "Virtual Classes",
    },
    { path: "/faculty/reports", icon: BarChart3, label: "Reports" },
  ];

  // Get navigation items based on user role
  const navItems = user?.role === "student" ? studentNavItems : facultyNavItems;

  const sidebarVariants = {
    expanded: { width: "280px" },
    collapsed: { width: "80px" },
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <motion.aside
      className={`sidebar ${isCollapsed ? "sidebar--collapsed" : ""}`}
      variants={sidebarVariants}
      animate={isCollapsed ? "collapsed" : "expanded"}
      transition={{ duration: 0.3 }}
    >
      {/* Logo/Brand */}
      <div className="sidebar__header">
        <div className="sidebar__logo">
          <GraduationCap size={32} className="sidebar__logo-icon" />
          {!isCollapsed && (
            <span className="sidebar__logo-text">University ERP</span>
          )}
        </div>
      </div>

      {/* User Profile */}
      <div className="sidebar__user">
        <Avatar
          src={user?.avatar}
          alt={user?.name}
          size={isCollapsed ? "sm" : "md"}
        />
        {!isCollapsed && (
          <div className="sidebar__user-info">
            <p className="sidebar__user-name">{user?.name}</p>
            <p className="sidebar__user-meta">
              {user?.role === "student" ? user?.regNumber : user?.employeeId}
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="sidebar__nav">
        {navItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) =>
              `sidebar__nav-link ${isActive ? "sidebar__nav-link--active" : ""}`
            }
            title={isCollapsed ? item.label : ""}
          >
            <item.icon size={20} className="sidebar__nav-icon" />
            {!isCollapsed && (
              <span className="sidebar__nav-label">{item.label}</span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="sidebar__footer">
        <button
          onClick={handleLogout}
          className="sidebar__logout"
          title={isCollapsed ? "Logout" : ""}
        >
          <LogOut size={20} className="sidebar__logout-icon" />
          {!isCollapsed && <span className="sidebar__logout-text">Logout</span>}
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
