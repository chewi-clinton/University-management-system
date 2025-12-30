import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import "../styles/pages/attendance.css";

// Mock Data
const mockAttendance = {
  overall: 92,
  total: 125,
  present: 115,
  absent: 10,
  byCourse: [
    {
      courseCode: "CS301",
      courseName: "Data Structures",
      percentage: 85,
      present: 34,
      total: 40,
      color: "#3b82f6",
    },
    {
      courseCode: "MA202",
      courseName: "Calculus II",
      percentage: 72,
      present: 28,
      total: 38,
      color: "#8b5cf6",
    },
    {
      courseCode: "EN101",
      courseName: "English Composition",
      percentage: 100,
      present: 30,
      total: 30,
      color: "#10b981",
    },
  ],
};

// Generate calendar data for last 42 days
const generateCalendarData = () => {
  const data = [];
  const today = new Date();
  const statuses = [
    "present",
    "present",
    "present",
    "present",
    "absent",
    "late",
    "holiday",
  ];

  for (let i = 41; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    data.push({
      date: date,
      day: date.getDate(),
      status: status,
    });
  }
  return data;
};

const Attendance = () => {
  const [expandedCourse, setExpandedCourse] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const calendarData = generateCalendarData();

  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "present":
        return "var(--success-500)";
      case "absent":
        return "var(--error-500)";
      case "late":
        return "var(--warning-500)";
      case "holiday":
        return "var(--neutral-500)";
      default:
        return "var(--neutral-200)";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "present":
        return "Present";
      case "absent":
        return "Absent";
      case "late":
        return "Late";
      case "holiday":
        return "Holiday";
      default:
        return "";
    }
  };

  const toggleCourse = (courseCode) => {
    setExpandedCourse(expandedCourse === courseCode ? null : courseCode);
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth };
  };

  const { firstDay, daysInMonth } = getDaysInMonth(currentMonth);
  const monthName = currentMonth.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="attendance">
      <motion.div
        className="attendance__container"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="attendance__header">
          <h1 className="attendance__title">Attendance</h1>
          <p className="attendance__subtitle">
            Track your attendance record and view detailed statistics
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div variants={itemVariants} className="attendance__stats-grid">
          {/* Overall Attendance */}
          <div className="attendance__stat-card attendance__stat-card--featured">
            <div className="attendance__circular-progress">
              <svg
                className="attendance__circular-progress-svg"
                width="120"
                height="120"
              >
                <circle
                  className="attendance__circular-progress-bg"
                  cx="60"
                  cy="60"
                  r="50"
                />
                <circle
                  className="attendance__circular-progress-fill"
                  cx="60"
                  cy="60"
                  r="50"
                  strokeDasharray={`${2 * Math.PI * 50}`}
                  strokeDashoffset={`${
                    2 * Math.PI * 50 * (1 - mockAttendance.overall / 100)
                  }`}
                />
              </svg>
              <div className="attendance__circular-progress-label">
                <div className="attendance__circular-progress-value">
                  {mockAttendance.overall}%
                </div>
              </div>
            </div>
            <h3 className="attendance__stat-card-title">Overall Attendance</h3>
            <p className="attendance__stat-card-subtitle">
              Excellent performance!
            </p>
          </div>

          {/* Total Classes */}
          <div className="attendance__stat-card">
            <div className="attendance__stat-card-content">
              <div className="attendance__stat-card-icon attendance__stat-card-icon--blue">
                <Calendar size={24} />
              </div>
              <div className="attendance__stat-card-info">
                <div className="attendance__stat-card-value">
                  {mockAttendance.total}
                </div>
                <div className="attendance__stat-card-label">Total Classes</div>
              </div>
            </div>
          </div>

          {/* Present */}
          <div className="attendance__stat-card">
            <div className="attendance__stat-card-content">
              <div className="attendance__stat-card-icon attendance__stat-card-icon--green">
                <CheckCircle size={24} />
              </div>
              <div className="attendance__stat-card-info">
                <div className="attendance__stat-card-value">
                  {mockAttendance.present}
                </div>
                <div className="attendance__stat-card-label">Present</div>
              </div>
            </div>
          </div>

          {/* Absent */}
          <div className="attendance__stat-card">
            <div className="attendance__stat-card-content">
              <div className="attendance__stat-card-icon attendance__stat-card-icon--red">
                <XCircle size={24} />
              </div>
              <div className="attendance__stat-card-info">
                <div className="attendance__stat-card-value">
                  {mockAttendance.absent}
                </div>
                <div className="attendance__stat-card-label">Missed</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Calendar Heatmap */}
        <motion.div
          variants={itemVariants}
          className="attendance__calendar-card"
        >
          <div className="attendance__calendar-header">
            <h2 className="attendance__calendar-title">Attendance Calendar</h2>
            <div className="attendance__calendar-nav">
              <button className="attendance__calendar-nav-btn">
                <ChevronLeft size={20} />
              </button>
              <span className="attendance__calendar-month">{monthName}</span>
              <button className="attendance__calendar-nav-btn">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="attendance__calendar-grid">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="attendance__calendar-day-label">
                {day}
              </div>
            ))}

            {Array(firstDay)
              .fill(null)
              .map((_, idx) => (
                <div
                  key={`empty-${idx}`}
                  className="attendance__calendar-day--empty"
                />
              ))}

            {calendarData.slice(0, daysInMonth).map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.1 }}
                className={`attendance__calendar-day attendance__calendar-day--${item.status}`}
                title={`${item.day} - ${getStatusLabel(item.status)}`}
                style={{ backgroundColor: getStatusColor(item.status) }}
              >
                {item.day}
              </motion.div>
            ))}
          </div>

          {/* Legend */}
          <div className="attendance__calendar-legend">
            <div className="attendance__legend-item">
              <div className="attendance__legend-dot attendance__legend-dot--present" />
              <span className="attendance__legend-label">Present</span>
            </div>
            <div className="attendance__legend-item">
              <div className="attendance__legend-dot attendance__legend-dot--absent" />
              <span className="attendance__legend-label">Absent</span>
            </div>
            <div className="attendance__legend-item">
              <div className="attendance__legend-dot attendance__legend-dot--late" />
              <span className="attendance__legend-label">Late</span>
            </div>
            <div className="attendance__legend-item">
              <div className="attendance__legend-dot attendance__legend-dot--holiday" />
              <span className="attendance__legend-label">Holiday</span>
            </div>
          </div>
        </motion.div>

        {/* Course Breakdown */}
        <motion.div variants={itemVariants} className="attendance__courses">
          <h2 className="attendance__courses-title">Course-wise Breakdown</h2>

          <div className="attendance__courses-list">
            {mockAttendance.byCourse.map((course) => (
              <div
                key={course.courseCode}
                className="attendance__course-card"
                onClick={() => toggleCourse(course.courseCode)}
              >
                <div className="attendance__course-header">
                  <div className="attendance__course-info">
                    <div
                      className="attendance__course-indicator"
                      style={{ backgroundColor: course.color }}
                    />
                    <div className="attendance__course-details">
                      <h3 className="attendance__course-title">
                        {course.courseCode} - {course.courseName}
                      </h3>
                      <p className="attendance__course-subtitle">
                        {course.present} / {course.total} classes attended
                      </p>
                    </div>
                  </div>
                  <div className="attendance__course-actions">
                    <div
                      className="attendance__course-percentage"
                      style={{ color: course.color }}
                    >
                      {course.percentage}%
                    </div>
                    {expandedCourse === course.courseCode ? (
                      <ChevronUp
                        size={20}
                        className="attendance__course-chevron"
                      />
                    ) : (
                      <ChevronDown
                        size={20}
                        className="attendance__course-chevron"
                      />
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="attendance__course-progress-bg">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${course.percentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="attendance__course-progress-fill"
                    style={{ backgroundColor: course.color }}
                  />
                </div>

                {/* Expanded Details */}
                {expandedCourse === course.courseCode && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="attendance__course-expanded"
                  >
                    <div className="attendance__course-stats">
                      <div className="attendance__course-stat">
                        <div className="attendance__course-stat-value attendance__course-stat-value--green">
                          {course.present}
                        </div>
                        <div className="attendance__course-stat-label">
                          Present
                        </div>
                      </div>
                      <div className="attendance__course-stat">
                        <div className="attendance__course-stat-value attendance__course-stat-value--red">
                          {course.total - course.present}
                        </div>
                        <div className="attendance__course-stat-label">
                          Absent
                        </div>
                      </div>
                      <div className="attendance__course-stat">
                        <div className="attendance__course-stat-value attendance__course-stat-value--blue">
                          {course.total}
                        </div>
                        <div className="attendance__course-stat-label">
                          Total
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Attendance;
