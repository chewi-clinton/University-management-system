import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/admin-pages/NoticeManagement.css";
import { adminService } from "../services/api/adminService";
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
  FileText,
  Download,
  Hash,
  AlertTriangle,
  Info,
  Star,
  BookOpen,
  GraduationCap,
  Loader,
  Megaphone,
  TrendingUp,
  MessageSquare,
} from "lucide-react";

const priorities = ["high", "medium", "low"];
const audiences = ["all", "students", "faculty", "staff"];

export default function NoticeManagement() {
  const [selectedTab, setSelectedTab] = useState("all");
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterAudience, setFilterAudience] = useState("all");
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [notices, setNotices] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    priority: "medium",
    target_audience: "all",
    department_id: "",
    expiry_date: "",
    is_pinned: false,
  });

  // Load initial data
  useEffect(() => {
    loadNotices();
    loadDepartments();
  }, []);

  const loadNotices = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await adminService.getAllNotices();
      if (result.success) {
        setNotices(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error("Error loading notices:", err);
      setError("Failed to load notices");
    } finally {
      setLoading(false);
    }
  };

  const loadDepartments = async () => {
    try {
      const result = await adminService.getDepartments();
      if (result.success) {
        setDepartments(result.data);
      }
    } catch (err) {
      console.error("Error loading departments:", err);
    }
  };

  // Calculate stats from loaded notices
  const calculateStats = () => {
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();

    return {
      totalNotices: notices.length,
      activeNotices: notices.filter((n) => {
        if (!n.expiry_date) return true;
        return new Date(n.expiry_date) > now;
      }).length,
      pinnedNotices: notices.filter((n) => n.is_pinned).length,
      totalViews: notices.reduce((sum, n) => sum + (n.views || 0), 0),
      publishedThisMonth: notices.filter((n) => {
        const postDate = new Date(n.post_date);
        return (
          postDate.getMonth() === thisMonth &&
          postDate.getFullYear() === thisYear
        );
      }).length,
      drafts: 0,
    };
  };

  const stats = calculateStats();

  // Filter notices
  const filteredNotices = notices.filter((notice) => {
    const matchesSearch =
      notice.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notice.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notice.notice_id
        ?.toString()
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    const matchesPriority =
      filterPriority === "all" || notice.priority === filterPriority;
    const matchesAudience =
      filterAudience === "all" || notice.target_audience === filterAudience;

    const matchesTab =
      selectedTab === "all" ||
      (selectedTab === "pinned" && notice.is_pinned) ||
      (selectedTab === "published" && notice.is_published);

    return matchesSearch && matchesPriority && matchesAudience && matchesTab;
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

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleTogglePin = async (noticeId) => {
    try {
      const notice = notices.find((n) => n.notice_id === noticeId);
      const result = await adminService.updateNotice(noticeId, {
        is_pinned: !notice.is_pinned,
      });

      if (result.success) {
        setNotices((prev) =>
          prev.map((n) =>
            n.notice_id === noticeId ? { ...n, is_pinned: !n.is_pinned } : n
          )
        );
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (err) {
      console.error("Error toggling pin:", err);
      alert("Failed to update notice");
    }
    setShowActionMenu(null);
  };

  const handleDeleteNotice = async (noticeId) => {
    if (window.confirm("Are you sure you want to delete this notice?")) {
      try {
        const result = await adminService.deleteNotice(noticeId);
        if (result.success) {
          setNotices((prev) => prev.filter((n) => n.notice_id !== noticeId));
          if (selectedNotice?.notice_id === noticeId) {
            setSelectedNotice(null);
          }
        } else {
          alert(`Error: ${result.error}`);
        }
      } catch (err) {
        console.error("Error deleting notice:", err);
        alert("Failed to delete notice");
      }
    }
    setShowActionMenu(null);
  };

  const handleEditNotice = (notice) => {
    setFormData({
      title: notice.title,
      content: notice.content,
      priority: notice.priority,
      target_audience: notice.target_audience,
      department_id: notice.department?.department_id || "",
      expiry_date: notice.expiry_date ? notice.expiry_date.split("T")[0] : "",
      is_pinned: notice.is_pinned,
    });
    setSelectedNotice(notice);
    setShowEditModal(true);
    setShowActionMenu(null);
  };

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      setSubmitting(true);

      const submitData = {
        title: formData.title,
        content: formData.content,
        priority: formData.priority,
        target_audience: formData.target_audience,
        department_id: formData.department_id || null,
        expiry_date: formData.expiry_date || null,
        is_pinned: formData.is_pinned,
      };

      const result = await adminService.createNotice(submitData);

      if (result.success) {
        setNotices((prev) => [result.data, ...prev]);
        setShowAddModal(false);
        resetForm();
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (err) {
      console.error("Error creating notice:", err);
      alert("Failed to create notice");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      setSubmitting(true);

      const updateData = {
        title: formData.title,
        content: formData.content,
        priority: formData.priority,
        target_audience: formData.target_audience,
        department_id: formData.department_id || null,
        expiry_date: formData.expiry_date || null,
        is_pinned: formData.is_pinned,
      };

      const result = await adminService.updateNotice(
        selectedNotice.notice_id,
        updateData
      );

      if (result.success) {
        setNotices((prev) =>
          prev.map((n) =>
            n.notice_id === selectedNotice.notice_id ? result.data : n
          )
        );
        setShowEditModal(false);
        setSelectedNotice(null);
        resetForm();
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (err) {
      console.error("Error updating notice:", err);
      alert("Failed to update notice");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      priority: "medium",
      target_audience: "all",
      department_id: "",
      expiry_date: "",
      is_pinned: false,
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Loader className="loading-spinner" size={48} />
        <p>Loading notices...</p>
      </div>
    );
  }

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

      {error && (
        <div className="error-banner">
          <AlertCircle size={20} />
          <span>{error}</span>
          <button onClick={() => setError(null)}>
            <XCircle size={16} />
          </button>
        </div>
      )}

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
            <div className="stat-value">{stats.totalNotices}</div>
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
            <div className="stat-value">{stats.activeNotices}</div>
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
            <div className="stat-value">{stats.pinnedNotices}</div>
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
              {stats.totalViews.toLocaleString()}
            </div>
            <div className="stat-label">Total Views</div>
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
            <div className="stat-value">{stats.publishedThisMonth}</div>
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
            <div className="stat-value">{stats.drafts}</div>
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
          Pinned ({notices.filter((n) => n.is_pinned).length})
        </button>
        <button
          className={`tab ${selectedTab === "published" ? "tab--active" : ""}`}
          onClick={() => setSelectedTab("published")}
        >
          <CheckCircle size={18} />
          Published ({notices.length})
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
                    <label>Priority</label>
                    <select
                      value={filterPriority}
                      onChange={(e) => setFilterPriority(e.target.value)}
                    >
                      <option value="all">All Priorities</option>
                      {priorities.map((priority) => (
                        <option key={priority} value={priority}>
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
                      {audiences.map((audience) => (
                        <option key={audience} value={audience}>
                          {audience}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="filter-actions">
                    <button
                      className="btn-clear"
                      onClick={() => {
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

          <button className="btn-secondary" onClick={loadNotices}>
            <Download size={18} /> Refresh
          </button>
        </div>
      </div>

      {/* Notices List */}
      <div className="nm-list">
        {filteredNotices.map((notice) => (
          <motion.div
            key={notice.notice_id}
            className={`notice-card ${
              notice.is_pinned ? "notice-card--pinned" : ""
            }`}
            whileHover={{ x: 4 }}
            layout
          >
            {notice.is_pinned && (
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
                  <span className="notice-id">#{notice.notice_id}</span>
                  <span className="notice-dot">•</span>
                  <span className="notice-posted">
                    Posted by {notice.posted_by_user?.first_name || "Admin"}{" "}
                    {notice.posted_by_user?.last_name || ""}
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
                        showActionMenu === notice.notice_id
                          ? null
                          : notice.notice_id
                      );
                    }}
                  >
                    <MoreVertical size={18} />
                  </button>

                  <AnimatePresence>
                    {showActionMenu === notice.notice_id && (
                      <motion.div
                        className="action-menu"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => {
                            setSelectedNotice(notice);
                            setShowActionMenu(null);
                          }}
                        >
                          <Eye size={16} /> View Details
                        </button>
                        <button onClick={() => handleEditNotice(notice)}>
                          <Edit3 size={16} /> Edit Notice
                        </button>
                        <button
                          onClick={() => handleTogglePin(notice.notice_id)}
                        >
                          <Pin size={16} /> {notice.is_pinned ? "Unpin" : "Pin"}{" "}
                          Notice
                        </button>
                        <button
                          className="danger"
                          onClick={() => handleDeleteNotice(notice.notice_id)}
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
              <span className="audience-badge">
                <Users size={14} />
                {notice.target_audience}
              </span>
              {notice.department && (
                <span className="department-badge">
                  <Building size={14} />
                  {notice.department.department_name}
                </span>
              )}
            </div>

            <div className="notice-footer">
              <div className="notice-meta">
                <div className="meta-item">
                  <Calendar size={14} />
                  <span>Posted: {formatDate(notice.post_date)}</span>
                </div>
                {notice.expiry_date && (
                  <div className="meta-item">
                    <Clock size={14} />
                    <span>Expires: {formatDate(notice.expiry_date)}</span>
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

      {/* Create/Edit Notice Modal */}
      <AnimatePresence>
        {(showAddModal || showEditModal) && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setShowAddModal(false);
              setShowEditModal(false);
            }}
          >
            <motion.div
              className="modal modal--large"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2>{showEditModal ? "Edit Notice" : "Create New Notice"}</h2>
                <button
                  className="modal-close"
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                  }}
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
                    <label>Priority *</label>
                    <select
                      value={formData.priority}
                      onChange={(e) =>
                        handleFormChange("priority", e.target.value)
                      }
                    >
                      {priorities.map((priority) => (
                        <option key={priority} value={priority}>
                          {priority}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Target Audience *</label>
                    <select
                      value={formData.target_audience}
                      onChange={(e) =>
                        handleFormChange("target_audience", e.target.value)
                      }
                    >
                      {audiences.map((audience) => (
                        <option key={audience} value={audience}>
                          {audience}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Department (Optional)</label>
                    <select
                      value={formData.department_id}
                      onChange={(e) =>
                        handleFormChange("department_id", e.target.value)
                      }
                    >
                      <option value="">All Departments</option>
                      {departments.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                          {dept.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Expiry Date (Optional)</label>
                    <input
                      type="date"
                      value={formData.expiry_date}
                      onChange={(e) =>
                        handleFormChange("expiry_date", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="form-group-checkbox">
                  <input
                    type="checkbox"
                    id="pinNotice"
                    checked={formData.is_pinned}
                    onChange={(e) =>
                      handleFormChange("is_pinned", e.target.checked)
                    }
                  />
                  <label htmlFor="pinNotice">Pin this notice to the top</label>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  className="btn-secondary"
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="btn-primary"
                  onClick={showEditModal ? handleUpdate : handleSubmit}
                  disabled={submitting}
                >
                  {submitting ? (
                    <Loader className="spinning" size={18} />
                  ) : showEditModal ? (
                    <Edit3 size={18} />
                  ) : (
                    <Send size={18} />
                  )}
                  {submitting
                    ? showEditModal
                      ? "Updating..."
                      : "Publishing..."
                    : showEditModal
                    ? "Update Notice"
                    : "Publish Notice"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notice Detail Modal */}
      <AnimatePresence>
        {selectedNotice && !showEditModal && (
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
                  <p>#{selectedNotice.notice_id}</p>
                </div>
                <div className="detail-header-actions">
                  <button
                    className="btn-icon"
                    onClick={() => handleEditNotice(selectedNotice)}
                  >
                    <Edit3 size={18} />
                  </button>
                  <button
                    className="btn-icon"
                    onClick={() => handleTogglePin(selectedNotice.notice_id)}
                  >
                    <Pin size={18} />
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
                    {selectedNotice.is_pinned && (
                      <span className="pinned-badge">
                        <Pin size={14} />
                        Pinned
                      </span>
                    )}
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
                      <label>Target Audience</label>
                      <div className="detail-value">
                        <Users size={16} />
                        <span>{selectedNotice.target_audience}</span>
                      </div>
                    </div>
                    <div className="detail-item">
                      <label>Department</label>
                      <div className="detail-value">
                        <Building size={16} />
                        <span>
                          {selectedNotice.department?.department_name ||
                            "All Departments"}
                        </span>
                      </div>
                    </div>
                    <div className="detail-item">
                      <label>Posted By</label>
                      <div className="detail-value">
                        <Users size={16} />
                        <span>
                          {selectedNotice.posted_by_user?.first_name || "Admin"}{" "}
                          {selectedNotice.posted_by_user?.last_name || ""}
                        </span>
                      </div>
                    </div>
                    <div className="detail-item">
                      <label>Posted Date</label>
                      <div className="detail-value">
                        <Calendar size={16} />
                        <span>{formatDateTime(selectedNotice.post_date)}</span>
                      </div>
                    </div>
                    {selectedNotice.expiry_date && (
                      <div className="detail-item">
                        <label>Expiry Date</label>
                        <div className="detail-value">
                          <Clock size={16} />
                          <span>
                            {formatDateTime(selectedNotice.expiry_date)}
                          </span>
                        </div>
                      </div>
                    )}
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
                <button
                  className="btn-secondary"
                  onClick={() => handleEditNotice(selectedNotice)}
                >
                  <Edit3 size={18} /> Edit Notice
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
