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
import Skeleton from "../components/shared/feedback/skeleton.jsx";
import "../styles/pages/Notices.css";

const mockNotices = [
  {
    id: 1,
    title: "Midterm Exam Schedule Released",
    content:
      "The midterm examination schedule for all courses has been finalized and published. Please check your individual course pages for specific dates and times. Students are advised to review the examination guidelines and arrive at the examination hall 15 minutes before the scheduled time. ID cards are mandatory for entry.",
    priority: "urgent",
    postedBy: "Academic Office",
    postedDate: "2025-01-22T10:00:00",
    isPinned: true,
    isRead: false,
    category: "Academic",
  },
  {
    id: 2,
    title: "Library Hours Extended During Exam Week",
    content:
      "To support students during the upcoming examination period, the university library will extend its operating hours. The library will remain open from 7:00 AM to 11:00 PM starting from January 28th through February 10th. Additional study rooms have also been made available on the third floor.",
    priority: "important",
    postedBy: "Library Services",
    postedDate: "2025-01-22T09:30:00",
    isPinned: true,
    isRead: false,
    category: "General",
  },
  {
    id: 3,
    title: "Campus Network Maintenance",
    content:
      "The IT department will perform scheduled maintenance on the campus network infrastructure on January 25th from 2:00 AM to 6:00 AM. During this time, internet services and online systems may be temporarily unavailable. Please plan your work accordingly.",
    priority: "important",
    postedBy: "IT Department",
    postedDate: "2025-01-21T16:45:00",
    isPinned: false,
    isRead: false,
    category: "Technical",
  },
  {
    id: 4,
    title: "Guest Lecture: AI and Machine Learning",
    content:
      'The Computer Science department is pleased to announce a special guest lecture by Dr. Emma Watson on "The Future of Artificial Intelligence and Machine Learning". The lecture will be held on February 2nd at 3:00 PM in the Main Auditorium. All students are welcome to attend.',
    priority: "normal",
    postedBy: "CS Department",
    postedDate: "2025-01-21T14:20:00",
    isPinned: false,
    isRead: true,
    category: "Events",
  },
  {
    id: 5,
    title: "Fee Payment Deadline Reminder",
    content:
      "This is a reminder that the deadline for semester fee payment is January 31st. Late payment will incur a penalty of $50. Students facing financial difficulties are encouraged to contact the Student Affairs Office to discuss payment plan options.",
    priority: "urgent",
    postedBy: "Finance Office",
    postedDate: "2025-01-20T11:00:00",
    isPinned: false,
    isRead: true,
    category: "Administrative",
  },
  {
    id: 6,
    title: "Student Council Elections 2025",
    content:
      "Nominations are now open for the Student Council Elections 2025. Interested students can submit their nomination forms to the Student Affairs Office by February 5th. The election campaign period will begin on February 10th, and voting will take place on February 20th.",
    priority: "normal",
    postedBy: "Student Affairs",
    postedDate: "2025-01-20T10:15:00",
    isPinned: false,
    isRead: true,
    category: "Events",
  },
  {
    id: 7,
    title: "Career Fair Registration Open",
    content:
      "The annual Career Fair will be held on March 15th. Over 50 companies from various industries will participate. Students interested in attending should register through the Career Services portal by March 1st. Professional attire is required.",
    priority: "normal",
    postedBy: "Career Services",
    postedDate: "2025-01-19T15:30:00",
    isPinned: false,
    isRead: true,
    category: "Events",
  },
  {
    id: 8,
    title: "Health Center Flu Vaccination Drive",
    content:
      "The University Health Center is conducting a flu vaccination drive for all students and staff. Vaccinations will be available from January 25th to February 5th, Monday through Friday, 9:00 AM to 4:00 PM. No appointment necessary.",
    priority: "normal",
    postedBy: "Health Center",
    postedDate: "2025-01-19T09:00:00",
    isPinned: false,
    isRead: true,
    category: "General",
  },
];

const Notices = () => {
  const [loading, setLoading] = useState(true);
  const [notices, setNotices] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [expandedNotices, setExpandedNotices] = useState(new Set());

  useEffect(() => {
    setTimeout(() => {
      setNotices(mockNotices);
      setLoading(false);
    }, 800);
  }, []);

  const filterNotices = () => {
    if (activeTab === "all") return notices;
    if (activeTab === "unread") return notices.filter((n) => !n.isRead);
    return notices.filter((n) => n.priority === activeTab);
  };

  const pinnedNotices = filterNotices().filter((n) => n.isPinned);
  const regularNotices = filterNotices().filter((n) => !n.isPinned);

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
        notice.id === noticeId ? { ...notice, isRead: true } : notice
      )
    );
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "urgent":
        return AlertCircle;
      case "important":
        return Bell;
      default:
        return Info;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "urgent":
        return "error";
      case "important":
        return "warning";
      default:
        return "secondary";
    }
  };

  const formatDate = (dateString) => {
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
      const date = new Date(notice.postedDate);
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

  const tabs = [
    { id: "all", label: "All Notices", count: notices.length },
    {
      id: "unread",
      label: "Unread",
      count: notices.filter((n) => !n.isRead).length,
    },
    {
      id: "urgent",
      label: "Urgent",
      count: notices.filter((n) => n.priority === "urgent").length,
    },
    {
      id: "important",
      label: "Important",
      count: notices.filter((n) => n.priority === "important").length,
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

        {/* Tabs */}
        <motion.div variants={itemVariants}>
          <Card variant="flat" className="notices__tabs-card">
            <Tabs
              tabs={tabs.map((tab) => ({
                id: tab.id,
                label: (
                  <div className="notices__tab-label">
                    {tab.label}
                    {tab.count > 0 && (
                      <Badge variant="secondary" size="sm">
                        {tab.count}
                      </Badge>
                    )}
                  </div>
                ),
              }))}
              activeTab={activeTab}
              onChange={setActiveTab}
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
                  const isExpanded = expandedNotices.has(notice.id);
                  const shouldTruncate = notice.content.length > 200;

                  return (
                    <motion.div
                      key={notice.id}
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
                              className={`notices__priority-icon notices__priority-icon--${notice.priority}`}
                            />
                          </div>
                          <Badge
                            variant={getPriorityColor(notice.priority)}
                            className="notices__priority-badge"
                          >
                            {notice.priority}
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
                                toggleExpand(notice.id);
                                if (!notice.isRead) markAsRead(notice.id);
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
                              {notice.postedBy}
                            </span>
                            <span className="notices__item-meta-item">
                              <Calendar size={14} />
                              {formatDate(notice.postedDate)}
                            </span>
                            <Badge variant="primary" size="sm">
                              {notice.category}
                            </Badge>
                          </div>
                          {!notice.isRead && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(notice.id)}
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
                    const isExpanded = expandedNotices.has(notice.id);
                    const shouldTruncate = notice.content.length > 200;

                    return (
                      <motion.div
                        key={notice.id}
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
                                className={`notices__priority-icon notices__priority-icon--${notice.priority}`}
                              />
                            </div>
                            <Badge
                              variant={getPriorityColor(notice.priority)}
                              className="notices__priority-badge"
                            >
                              {notice.priority}
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
                                  toggleExpand(notice.id);
                                  if (!notice.isRead) markAsRead(notice.id);
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
                                {notice.postedBy}
                              </span>
                              <span className="notices__item-meta-item">
                                <Calendar size={14} />
                                {formatDate(notice.postedDate)}
                              </span>
                              <Badge variant="primary" size="sm">
                                {notice.category}
                              </Badge>
                            </div>
                            {!notice.isRead && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => markAsRead(notice.id)}
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
