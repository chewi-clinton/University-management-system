import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
} from "lucide-react";

// Mock Data
const mockInquiries = [
  {
    id: 1,
    inquiryNumber: "INQ-2026-001",
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@email.com",
    phone: "+1 (555) 123-4567",
    dateOfBirth: "2005-03-15",
    programInterest: "Computer Science (BS)",
    status: "new",
    source: "website",
    inquiryDate: "2026-01-01T09:00:00",
    lastContact: "2026-01-01T09:00:00",
    assignedTo: null,
    notes: "Interested in AI specialization",
    priority: "high",
    address: "123 Main St, New York, NY",
    gpa: 3.8,
  },
  {
    id: 2,
    inquiryNumber: "INQ-2026-002",
    firstName: "Michael",
    lastName: "Chen",
    email: "michael.chen@email.com",
    phone: "+1 (555) 234-5678",
    dateOfBirth: "2004-07-22",
    programInterest: "Business Administration (MBA)",
    status: "contacted",
    source: "referral",
    inquiryDate: "2025-12-30T14:00:00",
    lastContact: "2025-12-31T10:30:00",
    assignedTo: "Admin A",
    notes: "Has 2 years work experience",
    priority: "medium",
    address: "456 Oak Ave, Boston, MA",
    gpa: 3.6,
  },
  {
    id: 3,
    inquiryNumber: "INQ-2026-003",
    firstName: "Emily",
    lastName: "Davis",
    email: "emily.davis@email.com",
    phone: "+1 (555) 345-6789",
    dateOfBirth: "2005-11-08",
    programInterest: "Mechanical Engineering (BE)",
    status: "converted",
    source: "social-media",
    inquiryDate: "2025-12-28T11:00:00",
    lastContact: "2025-12-29T15:00:00",
    assignedTo: "Admin B",
    notes: "Application submitted successfully",
    priority: "high",
    address: "789 Pine Rd, Seattle, WA",
    gpa: 3.9,
  },
  {
    id: 4,
    inquiryNumber: "INQ-2026-004",
    firstName: "James",
    lastName: "Wilson",
    email: "james.wilson@email.com",
    phone: "+1 (555) 456-7890",
    dateOfBirth: "2004-05-19",
    programInterest: "Data Science (MS)",
    status: "in-progress",
    source: "email-campaign",
    inquiryDate: "2025-12-27T16:00:00",
    lastContact: "2025-12-28T14:00:00",
    assignedTo: "Admin A",
    notes: "Requested more information about curriculum",
    priority: "medium",
    address: "321 Elm St, Austin, TX",
    gpa: 3.7,
  },
  {
    id: 5,
    inquiryNumber: "INQ-2026-005",
    firstName: "Sophia",
    lastName: "Martinez",
    email: "sophia.martinez@email.com",
    phone: "+1 (555) 567-8901",
    dateOfBirth: "2005-09-30",
    programInterest: "Psychology (BA)",
    status: "closed",
    source: "walk-in",
    inquiryDate: "2025-12-25T10:00:00",
    lastContact: "2025-12-26T11:00:00",
    assignedTo: "Admin C",
    notes: "Decided to apply next year",
    priority: "low",
    address: "654 Maple Dr, Chicago, IL",
    gpa: 3.5,
  },
];

const mockApplications = [
  {
    id: 1,
    applicationNumber: "APP-2026-001",
    studentName: "Emily Davis",
    email: "emily.davis@email.com",
    program: "Mechanical Engineering (BE)",
    status: "under-review",
    appliedDate: "2025-12-29T10:00:00",
    documents: ["transcript", "recommendation", "essay"],
    testScores: { sat: 1450, gpa: 3.8 },
    interviewScheduled: true,
    interviewDate: "2026-01-05T14:00:00",
    reviewedBy: null,
    reviewNotes: "",
    phone: "+1 (555) 345-6789",
  },
  {
    id: 2,
    applicationNumber: "APP-2026-002",
    studentName: "Robert Martinez",
    email: "robert.martinez@email.com",
    program: "Computer Science (BS)",
    status: "accepted",
    appliedDate: "2025-12-20T09:00:00",
    documents: ["transcript", "recommendation", "essay", "portfolio"],
    testScores: { sat: 1520, gpa: 3.9 },
    interviewScheduled: true,
    interviewDate: "2025-12-28T10:00:00",
    acceptedDate: "2025-12-30T16:00:00",
    reviewedBy: "Admin A",
    reviewNotes: "Excellent portfolio, strong academic record",
    phone: "+1 (555) 789-0123",
  },
  {
    id: 3,
    applicationNumber: "APP-2026-003",
    studentName: "Lisa Anderson",
    email: "lisa.anderson@email.com",
    program: "Business Administration (MBA)",
    status: "pending",
    appliedDate: "2025-12-26T11:00:00",
    documents: ["transcript", "recommendation"],
    testScores: { gmat: 680, gpa: 3.5 },
    interviewScheduled: false,
    reviewedBy: null,
    reviewNotes: "",
    phone: "+1 (555) 890-1234",
  },
  {
    id: 4,
    applicationNumber: "APP-2026-004",
    studentName: "David Kim",
    email: "david.kim@email.com",
    program: "Data Science (MS)",
    status: "waitlisted",
    appliedDate: "2025-12-24T15:00:00",
    documents: ["transcript", "recommendation", "essay"],
    testScores: { gre: 320, gpa: 3.6 },
    interviewScheduled: true,
    interviewDate: "2025-12-30T13:00:00",
    reviewedBy: "Admin B",
    reviewNotes: "Good candidate, limited seats available",
    phone: "+1 (555) 901-2345",
  },
  {
    id: 5,
    applicationNumber: "APP-2026-005",
    studentName: "Emma Thompson",
    email: "emma.thompson@email.com",
    program: "Psychology (BA)",
    status: "rejected",
    appliedDate: "2025-12-22T12:00:00",
    documents: ["transcript", "essay"],
    testScores: { sat: 1200, gpa: 3.0 },
    interviewScheduled: false,
    reviewedBy: "Admin C",
    reviewNotes: "Does not meet minimum requirements",
    phone: "+1 (555) 012-3456",
  },
];

const mockStats = {
  totalInquiries: 245,
  newInquiries: 12,
  totalApplications: 156,
  acceptanceRate: 68,
  pendingReviews: 34,
  interviewsScheduled: 18,
};

const programs = [
  "Computer Science (BS)",
  "Business Administration (MBA)",
  "Mechanical Engineering (BE)",
  "Data Science (MS)",
  "Electrical Engineering (BE)",
  "Civil Engineering (BE)",
  "Psychology (BA)",
  "Marketing (MBA)",
];

const sources = [
  "website",
  "referral",
  "social-media",
  "email-campaign",
  "walk-in",
];
const priorities = ["high", "medium", "low"];
const admins = ["Admin A", "Admin B", "Admin C"];

export default function AdmissionManagement() {
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
  const [inquiries, setInquiries] = useState(mockInquiries);
  const [applications, setApplications] = useState(mockApplications);

  // Filter inquiries
  const filteredInquiries = inquiries.filter((inquiry) => {
    const matchesSearch =
      inquiry.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.inquiryNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || inquiry.status === filterStatus;
    const matchesProgram =
      filterProgram === "all" || inquiry.programInterest === filterProgram;
    const matchesPriority =
      filterPriority === "all" || inquiry.priority === filterPriority;

    return matchesSearch && matchesStatus && matchesProgram && matchesPriority;
  });

  // Filter applications
  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.applicationNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || app.status === filterStatus;
    const matchesProgram =
      filterProgram === "all" || app.program === filterProgram;

    return matchesSearch && matchesStatus && matchesProgram;
  });

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

  const handleUpdateInquiryStatus = (inquiryId, newStatus) => {
    setInquiries((prev) =>
      prev.map((inq) =>
        inq.id === inquiryId
          ? { ...inq, status: newStatus, lastContact: new Date().toISOString() }
          : inq
      )
    );
    setShowActionMenu(null);
  };

  const handleUpdateApplicationStatus = (appId, newStatus) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === appId ? { ...app, status: newStatus } : app
      )
    );
    setShowActionMenu(null);
  };

  const handleDeleteInquiry = (inquiryId) => {
    if (window.confirm("Are you sure you want to delete this inquiry?")) {
      setInquiries((prev) => prev.filter((inq) => inq.id !== inquiryId));
      setShowActionMenu(null);
    }
  };

  const handleSendEmail = (email) => {
    window.location.href = `mailto:${email}`;
  };

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
            <div className="stat-value">{mockStats.totalInquiries}</div>
            <div className="stat-label">Total Inquiries</div>
          </div>
          <div className="stat-trend">
            <TrendingUp size={16} />
            <span>+12%</span>
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
            <div className="stat-value">{mockStats.newInquiries}</div>
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
            <div className="stat-value">{mockStats.totalApplications}</div>
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
            <div className="stat-value">{mockStats.acceptanceRate}%</div>
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
            <div className="stat-value">{mockStats.pendingReviews}</div>
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
            <div className="stat-value">{mockStats.interviewsScheduled}</div>
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
          Inquiries ({filteredInquiries.length})
        </button>
        <button
          className={`tab ${
            selectedTab === "applications" ? "tab--active" : ""
          }`}
          onClick={() => setSelectedTab("applications")}
        >
          <FileText size={18} />
          Applications ({filteredApplications.length})
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
                      {programs.map((program, index) => (
                        <option key={index} value={program}>
                          {program}
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedTab === "inquiries" && (
                    <div className="filter-section">
                      <label>Priority</label>
                      <select
                        value={filterPriority}
                        onChange={(e) => setFilterPriority(e.target.value)}
                      >
                        <option value="all">All Priorities</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                      </select>
                    </div>
                  )}

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

          <button className="btn-secondary">
            <Download size={18} /> Export
          </button>

          <button className="btn-secondary">
            <RefreshCw size={18} /> Refresh
          </button>
        </div>
      </div>

      {/* Content based on selected tab */}
      {selectedTab === "inquiries" && (
        <div className="am-list">
          {filteredInquiries.map((inquiry) => (
            <motion.div
              key={inquiry.id}
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
                    {inquiry.firstName} {inquiry.lastName}
                  </h3>
                  <span className="inquiry-number">
                    {inquiry.inquiryNumber}
                  </span>
                </div>
                <div className="inquiry-actions">
                  <div
                    className="inquiry-priority"
                    style={{
                      background: `${getPriorityColor(inquiry.priority)}20`,
                      color: getPriorityColor(inquiry.priority),
                    }}
                  >
                    <Star size={14} fill="currentColor" />
                    {inquiry.priority}
                  </div>
                  <div className="action-menu-wrapper">
                    <button
                      className="action-menu-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowActionMenu(
                          showActionMenu === inquiry.id ? null : inquiry.id
                        );
                      }}
                    >
                      <MoreVertical size={18} />
                    </button>

                    <AnimatePresence>
                      {showActionMenu === inquiry.id && (
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
                              handleUpdateInquiryStatus(inquiry.id, "contacted")
                            }
                          >
                            <MessageSquare size={16} /> Mark Contacted
                          </button>
                          <button
                            onClick={() =>
                              handleUpdateInquiryStatus(inquiry.id, "converted")
                            }
                          >
                            <CheckCircle size={16} /> Convert to Application
                          </button>
                          <button
                            className="danger"
                            onClick={() => handleDeleteInquiry(inquiry.id)}
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
                  <span>{inquiry.programInterest}</span>
                </div>
                <div className="detail-item">
                  <Calendar size={14} />
                  <span>Inquiry: {formatDate(inquiry.inquiryDate)}</span>
                </div>
              </div>

              <div className="inquiry-meta">
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
                <span className="source-badge">
                  <Activity size={14} />
                  {inquiry.source.replace("-", " ")}
                </span>
                {inquiry.assignedTo && (
                  <span className="assigned-badge">
                    <UserCheck size={14} />
                    {inquiry.assignedTo}
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
          ))}

          {filteredInquiries.length === 0 && (
            <div className="empty-state">
              <Users size={64} />
              <h3>No inquiries found</h3>
              <p>Try adjusting your filters or search criteria</p>
            </div>
          )}
        </div>
      )}

      {selectedTab === "applications" && (
        <div className="am-list">
          {filteredApplications.map((app) => (
            <motion.div
              key={app.id}
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
                    {app.studentName}
                  </h3>
                  <span className="app-number">{app.applicationNumber}</span>
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
                          showActionMenu === `app-${app.id}`
                            ? null
                            : `app-${app.id}`
                        );
                      }}
                    >
                      <MoreVertical size={18} />
                    </button>

                    <AnimatePresence>
                      {showActionMenu === `app-${app.id}` && (
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
                          <button onClick={() => handleSendEmail(app.email)}>
                            <Send size={16} /> Send Email
                          </button>
                          <button
                            onClick={() =>
                              handleUpdateApplicationStatus(app.id, "accepted")
                            }
                          >
                            <CheckCircle size={16} /> Accept
                          </button>
                          <button
                            onClick={() =>
                              handleUpdateApplicationStatus(app.id, "rejected")
                            }
                          >
                            <XCircle size={16} /> Reject
                          </button>
                          <button
                            onClick={() =>
                              handleUpdateApplicationStatus(
                                app.id,
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
                  <span>{app.email}</span>
                </div>
                <div className="detail-item">
                  <GraduationCap size={14} />
                  <span>{app.program}</span>
                </div>
                <div className="detail-item">
                  <Calendar size={14} />
                  <span>Applied: {formatDate(app.appliedDate)}</span>
                </div>
              </div>

              <div className="app-scores">
                {app.testScores.sat && (
                  <div className="score-item">
                    <span className="score-label">SAT</span>
                    <span className="score-value">{app.testScores.sat}</span>
                  </div>
                )}
                {app.testScores.gmat && (
                  <div className="score-item">
                    <span className="score-label">GMAT</span>
                    <span className="score-value">{app.testScores.gmat}</span>
                  </div>
                )}
                {app.testScores.gre && (
                  <div className="score-item">
                    <span className="score-label">GRE</span>
                    <span className="score-value">{app.testScores.gre}</span>
                  </div>
                )}
                <div className="score-item">
                  <span className="score-label">GPA</span>
                  <span className="score-value">{app.testScores.gpa}</span>
                </div>
              </div>

              <div className="app-documents">
                <FileText size={14} />
                <span>{app.documents.length} documents submitted</span>
                {app.interviewScheduled && (
                  <>
                    <span className="separator">•</span>
                    <Calendar size={14} />
                    <span>Interview: {formatDate(app.interviewDate)}</span>
                  </>
                )}
              </div>
            </motion.div>
          ))}

          {filteredApplications.length === 0 && (
            <div className="empty-state">
              <FileText size={64} />
              <h3>No applications found</h3>
              <p>Try adjusting your filters or search criteria</p>
            </div>
          )}
        </div>
      )}

      {selectedTab === "analytics" && (
        <div className="analytics-section">
          <div className="analytics-grid">
            <div className="analytics-card">
              <div className="analytics-header">
                <h3>Inquiry Sources</h3>
                <button className="btn-icon">
                  <Download size={16} />
                </button>
              </div>
              <div className="chart-placeholder">
                <PieChart size={64} />
                <p>Pie chart showing inquiry distribution by source</p>
              </div>
              <div className="chart-legend">
                <div className="legend-item">
                  <span
                    className="legend-color"
                    style={{ background: "#3b82f6" }}
                  ></span>
                  <span>Website (40%)</span>
                </div>
                <div className="legend-item">
                  <span
                    className="legend-color"
                    style={{ background: "#10b981" }}
                  ></span>
                  <span>Referral (25%)</span>
                </div>
                <div className="legend-item">
                  <span
                    className="legend-color"
                    style={{ background: "#f59e0b" }}
                  ></span>
                  <span>Social Media (20%)</span>
                </div>
                <div className="legend-item">
                  <span
                    className="legend-color"
                    style={{ background: "#8b5cf6" }}
                  ></span>
                  <span>Email (10%)</span>
                </div>
                <div className="legend-item">
                  <span
                    className="legend-color"
                    style={{ background: "#ec4899" }}
                  ></span>
                  <span>Walk-in (5%)</span>
                </div>
              </div>
            </div>

            <div className="analytics-card">
              <div className="analytics-header">
                <h3>Application Status</h3>
                <button className="btn-icon">
                  <Download size={16} />
                </button>
              </div>
              <div className="chart-placeholder">
                <BarChart3 size={64} />
                <p>Bar chart showing application statuses</p>
              </div>
            </div>

            <div className="analytics-card">
              <div className="analytics-header">
                <h3>Monthly Trends</h3>
                <button className="btn-icon">
                  <Download size={16} />
                </button>
              </div>
              <div className="chart-placeholder">
                <Activity size={64} />
                <p>Line chart showing monthly inquiry and application trends</p>
              </div>
            </div>

            <div className="analytics-card">
              <div className="analytics-header">
                <h3>Program Distribution</h3>
                <button className="btn-icon">
                  <Download size={16} />
                </button>
              </div>
              <div className="chart-placeholder">
                <PieChart size={64} />
                <p>Donut chart showing program interest distribution</p>
              </div>
            </div>

            <div className="analytics-card">
              <div className="analytics-header">
                <h3>Conversion Rate</h3>
                <button className="btn-icon">
                  <Download size={16} />
                </button>
              </div>
              <div className="conversion-stats">
                <div className="conversion-item">
                  <div className="conversion-label">Inquiry to Application</div>
                  <div className="conversion-value">42%</div>
                  <div className="conversion-bar">
                    <div
                      className="conversion-fill"
                      style={{ width: "42%", background: "#3b82f6" }}
                    ></div>
                  </div>
                </div>
                <div className="conversion-item">
                  <div className="conversion-label">
                    Application to Acceptance
                  </div>
                  <div className="conversion-value">68%</div>
                  <div className="conversion-bar">
                    <div
                      className="conversion-fill"
                      style={{ width: "68%", background: "#10b981" }}
                    ></div>
                  </div>
                </div>
                <div className="conversion-item">
                  <div className="conversion-label">
                    Acceptance to Enrollment
                  </div>
                  <div className="conversion-value">85%</div>
                  <div className="conversion-bar">
                    <div
                      className="conversion-fill"
                      style={{ width: "85%", background: "#8b5cf6" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="analytics-card">
              <div className="analytics-header">
                <h3>Top Programs</h3>
                <button className="btn-icon">
                  <ExternalLink size={16} />
                </button>
              </div>
              <div className="top-programs">
                {[
                  { name: "Computer Science (BS)", count: 45, change: "+12%" },
                  {
                    name: "Business Administration (MBA)",
                    count: 38,
                    change: "+8%",
                  },
                  { name: "Data Science (MS)", count: 32, change: "+15%" },
                  {
                    name: "Mechanical Engineering (BE)",
                    count: 28,
                    change: "+5%",
                  },
                  { name: "Psychology (BA)", count: 24, change: "-3%" },
                ].map((program, index) => (
                  <div key={index} className="program-item">
                    <div className="program-info">
                      <span className="program-rank">#{index + 1}</span>
                      <span className="program-name">{program.name}</span>
                    </div>
                    <div className="program-stats">
                      <span className="program-count">{program.count}</span>
                      <span
                        className={`program-change ${
                          program.change.startsWith("+")
                            ? "positive"
                            : "negative"
                        }`}
                      >
                        {program.change}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
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
              className="modal"
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

              <div className="modal-body">
                <div className="form-row">
                  <div className="form-group">
                    <label>First Name *</label>
                    <input type="text" placeholder="Enter first name" />
                  </div>
                  <div className="form-group">
                    <label>Last Name *</label>
                    <input type="text" placeholder="Enter last name" />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Email *</label>
                    <input type="email" placeholder="email@example.com" />
                  </div>
                  <div className="form-group">
                    <label>Phone *</label>
                    <input type="tel" placeholder="+1 (555) 123-4567" />
                  </div>
                </div>

                <div className="form-group">
                  <label>Date of Birth *</label>
                  <input type="date" />
                </div>

                <div className="form-group">
                  <label>Program of Interest *</label>
                  <select>
                    <option>Select Program</option>
                    {programs.map((program, index) => (
                      <option key={index} value={program}>
                        {program}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Source</label>
                    <select>
                      <option>Select Source</option>
                      <option>Website</option>
                      <option>Referral</option>
                      <option>Social Media</option>
                      <option>Email Campaign</option>
                      <option>Walk-in</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Priority</label>
                    <select>
                      <option>Medium</option>
                      <option>High</option>
                      <option>Low</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Address</label>
                  <input type="text" placeholder="Enter full address" />
                </div>

                <div className="form-group">
                  <label>Notes</label>
                  <textarea
                    rows="3"
                    placeholder="Add any additional notes..."
                  ></textarea>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  className="btn-secondary"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button className="btn-primary">
                  <UserPlus size={18} /> Add Inquiry
                </button>
              </div>
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
                    {selectedInquiry.firstName} {selectedInquiry.lastName}
                  </h2>
                  <p>{selectedInquiry.inquiryNumber}</p>
                </div>
                <div className="detail-header-actions">
                  <button
                    className="btn-icon"
                    onClick={() => handleSendEmail(selectedInquiry.email)}
                  >
                    <Send size={18} />
                  </button>
                  <button className="btn-icon">
                    <Edit3 size={18} />
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
                <div className="detail-tabs">
                  <button className="detail-tab detail-tab--active">
                    <Users size={16} /> Overview
                  </button>
                  <button className="detail-tab">
                    <MessageSquare size={16} /> Communications
                  </button>
                  <button className="detail-tab">
                    <Clock size={16} /> Timeline
                  </button>
                </div>

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
                    <select className="status-select">
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
                        <span>{formatDate(selectedInquiry.dateOfBirth)}</span>
                      </div>
                    </div>
                    <div className="detail-item">
                      <label>Address</label>
                      <div className="detail-value">
                        <MapPin size={16} />
                        <span>{selectedInquiry.address}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Academic Information</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>Program of Interest</label>
                      <div className="detail-value">
                        <GraduationCap size={16} />
                        <span>{selectedInquiry.programInterest}</span>
                      </div>
                    </div>
                    <div className="detail-item">
                      <label>Current GPA</label>
                      <div className="detail-value">
                        <Hash size={16} />
                        <span>{selectedInquiry.gpa}</span>
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
                        <span>{selectedInquiry.source.replace("-", " ")}</span>
                      </div>
                    </div>
                    <div className="detail-item">
                      <label>Priority</label>
                      <div className="detail-value">
                        <Star
                          size={16}
                          fill={getPriorityColor(selectedInquiry.priority)}
                        />
                        <span
                          style={{
                            color: getPriorityColor(selectedInquiry.priority),
                          }}
                        >
                          {selectedInquiry.priority}
                        </span>
                      </div>
                    </div>
                    <div className="detail-item">
                      <label>Inquiry Date</label>
                      <div className="detail-value">
                        <Calendar size={16} />
                        <span>
                          {formatDateTime(selectedInquiry.inquiryDate)}
                        </span>
                      </div>
                    </div>
                    <div className="detail-item">
                      <label>Last Contact</label>
                      <div className="detail-value">
                        <Clock size={16} />
                        <span>
                          {formatDateTime(selectedInquiry.lastContact)}
                        </span>
                      </div>
                    </div>
                    {selectedInquiry.assignedTo && (
                      <div className="detail-item">
                        <label>Assigned To</label>
                        <div className="detail-value">
                          <UserCheck size={16} />
                          <span>{selectedInquiry.assignedTo}</span>
                        </div>
                      </div>
                    )}
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
                <button className="btn-primary">
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
                  <h2>{selectedApplication.studentName}</h2>
                  <p>{selectedApplication.applicationNumber}</p>
                </div>
                <div className="detail-header-actions">
                  <button
                    className="btn-icon"
                    onClick={() => handleSendEmail(selectedApplication.email)}
                  >
                    <Send size={18} />
                  </button>
                  <button className="btn-icon">
                    <Download size={18} />
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
                <div className="detail-tabs">
                  <button className="detail-tab detail-tab--active">
                    <FileText size={16} /> Application
                  </button>
                  <button className="detail-tab">
                    <GraduationCap size={16} /> Academic Records
                  </button>
                  <button className="detail-tab">
                    <Calendar size={16} /> Interview
                  </button>
                </div>

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
                    <select className="status-select">
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
                        <span>{selectedApplication.email}</span>
                      </div>
                    </div>
                    <div className="detail-item">
                      <label>Phone</label>
                      <div className="detail-value">
                        <Phone size={16} />
                        <span>{selectedApplication.phone}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Program & Test Scores</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>Program</label>
                      <div className="detail-value">
                        <GraduationCap size={16} />
                        <span>{selectedApplication.program}</span>
                      </div>
                    </div>
                  </div>
                  <div className="test-scores-grid">
                    {Object.entries(selectedApplication.testScores).map(
                      ([key, value]) => (
                        <div key={key} className="test-score-card">
                          <div className="test-score-label">
                            {key.toUpperCase()}
                          </div>
                          <div className="test-score-value">{value}</div>
                        </div>
                      )
                    )}
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Documents Submitted</h3>
                  <div className="documents-list">
                    {selectedApplication.documents.map((doc, index) => (
                      <div key={index} className="document-item">
                        <FileText size={16} />
                        <span>{doc}</span>
                        <button className="btn-link">
                          <Eye size={14} /> View
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedApplication.interviewScheduled && (
                  <div className="detail-section">
                    <h3>Interview Information</h3>
                    <div className="interview-info">
                      <Calendar size={20} />
                      <div>
                        <div className="interview-date">
                          {formatDateTime(selectedApplication.interviewDate)}
                        </div>
                        <div className="interview-status">Scheduled</div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedApplication.reviewNotes && (
                  <div className="detail-section">
                    <h3>Review Notes</h3>
                    <div className="notes-display">
                      <MessageSquare size={16} />
                      <p>{selectedApplication.reviewNotes}</p>
                      <div className="notes-meta">
                        - Reviewed by {selectedApplication.reviewedBy}
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
                <button className="btn-success">
                  <CheckCircle size={18} /> Accept Application
                </button>
                <button className="btn-warning">
                  <XCircle size={18} /> Reject Application
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
