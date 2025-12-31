import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  Info,
  Bell,
  Pin,
  ChevronDown,
  ChevronUp,
  Calendar,
  User,
  CheckCircle,
} from "lucide-react";
import Container from "../components/shared/layout/Container.jsx";
import Card from "../components/shared/layout/Card.jsx";
import Badge from "../components/shared/ui/Badge.jsx";
import Button from "../components/shared/ui/Button.jsx";
import Tabs from "../components/shared/navigation/Tabs.jsx";
import Skeleton from "../components/shared/feedback/Skeleton.jsx";
import { studentService } from "../services/api/studentService.js";
import "../styles/pages/Notices.css";

const Notices = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notices, setNotices] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [expandedNotices, setExpandedNotices] = useState(new Set());

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      setError(null);

      const noticesResponse = await studentService.getNotices();
      console.log("Notices response:", noticesResponse);

      if (!noticesResponse.success) {
        throw new Error(noticesResponse.error || "Failed to load notices");
      }

      const noticesList = Array.isArray(noticesResponse.data)
        ? noticesResponse.data
        : noticesResponse.data?.results || [];

      // Process notices to add local state
      const processedNotices = noticesList.map((notice) => ({
        ...notice,
        isRead: false, // Track read status locally
        category: getCategoryFromAudience(notice.target_audience),
      }));

      console.log("Processed notices:", processedNotices);
      setNotices(processedNotices);
    } catch (err) {
      console.error("Error fetching notices:", err);
      setError(err.message || "Failed to load notices");
    } finally {
      setLoading(false);
    }
  };

  const getCategoryFromAudience = (audience) => {
    const audienceMap = {
      all: "General",
      students: "Academic",
      faculty: "Faculty",
      specific_department: "Department",
    };
    return audienceMap[audience] || "General";
  };

  const filterNotices = () => {
    if (activeTab === "all") return notices;
    if (activeTab === "unread") return notices.filter((n) => !n.isRead);
    return notices.filter((n) => n.priority === activeTab);
  };

  const pinnedNotices = filterNotices().filter((n) => n.is_pinned);
  const regularNotices = filterNotices().filter((n) => !n.is_pinned);

  const toggleExpand = (noticeId) => {
    setExpandedNotices((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(noticeId)) {
        newSet.delete(noticeId);
      } else {
        newSet.add(noticeId);
      }
      return newSet;
    });
  };

  const markAsRead = (noticeId) => {
    setNotices((prev) =>
      prev.map((notice) =>
        notice.notice_id === noticeId ? { ...notice, isRead: true } : notice
      )
    );
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "urgent":
      case "high":
        return AlertCircle;
      case "important":
      case "medium":
        return Bell;
      default:
        return Info;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "urgent":
      case "high":
        return "error";
      case "important":
      case "medium":
        return "warning";
      default:
        return "secondary";
    }
  };

  const getPriorityLabel = (priority) => {
    const priorityMap = {
      high: "urgent",
      medium: "important",
      low: "normal",
    };
    return priorityMap[priority] || priority;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));

    if (diffMinutes < 60) {
      return `${diffMinutes} minutes ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hours ago`;
    } else if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
  };

  const groupByDate = (noticesList) => {
    const groups = {};
    noticesList.forEach((notice) => {
      const date = new Date(notice.post_date);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      let label;
      if (date.toDateString() === today.toDateString()) {
        label = "Today";
      } else if (date.toDateString() === yesterday.toDateString()) {
        label = "Yesterday";
      } else {
        label = date.toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        });
      }

      if (!groups[label]) {
        groups[label] = [];
      }
      groups[label].push(notice);
    });
    return groups;
  };

  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  // Fixed tabs - using strings for labels instead of JSX
  const tabs = [
    {
      id: "all",
      label: `All Notices (${notices.length})`,
    },
    {
      id: "unread",
      label: `Unread (${notices.filter((n) => !n.isRead).length})`,
    },
    {
      id: "high",
      label: `Urgent (${notices.filter((n) => n.priority === "high").length})`,
    },
    {
      id: "medium",
      label: `Important (${
        notices.filter((n) => n.priority === "medium").length
      })`,
    },
  ];

  if (loading) {
    return (
      <Container>
        <div className="notices">
          <div className="notices__header">
            <Skeleton variant="text" width="200px" height="40px" />
            <Skeleton
              variant="text"
              width="400px"
              height="20px"
              style={{ marginTop: "8px" }}
            />
          </div>
          <Skeleton
            variant="rectangular"
            height="60px"
            style={{ marginBottom: "24px" }}
          />
          <Skeleton variant="rectangular" height="150px" count={3} />
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <div className="notices">
          <Card variant="flat" className="notices__error">
            <AlertCircle
              size={48}
              style={{ color: "#ef4444", marginBottom: "16px" }}
            />
            <h3
              style={{
                fontSize: "20px",
                fontWeight: "600",
                marginBottom: "8px",
              }}
            >
              Failed to Load Notices
            </h3>
            <p style={{ color: "#6b7280", marginBottom: "24px" }}>{error}</p>
            <Button variant="primary" onClick={fetchNotices}>
              Retry
            </Button>
          </Card>
        </div>
      </Container>
    );
  }

  const groupedRegularNotices = groupByDate(regularNotices);

  return (
    <Container>
      <motion.div
        className="notices"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        <div className="notices__header">
          <div className="notices__header-content">
            <h1 className="notices__title">Notices & Announcements</h1>
            <p className="notices__subtitle">
              Stay updated with important announcements and notifications
            </p>
          </div>
          <div className="notices__stats">
            <div className="notices__stat">
              <Bell className="notices__stat-icon" size={20} />
              <div className="notices__stat-content">
                <span className="notices__stat-value">
                  {notices.filter((n) => !n.isRead).length}
                </span>
                <span className="notices__stat-label">Unread</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs - Fixed to use string labels and onTabChange prop */}
        <motion.div variants={itemVariants}>
          <Card variant="flat" className="notices__tabs-card">
            <Tabs
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </Card>
        </motion.div>

        {/* Pinned Notices */}
        {pinnedNotices.length > 0 && (
          <motion.div variants={itemVariants} className="notices__section">
            <div className="notices__section-header">
              <Pin size={20} className="notices__section-icon" />
              <h2 className="notices__section-title">Pinned Notices</h2>
            </div>

            <div className="notices__list">
              <AnimatePresence>
                {pinnedNotices.map((notice, index) => {
                  const PriorityIcon = getPriorityIcon(notice.priority);
                  const isExpanded = expandedNotices.has(notice.notice_id);
                  const shouldTruncate =
                    notice.content && notice.content.length > 200;
                  const priorityLabel = getPriorityLabel(notice.priority);

                  return (
                    <motion.div
                      key={notice.notice_id}
                      variants={itemVariants}
                      custom={index}
                      layout
                    >
                      <Card
                        variant="elevated"
                        className={`notices__item notices__item--pinned ${
                          !notice.isRead ? "notices__item--unread" : ""
                        }`}
                      >
                        {!notice.isRead && (
                          <div className="notices__unread-indicator" />
                        )}

                        <div className="notices__item-header">
                          <div className="notices__item-priority">
                            <PriorityIcon
                              size={20}
                              className={`notices__priority-icon notices__priority-icon--${priorityLabel}`}
                            />
                          </div>
                          <Badge
                            variant={getPriorityColor(notice.priority)}
                            className="notices__priority-badge"
                          >
                            {priorityLabel}
                          </Badge>
                          <Pin size={16} className="notices__pin-icon" />
                        </div>

                        <h3 className="notices__item-title">{notice.title}</h3>

                        <div className="notices__item-content">
                          <p
                            className={`notices__item-text ${
                              !isExpanded && shouldTruncate
                                ? "notices__item-text--truncated"
                                : ""
                            }`}
                          >
                            {notice.content}
                          </p>
                          {shouldTruncate && (
                            <button
                              className="notices__read-more"
                              onClick={() => {
                                toggleExpand(notice.notice_id);
                                if (!notice.isRead)
                                  markAsRead(notice.notice_id);
                              }}
                            >
                              {isExpanded ? (
                                <>
                                  Read less <ChevronUp size={16} />
                                </>
                              ) : (
                                <>
                                  Read more <ChevronDown size={16} />
                                </>
                              )}
                            </button>
                          )}
                        </div>

                        <div className="notices__item-footer">
                          <div className="notices__item-meta">
                            <span className="notices__item-meta-item">
                              <User size={14} />
                              {notice.posted_by_user?.first_name}{" "}
                              {notice.posted_by_user?.last_name}
                            </span>
                            <span className="notices__item-meta-item">
                              <Calendar size={14} />
                              {formatDate(notice.post_date)}
                            </span>
                            <Badge variant="primary" size="sm">
                              {notice.category}
                            </Badge>
                          </div>
                          {!notice.isRead && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(notice.notice_id)}
                            >
                              <CheckCircle size={16} />
                              Mark as read
                            </Button>
                          )}
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* Regular Notices Grouped by Date */}
        {Object.entries(groupedRegularNotices).map(
          ([dateLabel, dateNotices], groupIndex) => (
            <motion.div
              key={dateLabel}
              variants={itemVariants}
              className="notices__section"
            >
              <div className="notices__date-divider">
                <Calendar size={18} />
                <span>{dateLabel}</span>
              </div>

              <div className="notices__list">
                <AnimatePresence>
                  {dateNotices.map((notice, index) => {
                    const PriorityIcon = getPriorityIcon(notice.priority);
                    const isExpanded = expandedNotices.has(notice.notice_id);
                    const shouldTruncate =
                      notice.content && notice.content.length > 200;
                    const priorityLabel = getPriorityLabel(notice.priority);

                    return (
                      <motion.div
                        key={notice.notice_id}
                        variants={itemVariants}
                        custom={index}
                        layout
                      >
                        <Card
                          variant="flat"
                          className={`notices__item ${
                            !notice.isRead ? "notices__item--unread" : ""
                          }`}
                        >
                          {!notice.isRead && (
                            <div className="notices__unread-indicator" />
                          )}

                          <div className="notices__item-header">
                            <div className="notices__item-priority">
                              <PriorityIcon
                                size={20}
                                className={`notices__priority-icon notices__priority-icon--${priorityLabel}`}
                              />
                            </div>
                            <Badge
                              variant={getPriorityColor(notice.priority)}
                              className="notices__priority-badge"
                            >
                              {priorityLabel}
                            </Badge>
                          </div>

                          <h3 className="notices__item-title">
                            {notice.title}
                          </h3>

                          <div className="notices__item-content">
                            <p
                              className={`notices__item-text ${
                                !isExpanded && shouldTruncate
                                  ? "notices__item-text--truncated"
                                  : ""
                              }`}
                            >
                              {notice.content}
                            </p>
                            {shouldTruncate && (
                              <button
                                className="notices__read-more"
                                onClick={() => {
                                  toggleExpand(notice.notice_id);
                                  if (!notice.isRead)
                                    markAsRead(notice.notice_id);
                                }}
                              >
                                {isExpanded ? (
                                  <>
                                    Read less <ChevronUp size={16} />
                                  </>
                                ) : (
                                  <>
                                    Read more <ChevronDown size={16} />
                                  </>
                                )}
                              </button>
                            )}
                          </div>

                          <div className="notices__item-footer">
                            <div className="notices__item-meta">
                              <span className="notices__item-meta-item">
                                <User size={14} />
                                {notice.posted_by_user?.first_name}{" "}
                                {notice.posted_by_user?.last_name}
                              </span>
                              <span className="notices__item-meta-item">
                                <Calendar size={14} />
                                {formatDate(notice.post_date)}
                              </span>
                              <Badge variant="primary" size="sm">
                                {notice.category}
                              </Badge>
                            </div>
                            {!notice.isRead && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => markAsRead(notice.notice_id)}
                              >
                                <CheckCircle size={16} />
                                Mark as read
                              </Button>
                            )}
                          </div>
                        </Card>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </motion.div>
          )
        )}

        {/* Empty State */}
        {filterNotices().length === 0 && (
          <motion.div variants={itemVariants}>
            <Card variant="flat" className="notices__empty">
              <div className="notices__empty-content">
                <Bell size={64} className="notices__empty-icon" />
                <h3 className="notices__empty-title">No Notices Found</h3>
                <p className="notices__empty-text">
                  {activeTab === "unread"
                    ? "You're all caught up! No unread notices at the moment."
                    : "There are no notices in this category."}
                </p>
                {activeTab !== "all" && (
                  <Button variant="outline" onClick={() => setActiveTab("all")}>
                    View All Notices
                  </Button>
                )}
              </div>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </Container>
  );
};

export default Notices;
