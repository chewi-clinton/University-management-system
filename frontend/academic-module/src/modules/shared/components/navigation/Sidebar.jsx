import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  GraduationCap,
  FileText,
  Video,
  Library,
  Bell,
  User,
  ChevronLeft,
} from "lucide-react";
import "./Sidebar.css";

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/courses", label: "My Courses", icon: BookOpen },
  { path: "/attendance", label: "Attendance", icon: Calendar },
  { path: "/grades", label: "Grades", icon: GraduationCap },
  { path: "/exams", label: "Exams", icon: FileText },
  { path: "/virtual-classes", label: "Virtual Classes", icon: Video },
  { path: "/materials", label: "Materials", icon: Library },
  { path: "/notices", label: "Notices", icon: Bell },
  { path: "/profile", label: "Profile", icon: User },
];

const Sidebar = ({ isOpen, toggle }) => {
  return (
    <aside className={`sidebar ${isOpen ? "open" : "collapsed"}`}>
      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-icon">U</div>
          {isOpen && <span className="logo-text">UniERP</span>}
        </div>
        <button className="toggle-btn" onClick={toggle}>
          <ChevronLeft
            size={20}
            style={{ transform: isOpen ? "rotate(0)" : "rotate(180deg)" }}
          />
        </button>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            <item.icon size={22} className="nav-icon" />
            {isOpen && <span className="nav-label">{item.label}</span>}
            <div className="active-indicator" />
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
