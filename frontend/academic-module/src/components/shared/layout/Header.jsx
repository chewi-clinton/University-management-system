import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Menu,
  Bell,
  Search,
  ChevronDown,
  Settings,
  LogOut,
  User,
} from "lucide-react";
import Avatar from "../ui/Avatar.jsx";
import Badge from "../ui/Badge.jsx";
import Button from "../ui/Button.jsx";
import { useAuth } from "../../../context/AuthContext.jsx";

const Header = ({ onToggleSidebar, isSidebarCollapsed, user }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Generate breadcrumbs from current path
  const getBreadcrumbs = () => {
    const pathnames = location.pathname.split("/").filter((x) => x);
    return pathnames.map((name, index) => {
      const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
      const isLast = index === pathnames.length - 1;

      // Format label: capitalize and replace hyphens with spaces
      const label = name
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      return {
        label,
        path: routeTo,
        isLast,
      };
    });
  };

  const breadcrumbs = getBreadcrumbs();

  const notifications = [
    {
      id: 1,
      title: "Exam Schedule Updated",
      time: "2 hours ago",
      unread: true,
    },
    { id: 2, title: "New Material Available", time: "1 day ago", unread: true },
    { id: 3, title: "Assignment graded", time: "3 days ago", unread: false },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
    setShowProfileMenu(false);
  };

  const handleProfileClick = () => {
    const profilePath =
      user?.role === "student" ? "/student/profile" : "/faculty/profile";
    navigate(profilePath);
    setShowProfileMenu(false);
  };

  return (
    <header
      className={`header ${isSidebarCollapsed ? "header--expanded" : ""}`}
    >
      <div className="header__left">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleSidebar}
          className="header__toggle"
        >
          <Menu size={20} />
        </Button>

        <nav className="header__breadcrumbs">
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={index}>
              <span
                className={`breadcrumb ${
                  crumb.isLast ? "breadcrumb--current" : ""
                }`}
              >
                {crumb.label}
              </span>
              {!crumb.isLast && (
                <span className="breadcrumb__separator">/</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      </div>

      <div className="header__right">
        {/* Search */}
        <div className="header__search">
          <Search size={18} className="header__search-icon" />
          <input
            type="text"
            placeholder="Search courses, materials..."
            className="header__search-input"
          />
        </div>

        {/* Notifications */}
        <div className="header__notifications">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowNotifications(!showNotifications)}
            className="header__notifications-btn"
          >
            <Bell size={20} />
            <Badge
              variant="error"
              size="sm"
              className="header__notifications-badge"
            >
              2
            </Badge>
          </Button>

          {showNotifications && (
            <motion.div
              className="header__notifications-dropdown"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="header__notifications-header">
                <h3>Notifications</h3>
                <Button variant="link" size="sm">
                  Mark all read
                </Button>
              </div>
              <div className="header__notifications-list">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`notification ${
                      notification.unread ? "notification--unread" : ""
                    }`}
                  >
                    <div className="notification__content">
                      <p className="notification__title">
                        {notification.title}
                      </p>
                      <p className="notification__time">{notification.time}</p>
                    </div>
                    {notification.unread && (
                      <div className="notification__dot" />
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Profile Menu */}
        <div className="header__profile">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="header__profile-btn"
          >
            <Avatar src={user?.avatar} alt={user?.name} size="sm" />
            <span className="header__profile-name">{user?.name}</span>
            <ChevronDown size={16} className="header__profile-chevron" />
          </Button>

          {showProfileMenu && (
            <motion.div
              className="header__profile-dropdown"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="header__profile-info">
                <Avatar src={user?.avatar} alt={user?.name} size="md" />
                <div>
                  <p className="header__profile-fullname">{user?.name}</p>
                  <p className="header__profile-email">{user?.email}</p>
                </div>
              </div>

              <div className="header__profile-menu">
                <Button
                  variant="ghost"
                  size="sm"
                  className="header__profile-item"
                  onClick={handleProfileClick}
                >
                  <User size={16} />
                  <span>Profile</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="header__profile-item"
                >
                  <Settings size={16} />
                  <span>Settings</span>
                </Button>
                <div className="header__profile-divider" />
                <Button
                  variant="ghost"
                  size="sm"
                  className="header__profile-item header__profile-item--danger"
                  onClick={handleLogout}
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
