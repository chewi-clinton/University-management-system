import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/admin-pages/dashboard.css";
import {
  Users,
  GraduationCap,
  BookOpen,
  TrendingUp,
  TrendingDown,
  Calendar,
  Award,
  AlertTriangle,
  UserPlus,
  Activity,
  Clock,
  CheckCircle,
  MessageSquare,
  Bell,
  Eye,
  Download,
  Filter,
  RefreshCw,
  Building,
  Target,
  Zap,
  ArrowUpRight,
  FileText,
  BarChart3,
} from "lucide-react";
import { adminService } from "../services/api/adminService";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("month");
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // State for dashboard data
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalStudents: 0,
      totalFaculty: 0,
      totalCourses: 0,
      attendanceRate: 0,
      trends: {
        students: { value: "+0%", isPositive: true },
        faculty: { value: "+0", isPositive: true },
        courses: { value: "+0", isPositive: true },
        attendance: { value: "+0%", isPositive: true },
      },
    },
    enrollmentTrends: {
      labels: [],
      data: [],
    },
    departments: [],
    recentActivities: [],
    systemNotifications: [],
    gradeDistribution: [],
    upcomingEvents: [],
  });

  // Fetch all dashboard data
  const fetchDashboardData = async () => {
    try {
      setError(null);

      // Fetch all data in parallel
      const [
        statsResult,
        departmentsResult,
        enrollmentTrendsResult,
        gradeDistributionResult,
        noticesResult,
        upcomingEventsResult,
        systemNotificationsResult,
      ] = await Promise.all([
        adminService.getDashboardStats(),
        adminService.getDepartments(),
        adminService.getEnrollmentTrends(),
        adminService.getGradeDistribution(),
        adminService.getRecentNotices(5),
        adminService.getUpcomingEvents(),
        adminService.getSystemNotifications(),
      ]);

      // Check for errors
      if (!statsResult.success) throw new Error(statsResult.error);
      if (!departmentsResult.success) throw new Error(departmentsResult.error);
      if (!enrollmentTrendsResult.success)
        throw new Error(enrollmentTrendsResult.error);
      if (!gradeDistributionResult.success)
        throw new Error(gradeDistributionResult.error);

      // Build recent activities from notices
      const recentActivities = noticesResult.success
        ? noticesResult.data.map((notice, index) => ({
            id: notice.notice_id || index,
            type: getNoticeType(notice.priority),
            message: notice.title,
            time: formatTimeAgo(notice.post_date),
          }))
        : [];

      // Update state with fetched data
      setDashboardData({
        stats: {
          ...statsResult.data,
          trends: {
            students: { value: "+12%", isPositive: true },
            faculty: { value: "+5", isPositive: true },
            courses: { value: "+8", isPositive: true },
            attendance: { value: "+3.1%", isPositive: true },
          },
        },
        enrollmentTrends: enrollmentTrendsResult.data,
        departments: departmentsResult.data || [],
        recentActivities,
        systemNotifications: systemNotificationsResult.data || [],
        gradeDistribution: gradeDistributionResult.data || [],
        upcomingEvents: upcomingEventsResult.data || [],
      });
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setTimeout(() => setRefreshing(false), 1000);
  };

  // Helper function to get notice type for activity icon
  const getNoticeType = (priority) => {
    switch (priority) {
      case "high":
        return "notice_published";
      case "medium":
        return "exam_scheduled";
      case "low":
        return "course_added";
      default:
        return "notice_published";
    }
  };

  // Helper function to format time ago
  const formatTimeAgo = (dateString) => {
    if (!dateString) return "Recently";
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return date.toLocaleDateString();
  };

  const SimpleLineChart = ({
    data,
    labels,
    color = "#e87d26",
    height = 200,
  }) => {
    if (!data || data.length === 0) {
      return (
        <div
          style={{
            height,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <p style={{ color: "var(--neutral-500)" }}>No data available</p>
        </div>
      );
    }

    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;

    const points = data
      .map((value, index) => {
        const x = (index / (data.length - 1)) * 100;
        const y = 100 - ((value - min) / range) * 100;
        return `${x},${y}`;
      })
      .join(" ");

    return (
      <div className="simple-chart" style={{ height }}>
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="line-chart"
        >
          <polyline
            points={points}
            fill="none"
            stroke={color}
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
          <polyline
            points={`0,100 ${points} 100,100`}
            fill={`${color}20`}
            stroke="none"
          />
        </svg>
        {labels && (
          <div className="chart-labels">
            {labels.map((label, index) => (
              <span key={index}>{label}</span>
            ))}
          </div>
        )}
      </div>
    );
  };

  const SimpleBarChart = ({ data, labels, colors, height = 200 }) => {
    if (!data || data.length === 0) {
      return (
        <div
          style={{
            height,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <p style={{ color: "var(--neutral-500)" }}>No data available</p>
        </div>
      );
    }

    const max = Math.max(...data);

    return (
      <div className="simple-chart" style={{ height }}>
        <div className="bar-chart">
          {data.map((value, index) => (
            <div key={index} className="bar-item">
              <div className="bar-wrapper">
                <motion.div
                  className="bar"
                  style={{
                    backgroundColor: colors[index] || colors[0],
                    height: `${(value / max) * 100}%`,
                  }}
                  initial={{ height: 0 }}
                  animate={{ height: `${(value / max) * 100}%` }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                >
                  <span className="bar-value">{value}</span>
                </motion.div>
              </div>
              {labels && <span className="bar-label">{labels[index]}</span>}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const SimplePieChart = ({ data, colors, height = 200 }) => {
    if (!data || data.length === 0) {
      return (
        <div
          style={{
            height,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <p style={{ color: "var(--neutral-500)" }}>No data available</p>
        </div>
      );
    }

    const total = data.reduce((sum, item) => sum + item.percentage, 0);
    let currentAngle = -90;

    return (
      <div className="pie-chart-container" style={{ height }}>
        <svg viewBox="0 0 200 200" className="pie-chart">
          {data.map((item, index) => {
            const angle = (item.percentage / 100) * 360;
            const startAngle = currentAngle;
            currentAngle += angle;

            const startRad = (startAngle * Math.PI) / 180;
            const endRad = ((startAngle + angle) * Math.PI) / 180;
            const largeArc = angle > 180 ? 1 : 0;

            const x1 = 100 + 80 * Math.cos(startRad);
            const y1 = 100 + 80 * Math.sin(startRad);
            const x2 = 100 + 80 * Math.cos(endRad);
            const y2 = 100 + 80 * Math.sin(endRad);

            const path = `M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z`;

            return (
              <motion.path
                key={index}
                d={path}
                fill={colors[index]}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              />
            );
          })}
        </svg>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="dashboard dashboard--loading">
        <div className="skeleton">
          <div className="skeleton-header"></div>
          <div className="skeleton-stats">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="skeleton-stat"></div>
            ))}
          </div>
          <div className="skeleton-charts">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="skeleton-chart"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard">
        <div
          style={{
            padding: "2rem",
            textAlign: "center",
            color: "var(--error-500)",
          }}
        >
          <AlertTriangle size={48} style={{ marginBottom: "1rem" }} />
          <h2>Error Loading Dashboard</h2>
          <p>{error}</p>
          <button
            onClick={handleRefresh}
            className="btn-secondary"
            style={{ marginTop: "1rem" }}
          >
            <RefreshCw size={18} /> Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="dashboard"
    >
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>
            Welcome back! Here's what's happening with your university today.
          </p>
        </div>
        <div className="dashboard-actions">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="time-selector"
          >
            <option value="day">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
          <button className="btn-icon" onClick={handleRefresh}>
            <RefreshCw size={18} className={refreshing ? "spinning" : ""} />
          </button>
          <button className="btn-secondary">
            <Download size={18} /> Export
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="stats-grid">
        <motion.div
          className="stat-card stat-card--blue"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ y: -4 }}
        >
          <div className="stat-icon">
            <GraduationCap size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Total Students</div>
            <div className="stat-value">
              {dashboardData.stats.totalStudents.toLocaleString()}
            </div>
            <div className="stat-trend stat-trend--up">
              <TrendingUp size={14} />
              {dashboardData.stats.trends.students.value}
            </div>
          </div>
        </motion.div>

        <motion.div
          className="stat-card stat-card--green"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ y: -4 }}
        >
          <div className="stat-icon">
            <Users size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Faculty Members</div>
            <div className="stat-value">{dashboardData.stats.totalFaculty}</div>
            <div className="stat-trend stat-trend--up">
              <TrendingUp size={14} />
              {dashboardData.stats.trends.faculty.value}
            </div>
          </div>
        </motion.div>

        <motion.div
          className="stat-card stat-card--purple"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ y: -4 }}
        >
          <div className="stat-icon">
            <BookOpen size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Active Courses</div>
            <div className="stat-value">{dashboardData.stats.totalCourses}</div>
            <div className="stat-trend stat-trend--up">
              <TrendingUp size={14} />
              {dashboardData.stats.trends.courses.value}
            </div>
          </div>
        </motion.div>

        <motion.div
          className="stat-card stat-card--yellow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          whileHover={{ y: -4 }}
        >
          <div className="stat-icon">
            <Calendar size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Attendance Rate</div>
            <div className="stat-value">
              {dashboardData.stats.attendanceRate}%
            </div>
            <div className="stat-trend stat-trend--up">
              <TrendingUp size={14} />
              {dashboardData.stats.trends.attendance.value}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <motion.div
          className="chart-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="chart-header">
            <div>
              <h3>Enrollment Trends</h3>
              <p>Student enrollment over time</p>
            </div>
            <button className="btn-icon">
              <Download size={16} />
            </button>
          </div>
          <SimpleLineChart
            data={dashboardData.enrollmentTrends.data}
            labels={dashboardData.enrollmentTrends.labels}
            color="#e87d26"
            height={250}
          />
        </motion.div>

        <motion.div
          className="chart-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="chart-header">
            <div>
              <h3>Department Performance</h3>
              <p>Average GPA by department</p>
            </div>
            <button className="btn-icon">
              <Download size={16} />
            </button>
          </div>
          <SimpleBarChart
            data={dashboardData.departments.map((d) => parseFloat(d.avgGPA))}
            labels={dashboardData.departments.map((d) => d.code)}
            colors={dashboardData.departments.map((d) => d.color)}
            height={250}
          />
        </motion.div>

        <motion.div
          className="chart-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="chart-header">
            <div>
              <h3>Grade Distribution</h3>
              <p>Overall grades across all courses</p>
            </div>
            <button className="btn-icon">
              <Download size={16} />
            </button>
          </div>
          <SimplePieChart
            data={dashboardData.gradeDistribution}
            colors={["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#991b1b"]}
            height={250}
          />
          <div className="pie-legend">
            {dashboardData.gradeDistribution.map((item, index) => (
              <div key={index} className="legend-item">
                <span
                  className="legend-color"
                  style={{
                    backgroundColor: [
                      "#10b981",
                      "#3b82f6",
                      "#f59e0b",
                      "#ef4444",
                      "#991b1b",
                    ][index],
                  }}
                ></span>
                <span className="legend-label">{item.grade}</span>
                <span className="legend-value">{item.count}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Department Table */}
        <motion.div
          className="content-card content-card--wide"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="card-header">
            <div>
              <h3>Department Overview</h3>
              <p>Performance metrics by department</p>
            </div>
            <button className="btn-secondary btn-sm">
              <Eye size={14} /> View All
            </button>
          </div>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Department</th>
                  <th>Students</th>
                  <th>Faculty</th>
                  <th>Courses</th>
                  <th>Avg Attendance</th>
                  <th>Avg GPA</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.departments.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: "center" }}>
                      No departments found
                    </td>
                  </tr>
                ) : (
                  dashboardData.departments.map((dept) => (
                    <tr key={dept.id}>
                      <td>
                        <div className="dept-name">
                          <span
                            className="dept-badge"
                            style={{ backgroundColor: dept.color }}
                          ></span>
                          <div>
                            <div className="dept-code">{dept.code}</div>
                            <div className="dept-fullname">{dept.name}</div>
                          </div>
                        </div>
                      </td>
                      <td>{dept.students}</td>
                      <td>{dept.faculty}</td>
                      <td>{dept.courses}</td>
                      <td>
                        <div className="attendance-cell">
                          <div className="progress-bar">
                            <div
                              className="progress-fill"
                              style={{ width: `${dept.avgAttendance}%` }}
                            ></div>
                          </div>
                          <span>{dept.avgAttendance}%</span>
                        </div>
                      </td>
                      <td>
                        <span
                          className={`gpa-badge ${
                            parseFloat(dept.avgGPA) >= 3.5
                              ? "gpa-badge--high"
                              : ""
                          }`}
                        >
                          {dept.avgGPA}
                        </span>
                      </td>
                      <td>
                        <button className="action-btn">View Details</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Recent Activities */}
        <motion.div
          className="content-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <div className="card-header">
            <div>
              <h3>Recent Activities</h3>
              <p>Latest system updates</p>
            </div>
          </div>
          <div className="activities-list">
            {dashboardData.recentActivities.length === 0 ? (
              <p style={{ textAlign: "center", color: "var(--neutral-500)" }}>
                No recent activities
              </p>
            ) : (
              dashboardData.recentActivities.map((activity) => (
                <div key={activity.id} className="activity-item">
                  <div
                    className={`activity-icon activity-icon--${activity.type}`}
                  >
                    {activity.type === "student_registered" && (
                      <UserPlus size={16} />
                    )}
                    {activity.type === "grade_updated" && (
                      <TrendingUp size={16} />
                    )}
                    {activity.type === "attendance_marked" && (
                      <Calendar size={16} />
                    )}
                    {activity.type === "exam_scheduled" && <Award size={16} />}
                    {activity.type === "notice_published" && <Bell size={16} />}
                    {activity.type === "course_added" && <BookOpen size={16} />}
                  </div>
                  <div className="activity-content">
                    <p>{activity.message}</p>
                    <span>{activity.time}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>

      {/* System Notifications */}
      <motion.div
        className="notifications-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <div className="card-header">
          <div>
            <h3>System Notifications</h3>
            <p>Important alerts and reminders</p>
          </div>
          <button className="btn-link">Mark all as read</button>
        </div>
        <div className="notifications-list">
          {dashboardData.systemNotifications.length === 0 ? (
            <p style={{ textAlign: "center", color: "var(--neutral-500)" }}>
              No notifications
            </p>
          ) : (
            dashboardData.systemNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`notification-item notification-item--${notification.type}`}
              >
                <div className="notification-icon">
                  {notification.type === "warning" && (
                    <AlertTriangle size={18} />
                  )}
                  {notification.type === "info" && <Activity size={18} />}
                  {notification.type === "success" && <CheckCircle size={18} />}
                </div>
                <div className="notification-content">
                  <h4>{notification.title}</h4>
                  <p>{notification.message}</p>
                  <span>{notification.timestamp}</span>
                </div>
                {!notification.isRead && (
                  <div className="notification-badge"></div>
                )}
              </div>
            ))
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
