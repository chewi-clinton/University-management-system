import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Search,
  Settings,
  User,
  LogOut,
  Moon,
  Sun,
  Menu,
  X,
} from "lucide-react";
import { adminService } from "../../../services/api/adminService";
import authService from "../../../services/api/authService";

export default function AdminHeader({
  onToggleSidebar,
  sidebarCollapsed = false,
  onLogout,
  onToggleTheme,
  isDarkMode = false,
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const notificationsRef = useRef(null);
  const userMenuRef = useRef(null);

  useEffect(() => {
    fetchUserData();
    fetchNotifications();
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await authService.getCurrentUser();
      if (response.success) {
        setUser(response.data);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await adminService.getSystemNotifications();
      if (response.success) {
        setNotifications(response.data);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "info":
        return "ℹ️";
      case "warning":
        return "⚠️";
      case "success":
        return "✅";
      case "error":
        return "❌";
      default:
        return "ℹ️";
    }
  };

  const getRoleDisplay = (role) => {
    const roleMap = {
      super_admin: "Super Admin",
      academic_admin: "Academic Admin",
      faculty: "Faculty Member",
      student: "Student",
    };
    return roleMap[role] || role;
  };

  if (loading || !user) {
    return (
      <header className="admin-header">
        <div className="admin-header__container">
          <div className="admin-header__left">
            <button
              className="admin-header__menu-btn"
              onClick={onToggleSidebar}
              aria-label="Toggle sidebar"
            >
              {sidebarCollapsed ? <Menu size={20} /> : <X size={20} />}
            </button>
          </div>
          <div className="admin-header__right">
            <div className="admin-header__loading">Loading...</div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="admin-header">
      <div className="admin-header__container">
        {/* Left Section */}
        <div className="admin-header__left">
          <button
            className="admin-header__menu-btn"
            onClick={onToggleSidebar}
            aria-label="Toggle sidebar"
          >
            {sidebarCollapsed ? <Menu size={20} /> : <X size={20} />}
          </button>

          <div className="admin-header__search">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search students, faculty, courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSearch(e);
                }
              }}
              className="admin-header__search-input"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="admin-header__right">
          {/* Theme Toggle */}
          <button
            className="admin-header__icon-btn"
            onClick={onToggleTheme}
            aria-label="Toggle theme"
            title="Toggle theme"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Settings */}
          <button
            className="admin-header__icon-btn"
            aria-label="Settings"
            title="Settings"
          >
            <Settings size={20} />
          </button>

          {/* Notifications Dropdown */}
          <div
            className="admin-header__dropdown-wrapper"
            ref={notificationsRef}
          >
            <button
              className="admin-header__icon-btn admin-header__notifications-trigger"
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowUserMenu(false);
              }}
              aria-label="View notifications"
              title="Notifications"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="admin-header__badge">{unreadCount}</span>
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  className="admin-header__dropdown admin-header__notifications-dropdown"
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.15 }}
                >
                  <div className="admin-header__dropdown-header">
                    <h4>Notifications</h4>
                    {unreadCount > 0 && (
                      <span className="admin-header__unread-count">
                        {unreadCount} new
                      </span>
                    )}
                  </div>

                  <div className="admin-header__dropdown-content">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`admin-header__notification-item ${
                            !notification.isRead ? "unread" : ""
                          }`}
                        >
                          <div className="admin-header__notification-icon">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="admin-header__notification-content">
                            <h5>{notification.title}</h5>
                            <p>{notification.message}</p>
                            <span className="admin-header__notification-time">
                              {notification.timestamp}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="admin-header__empty-state">
                        <Bell size={32} />
                        <p>No notifications</p>
                      </div>
                    )}
                  </div>

                  {notifications.length > 0 && (
                    <div className="admin-header__dropdown-footer">
                      <button className="admin-header__view-all-btn">
                        View all notifications
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Menu Dropdown */}
          <div className="admin-header__dropdown-wrapper" ref={userMenuRef}>
            <button
              className="admin-header__user-trigger"
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowNotifications(false);
              }}
              aria-label="User menu"
            >
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                alt={`${user.first_name} ${user.last_name}`}
                className="admin-header__user-avatar"
              />
              <div className="admin-header__user-info">
                <span className="admin-header__user-name">
                  {user.first_name} {user.last_name}
                </span>
                <span className="admin-header__user-role">
                  {getRoleDisplay(user.role)}
                </span>
              </div>
            </button>

            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  className="admin-header__dropdown admin-header__user-dropdown"
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.15 }}
                >
                  <div className="admin-header__user-profile">
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                      alt={`${user.first_name} ${user.last_name}`}
                      className="admin-header__user-profile-avatar"
                    />
                    <div className="admin-header__user-profile-info">
                      <h4>
                        {user.first_name} {user.last_name}
                      </h4>
                      <p>{user.email}</p>
                      <span className="admin-header__user-badge">
                        {getRoleDisplay(user.role)}
                      </span>
                    </div>
                  </div>

                  <div className="admin-header__dropdown-divider"></div>

                  <div className="admin-header__user-menu">
                    <button className="admin-header__menu-item">
                      <User size={18} />
                      <span>My Profile</span>
                    </button>
                    <button className="admin-header__menu-item">
                      <Settings size={18} />
                      <span>Settings</span>
                    </button>
                  </div>

                  <div className="admin-header__dropdown-divider"></div>

                  <button
                    className="admin-header__menu-item admin-header__logout-btn"
                    onClick={onLogout}
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}
