// src/components/shared/layout/Sidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
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
  GraduationCap, // Use GraduationCap instead of University
} from "lucide-react";
import Avatar from "../ui/Avatar.jsx";

const Sidebar = ({ isCollapsed = false, user }) => {
  const navItems = [
    { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/courses", icon: BookOpen, label: "Courses" },
    { path: "/attendance", icon: CalendarCheck, label: "Attendance" },
    { path: "/grades", icon: Award, label: "Grades" },
    { path: "/exams", icon: FileText, label: "Exams" },
    { path: "/virtual-classes", icon: Video, label: "Virtual Classes" },
    { path: "/materials", icon: FolderOpen, label: "Materials" },
    { path: "/notices", icon: Bell, label: "Notices" },
    { path: "/profile", icon: User, label: "Profile" },
  ];

  const sidebarVariants = {
    expanded: { width: "280px" },
    collapsed: { width: "80px" },
  };

  return (
    <motion.aside
      className={`app__sidebar ${isCollapsed ? "app__sidebar--collapsed" : ""}`}
      variants={sidebarVariants}
      initial={isCollapsed ? "collapsed" : "expanded"}
      animate={isCollapsed ? "collapsed" : "expanded"}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {/* Logo/Brand */}
      <div className="sidebar__brand">
        <div className="sidebar__logo">
          <GraduationCap size={32} />
          {!isCollapsed && (
            <span className="sidebar__title">University ERP</span>
          )}
        </div>

        <button className="sidebar__toggle">
          <ChevronLeft
            size={20}
            className={`sidebar__toggle-icon ${
              isCollapsed ? "sidebar__toggle-icon--collapsed" : ""
            }`}
          />
        </button>
      </div>

      {/* User Profile */}
      <div className="sidebar__profile">
        <Avatar
          src={user?.avatar}
          alt={user?.name}
          size={isCollapsed ? "sm" : "md"}
        />
        {!isCollapsed && (
          <div className="sidebar__profile-info">
            <h3 className="sidebar__profile-name">{user?.name}</h3>
            <p className="sidebar__profile-reg">{user?.regNumber}</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="sidebar__nav">
        <ul className="sidebar__nav-list">
          {navItems.map((item, index) => (
            <motion.li
              key={item.path}
              className="sidebar__nav-item"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `sidebar__nav-link ${
                    isActive ? "sidebar__nav-link--active" : ""
                  }`
                }
              >
                <item.icon size={20} className="sidebar__nav-icon" />
                {!isCollapsed && (
                  <span className="sidebar__nav-label">{item.label}</span>
                )}
              </NavLink>
            </motion.li>
          ))}
        </ul>
      </nav>

      {/* Logout */}
      <div className="sidebar__footer">
        <button className="sidebar__logout">
          <LogOut size={20} className="sidebar__logout-icon" />
          {!isCollapsed && <span className="sidebar__logout-text">Logout</span>}
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
