import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import { studentService } from "../services/api/studentService.js";
import "../styles/pages/attendance.css";

const Attendance = () => {
  const [attendanceData, setAttendanceData] = useState(null);
  const [attendanceSummary, setAttendanceSummary] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedCourse, setExpandedCourse] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [studentId, setStudentId] = useState(null);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get student profile first to get student ID
        const profileResponse = await studentService.getMyProfile();
        if (!profileResponse.success) {
          throw new Error(profileResponse.error);
        }
        const studentId = profileResponse.data.student_id;
        setStudentId(studentId);

        // Fetch attendance summary
        const summaryResponse = await studentService.getAttendance(studentId);
        if (summaryResponse.success) {
          setAttendanceSummary(summaryResponse.data);
        }

        // Fetch detailed attendance records
        const recordsResponse = await studentService.getAttendanceRecords();
        if (recordsResponse.success) {
          setAttendanceRecords(recordsResponse.data);
        }

        // Calculate overall statistics
        calculateOverallStats(summaryResponse.data);
      } catch (err) {
        console.error("Error fetching attendance:", err);
        setError(err.message || "Failed to load attendance data");
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceData();
  }, []);

  const calculateOverallStats = (summaryData) => {
    if (!summaryData || summaryData.length === 0) {
      setAttendanceData({
        overall: 0,
        total: 0,
        present: 0,
        absent: 0,
        byCourse: [],
      });
      return;
    }

    let totalClasses = 0;
    let totalPresent = 0;
    const courseData = [];

    summaryData.forEach((summary) => {
      const total = summary.total_classes || 0;
      const present = summary.present_count || 0;
      const absent = summary.absent_count || 0;
      const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

      totalClasses += total;
      totalPresent += present;

      courseData.push({
        courseCode: summary.offering?.course?.course_code || "N/A",
        courseName: summary.offering?.course?.course_name || "Unknown Course",
        percentage: percentage,
        present: present,
        total: total,
        absent: absent,
        color: getRandomColor(),
        summaryId: summary.summary_id,
        offeringId: summary.offering?.offering_id,
      });
    });

    const overallPercentage =
      totalClasses > 0 ? Math.round((totalPresent / totalClasses) * 100) : 0;

    setAttendanceData({
      overall: overallPercentage,
      total: totalClasses,
      present: totalPresent,
      absent: totalClasses - totalPresent,
      byCourse: courseData,
    });
  };

  const getRandomColor = () => {
    const colors = [
      "#3b82f6",
      "#8b5cf6",
      "#10b981",
      "#f59e0b",
      "#ec4899",
      "#06b6d4",
      "#f97316",
      "#6366f1",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const generateCalendarData = () => {
    if (!attendanceRecords || attendanceRecords.length === 0) {
      return [];
    }

    const data = [];
    const today = new Date();

    // Group attendance records by date
    const recordsByDate = {};
    attendanceRecords.forEach((record) => {
      const date = new Date(record.attendance_date);
      const dateKey = date.toISOString().split("T")[0];
      if (!recordsByDate[dateKey]) {
        recordsByDate[dateKey] = [];
      }
      recordsByDate[dateKey].push(record);
    });

    // Generate calendar data for last 42 days
    for (let i = 41; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split("T")[0];

      let status = "none";
      if (recordsByDate[dateKey]) {
        const records = recordsByDate[dateKey];
        // If any record is absent, mark as absent
        // If all present, mark as present
        // If mixed, mark as late (partial attendance)
        const hasAbsent = records.some((r) => r.status === "absent");
        const hasPresent = records.some((r) => r.status === "present");

        if (hasAbsent && !hasPresent) {
          status = "absent";
        } else if (hasPresent && !hasAbsent) {
          status = "present";
        } else if (hasPresent && hasAbsent) {
          status = "late";
        }
      }

      // Check if it's a weekend (Saturday or Sunday)
      const dayOfWeek = date.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        status = "holiday";
      }

      data.push({
        date: date,
        day: date.getDate(),
        status: status,
      });
    }
    return data;
  };

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
        return "Partial";
      case "holiday":
        return "Holiday";
      default:
        return "No Class";
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

  const changeMonth = (direction) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + direction);
    setCurrentMonth(newMonth);
  };

  const { firstDay, daysInMonth } = getDaysInMonth(currentMonth);
  const monthName = currentMonth.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  if (loading) {
    return (
      <div className="attendance">
        <div className="attendance__container">
          <div
            className="skeleton"
            style={{ height: "80px", marginBottom: "24px" }}
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "24px",
              marginBottom: "24px",
            }}
          >
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="skeleton"
                style={{ height: "150px", borderRadius: "12px" }}
              />
            ))}
          </div>
          <div
            className="skeleton"
            style={{ height: "400px", borderRadius: "12px" }}
          />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="attendance">
        <div className="attendance__container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              textAlign: "center",
              padding: "48px",
              backgroundColor: "var(--color-error-light, #fef2f2)",
              borderRadius: "12px",
            }}
          >
            <AlertCircle
              size={48}
              style={{
                color: "var(--color-error, #ef4444)",
                marginBottom: "16px",
              }}
            />
            <h3
              style={{
                fontSize: "20px",
                fontWeight: "600",
                marginBottom: "8px",
              }}
            >
              Failed to Load Attendance
            </h3>
            <p
              style={{
                color: "var(--color-text-secondary, #6b7280)",
                marginBottom: "24px",
              }}
            >
              {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: "10px 20px",
                backgroundColor: "var(--color-primary, #6366f1)",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Retry
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  if (!attendanceData) {
    return null;
  }

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
                    2 * Math.PI * 50 * (1 - attendanceData.overall / 100)
                  }`}
                />
              </svg>
              <div className="attendance__circular-progress-label">
                <div className="attendance__circular-progress-value">
                  {attendanceData.overall}%
                </div>
              </div>
            </div>
            <h3 className="attendance__stat-card-title">Overall Attendance</h3>
            <p className="attendance__stat-card-subtitle">
              {attendanceData.overall >= 90
                ? "Excellent performance!"
                : attendanceData.overall >= 75
                ? "Good attendance"
                : "Needs improvement"}
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
                  {attendanceData.total}
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
                  {attendanceData.present}
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
                  {attendanceData.absent}
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
              <button
                className="attendance__calendar-nav-btn"
                onClick={() => changeMonth(-1)}
              >
                <ChevronLeft size={20} />
              </button>
              <span className="attendance__calendar-month">{monthName}</span>
              <button
                className="attendance__calendar-nav-btn"
                onClick={() => changeMonth(1)}
              >
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
              <span className="attendance__legend-label">Partial</span>
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

          {attendanceData.byCourse.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "48px",
                color: "var(--color-text-secondary, #6b7280)",
              }}
            >
              No attendance records found
            </div>
          ) : (
            <div className="attendance__courses-list">
              {attendanceData.byCourse.map((course) => (
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
                            {course.absent}
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
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Attendance;
