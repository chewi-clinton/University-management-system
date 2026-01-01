import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
  GraduationCap,
  BookOpen,
  TrendingUp,
  Calendar,
  Award,
  AlertTriangle,
  UserPlus,
  Activity,
  DollarSign,
  Clock,
  CheckCircle,
  MessageSquare,
} from "lucide-react";
import QuickStats from "../components/shared/admin/QuickStats";
import LineChart from "../components/shared/charts/LineChart";
import BarChart from "../components/shared/charts/BarChart";
import PieChart from "../components/shared/charts/PieChart";
import "../styles/admin-pages/dashboard.css";
import "../styles/admin-pages/admin-styles.css";
import {
  mockDashboardStats,
  mockDepartmentStats,
  mockRecentActivities,
  mockSystemNotifications,
} from "../mock-data/adminMockData";
import { mockReports } from "../mock-data/reportsMock";
import { mockAttendanceTrends } from "../mock-data/attendanceMock";
import { mockGradeDistribution } from "../mock-data/gradesMock";

export default function AdminDashboard() {
  const [stats, setStats] = useState(mockDashboardStats);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("week");

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const quickStats = [
    {
      title: "Total Students",
      value: stats.totalStudents.toLocaleString(),
      trend: stats.trends.students.value,
      isPositive: stats.trends.students.isPositive,
      icon: <GraduationCap size={24} />,
      color: "blue",
      action: () => console.log("Navigate to students"),
    },
    {
      title: "Faculty Members",
      value: stats.totalFaculty.toString(),
      trend: stats.trends.faculty.value,
      isPositive: stats.trends.faculty.isPositive,
      icon: <Users size={24} />,
      color: "green",
    },
    {
      title: "Active Courses",
      value: stats.totalCourses.toString(),
      trend: "+8",
      isPositive: true,
      icon: <BookOpen size={24} />,
      color: "purple",
    },
    {
      title: "Attendance Rate",
      value: `${stats.attendanceRate}%`,
      trend: stats.trends.attendance.value,
      isPositive: stats.trends.attendance.isPositive,
      icon: <Calendar size={24} />,
      color: "yellow",
    },
  ];

  const departmentData = mockDepartmentStats.map((dept) => ({
    name: dept.code,
    value: dept.avgGPA,
    fullName: dept.name,
    students: dept.students,
    color: dept.color,
  }));

  const gradeData = mockGradeDistribution.overall.map((grade) => grade.count);
  const gradeLabels = mockGradeDistribution.overall.map((grade) => grade.grade);
  const gradeColors = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#991b1b"];

  if (loading) {
    return (
      <div className="admin-dashboard admin-dashboard--loading">
        <div className="admin-dashboard__skeleton">
          <div className="admin-dashboard__skeleton-header"></div>
          <div className="admin-dashboard__skeleton-stats">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="admin-dashboard__skeleton-stat"></div>
            ))}
          </div>
          <div className="admin-dashboard__skeleton-charts">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="admin-dashboard__skeleton-chart"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="admin-dashboard"
    >
      {/* Header */}
      <div className="admin-dashboard__header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>
            Welcome back! Here's what's happening with your university today.
          </p>
        </div>
        <div className="admin-dashboard__header-actions">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="admin-dashboard__time-selector"
          >
            <option value="day">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      {/* Quick Stats */}
      <QuickStats stats={quickStats} />

      {/* Charts Section */}
      <div className="admin-dashboard__charts">
        <motion.div
          className="admin-dashboard__chart-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="admin-dashboard__chart-header">
            <h3>Enrollment Trends</h3>
            <p>Student enrollment over time</p>
          </div>
          <div className="admin-dashboard__chart-content">
            <LineChart
              data={mockReports.enrollmentTrends.data}
              labels={mockReports.enrollmentTrends.labels}
              color="#3b82f6"
              height={250}
            />
          </div>
        </motion.div>

        <motion.div
          className="admin-dashboard__chart-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="admin-dashboard__chart-header">
            <h3>Department Performance</h3>
            <p>Average GPA by department</p>
          </div>
          <div className="admin-dashboard__chart-content">
            <BarChart
              data={departmentData.map((d) => d.value)}
              labels={departmentData.map((d) => d.name)}
              colors={departmentData.map((d) => d.color)}
              height={250}
            />
          </div>
        </motion.div>

        <motion.div
          className="admin-dashboard__chart-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="admin-dashboard__chart-header">
            <h3>Grade Distribution</h3>
            <p>Overall grades across all courses</p>
          </div>
          <div className="admin-dashboard__chart-content">
            <PieChart
              data={gradeData}
              labels={gradeLabels}
              colors={gradeColors}
              height={250}
            />
          </div>
        </motion.div>
      </div>

      {/* Bottom Section */}
      <div className="admin-dashboard__bottom">
        {/* Department Overview */}
        <motion.div
          className="admin-dashboard__departments"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="admin-dashboard__section-header">
            <h3>Department Overview</h3>
            <p>Performance metrics by department</p>
          </div>
          <div className="admin-dashboard__table-wrapper">
            <table className="admin-dashboard__table">
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
                {mockDepartmentStats.map((dept) => (
                  <tr key={dept.id}>
                    <td>
                      <div className="admin-dashboard__dept-name">
                        <span
                          className="admin-dashboard__dept-badge"
                          style={{ backgroundColor: dept.color }}
                        />
                        <div>
                          <div className="admin-dashboard__dept-code">
                            {dept.code}
                          </div>
                          <div className="admin-dashboard__dept-fullname">
                            {dept.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>{dept.students}</td>
                    <td>{dept.faculty}</td>
                    <td>{dept.courses}</td>
                    <td>
                      <div className="admin-dashboard__attendance">
                        <div className="admin-dashboard__attendance-bar">
                          <div
                            className="admin-dashboard__attendance-fill"
                            style={{ width: `${dept.avgAttendance}%` }}
                          />
                        </div>
                        <span>{dept.avgAttendance}%</span>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`admin-dashboard__gpa ${
                          dept.avgGPA >= 3.5 ? "admin-dashboard__gpa--high" : ""
                        }`}
                      >
                        {dept.avgGPA}
                      </span>
                    </td>
                    <td>
                      <button className="admin-dashboard__action-btn">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Recent Activities */}
        <motion.div
          className="admin-dashboard__activities"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="admin-dashboard__section-header">
            <h3>Recent Activities</h3>
            <p>Latest system updates</p>
          </div>
          <div className="admin-dashboard__activities-list">
            {mockRecentActivities.map((activity) => (
              <div key={activity.id} className="admin-dashboard__activity">
                <div
                  className={`admin-dashboard__activity-icon admin-dashboard__activity-icon--${activity.type}`}
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
                  {activity.type === "notice_published" && (
                    <Activity size={16} />
                  )}
                </div>
                <div className="admin-dashboard__activity-content">
                  <p>{activity.message}</p>
                  <span>{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* System Notifications */}
      <motion.div
        className="admin-dashboard__notifications"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <div className="admin-dashboard__section-header">
          <h3>System Notifications</h3>
          <p>Important alerts and reminders</p>
        </div>
        <div className="admin-dashboard__notifications-list">
          {mockSystemNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`admin-dashboard__notification admin-dashboard__notification--${notification.type}`}
            >
              <div className="admin-dashboard__notification-icon">
                {notification.type === "warning" && <AlertTriangle size={18} />}
                {notification.type === "info" && <Activity size={18} />}
                {notification.type === "success" && <CheckCircle size={18} />}
              </div>
              <div className="admin-dashboard__notification-content">
                <h4>{notification.title}</h4>
                <p>{notification.message}</p>
                <span>{notification.timestamp}</span>
              </div>
              {!notification.isRead && (
                <div className="admin-dashboard__notification-badge"></div>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
