import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { adminService } from "../services/api/adminService";
import "../styles/admin-pages/AdmissionManagement.css";
import {
  Users,
  UserPlus,
  Mail,
  Phone,
  Calendar,
  MapPin,
  FileText,
  Search,
  Filter,
  ChevronDown,
  MoreVertical,
  Eye,
  Check,
  X,
  Clock,
  AlertCircle,
  TrendingUp,
  UserCheck,
  UserX,
  Send,
  Download,
  Upload,
  Edit3,
  Trash2,
  Star,
  MessageSquare,
  GraduationCap,
  Building,
  DollarSign,
  CheckCircle,
  XCircle,
  ArrowRight,
  BarChart3,
  PieChart,
  Activity,
  ExternalLink,
  RefreshCw,
  Archive,
  Bell,
  Hash,
  Tag,
  Loader as RefreshCwIcon,
} from "lucide-react";

const sources = [
  "website",
  "referral",
  "social-media",
  "email-campaign",
  "walk-in",
];
const priorities = ["high", "medium", "low"];

export default function AdmissionManagement() {
  // State management
  const [selectedTab, setSelectedTab] = useState("inquiries");
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterProgram, setFilterProgram] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  // Data state
  const [inquiries, setInquiries] = useState([]);
  const [applications, setApplications] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [stats, setStats] = useState({
    totalInquiries: 0,
    newInquiries: 0,
    totalApplications: 0,
    acceptanceRate: 0,
    pendingReviews: 0,
    interviewsScheduled: 0,
  });

  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    date_of_birth: "",
    program_interest: "",
    source: "website",
    priority: "medium",
    address: "",
    notes: "",
  });

  // Load initial data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, programsRes, adminsRes, inquiriesRes, applicationsRes] =
        await Promise.all([
          adminService.getAdmissionStatistics(),
          adminService.getPrograms(),
          adminService.getAdminsForAssignment(),
          adminService.getAdmissionInquiries(),
          adminService.getApplicants(),
        ]);

      if (statsRes.success) setStats(statsRes.data);
      if (programsRes.success) setPrograms(programsRes.data);
      if (adminsRes.success) setAdmins(adminsRes.data);
      if (inquiriesRes.success) setInquiries(inquiriesRes.data);
      if (applicationsRes.success) setApplications(applicationsRes.data);

      setError(null);
    } catch (err) {
      console.error("Error loading data:", err);
      setError("Failed to load admission data");
    } finally {
      setLoading(false);
    }
  };

  const loadInquiries = async () => {
    const filters = {
      search: searchQuery,
      status: filterStatus,
      program: filterProgram,
      priority: filterPriority,
    };

    const result = await adminService.getAdmissionInquiries(filters);
    if (result.success) {
      setInquiries(result.data);
    }
  };

  const loadApplications = async () => {
    const filters = {
      search: searchQuery,
      status: filterStatus,
      program: filterProgram,
    };

    const result = await adminService.getApplicants(filters);
    if (result.success) {
      setApplications(result.data);
    }
  };

  // Reload on filter changes
  useEffect(() => {
    if (selectedTab === "inquiries") {
      loadInquiries();
    } else if (selectedTab === "applications") {
      loadApplications();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, filterStatus, filterProgram, filterPriority, selectedTab]);

  const handleCreateInquiry = async (e) => {
    e.preventDefault();

    const result = await adminService.createAdmissionInquiry(formData);

    if (result.success) {
      setShowAddModal(false);
      loadInquiries();
      loadData();
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        date_of_birth: "",
        program_interest: "",
        source: "website",
        priority: "medium",
        address: "",
        notes: "",
      });
    } else {
      alert(result.error || "Failed to create inquiry");
    }
  };

  const handleUpdateInquiryStatus = async (inquiryId, newStatus) => {
    const result = await adminService.updateAdmissionInquiry(inquiryId, {
      status: newStatus,
    });

    if (result.success) {
      loadInquiries();
      loadData();
    } else {
      alert(result.error || "Failed to update status");
    }

    setShowActionMenu(null);
  };

  const handleUpdateApplicationStatus = async (appId, newStatus) => {
    const result = await adminService.updateApplicant(appId, {
      status: newStatus,
    });

    if (result.success) {
      loadApplications();
      loadData();
    } else {
      alert(result.error || "Failed to update status");
    }

    setShowActionMenu(null);
  };

  const handleDeleteInquiry = async (inquiryId) => {
    if (window.confirm("Are you sure you want to delete this inquiry?")) {
      const result = await adminService.deleteAdmissionInquiry(inquiryId);

      if (result.success) {
        loadInquiries();
        loadData();
      } else {
        alert(result.error || "Failed to delete inquiry");
      }
    }

    setShowActionMenu(null);
  };

  const handleAcceptApplication = async (appId) => {
    if (
      window.confirm(
        "Accept this application? This will create a student record."
      )
    ) {
      const result = await adminService.acceptApplicant(appId);

      if (result.success) {
        alert("Application accepted successfully! Student record created.");
        loadApplications();
        loadData();
      } else {
        alert(result.error || "Failed to accept application");
      }
    }
  };

  const handleSendEmail = (email) => {
    window.location.href = `mailto:${email}`;
  };

  const getStatusColor = (status) => {
    const colors = {
      new: "#3b82f6",
      contacted: "#f59e0b",
      "in-progress": "#8b5cf6",
      converted: "#10b981",
      closed: "#6b7280",
      pending: "#f59e0b",
      "under-review": "#3b82f6",
      accepted: "#10b981",
      rejected: "#ef4444",
      waitlisted: "#f59e0b",
    };
    return colors[status] || "#6b7280";
  };

  const getStatusIcon = (status) => {
    const icons = {
      new: <AlertCircle size={14} />,
      contacted: <MessageSquare size={14} />,
      "in-progress": <Clock size={14} />,
      converted: <CheckCircle size={14} />,
      closed: <XCircle size={14} />,
      pending: <Clock size={14} />,
      "under-review": <Eye size={14} />,
      accepted: <CheckCircle size={14} />,
      rejected: <XCircle size={14} />,
      waitlisted: <AlertCircle size={14} />,
    };
    return icons[status] || <AlertCircle size={14} />;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: "#ef4444",
      medium: "#f59e0b",
      low: "#10b981",
    };
    return colors[priority] || "#6b7280";
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

  if (loading) {
    return (
      <div className="admission-management">
        <div className="loading-container">
          <RefreshCwIcon className="loading-spinner" size={48} />
          <p>Loading admission data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admission-management">
      {/* Header */}
      <div className="am-header">
        <div>
          <h1 className="am-title">Admission Management</h1>
          <p className="am-subtitle">
            Manage admission inquiries and applications
          </p>
        </div>
        <button className="btn-primary" onClick={() => setShowAddModal(true)}>
          <UserPlus size={20} /> Add Inquiry
        </button>
      </div>

      {/* Stats Grid */}
      <div className="am-stats">
        <motion.div className="stat-card" whileHover={{ y: -4 }}>
          <div
            className="stat-icon"
            style={{ background: "#dbeafe", color: "#3b82f6" }}
          >
            <Users size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalInquiries}</div>
            <div className="stat-label">Total Inquiries</div>
          </div>
        </motion.div>

        <motion.div
          className="stat-card stat-card--highlight"
          whileHover={{ y: -4 }}
        >
          <div
            className="stat-icon"
            style={{ background: "#dcfce7", color: "#10b981" }}
          >
            <AlertCircle size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.newInquiries}</div>
            <div className="stat-label">New Inquiries</div>
          </div>
        </motion.div>

        <motion.div className="stat-card" whileHover={{ y: -4 }}>
          <div
            className="stat-icon"
            style={{ background: "#fef3c7", color: "#f59e0b" }}
          >
            <FileText size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalApplications}</div>
            <div className="stat-label">Applications</div>
          </div>
        </motion.div>

        <motion.div className="stat-card" whileHover={{ y: -4 }}>
          <div
            className="stat-icon"
            style={{ background: "#e0e7ff", color: "#6366f1" }}
          >
            <UserCheck size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.acceptanceRate}%</div>
            <div className="stat-label">Acceptance Rate</div>
          </div>
        </motion.div>

        <motion.div className="stat-card" whileHover={{ y: -4 }}>
          <div
            className="stat-icon"
            style={{ background: "#fce7f3", color: "#ec4899" }}
          >
            <Clock size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.pendingReviews}</div>
            <div className="stat-label">Pending Reviews</div>
          </div>
        </motion.div>

        <motion.div className="stat-card" whileHover={{ y: -4 }}>
          <div
            className="stat-icon"
            style={{ background: "#ddd6fe", color: "#8b5cf6" }}
          >
            <Calendar size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.interviewsScheduled}</div>
            <div className="stat-label">Interviews Scheduled</div>
          </div>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="am-tabs">
        <button
          className={`tab ${selectedTab === "inquiries" ? "tab--active" : ""}`}
          onClick={() => setSelectedTab("inquiries")}
        >
          <Users size={18} />
          Inquiries ({inquiries.length})
        </button>
        <button
          className={`tab ${
            selectedTab === "applications" ? "tab--active" : ""
          }`}
          onClick={() => setSelectedTab("applications")}
        >
          <FileText size={18} />
          Applications ({applications.length})
        </button>
        <button
          className={`tab ${selectedTab === "analytics" ? "tab--active" : ""}`}
          onClick={() => setSelectedTab("analytics")}
        >
          <BarChart3 size={18} />
          Analytics
        </button>
      </div>

      {/* Controls */}
      <div className="am-controls">
        <div className="am-search">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search by name, email, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="am-actions">
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
                    <label>Status</label>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                    >
                      <option value="all">All Statuses</option>
                      {selectedTab === "inquiries" ? (
                        <>
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="in-progress">In Progress</option>
                          <option value="converted">Converted</option>
                          <option value="closed">Closed</option>
                        </>
                      ) : (
                        <>
                          <option value="pending">Pending</option>
                          <option value="under-review">Under Review</option>
                          <option value="accepted">Accepted</option>
                          <option value="rejected">Rejected</option>
                          <option value="waitlisted">Waitlisted</option>
                        </>
                      )}
                    </select>
                  </div>

                  <div className="filter-section">
                    <label>Program</label>
                    <select
                      value={filterProgram}
                      onChange={(e) => setFilterProgram(e.target.value)}
                    >
                      <option value="all">All Programs</option>
                      {programs.map((program) => (
                        <option key={program.id} value={program.name}>
                          {program.name}
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
                      {priorities.map((p) => (
                        <option key={p} value={p}>
                          {p.charAt(0).toUpperCase() + p.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="filter-actions">
                    <button
                      className="btn-clear"
                      onClick={() => {
                        setFilterStatus("all");
                        setFilterProgram("all");
                        setFilterPriority("all");
                      }}
                    >
                      Clear All
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button className="btn-secondary" onClick={loadData}>
            <RefreshCwIcon size={18} /> Refresh
          </button>
        </div>
      </div>

      {/* Inquiries List */}
      {selectedTab === "inquiries" && (
        <div className="am-list">
          {inquiries.length === 0 ? (
            <div className="empty-state">
              <Users size={64} />
              <h3>No inquiries found</h3>
              <p>Try adjusting your filters or search criteria</p>
            </div>
          ) : (
            inquiries.map((inquiry) => (
              <motion.div
                key={inquiry.inquiry_id}
                className="inquiry-card"
                whileHover={{ x: 4 }}
                layout
              >
                <div className="inquiry-header">
                  <div className="inquiry-info">
                    <h3
                      className="inquiry-name"
                      onClick={() => setSelectedInquiry(inquiry)}
                    >
                      {inquiry.first_name} {inquiry.last_name}
                    </h3>
                    <span className="inquiry-number">
                      #{inquiry.inquiry_id}
                    </span>
                  </div>
                  <div className="inquiry-actions">
                    <span
                      className="status-badge"
                      style={{
                        background: `${getStatusColor(inquiry.status)}20`,
                        color: getStatusColor(inquiry.status),
                      }}
                    >
                      {getStatusIcon(inquiry.status)}
                      {inquiry.status.replace("-", " ")}
                    </span>
                    <div className="action-menu-wrapper">
                      <button
                        className="action-menu-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowActionMenu(
                            showActionMenu === inquiry.inquiry_id
                              ? null
                              : inquiry.inquiry_id
                          );
                        }}
                      >
                        <MoreVertical size={18} />
                      </button>

                      <AnimatePresence>
                        {showActionMenu === inquiry.inquiry_id && (
                          <motion.div
                            className="action-menu"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button onClick={() => setSelectedInquiry(inquiry)}>
                              <Eye size={16} /> View Details
                            </button>
                            <button
                              onClick={() => handleSendEmail(inquiry.email)}
                            >
                              <Send size={16} /> Send Email
                            </button>
                            <button
                              onClick={() =>
                                handleUpdateInquiryStatus(
                                  inquiry.inquiry_id,
                                  "contacted"
                                )
                              }
                            >
                              <MessageSquare size={16} /> Mark Contacted
                            </button>
                            <button
                              onClick={() =>
                                handleUpdateInquiryStatus(
                                  inquiry.inquiry_id,
                                  "converted"
                                )
                              }
                            >
                              <CheckCircle size={16} /> Convert to Application
                            </button>
                            <button
                              className="danger"
                              onClick={() =>
                                handleDeleteInquiry(inquiry.inquiry_id)
                              }
                            >
                              <Trash2 size={16} /> Delete
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>

                <div className="inquiry-details">
                  <div className="detail-item">
                    <Mail size={14} />
                    <span>{inquiry.email}</span>
                  </div>
                  <div className="detail-item">
                    <Phone size={14} />
                    <span>{inquiry.phone}</span>
                  </div>
                  <div className="detail-item">
                    <GraduationCap size={14} />
                    <span>{inquiry.program_interest}</span>
                  </div>
                  <div className="detail-item">
                    <Calendar size={14} />
                    <span>Inquiry: {formatDate(inquiry.inquiry_date)}</span>
                  </div>
                </div>

                <div className="inquiry-meta">
                  <span className="source-badge">
                    <Activity size={14} />
                    {inquiry.source?.replace("-", " ")}
                  </span>
                  {inquiry.priority && (
                    <span
                      className="priority-badge"
                      style={{
                        background: `${getPriorityColor(inquiry.priority)}20`,
                        color: getPriorityColor(inquiry.priority),
                      }}
                    >
                      {inquiry.priority}
                    </span>
                  )}
                </div>

                {inquiry.notes && (
                  <div className="inquiry-notes">
                    <MessageSquare size={14} />
                    <span>{inquiry.notes}</span>
                  </div>
                )}
              </motion.div>
            ))
          )}
        </div>
      )}

      {/* Applications List */}
      {selectedTab === "applications" && (
        <div className="am-list">
          {applications.length === 0 ? (
            <div className="empty-state">
              <FileText size={64} />
              <h3>No applications found</h3>
              <p>Try adjusting your filters or search criteria</p>
            </div>
          ) : (
            applications.map((app) => (
              <motion.div
                key={app.applicant_id}
                className="application-card"
                whileHover={{ x: 4 }}
                layout
              >
                <div className="app-header">
                  <div className="app-info">
                    <h3
                      className="app-name"
                      onClick={() => setSelectedApplication(app)}
                    >
                      {app.inquiry?.first_name} {app.inquiry?.last_name}
                    </h3>
                    <span className="app-number">{app.application_number}</span>
                  </div>
                  <div className="app-actions">
                    <span
                      className="status-badge"
                      style={{
                        background: `${getStatusColor(app.status)}20`,
                        color: getStatusColor(app.status),
                      }}
                    >
                      {getStatusIcon(app.status)}
                      {app.status.replace("-", " ")}
                    </span>
                    <div className="action-menu-wrapper">
                      <button
                        className="action-menu-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowActionMenu(
                            showActionMenu === `app-${app.applicant_id}`
                              ? null
                              : `app-${app.applicant_id}`
                          );
                        }}
                      >
                        <MoreVertical size={18} />
                      </button>

                      <AnimatePresence>
                        {showActionMenu === `app-${app.applicant_id}` && (
                          <motion.div
                            className="action-menu"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button onClick={() => setSelectedApplication(app)}>
                              <Eye size={16} /> View Details
                            </button>
                            <button
                              onClick={() =>
                                handleSendEmail(app.inquiry?.email)
                              }
                            >
                              <Send size={16} /> Send Email
                            </button>
                            <button
                              onClick={() =>
                                handleAcceptApplication(app.applicant_id)
                              }
                            >
                              <CheckCircle size={16} /> Accept
                            </button>
                            <button
                              onClick={() =>
                                handleUpdateApplicationStatus(
                                  app.applicant_id,
                                  "rejected"
                                )
                              }
                            >
                              <XCircle size={16} /> Reject
                            </button>
                            <button
                              onClick={() =>
                                handleUpdateApplicationStatus(
                                  app.applicant_id,
                                  "waitlisted"
                                )
                              }
                            >
                              <Clock size={16} /> Waitlist
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>

                <div className="app-details">
                  <div className="detail-item">
                    <Mail size={14} />
                    <span>{app.inquiry?.email}</span>
                  </div>
                  <div className="detail-item">
                    <GraduationCap size={14} />
                    <span>{app.program?.program_name}</span>
                  </div>
                  <div className="detail-item">
                    <Calendar size={14} />
                    <span>Applied: {formatDate(app.applied_date)}</span>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}

      {/* Analytics Tab */}
      {selectedTab === "analytics" && (
        <div className="analytics-section">
          <div className="empty-state">
            <BarChart3 size={64} />
            <h3>Analytics Dashboard</h3>
            <p>Analytics features coming soon</p>
          </div>
        </div>
      )}

      {/* Add Inquiry Modal */}
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
                <h2>Add New Inquiry</h2>
                <button
                  className="modal-close"
                  onClick={() => setShowAddModal(false)}
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleCreateInquiry}>
                <div className="modal-body">
                  <div className="form-row">
                    <div className="form-group">
                      <label>First Name *</label>
                      <input
                        type="text"
                        placeholder="Enter first name"
                        value={formData.first_name}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            first_name: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Last Name *</label>
                      <input
                        type="text"
                        placeholder="Enter last name"
                        value={formData.last_name}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            last_name: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Email *</label>
                      <input
                        type="email"
                        placeholder="email@example.com"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Phone *</label>
                      <input
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Date of Birth</label>
                    <input
                      type="date"
                      value={formData.date_of_birth}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          date_of_birth: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Program of Interest *</label>
                      <select
                        value={formData.program_interest}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            program_interest: e.target.value,
                          })
                        }
                        required
                      >
                        <option value="">Select Program</option>
                        {programs.map((program) => (
                          <option key={program.id} value={program.name}>
                            {program.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Priority</label>
                      <select
                        value={formData.priority}
                        onChange={(e) =>
                          setFormData({ ...formData, priority: e.target.value })
                        }
                      >
                        {priorities.map((p) => (
                          <option key={p} value={p}>
                            {p.charAt(0).toUpperCase() + p.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Source</label>
                    <select
                      value={formData.source}
                      onChange={(e) =>
                        setFormData({ ...formData, source: e.target.value })
                      }
                    >
                      {sources.map((s) => (
                        <option key={s} value={s}>
                          {s.charAt(0).toUpperCase() +
                            s.slice(1).replace("-", " ")}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Address</label>
                    <input
                      type="text"
                      placeholder="Enter full address"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>Notes</label>
                    <textarea
                      rows="4"
                      placeholder="Add any additional notes..."
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData({ ...formData, notes: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    <UserPlus size={18} /> Add Inquiry
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Inquiry Detail Modal */}
      <AnimatePresence>
        {selectedInquiry && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedInquiry(null)}
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
                  <h2>
                    {selectedInquiry.first_name} {selectedInquiry.last_name}
                  </h2>
                  <p>Inquiry #{selectedInquiry.inquiry_id}</p>
                </div>
                <div className="detail-header-actions">
                  <button
                    className="btn-icon"
                    onClick={() => handleSendEmail(selectedInquiry.email)}
                  >
                    <Send size={18} />
                  </button>
                  <button
                    className="modal-close"
                    onClick={() => setSelectedInquiry(null)}
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="modal-body">
                <div className="detail-section">
                  <h3>Status</h3>
                  <div className="status-control">
                    <span
                      className="status-badge status-badge--large"
                      style={{
                        background: `${getStatusColor(
                          selectedInquiry.status
                        )}20`,
                        color: getStatusColor(selectedInquiry.status),
                      }}
                    >
                      {getStatusIcon(selectedInquiry.status)}
                      {selectedInquiry.status.replace("-", " ")}
                    </span>
                    <select
                      className="status-select"
                      value={selectedInquiry.status}
                      onChange={(e) =>
                        handleUpdateInquiryStatus(
                          selectedInquiry.inquiry_id,
                          e.target.value
                        )
                      }
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="in-progress">In Progress</option>
                      <option value="converted">Converted</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Contact Information</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>Email</label>
                      <div className="detail-value">
                        <Mail size={16} />
                        <span>{selectedInquiry.email}</span>
                        <button
                          className="btn-link"
                          onClick={() => handleSendEmail(selectedInquiry.email)}
                        >
                          <ExternalLink size={14} />
                        </button>
                      </div>
                    </div>
                    <div className="detail-item">
                      <label>Phone</label>
                      <div className="detail-value">
                        <Phone size={16} />
                        <span>{selectedInquiry.phone}</span>
                      </div>
                    </div>
                    <div className="detail-item">
                      <label>Date of Birth</label>
                      <div className="detail-value">
                        <Calendar size={16} />
                        <span>{formatDate(selectedInquiry.date_of_birth)}</span>
                      </div>
                    </div>
                    {selectedInquiry.address && (
                      <div className="detail-item">
                        <label>Address</label>
                        <div className="detail-value">
                          <MapPin size={16} />
                          <span>{selectedInquiry.address}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Academic Information</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>Program of Interest</label>
                      <div className="detail-value">
                        <GraduationCap size={16} />
                        <span>{selectedInquiry.program_interest}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Inquiry Details</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>Source</label>
                      <div className="detail-value">
                        <Activity size={16} />
                        <span>{selectedInquiry.source?.replace("-", " ")}</span>
                      </div>
                    </div>
                    <div className="detail-item">
                      <label>Inquiry Date</label>
                      <div className="detail-value">
                        <Calendar size={16} />
                        <span>
                          {formatDateTime(selectedInquiry.inquiry_date)}
                        </span>
                      </div>
                    </div>
                    <div className="detail-item">
                      <label>Last Contact</label>
                      <div className="detail-value">
                        <Clock size={16} />
                        <span>
                          {formatDateTime(selectedInquiry.last_contact_date) ||
                            "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedInquiry.notes && (
                  <div className="detail-section">
                    <h3>Notes</h3>
                    <div className="notes-display">
                      <MessageSquare size={16} />
                      <p>{selectedInquiry.notes}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <button
                  className="btn-secondary"
                  onClick={() => setSelectedInquiry(null)}
                >
                  Close
                </button>
                <button
                  className="btn-primary"
                  onClick={() =>
                    handleUpdateInquiryStatus(
                      selectedInquiry.inquiry_id,
                      "converted"
                    )
                  }
                >
                  <CheckCircle size={18} /> Convert to Application
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Application Detail Modal */}
      <AnimatePresence>
        {selectedApplication && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedApplication(null)}
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
                  <h2>
                    {selectedApplication.inquiry?.first_name}{" "}
                    {selectedApplication.inquiry?.last_name}
                  </h2>
                  <p>{selectedApplication.application_number}</p>
                </div>
                <div className="detail-header-actions">
                  <button
                    className="btn-icon"
                    onClick={() =>
                      handleSendEmail(selectedApplication.inquiry?.email)
                    }
                  >
                    <Send size={18} />
                  </button>
                  <button
                    className="modal-close"
                    onClick={() => setSelectedApplication(null)}
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="modal-body">
                <div className="detail-section">
                  <h3>Application Status</h3>
                  <div className="status-control">
                    <span
                      className="status-badge status-badge--large"
                      style={{
                        background: `${getStatusColor(
                          selectedApplication.status
                        )}20`,
                        color: getStatusColor(selectedApplication.status),
                      }}
                    >
                      {getStatusIcon(selectedApplication.status)}
                      {selectedApplication.status.replace("-", " ")}
                    </span>
                    <select
                      className="status-select"
                      value={selectedApplication.status}
                      onChange={(e) =>
                        handleUpdateApplicationStatus(
                          selectedApplication.applicant_id,
                          e.target.value
                        )
                      }
                    >
                      <option value="pending">Pending</option>
                      <option value="under-review">Under Review</option>
                      <option value="accepted">Accepted</option>
                      <option value="rejected">Rejected</option>
                      <option value="waitlisted">Waitlisted</option>
                    </select>
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Contact Information</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>Email</label>
                      <div className="detail-value">
                        <Mail size={16} />
                        <span>{selectedApplication.inquiry?.email}</span>
                      </div>
                    </div>
                    <div className="detail-item">
                      <label>Phone</label>
                      <div className="detail-value">
                        <Phone size={16} />
                        <span>{selectedApplication.inquiry?.phone}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Program Information</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>Program</label>
                      <div className="detail-value">
                        <GraduationCap size={16} />
                        <span>
                          {selectedApplication.program?.program_name || "N/A"}
                        </span>
                      </div>
                    </div>
                    <div className="detail-item">
                      <label>Applied Date</label>
                      <div className="detail-value">
                        <Calendar size={16} />
                        <span>
                          {formatDate(selectedApplication.applied_date)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedApplication.accepted_date && (
                  <div className="detail-section">
                    <h3>Decision Information</h3>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <label>Decision Date</label>
                        <div className="detail-value">
                          <Calendar size={16} />
                          <span>
                            {formatDate(selectedApplication.accepted_date)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <button
                  className="btn-secondary"
                  onClick={() => setSelectedApplication(null)}
                >
                  Close
                </button>
                {selectedApplication.status !== "accepted" && (
                  <button
                    className="btn-success"
                    onClick={() =>
                      handleAcceptApplication(selectedApplication.applicant_id)
                    }
                  >
                    <CheckCircle size={18} /> Accept Application
                  </button>
                )}
                {selectedApplication.status !== "rejected" && (
                  <button
                    className="btn-warning"
                    onClick={() =>
                      handleUpdateApplicationStatus(
                        selectedApplication.applicant_id,
                        "rejected"
                      )
                    }
                  >
                    <XCircle size={18} /> Reject Application
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
