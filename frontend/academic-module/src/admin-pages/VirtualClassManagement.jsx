import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  Clock,
  Users,
  Video,
  Calendar,
  MoreVertical,
  ExternalLink,
  Play,
  Bell,
  BarChart3,
  X,
} from "lucide-react";
import { adminService } from "../services/api/adminService";
import "../styles/admin-pages/VirtualClassManagement.css";

export default function VirtualClassManagement() {
  const [selectedTab, setSelectedTab] = useState("all");
  const [selectedClass, setSelectedClass] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPlatform, setFilterPlatform] = useState("all");

  // Data states
  const [classes, setClasses] = useState([]);
  const [stats, setStats] = useState({
    totalClasses: 0,
    liveNow: 0,
    scheduledToday: 0,
    completedThisWeek: 0,
    averageAttendance: 0,
    totalParticipants: 0,
  });
  const [upcomingClasses, setUpcomingClasses] = useState([]);
  const [courseOfferings, setCourseOfferings] = useState([]);

  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    topic: "",
    offering_id: "",
    platform: "zoom",
    schedule_date: "",
    start_time: "",
    duration_minutes: 60,
    description: "",
  });

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Load all data in parallel
      const [classesRes, statsRes, upcomingRes, offeringsRes] =
        await Promise.all([
          adminService.getVirtualClasses(),
          adminService.getVirtualClassStats(),
          adminService.getUpcomingVirtualClasses(),
          adminService.getCourseOfferings(),
        ]);

      if (classesRes.success) {
        // Transform backend data to frontend format
        const transformedClasses = classesRes.data.map((cls) => ({
          id: cls.id,
          title: cls.topic,
          course:
            cls.offering?.course?.course_code +
              " - " +
              cls.offering?.course?.course_name || "N/A",
          instructor: cls.created_by_faculty
            ? `${cls.created_by_faculty.user?.first_name || ""} ${
                cls.created_by_faculty.user?.last_name || ""
              }`
            : "N/A",
          platform: cls.platform,
          status: getClassStatus(cls),
          startTime: `${cls.schedule_date}T${cls.start_time}`,
          duration: cls.duration_minutes,
          participants: cls.current_participants || 0,
          maxParticipants: cls.max_participants || 100,
          meetingLink: cls.join_link,
          recordingAvailable: cls.recording_url ? true : false,
          recordingUrl: cls.recording_url,
        }));
        setClasses(transformedClasses);
      }

      if (statsRes.success) {
        setStats(statsRes.data);
      }

      if (upcomingRes.success) {
        setUpcomingClasses(upcomingRes.data);
      }

      if (offeringsRes.success) {
        setCourseOfferings(offeringsRes.data);
      }
    } catch (err) {
      setError("Failed to load data. Please try again.");
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  const getClassStatus = (cls) => {
    if (!cls.schedule_date || !cls.start_time || !cls.is_active)
      return "completed";

    const classDateTime = new Date(`${cls.schedule_date}T${cls.start_time}`);
    const endTime = new Date(
      classDateTime.getTime() + cls.duration_minutes * 60000
    );
    const currentTime = new Date();

    if (currentTime >= classDateTime && currentTime <= endTime) {
      return "live";
    } else if (currentTime < classDateTime) {
      return "scheduled";
    } else {
      return "completed";
    }
  };

  // Filter classes based on tab, search, and platform
  const filteredClasses = classes.filter((cls) => {
    const matchesTab = selectedTab === "all" || cls.status === selectedTab;
    const matchesSearch =
      cls.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlatform =
      filterPlatform === "all" || cls.platform === filterPlatform;

    return matchesTab && matchesSearch && matchesPlatform;
  });

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCreateClass = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const result = await adminService.createVirtualClass(formData);

      if (result.success) {
        setShowCreateModal(false);
        setFormData({
          topic: "",
          offering_id: "",
          platform: "zoom",
          schedule_date: "",
          start_time: "",
          duration_minutes: 60,
          description: "",
        });
        // Reload data
        await loadData();
        alert("Virtual class created successfully!");
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("Failed to create class. Please try again.");
      console.error("Error creating class:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleStartClass = async (classId) => {
    try {
      const result = await adminService.startVirtualClass(classId);
      if (result.success) {
        window.open(result.data.start_url, "_blank");
      } else {
        alert(result.error);
      }
    } catch (err) {
      alert("Failed to start class");
      console.error("Error starting class:", err);
    }
  };

  const handleSendReminder = async (classId) => {
    try {
      const result = await adminService.sendClassReminder(classId);
      if (result.success) {
        alert("Reminder sent successfully!");
      } else {
        alert(result.error);
      }
    } catch (err) {
      alert("Failed to send reminder");
      console.error("Error sending reminder:", err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "live":
        return "#10b981";
      case "scheduled":
        return "#3b82f6";
      case "completed":
        return "#6b7280";
      default:
        return "#9ca3af";
    }
  };

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case "zoom":
        return <Video size={16} />;
      case "google_meet":
      case "google-meet":
        return <Video size={16} />;
      case "teams":
        return <Video size={16} />;
      default:
        return <Video size={16} />;
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  if (loading) {
    return (
      <div className="virtual-class-management">
        <div style={{ textAlign: "center", padding: "50px" }}>
          <div className="spinner">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="virtual-class-management"
    >
      {/* Header */}
      <div className="vcm-header">
        <div>
          <h1 className="vcm-title">Virtual Class Management</h1>
          <p className="vcm-subtitle">
            Manage online classes and virtual learning sessions
          </p>
        </div>
        <button
          className="btn-primary"
          onClick={() => setShowCreateModal(true)}
        >
          Schedule New Class
        </button>
      </div>

      {/* Error Alert */}
      {error && <div className="error-alert">{error}</div>}

      {/* Stats Grid */}
      <div className="vcm-stats">
        <motion.div className="stat-card" whileHover={{ y: -2 }}>
          <div className="stat-content">
            <div className="stat-label">Total Classes</div>
            <div className="stat-value">{stats.totalClasses}</div>
          </div>
        </motion.div>

        <motion.div
          className="stat-card stat-card--live"
          whileHover={{ y: -2 }}
        >
          <div className="stat-content">
            <div className="stat-label">Live Now</div>
            <div className="stat-value">{stats.liveNow}</div>
          </div>
        </motion.div>

        <motion.div className="stat-card" whileHover={{ y: -2 }}>
          <div className="stat-content">
            <div className="stat-label">Scheduled Today</div>
            <div className="stat-value">{stats.scheduledToday}</div>
          </div>
        </motion.div>

        <motion.div className="stat-card" whileHover={{ y: -2 }}>
          <div className="stat-content">
            <div className="stat-label">Completed This Week</div>
            <div className="stat-value">{stats.completedThisWeek}</div>
          </div>
        </motion.div>

        <motion.div className="stat-card" whileHover={{ y: -2 }}>
          <div className="stat-content">
            <div className="stat-label">Avg Attendance</div>
            <div className="stat-value">{stats.averageAttendance}%</div>
          </div>
        </motion.div>

        <motion.div className="stat-card" whileHover={{ y: -2 }}>
          <div className="stat-content">
            <div className="stat-label">Total Participants</div>
            <div className="stat-value">{stats.totalParticipants}</div>
          </div>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="vcm-content">
        {/* Left Section - Class List */}
        <div className="vcm-left">
          {/* Filters */}
          <div className="vcm-filters">
            <div className="search-bar">
              <Search className="search-icon" size={18} />
              <input
                type="text"
                placeholder="Search classes, courses, or instructors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="filter-group">
              <Filter size={18} />
              <select
                className="filter-select"
                value={filterPlatform}
                onChange={(e) => setFilterPlatform(e.target.value)}
              >
                <option value="all">All Platforms</option>
                <option value="zoom">Zoom</option>
                <option value="google_meet">Google Meet</option>
                <option value="teams">Microsoft Teams</option>
              </select>
            </div>
          </div>

          {/* Tabs */}
          <div className="vcm-tabs">
            <button
              className={`tab ${selectedTab === "all" ? "tab--active" : ""}`}
              onClick={() => setSelectedTab("all")}
            >
              All Classes
            </button>
            <button
              className={`tab ${selectedTab === "live" ? "tab--active" : ""}`}
              onClick={() => setSelectedTab("live")}
            >
              Live
            </button>
            <button
              className={`tab ${
                selectedTab === "scheduled" ? "tab--active" : ""
              }`}
              onClick={() => setSelectedTab("scheduled")}
            >
              Scheduled
            </button>
            <button
              className={`tab ${
                selectedTab === "completed" ? "tab--active" : ""
              }`}
              onClick={() => setSelectedTab("completed")}
            >
              Completed
            </button>
          </div>

          {/* Class List */}
          <div className="class-list">
            {filteredClasses.map((cls) => (
              <motion.div
                key={cls.id}
                className={`class-card ${
                  selectedClass?.id === cls.id ? "class-card--selected" : ""
                }`}
                onClick={() => setSelectedClass(cls)}
                whileHover={{ x: 2 }}
                layout
              >
                <div className="class-card-header">
                  <div className="class-card-platform">
                    {getPlatformIcon(cls.platform)}
                  </div>
                  <span
                    className="class-card-status"
                    style={{ backgroundColor: getStatusColor(cls.status) }}
                  >
                    {cls.status}
                  </span>
                </div>

                <h3 className="class-card-title">{cls.title}</h3>
                <p className="class-card-course">{cls.course}</p>

                <div className="class-card-info">
                  <div className="info-item">
                    <span>{cls.instructor}</span>
                  </div>
                  <div className="info-item">
                    <Clock size={14} />
                    <span>
                      {formatTime(cls.startTime)} • {cls.duration}min
                    </span>
                  </div>
                  <div className="info-item">
                    <Users size={14} />
                    <span>
                      {cls.participants}/{cls.maxParticipants}
                    </span>
                  </div>
                </div>

                {cls.recordingAvailable && (
                  <div className="class-card-recording">
                    Recording Available
                  </div>
                )}
              </motion.div>
            ))}

            {filteredClasses.length === 0 && (
              <div className="empty-state">
                <h3>No classes found</h3>
                <p>Try adjusting your filters or search criteria</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Section - Details & Upcoming */}
        <div className="vcm-right">
          {/* Class Details */}
          {selectedClass ? (
            <motion.div
              className="class-details"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="details-header">
                <h2>Class Details</h2>
                <button className="btn-icon">
                  <MoreVertical size={18} />
                </button>
              </div>

              <div className="details-content">
                <div className="details-body">
                  <div className="details-status-bar">
                    <span
                      className="status-indicator"
                      style={{
                        backgroundColor: getStatusColor(selectedClass.status),
                      }}
                    >
                      {selectedClass.status}
                    </span>
                    <div className="platform-badge">
                      {getPlatformIcon(selectedClass.platform)}
                      <span>
                        {selectedClass.platform === "zoom"
                          ? "Zoom"
                          : selectedClass.platform === "google_meet"
                          ? "Google Meet"
                          : "Microsoft Teams"}
                      </span>
                    </div>
                  </div>

                  <h3 className="details-title">{selectedClass.title}</h3>
                  <p className="details-course">{selectedClass.course}</p>

                  <div className="details-grid">
                    <div className="detail-item">
                      <div className="detail-label">Instructor</div>
                      <div className="detail-value">
                        {selectedClass.instructor}
                      </div>
                    </div>

                    <div className="detail-item">
                      <div className="detail-label">Date & Time</div>
                      <div className="detail-value">
                        {formatDate(selectedClass.startTime)} at{" "}
                        {formatTime(selectedClass.startTime)}
                      </div>
                    </div>

                    <div className="detail-item">
                      <div className="detail-label">Duration</div>
                      <div className="detail-value">
                        {selectedClass.duration} minutes
                      </div>
                    </div>

                    <div className="detail-item">
                      <div className="detail-label">Participants</div>
                      <div className="detail-value">
                        {selectedClass.participants} /{" "}
                        {selectedClass.maxParticipants}
                      </div>
                    </div>

                    <div className="detail-item detail-item--full">
                      <div className="detail-label">Meeting Link</div>
                      <div className="detail-value detail-link">
                        <a
                          href={selectedClass.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Join Meeting
                          <ExternalLink size={14} />
                        </a>
                      </div>
                    </div>
                  </div>

                  {selectedClass.recordingAvailable && (
                    <div className="recording-section">
                      <div className="recording-label">Recording Available</div>
                      <a
                        href={selectedClass.recordingUrl}
                        className="btn-secondary btn-block"
                      >
                        Watch Recording
                      </a>
                    </div>
                  )}

                  <div className="details-actions">
                    {selectedClass.status === "live" && (
                      <button
                        className="btn-primary btn-block"
                        onClick={() => handleStartClass(selectedClass.id)}
                      >
                        <Play size={16} />
                        Join Live Class
                      </button>
                    )}
                    {selectedClass.status === "scheduled" && (
                      <button
                        className="btn-secondary btn-block"
                        onClick={() => handleSendReminder(selectedClass.id)}
                      >
                        <Bell size={16} />
                        Send Reminder
                      </button>
                    )}
                    {selectedClass.status === "completed" && (
                      <button className="btn-secondary btn-block">
                        <BarChart3 size={16} />
                        View Analytics
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="empty-details">
              <h3>Select a Class</h3>
              <p>Choose a class from the list to view details</p>
            </div>
          )}

          {/* Upcoming Classes */}
          <div className="upcoming-classes">
            <h3 className="upcoming-title">Upcoming Classes</h3>
            <div className="upcoming-list">
              {upcomingClasses.map((cls) => (
                <div key={cls.id} className="upcoming-item">
                  <div className="upcoming-time">
                    <div className="upcoming-date">{formatDate(cls.time)}</div>
                    <div className="upcoming-hour">{formatTime(cls.time)}</div>
                  </div>
                  <div className="upcoming-info">
                    <div className="upcoming-course">{cls.course}</div>
                    <div className="upcoming-title-text">{cls.title}</div>
                    <div className="upcoming-instructor">{cls.instructor}</div>
                  </div>
                </div>
              ))}
              {upcomingClasses.length === 0 && (
                <p className="upcoming-empty">No upcoming classes</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Create Class Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              className="modal"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div onSubmit={handleCreateClass}>
                <div className="modal-header">
                  <h2>Schedule New Virtual Class</h2>
                  <button
                    type="button"
                    className="modal-close"
                    onClick={() => setShowCreateModal(false)}
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="modal-body">
                  <div className="form-group">
                    <label>Class Title *</label>
                    <input
                      type="text"
                      name="topic"
                      value={formData.topic}
                      onChange={handleFormChange}
                      placeholder="e.g., Introduction to Machine Learning"
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Course Offering *</label>
                      <select
                        name="offering_id"
                        value={formData.offering_id}
                        onChange={handleFormChange}
                        required
                      >
                        <option value="">Select Course Offering</option>
                        {courseOfferings.map((offering) => (
                          <option key={offering.id} value={offering.id}>
                            {offering.course?.course_code} -{" "}
                            {offering.course?.course_name} ({offering.section})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Platform *</label>
                      <select
                        name="platform"
                        value={formData.platform}
                        onChange={handleFormChange}
                        required
                      >
                        <option value="zoom">Zoom</option>
                        <option value="google_meet">Google Meet</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Date *</label>
                      <input
                        type="date"
                        name="schedule_date"
                        value={formData.schedule_date}
                        onChange={handleFormChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Time *</label>
                      <input
                        type="time"
                        name="start_time"
                        value={formData.start_time}
                        onChange={handleFormChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Duration (minutes) *</label>
                    <input
                      type="number"
                      name="duration_minutes"
                      value={formData.duration_minutes}
                      onChange={handleFormChange}
                      placeholder="60"
                      min="15"
                      max="300"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleFormChange}
                      rows="3"
                      placeholder="Add class description..."
                    ></textarea>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setShowCreateModal(false)}
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={handleCreateClass}
                    disabled={submitting}
                  >
                    {submitting ? "Creating..." : "Schedule Class"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
