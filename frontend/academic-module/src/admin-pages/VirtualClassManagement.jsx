import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/admin-pages/VirtualClassManagement.css";

// Mock Data
const mockClasses = [
  {
    id: 1,
    title: "Advanced Algorithms - Lecture 12",
    course: "CS401 - Data Structures & Algorithms",
    instructor: "Dr. Sarah Johnson",
    platform: "zoom",
    status: "live",
    startTime: "2026-01-01T10:00:00",
    duration: 60,
    participants: 45,
    maxParticipants: 50,
    meetingLink: "https://zoom.us/j/123456789",
    recordingAvailable: false,
  },
  {
    id: 2,
    title: "Database Management Systems",
    course: "CS302 - Database Systems",
    instructor: "Prof. Michael Chen",
    platform: "google-meet",
    status: "scheduled",
    startTime: "2026-01-01T14:00:00",
    duration: 90,
    participants: 0,
    maxParticipants: 60,
    meetingLink: "https://meet.google.com/abc-defg-hij",
    recordingAvailable: false,
  },
  {
    id: 3,
    title: "Machine Learning Basics",
    course: "CS501 - Artificial Intelligence",
    instructor: "Dr. Emily Davis",
    platform: "zoom",
    status: "completed",
    startTime: "2025-12-31T11:00:00",
    duration: 120,
    participants: 52,
    maxParticipants: 60,
    meetingLink: "https://zoom.us/j/987654321",
    recordingAvailable: true,
    recordingUrl: "https://zoom.us/rec/share/xyz123",
  },
  {
    id: 4,
    title: "Web Development Workshop",
    course: "CS201 - Web Technologies",
    instructor: "Prof. James Wilson",
    platform: "zoom",
    status: "scheduled",
    startTime: "2026-01-02T09:00:00",
    duration: 180,
    participants: 0,
    maxParticipants: 40,
    meetingLink: "https://zoom.us/j/456789123",
    recordingAvailable: false,
  },
];

const mockUpcomingClasses = [
  {
    id: 5,
    title: "Software Engineering Principles",
    course: "CS301",
    time: "2026-01-01T16:00:00",
    instructor: "Dr. Anderson",
  },
  {
    id: 6,
    title: "Computer Networks Lab",
    course: "CS402",
    time: "2026-01-02T10:30:00",
    instructor: "Prof. Martinez",
  },
  {
    id: 7,
    title: "Operating Systems Tutorial",
    course: "CS303",
    time: "2026-01-02T13:00:00",
    instructor: "Dr. Thompson",
  },
];

const mockStats = {
  totalClasses: 156,
  liveNow: 1,
  scheduledToday: 3,
  completedThisWeek: 28,
  averageAttendance: 87,
  totalParticipants: 234,
};

export default function VirtualClassManagement() {
  const [selectedTab, setSelectedTab] = useState("all");
  const [selectedClass, setSelectedClass] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPlatform, setFilterPlatform] = useState("all");

  // Filter classes based on tab, search, and platform
  const filteredClasses = mockClasses.filter((cls) => {
    const matchesTab = selectedTab === "all" || cls.status === selectedTab;
    const matchesSearch =
      cls.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlatform =
      filterPlatform === "all" || cls.platform === filterPlatform;

    return matchesTab && matchesSearch && matchesPlatform;
  });

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
        return "📹";
      case "google-meet":
        return "🎥";
      case "teams":
        return "💼";
      default:
        return "🖥️";
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
          <span>➕</span> Schedule New Class
        </button>
      </div>

      {/* Stats Grid */}
      <div className="vcm-stats">
        <motion.div className="stat-card" whileHover={{ y: -4 }}>
          <div className="stat-icon" style={{ background: "#dbeafe" }}>
            📚
          </div>
          <div className="stat-content">
            <div className="stat-value">{mockStats.totalClasses}</div>
            <div className="stat-label">Total Classes</div>
          </div>
        </motion.div>

        <motion.div
          className="stat-card stat-card--live"
          whileHover={{ y: -4 }}
        >
          <div className="stat-icon" style={{ background: "#dcfce7" }}>
            🔴
          </div>
          <div className="stat-content">
            <div className="stat-value">{mockStats.liveNow}</div>
            <div className="stat-label">Live Now</div>
          </div>
        </motion.div>

        <motion.div className="stat-card" whileHover={{ y: -4 }}>
          <div className="stat-icon" style={{ background: "#fef3c7" }}>
            📅
          </div>
          <div className="stat-content">
            <div className="stat-value">{mockStats.scheduledToday}</div>
            <div className="stat-label">Scheduled Today</div>
          </div>
        </motion.div>

        <motion.div className="stat-card" whileHover={{ y: -4 }}>
          <div className="stat-icon" style={{ background: "#e0e7ff" }}>
            ✅
          </div>
          <div className="stat-content">
            <div className="stat-value">{mockStats.completedThisWeek}</div>
            <div className="stat-label">Completed This Week</div>
          </div>
        </motion.div>

        <motion.div className="stat-card" whileHover={{ y: -4 }}>
          <div className="stat-icon" style={{ background: "#fce7f3" }}>
            👥
          </div>
          <div className="stat-content">
            <div className="stat-value">{mockStats.averageAttendance}%</div>
            <div className="stat-label">Avg Attendance</div>
          </div>
        </motion.div>

        <motion.div className="stat-card" whileHover={{ y: -4 }}>
          <div className="stat-icon" style={{ background: "#ddd6fe" }}>
            🎓
          </div>
          <div className="stat-content">
            <div className="stat-value">{mockStats.totalParticipants}</div>
            <div className="stat-label">Total Participants</div>
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
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search classes, courses, or instructors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="filter-group">
              <select
                className="filter-select"
                value={filterPlatform}
                onChange={(e) => setFilterPlatform(e.target.value)}
              >
                <option value="all">All Platforms</option>
                <option value="zoom">Zoom</option>
                <option value="google-meet">Google Meet</option>
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
              <span className="live-indicator">●</span> Live
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
                whileHover={{ x: 4 }}
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
                    {cls.status === "live" && (
                      <span className="pulse-dot">●</span>
                    )}
                    {cls.status}
                  </span>
                </div>

                <h3 className="class-card-title">{cls.title}</h3>
                <p className="class-card-course">{cls.course}</p>

                <div className="class-card-info">
                  <div className="info-item">
                    <span>👨‍🏫</span>
                    <span>{cls.instructor}</span>
                  </div>
                  <div className="info-item">
                    <span>🕐</span>
                    <span>
                      {formatTime(cls.startTime)} • {cls.duration}min
                    </span>
                  </div>
                  <div className="info-item">
                    <span>👥</span>
                    <span>
                      {cls.participants}/{cls.maxParticipants}
                    </span>
                  </div>
                </div>

                {cls.recordingAvailable && (
                  <div className="class-card-recording">
                    <span>📹</span> Recording Available
                  </div>
                )}
              </motion.div>
            ))}

            {filteredClasses.length === 0 && (
              <div className="empty-state">
                <div className="empty-state-icon">📭</div>
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
                <button className="btn-icon">⋮</button>
              </div>

              <div className="details-content">
                <div
                  className="details-banner"
                  style={{
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  }}
                >
                  <div className="banner-platform">
                    {getPlatformIcon(selectedClass.platform)}
                  </div>
                  <span
                    className="banner-status"
                    style={{
                      backgroundColor: getStatusColor(selectedClass.status),
                    }}
                  >
                    {selectedClass.status === "live" && (
                      <span className="pulse-dot">●</span>
                    )}
                    {selectedClass.status}
                  </span>
                </div>

                <div className="details-body">
                  <h3 className="details-title">{selectedClass.title}</h3>
                  <p className="details-course">{selectedClass.course}</p>

                  <div className="details-grid">
                    <div className="detail-item">
                      <div className="detail-label">Instructor</div>
                      <div className="detail-value">
                        <span className="detail-icon">👨‍🏫</span>
                        {selectedClass.instructor}
                      </div>
                    </div>

                    <div className="detail-item">
                      <div className="detail-label">Date & Time</div>
                      <div className="detail-value">
                        <span className="detail-icon">📅</span>
                        {formatDate(selectedClass.startTime)} at{" "}
                        {formatTime(selectedClass.startTime)}
                      </div>
                    </div>

                    <div className="detail-item">
                      <div className="detail-label">Duration</div>
                      <div className="detail-value">
                        <span className="detail-icon">⏱️</span>
                        {selectedClass.duration} minutes
                      </div>
                    </div>

                    <div className="detail-item">
                      <div className="detail-label">Participants</div>
                      <div className="detail-value">
                        <span className="detail-icon">👥</span>
                        {selectedClass.participants} /{" "}
                        {selectedClass.maxParticipants}
                      </div>
                    </div>

                    <div className="detail-item">
                      <div className="detail-label">Platform</div>
                      <div className="detail-value">
                        <span className="detail-icon">
                          {getPlatformIcon(selectedClass.platform)}
                        </span>
                        {selectedClass.platform === "zoom"
                          ? "Zoom"
                          : selectedClass.platform === "google-meet"
                          ? "Google Meet"
                          : "Microsoft Teams"}
                      </div>
                    </div>

                    <div className="detail-item">
                      <div className="detail-label">Meeting Link</div>
                      <div className="detail-value detail-link">
                        <span className="detail-icon">🔗</span>
                        <a
                          href={selectedClass.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Join Meeting
                        </a>
                      </div>
                    </div>
                  </div>

                  {selectedClass.recordingAvailable && (
                    <div className="recording-section">
                      <h4>📹 Recording Available</h4>
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
                      <button className="btn-primary btn-block btn-pulse">
                        <span>▶️</span> Join Live Class
                      </button>
                    )}
                    {selectedClass.status === "scheduled" && (
                      <>
                        <button className="btn-primary btn-block">
                          <span>✏️</span> Edit Class
                        </button>
                        <button className="btn-secondary btn-block">
                          <span>📧</span> Send Reminder
                        </button>
                      </>
                    )}
                    {selectedClass.status === "completed" && (
                      <button className="btn-secondary btn-block">
                        <span>📊</span> View Analytics
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="empty-details">
              <div className="empty-details-icon">🎥</div>
              <h3>Select a Class</h3>
              <p>Choose a class from the list to view details</p>
            </div>
          )}

          {/* Upcoming Classes */}
          <div className="upcoming-classes">
            <h3 className="upcoming-title">📅 Upcoming Classes</h3>
            <div className="upcoming-list">
              {mockUpcomingClasses.map((cls) => (
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
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2>Schedule New Virtual Class</h2>
                <button
                  className="modal-close"
                  onClick={() => setShowCreateModal(false)}
                >
                  ✕
                </button>
              </div>

              <div className="modal-body">
                <div className="form-group">
                  <label>Class Title *</label>
                  <input
                    type="text"
                    placeholder="e.g., Introduction to Machine Learning"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Course *</label>
                    <select>
                      <option>Select Course</option>
                      <option>CS401 - Data Structures</option>
                      <option>CS302 - Database Systems</option>
                      <option>CS501 - AI</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Platform *</label>
                    <select>
                      <option>Select Platform</option>
                      <option>Zoom</option>
                      <option>Google Meet</option>
                      <option>Microsoft Teams</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Date *</label>
                    <input type="date" />
                  </div>

                  <div className="form-group">
                    <label>Time *</label>
                    <input type="time" />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Duration (minutes) *</label>
                    <input type="number" placeholder="60" />
                  </div>

                  <div className="form-group">
                    <label>Max Participants *</label>
                    <input type="number" placeholder="50" />
                  </div>
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    rows="3"
                    placeholder="Add class description..."
                  ></textarea>
                </div>

                <div className="form-group">
                  <label className="checkbox-label">
                    <input type="checkbox" />
                    <span>Enable recording</span>
                  </label>
                  <label className="checkbox-label">
                    <input type="checkbox" />
                    <span>Send email notifications to participants</span>
                  </label>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  className="btn-secondary"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button className="btn-primary">Schedule Class</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
