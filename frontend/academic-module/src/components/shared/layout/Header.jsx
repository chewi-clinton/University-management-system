import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  Bell,
  Search,
  ChevronDown,
  Settings,
  LogOut,
  User,
  AlertCircle,
  Info,
} from "lucide-react";
import Avatar from "../ui/Avatar.jsx";
import Badge from "../ui/Badge.jsx";
import Button from "../ui/Button.jsx";
import { useAuth } from "../../../context/AuthContext.jsx";
import { studentService } from "../../../services/api/studentService.js";

const Header = ({ onToggleSidebar, isSidebarCollapsed, user }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const notificationsRef = useRef(null);
  const profileRef = useRef(null);
  const searchRef = useRef(null);

  // Fetch notifications
  useEffect(() => {
    if (user?.role === "student") {
      fetchNotifications();
    }
  }, [user]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Search functionality with debounce
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        performSearch(searchQuery);
      } else {
        setSearchResults([]);
        setShowSearchResults(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const performSearch = async (query) => {
    try {
      setSearchLoading(true);
      setShowSearchResults(true);

      // Search across multiple resources
      const [coursesRes, materialsRes, noticesRes] = await Promise.all([
        studentService.getCourses(),
        studentService.getCourses().then(async (res) => {
          if (!res.success) return { success: false, data: [] };
          const courses = Array.isArray(res.data)
            ? res.data
            : res.data?.results || [];

          // Fetch materials for all courses
          const allMaterials = [];
          for (const course of courses) {
            if (course.offering?.id) {
              const matRes = await studentService.getCourseMaterials(
                course.offering.id
              );
              if (matRes.success) {
                const materials = Array.isArray(matRes.data)
                  ? matRes.data
                  : matRes.data?.results || [];
                allMaterials.push(...materials);
              }
            }
          }
          return { success: true, data: allMaterials };
        }),
        studentService.getNotices(),
      ]);

      const results = [];

      // Filter courses
      if (coursesRes.success) {
        const courses = Array.isArray(coursesRes.data)
          ? coursesRes.data
          : coursesRes.data?.results || [];
        courses
          .filter((course) => {
            const searchLower = query.toLowerCase();
            const courseCode =
              course.offering?.course?.course_code?.toLowerCase() || "";
            const courseName =
              course.offering?.course?.course_name?.toLowerCase() || "";
            return (
              courseCode.includes(searchLower) ||
              courseName.includes(searchLower)
            );
          })
          .slice(0, 3)
          .forEach((course) => {
            results.push({
              type: "course",
              title: `${course.offering?.course?.course_code} - ${course.offering?.course?.course_name}`,
              subtitle: course.offering?.faculty?.user?.first_name
                ? `Instructor: ${course.offering.faculty.user.first_name} ${course.offering.faculty.user.last_name}`
                : "Course",
              path: `/student/courses`,
            });
          });
      }

      // Filter materials
      if (materialsRes.success) {
        const materials = Array.isArray(materialsRes.data)
          ? materialsRes.data
          : [];
        materials
          .filter((material) => {
            const searchLower = query.toLowerCase();
            const title = material.title?.toLowerCase() || "";
            const description = material.description?.toLowerCase() || "";
            return (
              title.includes(searchLower) || description.includes(searchLower)
            );
          })
          .slice(0, 3)
          .forEach((material) => {
            results.push({
              type: "material",
              title: material.title || "Untitled Material",
              subtitle: material.courseCode || "Study Material",
              path: `/student/materials`,
            });
          });
      }

      // Filter notices
      if (noticesRes.success) {
        const notices = Array.isArray(noticesRes.data)
          ? noticesRes.data
          : noticesRes.data?.results || [];
        notices
          .filter((notice) => {
            const searchLower = query.toLowerCase();
            const title = notice.title?.toLowerCase() || "";
            const content = notice.content?.toLowerCase() || "";
            return title.includes(searchLower) || content.includes(searchLower);
          })
          .slice(0, 3)
          .forEach((notice) => {
            results.push({
              type: "notice",
              title: notice.title || "Notice",
              subtitle: formatNotificationTime(notice.post_date),
              path: `/student/notices`,
            });
          });
      }

      setSearchResults(results);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSearchResultClick = (result) => {
    navigate(result.path);
    setSearchQuery("");
    setShowSearchResults(false);
  };

  const getSearchResultIcon = (type) => {
    switch (type) {
      case "course":
        return "📚";
      case "material":
        return "📄";
      case "notice":
        return "📢";
      default:
        return "🔍";
    }
  };

  const fetchNotifications = async () => {
    try {
      setNotificationsLoading(true);
      const response = await studentService.getNotices();

      if (response.success) {
        const noticesList = Array.isArray(response.data)
          ? response.data
          : response.data?.results || [];

        // Convert notices to notifications and limit to 5 most recent
        const recentNotices = noticesList
          .sort((a, b) => new Date(b.post_date) - new Date(a.post_date))
          .slice(0, 5)
          .map((notice) => ({
            id: notice.notice_id,
            title: notice.title,
            content: notice.content,
            time: formatNotificationTime(notice.post_date),
            unread: true, // You can track read status locally or from API
            priority: notice.priority,
            category: notice.target_audience,
          }));

        setNotifications(recentNotices);

        // Count unread (you can modify this based on your tracking logic)
        const unread = recentNotices.filter((n) => n.unread).length;
        setUnreadCount(unread);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setNotificationsLoading(false);
    }
  };

  const formatNotificationTime = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffMinutes < 60) {
      return `${diffMinutes} ${diffMinutes === 1 ? "minute" : "minutes"} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} ${diffHours === 1 ? "hour" : "hours"} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} ${diffDays === 1 ? "day" : "days"} ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "high":
      case "urgent":
        return <AlertCircle size={16} style={{ color: "#ef4444" }} />;
      case "medium":
      case "important":
        return <Bell size={16} style={{ color: "#f59e0b" }} />;
      default:
        return <Info size={16} style={{ color: "#6366f1" }} />;
    }
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    setUnreadCount(0);
  };

  const markAsRead = (notificationId) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, unread: false } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    navigate("/student/notices");
    setShowNotifications(false);
  };

  const handleViewAllNotifications = () => {
    navigate("/student/notices");
    setShowNotifications(false);
  };

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
        <div className="header__search" ref={searchRef}>
          <Search size={18} className="header__search-icon" />
          <input
            type="text"
            placeholder="Search courses, materials..."
            className="header__search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => {
              if (searchResults.length > 0) {
                setShowSearchResults(true);
              }
            }}
          />

          <AnimatePresence>
            {showSearchResults && (
              <motion.div
                className="header__search-dropdown"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {searchLoading ? (
                  <div
                    style={{
                      padding: "20px",
                      textAlign: "center",
                      color: "#6b7280",
                    }}
                  >
                    Searching...
                  </div>
                ) : searchResults.length > 0 ? (
                  <>
                    <div className="header__search-results">
                      {searchResults.map((result, index) => (
                        <div
                          key={index}
                          className="header__search-result"
                          onClick={() => handleSearchResultClick(result)}
                        >
                          <span className="header__search-result-icon">
                            {getSearchResultIcon(result.type)}
                          </span>
                          <div className="header__search-result-content">
                            <p className="header__search-result-title">
                              {result.title}
                            </p>
                            <p className="header__search-result-subtitle">
                              {result.subtitle}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : searchQuery.trim().length >= 2 ? (
                  <div
                    style={{
                      padding: "20px",
                      textAlign: "center",
                      color: "#6b7280",
                    }}
                  >
                    <Search
                      size={32}
                      style={{ marginBottom: "8px", opacity: 0.5 }}
                    />
                    <p>No results found for "{searchQuery}"</p>
                  </div>
                ) : null}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Notifications */}
        <div className="header__notifications" ref={notificationsRef}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowNotifications(!showNotifications)}
            className="header__notifications-btn"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <Badge
                variant="error"
                size="sm"
                className="header__notifications-badge"
              >
                {unreadCount > 9 ? "9+" : unreadCount}
              </Badge>
            )}
          </Button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                className="header__notifications-dropdown"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="header__notifications-header">
                  <h3>Notifications</h3>
                  {unreadCount > 0 && (
                    <Button variant="link" size="sm" onClick={markAllAsRead}>
                      Mark all read
                    </Button>
                  )}
                </div>

                <div className="header__notifications-list">
                  {notificationsLoading ? (
                    <div
                      style={{
                        padding: "20px",
                        textAlign: "center",
                        color: "#6b7280",
                      }}
                    >
                      Loading notifications...
                    </div>
                  ) : notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`notification ${
                          notification.unread ? "notification--unread" : ""
                        }`}
                        onClick={() => handleNotificationClick(notification)}
                        style={{ cursor: "pointer" }}
                      >
                        <div className="notification__icon">
                          {getPriorityIcon(notification.priority)}
                        </div>
                        <div className="notification__content">
                          <p className="notification__title">
                            {notification.title}
                          </p>
                          {notification.content && (
                            <p className="notification__excerpt">
                              {notification.content.length > 60
                                ? `${notification.content.substring(0, 60)}...`
                                : notification.content}
                            </p>
                          )}
                          <p className="notification__time">
                            {notification.time}
                          </p>
                        </div>
                        {notification.unread && (
                          <div className="notification__dot" />
                        )}
                      </div>
                    ))
                  ) : (
                    <div
                      style={{
                        padding: "40px 20px",
                        textAlign: "center",
                        color: "#6b7280",
                      }}
                    >
                      <Bell
                        size={32}
                        style={{ marginBottom: "8px", opacity: 0.5 }}
                      />
                      <p>No notifications yet</p>
                    </div>
                  )}
                </div>

                {notifications.length > 0 && (
                  <div className="header__notifications-footer">
                    <Button
                      variant="link"
                      size="sm"
                      onClick={handleViewAllNotifications}
                      style={{ width: "100%", justifyContent: "center" }}
                    >
                      View all notifications
                    </Button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile Menu */}
        <div className="header__profile" ref={profileRef}>
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

          <AnimatePresence>
            {showProfileMenu && (
              <motion.div
                className="header__profile-dropdown"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
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
                    onClick={() => {
                      navigate("/student/profile");
                      setShowProfileMenu(false);
                    }}
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
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Header;
