import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  Search, 
  Settings, 
  User, 
  LogOut, 
  Moon, 
  Sun,
  Menu,
  X
} from 'lucide-react';

export default function AdminHeader({
  onToggleSidebar,
  sidebarCollapsed = false,
  user = {},
  notifications = [],
  onLogout,
  onToggleTheme,
  isDarkMode = false
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const defaultUser = {
    name: 'John Anderson',
    email: 'admin@university.edu',
    role: 'Super Admin',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
  };

  const displayUser = { ...defaultUser, ...user };

  const defaultNotifications = [
    {
      id: 1,
      type: 'info',
      title: 'Grade Submission Reminder',
      message: 'Final grades for Fall 2024 due in 3 days',
      time: '2 hours ago',
      isRead: false
    },
    {
      id: 2,
      type: 'warning',
      title: 'Low Attendance Alert',
      message: '15 students have attendance below 75%',
      time: '4 hours ago',
      isRead: false
    },
    {
      id: 3,
      type: 'success',
      title: 'Enrollment Complete',
      message: 'Spring 2025 enrollment period closed successfully',
      time: '1 day ago',
      isRead: true
    }
  ];

  const displayNotifications = notifications.length > 0 ? notifications : defaultNotifications;
  const unreadCount = displayNotifications.filter(n => !n.isRead).length;

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search functionality
    console.log('Searching for:', searchQuery);
  };

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

          <form onSubmit={handleSearch} className="admin-header__search">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search students, faculty, courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="admin-header__search-input"
            />
          </form>
        </div>

        {/* Right Section */}
        <div className="admin-header__right">
          {/* Theme Toggle */}
          <button
            className="admin-header__theme-btn"
            onClick={onToggleTheme}
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Settings */}
          <button
            className="admin-header__settings-btn"
            aria-label="Settings"
          >
            <Settings size={18} />
          </button>

          {/* Notifications */}
          <div className="admin-header__notifications">
            <button
              className="admin-header__notifications-btn"
              onClick={() => setShowNotifications(!showNotifications)}
              aria-label="View notifications"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="admin-header__notifications-badge">
                  {unreadCount}
                </span>
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  className="admin-header__notifications-dropdown"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="admin-header__notifications-header">
                    <h4>Notifications</h4>
                    {unreadCount > 0 && (
                      <span className="admin-header__notifications-count">
                        {unreadCount} new
                      </span>
                    )}
                  </div>

                  <div className="admin-header__notifications-list">
                    {displayNotifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`admin-header__notification ${!notification.isRead ? 'admin-header__notification--unread' : ''}`}
                      >
                        <div className={`admin-header__notification-icon admin-header__notification-icon--${notification.type}`}>
                          {notification.type === 'info' && 'i'}
                          {notification.type === 'warning' && '!'}
                          {notification.type === 'success' && '✓'}
                          {notification.type === 'error' && '×'}
                        </div>
                        <div className="admin-header__notification-content">
                          <h5>{notification.title}</h5>
                          <p>{notification.message}</p>
                          <span>{notification.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="admin-header__notifications-footer">
                    <button className="admin-header__notifications-view-all">
                      View all notifications
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Menu */}
          <div className="admin-header__user">
            <button
              className="admin-header__user-btn"
              onClick={() => setShowUserMenu(!showUserMenu)}
              aria-label="User menu"
            >
              <img
                src={displayUser.avatar}
                alt={displayUser.name}
                className="admin-header__user-avatar"
              />
              <div className="admin-header__user-info">
                <span className="admin-header__user-name">{displayUser.name}</span>
                <span className="admin-header__user-role">{displayUser.role}</span>
              </div>
            </button>

            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  className="admin-header__user-dropdown"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="admin-header__user-header">
                    <img
                      src={displayUser.avatar}
                      alt={displayUser.name}
                      className="admin-header__user-header-avatar"
                    />
                    <div>
                      <h4>{displayUser.name}</h4>
                      <p>{displayUser.email}</p>
                      <span>{displayUser.role}</span>
                    </div>
                  </div>

                  <div className="admin-header__user-menu">
                    <button className="admin-header__user-menu-item">
                      <User size={16} />
                      Profile
                    </button>
                    <button className="admin-header__user-menu-item">
                      <Settings size={16} />
                      Settings
                    </button>
                    <div className="admin-header__user-divider"></div>
                    <button
                      className="admin-header__user-menu-item admin-header__user-menu-item--logout"
                      onClick={onLogout}
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}