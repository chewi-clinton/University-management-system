import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/admin-pages/NoticeManagement.css";
import {
  Bell,
  Plus,
  Search,
  Filter,
  ChevronDown,
  MoreVertical,
  Eye,
  Edit3,
  Trash2,
  Send,
  Calendar,
  Clock,
  Users,
  Building,
  Pin,
  AlertCircle,
  CheckCircle,
  XCircle,
  Tag,
  FileText,
  Download,
  Upload,
  Archive,
  TrendingUp,
  MessageSquare,
  ExternalLink,
  Copy,
  Hash,
  Target,
  Megaphone,
  AlertTriangle,
  Info,
  Star,
  BookOpen,
  GraduationCap,
} from "lucide-react";

// Mock Data
const mockNotices = [
  {
    id: 1,
    noticeId: "NOT-2026-001",
    title: "Mid-Term Examination Schedule Released",
    content:
      "The mid-term examination schedule for Spring 2026 semester has been released. Students are advised to check their respective portals for detailed timings and venues. All examinations will be conducted from January 15-25, 2026.",
    priority: "high",
    category: "examination",
    targetAudience: "students",
    department: "All Departments",
    postedBy: "Academic Office",
    postedDate: "2026-01-01T09:00:00",
    expiryDate: "2026-01-25T23:59:59",
    isPinned: true,
    isPublished: true,
    views: 1247,
    attachments: ["exam_schedule.pdf"],
    tags: ["examination", "schedule", "important"],
  },
  {
    id: 2,
    noticeId: "NOT-2026-002",
    title: "Holiday Notice - National Day Celebration",
    content:
      "The university will remain closed on January 10, 2026, in observance of National Day. All classes and administrative offices will be closed. Regular operations will resume on January 11, 2026.",
    priority: "medium",
    category: "holiday",
    targetAudience: "all",
    department: "All Departments",
    postedBy: "Administration",
    postedDate: "2025-12-28T14:00:00",
    expiryDate: "2026-01-11T00:00:00",
    isPinned: true,
    isPublished: true,
    views: 892,
    attachments: [],
    tags: ["holiday", "closure"],
  },
  {
    id: 3,
    noticeId: "NOT-2026-003",
    title: "Workshop on AI and Machine Learning",
    content:
      "Department of Computer Science is organizing a 3-day workshop on Artificial Intelligence and Machine Learning from January 20-22, 2026. Interested students can register at the department office. Limited seats available.",
    priority: "medium",
    category: "event",
    targetAudience: "students",
    department: "Computer Science",
    postedBy: "Dr. Sarah Johnson",
    postedDate: "2025-12-27T11:00:00",
    expiryDate: "2026-01-22T23:59:59",
    isPinned: false,
    isPublished: true,
    views: 456,
    attachments: ["workshop_details.pdf"],
    tags: ["workshop", "AI", "ML", "event"],
  },
  {
    id: 4,
    noticeId: "NOT-2026-004",
    title: "Library Timings Extended During Exams",
    content:
      "The university library will extend its operating hours during the examination period. Library will be open from 7:00 AM to 11:00 PM (January 15-25). Students are requested to follow library rules and maintain silence.",
    priority: "low",
    category: "general",
    targetAudience: "students",
    department: "Library",
    postedBy: "Library Administration",
    postedDate: "2025-12-26T10:00:00",
    expiryDate: "2026-01-26T00:00:00",
    isPinned: false,
    isPublished: true,
    views: 678,
    attachments: [],
    tags: ["library", "examination", "facility"],
  },
  {
    id: 5,
    noticeId: "NOT-2026-005",
    title: "Faculty Meeting - January 8, 2026",
    content:
      "All faculty members are required to attend the monthly faculty meeting scheduled for January 8, 2026, at 10:00 AM in the Main Conference Hall. Agenda includes curriculum review and semester planning.",
    priority: "high",
    category: "meeting",
    targetAudience: "faculty",
    department: "All Departments",
    postedBy: "Dean of Academics",
    postedDate: "2025-12-25T15:00:00",
    expiryDate: "2026-01-08T23:59:59",
    isPinned: false,
    isPublished: true,
    views: 234,
    attachments: ["meeting_agenda.pdf"],
    tags: ["meeting", "faculty", "mandatory"],
  },
];

const mockStats = {
  totalNotices: 45,
  activeNotices: 28,
  pinnedNotices: 3,
  totalViews: 12847,
  publishedThisMonth: 12,
  drafts: 5,
};

const categories = [
  "examination",
  "holiday",
  "event",
  "meeting",
  "general",
  "academic",
  "administrative",
];
const priorities = ["high", "medium", "low"];
const audiences = ["all", "students", "faculty", "staff"];
const departments = [
  "All Departments",
  "Computer Science",
  "Business Administration",
  "Engineering",
  "Arts & Sciences",
  "Library",
];

export default function NoticeManagement() {
  const [selectedTab, setSelectedTab] = useState("all");
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterAudience, setFilterAudience] = useState("all");
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [notices, setNotices] = useState(mockNotices);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    priority: "medium",
    category: "general",
    targetAudience: "all",
    department: "All Departments",
    expiryDate: "",
    isPinned: false,
    tags: "",
  });

  // Filter notices
  const filteredNotices = notices.filter((notice) => {
    const matchesSearch =
      notice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notice.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notice.noticeId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || notice.category === filterCategory;
    const matchesPriority =
      filterPriority === "all" || notice.priority === filterPriority;
    const matchesAudience =
      filterAudience === "all" || notice.targetAudience === filterAudience;
    const matchesTab =
      selectedTab === "all" ||
      (selectedTab === "pinned" && notice.isPinned) ||
      (selectedTab === "published" && notice.isPublished) ||
      (selectedTab === "drafts" && !notice.isPublished);

    return (
      matchesSearch &&
      matchesCategory &&
      matchesPriority &&
      matchesAudience &&
      matchesTab
    );
  });

  const getPriorityColor = (priority) => {
    const colors = {
      high: "#ef4444",
      medium: "#f59e0b",
      low: "#10b981",
    };
    return colors[priority] || "#6b7280";
  };

  const getPriorityIcon = (priority) => {
    const icons = {
      high: <AlertTriangle size={14} />,
      medium: <Info size={14} />,
      low: <CheckCircle size={14} />,
    };
    return icons[priority] || <Info size={14} />;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      examination: <BookOpen size={16} />,
      holiday: <Calendar size={16} />,
      event: <Star size={16} />,
      meeting: <Users size={16} />,
      general: <Bell size={16} />,
      academic: <GraduationCap size={16} />,
      administrative: <Building size={16} />,
    };
    return icons[category] || <Bell size={16} />;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleTogglePin = (noticeId) => {
    setNotices((prev) =>
      prev.map((notice) =>
        notice.id === noticeId
          ? { ...notice, isPinned: !notice.isPinned }
          : notice
      )
    );
    setShowActionMenu(null);
  };

  const handleDeleteNotice = (noticeId) => {
    if (window.confirm("Are you sure you want to delete this notice?")) {
      setNotices((prev) => prev.filter((notice) => notice.id !== noticeId));
      setShowActionMenu(null);
    }
  };

  const handleDuplicateNotice = (notice) => {
    const newNotice = {
      ...notice,
      id: notices.length + 1,
      noticeId: `NOT-2026-${String(notices.length + 1).padStart(3, "0")}`,
      title: `${notice.title} (Copy)`,
      postedDate: new Date().toISOString(),
      isPublished: false,
      views: 0,
    };
    setNotices((prev) => [newNotice, ...prev]);
    setShowActionMenu(null);
  };

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    const newNotice = {
      id: notices.length + 1,
      noticeId: `NOT-2026-${String(notices.length + 1).padStart(3, "0")}`,
      ...formData,
      postedBy: "Current User",
      postedDate: new Date().toISOString(),
      isPublished: true,
      views: 0,
      attachments: [],
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    };
    setNotices((prev) => [newNotice, ...prev]);
    setShowAddModal(false);
    setFormData({
      title: "",
      content: "",
      priority: "medium",
      category: "general",
      targetAudience: "all",
      department: "All Departments",
      expiryDate: "",
      isPinned: false,
      tags: "",
    });
  };

  return (
    <div className="notice-management">
      {/* Header */}
      <div className="nm-header">
        <div>
          <h1 className="nm-title">Notice Management</h1>
          <p className="nm-subtitle">
            Create and manage notices and announcements
          </p>
        </div>
        <button className="btn-primary" onClick={() => setShowAddModal(true)}>
          <Plus size={20} /> Create Notice
        </button>
      </div>

      {/* Stats Grid */}
      <div className="nm-stats">
        <motion.div className="stat-card" whileHover={{ y: -4 }}>
          <div
            className="stat-icon"
            style={{ background: "#dbeafe", color: "#3b82f6" }}
          >
            <Bell size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{mockStats.totalNotices}</div>
            <div className="stat-label">Total Notices</div>
          </div>
        </motion.div>

        <motion.div className="stat-card" whileHover={{ y: -4 }}>
          <div
            className="stat-icon"
            style={{ background: "#dcfce7", color: "#10b981" }}
          >
            <CheckCircle size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{mockStats.activeNotices}</div>
            <div className="stat-label">Active Notices</div>
          </div>
        </motion.div>

        <motion.div className="stat-card" whileHover={{ y: -4 }}>
          <div
            className="stat-icon"
            style={{ background: "#fef3c7", color: "#f59e0b" }}
          >
            <Pin size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{mockStats.pinnedNotices}</div>
            <div className="stat-label">Pinned</div>
          </div>
        </motion.div>

        <motion.div className="stat-card" whileHover={{ y: -4 }}>
          <div
            className="stat-icon"
            style={{ background: "#e0e7ff", color: "#6366f1" }}
          >
            <Eye size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">
              {mockStats.totalViews.toLocaleString()}
            </div>
            <div className="stat-label">Total Views</div>
          </div>
          <div className="stat-trend">
            <TrendingUp size={16} />
            <span>+15%</span>
          </div>
        </motion.div>

        <motion.div className="stat-card" whileHover={{ y: -4 }}>
          <div
            className="stat-icon"
            style={{ background: "#ddd6fe", color: "#8b5cf6" }}
          >
            <Megaphone size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{mockStats.publishedThisMonth}</div>
            <div className="stat-label">This Month</div>
          </div>
        </motion.div>

        <motion.div className="stat-card" whileHover={{ y: -4 }}>
          <div
            className="stat-icon"
            style={{ background: "#fce7f3", color: "#ec4899" }}
          >
            <FileText size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{mockStats.drafts}</div>
            <div className="stat-label">Drafts</div>
          </div>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="nm-tabs">
        <button
          className={`tab ${selectedTab === "all" ? "tab--active" : ""}`}
          onClick={() => setSelectedTab("all")}
        >
          <Bell size={18} />
          All Notices ({notices.length})
        </button>
        <button
          className={`tab ${selectedTab === "pinned" ? "tab--active" : ""}`}
          onClick={() => setSelectedTab("pinned")}
        >
          <Pin size={18} />
          Pinned ({notices.filter((n) => n.isPinned).length})
        </button>
        <button
          className={`tab ${selectedTab === "published" ? "tab--active" : ""}`}
          onClick={() => setSelectedTab("published")}
        >
          <CheckCircle size={18} />
          Published ({notices.filter((n) => n.isPublished).length})
        </button>
        <button
          className={`tab ${selectedTab === "drafts" ? "tab--active" : ""}`}
          onClick={() => setSelectedTab("drafts")}
        >
          <FileText size={18} />
          Drafts ({notices.filter((n) => !n.isPublished).length})
        </button>
      </div>

      {/* Controls */}
      <div className="nm-controls">
        <div className="nm-search">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search notices by title, content, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="nm-actions">
          <div className="filter-dropdown">
            <button
              className="btn-filter"
              onClick={() => setShowFilterMenu(!showFilterMenu)}
            >
              <Filter size={18} />
              Filters
              <ChevronDown size={16} />
            </button>

            <AnimatePresence>
              {showFilterMenu && (
                <motion.div
                  className="filter-menu"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="filter-section">
                    <label>Category</label>
                    <select
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                    >
                      <option value="all">All Categories</option>
                      {categories.map((cat, index) => (
                        <option key={index} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="filter-section">
                    <label>Priority</label>
                    <select
                      value={filterPriority}
                      onChange={(e) => setFilterPriority(e.target.value)}
                    >
                      <option value="all">All Priorities</option>
                      {priorities.map((priority, index) => (
                        <option key={index} value={priority}>
                          {priority}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="filter-section">
                    <label>Audience</label>
                    <select
                      value={filterAudience}
                      onChange={(e) => setFilterAudience(e.target.value)}
                    >
                      <option value="all">All Audiences</option>
                      {audiences.map((audience, index) => (
                        <option key={index} value={audience}>
                          {audience}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="filter-actions">
                    <button
                      className="btn-clear"
                      onClick={() => {
                        setFilterCategory("all");
                        setFilterPriority("all");
                        setFilterAudience("all");
                      }}
                    >
                      Clear All
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button className="btn-secondary">
            <Download size={18} /> Export
          </button>
        </div>
      </div>

      {/* Notices List */}
      <div className="nm-list">
        {filteredNotices.map((notice) => (
          <motion.div
            key={notice.id}
            className={`notice-card ${
              notice.isPinned ? "notice-card--pinned" : ""
            }`}
            whileHover={{ x: 4 }}
            layout
          >
            {notice.isPinned && (
              <div className="notice-pin-indicator">
                <Pin size={14} />
                Pinned
              </div>
            )}

            <div className="notice-header">
              <div className="notice-info">
                <h3
                  className="notice-title"
                  onClick={() => setSelectedNotice(notice)}
                >
                  {notice.title}
                </h3>
                <div className="notice-meta-top">
                  <span className="notice-id">{notice.noticeId}</span>
                  <span className="notice-dot">•</span>
                  <span className="notice-posted">
                    Posted by {notice.postedBy}
                  </span>
                </div>
              </div>
              <div className="notice-actions">
                <div
                  className="priority-badge"
                  style={{
                    background: `${getPriorityColor(notice.priority)}20`,
                    color: getPriorityColor(notice.priority),
                  }}
                >
                  {getPriorityIcon(notice.priority)}
                  {notice.priority}
                </div>
                <div className="action-menu-wrapper">
                  <button
                    className="action-menu-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowActionMenu(
                        showActionMenu === notice.id ? null : notice.id
                      );
                    }}
                  >
                    <MoreVertical size={18} />
                  </button>

                  <AnimatePresence>
                    {showActionMenu === notice.id && (
                      <motion.div
                        className="action-menu"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button onClick={() => setSelectedNotice(notice)}>
                          <Eye size={16} /> View Details
                        </button>
                        <button onClick={() => console.log("Edit", notice.id)}>
                          <Edit3 size={16} /> Edit Notice
                        </button>
                        <button onClick={() => handleTogglePin(notice.id)}>
                          <Pin size={16} /> {notice.isPinned ? "Unpin" : "Pin"}{" "}
                          Notice
                        </button>
                        <button onClick={() => handleDuplicateNotice(notice)}>
                          <Copy size={16} /> Duplicate
                        </button>
                        <button onClick={() => console.log("Send", notice.id)}>
                          <Send size={16} /> Send Notification
                        </button>
                        <button
                          onClick={() => console.log("Archive", notice.id)}
                        >
                          <Archive size={16} /> Archive
                        </button>
                        <button
                          className="danger"
                          onClick={() => handleDeleteNotice(notice.id)}
                        >
                          <Trash2 size={16} /> Delete
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            <div className="notice-content">
              <p>
                {notice.content.substring(0, 200)}
                {notice.content.length > 200 ? "..." : ""}
              </p>
            </div>

            <div className="notice-badges">
              <span className="category-badge">
                {getCategoryIcon(notice.category)}
                {notice.category}
              </span>
              <span className="audience-badge">
                <Users size={14} />
                {notice.targetAudience}
              </span>
              {notice.department !== "All Departments" && (
                <span className="department-badge">
                  <Building size={14} />
                  {notice.department}
                </span>
              )}
            </div>

            {notice.tags.length > 0 && (
              <div className="notice-tags">
                {notice.tags.map((tag, index) => (
                  <span key={index} className="tag">
                    <Hash size={12} />
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="notice-footer">
              <div className="notice-meta">
                <div className="meta-item">
                  <Calendar size={14} />
                  <span>Posted: {formatDate(notice.postedDate)}</span>
                </div>
                <div className="meta-item">
                  <Clock size={14} />
                  <span>Expires: {formatDate(notice.expiryDate)}</span>
                </div>
                <div className="meta-item">
                  <Eye size={14} />
                  <span>{notice.views} views</span>
                </div>
                {notice.attachments.length > 0 && (
                  <div className="meta-item">
                    <FileText size={14} />
                    <span>{notice.attachments.length} attachment(s)</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}

        {filteredNotices.length === 0 && (
          <div className="empty-state">
            <Bell size={64} />
            <h3>No notices found</h3>
            <p>Try adjusting your filters or create a new notice</p>
          </div>
        )}
      </div>

      {/* Create Notice Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              className="modal modal--large"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2>Create New Notice</h2>
                <button
                  className="modal-close"
                  onClick={() => setShowAddModal(false)}
                >
                  <XCircle size={20} />
                </button>
              </div>

              <div className="modal-body">
                <div className="form-group">
                  <label>Notice Title *</label>
                  <input
                    type="text"
                    placeholder="Enter notice title"
                    value={formData.title}
                    onChange={(e) => handleFormChange("title", e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Content *</label>
                  <textarea
                    rows="6"
                    placeholder="Enter notice content..."
                    value={formData.content}
                    onChange={(e) =>
                      handleFormChange("content", e.target.value)
                    }
                  ></textarea>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        handleFormChange("category", e.target.value)
                      }
                    >
                      {categories.map((cat, index) => (
                        <option key={index} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Priority *</label>
                    <select
                      value={formData.priority}
                      onChange={(e) =>
                        handleFormChange("priority", e.target.value)
                      }
                    >
                      {priorities.map((priority, index) => (
                        <option key={index} value={priority}>
                          {priority}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Target Audience *</label>
                    <select
                      value={formData.targetAudience}
                      onChange={(e) =>
                        handleFormChange("targetAudience", e.target.value)
                      }
                    >
                      {audiences.map((audience, index) => (
                        <option key={index} value={audience}>
                          {audience}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Department</label>
                    <select
                      value={formData.department}
                      onChange={(e) =>
                        handleFormChange("department", e.target.value)
                      }
                    >
                      {departments.map((dept, index) => (
                        <option key={index} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Expiry Date *</label>
                  <input
                    type="datetime-local"
                    value={formData.expiryDate}
                    onChange={(e) =>
                      handleFormChange("expiryDate", e.target.value)
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Tags (comma-separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. important, deadline, examination"
                    value={formData.tags}
                    onChange={(e) => handleFormChange("tags", e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Attachments</label>
                  <div className="upload-area">
                    <Upload size={24} />
                    <p>Click to upload or drag and drop</p>
                    <span>PDF, DOC, JPG up to 10MB</span>
                  </div>
                </div>

                <div className="form-group-checkbox">
                  <input
                    type="checkbox"
                    id="pinNotice"
                    checked={formData.isPinned}
                    onChange={(e) =>
                      handleFormChange("isPinned", e.target.checked)
                    }
                  />
                  <label htmlFor="pinNotice">Pin this notice to the top</label>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  className="btn-secondary"
                  onClick={() => setShowAddModal(false)}
                >
                  Save as Draft
                </button>
                <button className="btn-primary" onClick={handleSubmit}>
                  <Send size={18} /> Publish Notice
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notice Detail Modal */}
      <AnimatePresence>
        {selectedNotice && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedNotice(null)}
          >
            <motion.div
              className="modal modal--large"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <div className="detail-header-content">
                  <h2>{selectedNotice.title}</h2>
                  <p>{selectedNotice.noticeId}</p>
                </div>
                <div className="detail-header-actions">
                  <button
                    className="btn-icon"
                    onClick={() => console.log("Edit")}
                  >
                    <Edit3 size={18} />
                  </button>
                  <button
                    className="btn-icon"
                    onClick={() => handleTogglePin(selectedNotice.id)}
                  >
                    <Pin size={18} />
                  </button>
                  <button
                    className="btn-icon"
                    onClick={() => console.log("Download")}
                  >
                    <Download size={18} />
                  </button>
                  <button
                    className="modal-close"
                    onClick={() => setSelectedNotice(null)}
                  >
                    <XCircle size={20} />
                  </button>
                </div>
              </div>

              <div className="modal-body">
                <div className="notice-detail-header">
                  <div className="notice-detail-badges">
                    <span
                      className="priority-badge priority-badge--large"
                      style={{
                        background: `${getPriorityColor(
                          selectedNotice.priority
                        )}20`,
                        color: getPriorityColor(selectedNotice.priority),
                      }}
                    >
                      {getPriorityIcon(selectedNotice.priority)}
                      {selectedNotice.priority} Priority
                    </span>
                    <span className="category-badge category-badge--large">
                      {getCategoryIcon(selectedNotice.category)}
                      {selectedNotice.category}
                    </span>
                    {selectedNotice.isPinned && (
                      <span className="pinned-badge">
                        <Pin size={14} />
                        Pinned
                      </span>
                    )}
                  </div>

                  <div className="notice-detail-stats">
                    <div className="stat-item">
                      <Eye size={16} />
                      <span>{selectedNotice.views} views</span>
                    </div>
                    <div className="stat-item">
                      <MessageSquare size={16} />
                      <span>0 comments</span>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Notice Content</h3>
                  <div className="notice-content-full">
                    <p>{selectedNotice.content}</p>
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Notice Information</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>Category</label>
                      <div className="detail-value">
                        {getCategoryIcon(selectedNotice.category)}
                        <span>{selectedNotice.category}</span>
                      </div>
                    </div>
                    <div className="detail-item">
                      <label>Target Audience</label>
                      <div className="detail-value">
                        <Users size={16} />
                        <span>{selectedNotice.targetAudience}</span>
                      </div>
                    </div>
                    <div className="detail-item">
                      <label>Department</label>
                      <div className="detail-value">
                        <Building size={16} />
                        <span>{selectedNotice.department}</span>
                      </div>
                    </div>
                    <div className="detail-item">
                      <label>Posted By</label>
                      <div className="detail-value">
                        <Users size={16} />
                        <span>{selectedNotice.postedBy}</span>
                      </div>
                    </div>
                    <div className="detail-item">
                      <label>Posted Date</label>
                      <div className="detail-value">
                        <Calendar size={16} />
                        <span>{formatDateTime(selectedNotice.postedDate)}</span>
                      </div>
                    </div>
                    <div className="detail-item">
                      <label>Expiry Date</label>
                      <div className="detail-value">
                        <Clock size={16} />
                        <span>{formatDateTime(selectedNotice.expiryDate)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedNotice.tags.length > 0 && (
                  <div className="detail-section">
                    <h3>Tags</h3>
                    <div className="notice-tags">
                      {selectedNotice.tags.map((tag, index) => (
                        <span key={index} className="tag tag--large">
                          <Hash size={14} />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedNotice.attachments.length > 0 && (
                  <div className="detail-section">
                    <h3>Attachments ({selectedNotice.attachments.length})</h3>
                    <div className="attachments-list">
                      {selectedNotice.attachments.map((attachment, index) => (
                        <div key={index} className="attachment-item">
                          <FileText size={20} />
                          <div className="attachment-info">
                            <span className="attachment-name">
                              {attachment}
                            </span>
                            <span className="attachment-size">2.4 MB</span>
                          </div>
                          <button className="btn-link">
                            <Download size={14} /> Download
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="detail-section">
                  <h3>Activity & Engagement</h3>
                  <div className="activity-stats">
                    <div className="activity-item">
                      <div
                        className="activity-icon"
                        style={{ background: "#dbeafe", color: "#3b82f6" }}
                      >
                        <Eye size={20} />
                      </div>
                      <div className="activity-content">
                        <div className="activity-value">
                          {selectedNotice.views}
                        </div>
                        <div className="activity-label">Total Views</div>
                      </div>
                    </div>
                    <div className="activity-item">
                      <div
                        className="activity-icon"
                        style={{ background: "#dcfce7", color: "#10b981" }}
                      >
                        <CheckCircle size={20} />
                      </div>
                      <div className="activity-content">
                        <div className="activity-value">0</div>
                        <div className="activity-label">Acknowledged</div>
                      </div>
                    </div>
                    <div className="activity-item">
                      <div
                        className="activity-icon"
                        style={{ background: "#fef3c7", color: "#f59e0b" }}
                      >
                        <MessageSquare size={20} />
                      </div>
                      <div className="activity-content">
                        <div className="activity-value">0</div>
                        <div className="activity-label">Comments</div>
                      </div>
                    </div>
                    <div className="activity-item">
                      <div
                        className="activity-icon"
                        style={{ background: "#e0e7ff", color: "#6366f1" }}
                      >
                        <Send size={20} />
                      </div>
                      <div className="activity-content">
                        <div className="activity-value">0</div>
                        <div className="activity-label">Shared</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  className="btn-secondary"
                  onClick={() => setSelectedNotice(null)}
                >
                  Close
                </button>
                <button className="btn-secondary">
                  <Edit3 size={18} /> Edit Notice
                </button>
                <button className="btn-primary">
                  <Send size={18} /> Send Notification
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
