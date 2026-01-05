import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { adminService } from "../services/api/adminService";
import "../styles/admin-pages/Report.css";

import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  BookOpen,
  Download,
  Filter,
  Calendar,
  Eye,
  Target,
  Award,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Activity,
  Percent,
  Hash,
  GraduationCap,
  Building,
  Globe,
  Zap,
  UserCheck,
  RefreshCw,
} from "lucide-react";

export default function ReportsAnalytics() {
  const [activeTab, setActiveTab] = useState("overview");
  const [dateRange, setDateRange] = useState("month");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Data state
  const [overviewData, setOverviewData] = useState(null);
  const [enrollmentTrends, setEnrollmentTrends] = useState(null);
  const [programDistribution, setProgramDistribution] = useState(null);
  const [demographics, setDemographics] = useState(null);
  const [programPerformance, setProgramPerformance] = useState([]);
  const [courseCompletion, setCourseCompletion] = useState(null);
  const [attendanceStats, setAttendanceStats] = useState(null);
  const [topCourses, setTopCourses] = useState([]);
  const [monthlyAttendance, setMonthlyAttendance] = useState(null);

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "students", label: "Students", icon: Users },
    { id: "academic", label: "Academic", icon: BookOpen },
    { id: "attendance", label: "Attendance", icon: CheckCircle },
  ];

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadTabData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      const result = await adminService.getOverviewStatistics();
      if (result.success) {
        setOverviewData(result.data);
      }
      setError(null);
    } catch (err) {
      console.error("Error loading data:", err);
      setError("Failed to load report data");
    } finally {
      setLoading(false);
    }
  };

  const loadTabData = async () => {
    setLoading(true);
    try {
      switch (activeTab) {
        case "overview":
          await loadOverviewData();
          break;
        case "students":
          await loadStudentsData();
          break;
        case "academic":
          await loadAcademicData();
          break;
        case "attendance":
          await loadAttendanceData();
          break;
      }
    } catch (err) {
      console.error("Error loading tab data:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadOverviewData = async () => {
    const [trends, distribution] = await Promise.all([
      adminService.getEnrollmentTrends(),
      adminService.getProgramDistribution(),
    ]);

    if (trends.success) setEnrollmentTrends(trends.data);
    if (distribution.success) setProgramDistribution(distribution.data);
  };

  const loadStudentsData = async () => {
    const [demo, performance] = await Promise.all([
      adminService.getStudentDemographics(),
      adminService.getProgramPerformance(),
    ]);

    if (demo.success) setDemographics(demo.data);
    if (performance.success) setProgramPerformance(performance.data);
  };

  const loadAcademicData = async () => {
    const [completion, courses] = await Promise.all([
      adminService.getCourseCompletionRates(),
      adminService.getTopCourses(),
    ]);

    if (completion.success) setCourseCompletion(completion.data);
    if (courses.success) setTopCourses(courses.data);
  };

  const loadAttendanceData = async () => {
    const [stats, monthly] = await Promise.all([
      adminService.getAttendanceStatistics(),
      adminService.getMonthlyAttendanceTrends(),
    ]);

    if (stats.success) setAttendanceStats(stats.data);
    if (monthly.success) setMonthlyAttendance(monthly.data);
  };

  const SimpleLineChart = ({
    data,
    labels,
    color = "#3b82f6",
    height = 200,
  }) => {
    if (!data || data.length === 0)
      return <div className="chart-placeholder">No data available</div>;

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
      <div className="chart-container" style={{ height }}>
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
    if (!data || data.length === 0)
      return <div className="chart-placeholder">No data available</div>;

    const max = Math.max(...data);

    return (
      <div className="chart-container" style={{ height }}>
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

  const SimplePieChart = ({ data, labels, colors, height = 200 }) => {
    if (!data || data.length === 0)
      return <div className="chart-placeholder">No data available</div>;

    const total = data.reduce((sum, value) => sum + value, 0);
    let currentAngle = -90;

    const segments = data.map((value, index) => {
      const percentage = (value / total) * 100;
      const angle = (percentage / 100) * 360;
      const startAngle = currentAngle;
      currentAngle += angle;

      return {
        percentage,
        angle,
        startAngle,
        color: colors[index],
        label: labels[index],
        value,
      };
    });

    return (
      <div className="pie-chart-container" style={{ height }}>
        <div className="pie-chart">
          <svg viewBox="0 0 200 200">
            {segments.map((segment, index) => {
              const startRad = (segment.startAngle * Math.PI) / 180;
              const endRad =
                ((segment.startAngle + segment.angle) * Math.PI) / 180;
              const largeArc = segment.angle > 180 ? 1 : 0;

              const x1 = 100 + 80 * Math.cos(startRad);
              const y1 = 100 + 80 * Math.sin(startRad);
              const x2 = 100 + 80 * Math.cos(endRad);
              const y2 = 100 + 80 * Math.sin(endRad);

              const path = `M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z`;

              return (
                <motion.path
                  key={index}
                  d={path}
                  fill={segment.color}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                />
              );
            })}
          </svg>
        </div>
        <div className="pie-legend">
          {segments.map((segment, index) => (
            <div key={index} className="legend-item">
              <span
                className="legend-color"
                style={{ backgroundColor: segment.color }}
              ></span>
              <span className="legend-label">{segment.label}</span>
              <span className="legend-value">
                {segment.percentage.toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading && !overviewData) {
    return (
      <div className="reports-analytics">
        <div style={{ textAlign: "center", padding: "4rem" }}>
          <RefreshCw size={48} className="animate-spin" />
          <p style={{ marginTop: "1rem", color: "#6b7280" }}>
            Loading reports...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="reports-analytics">
      {/* Header */}
      <div className="ra-header">
        <div>
          <h1 className="ra-title">Reports & Analytics</h1>
          <p className="ra-subtitle">
            Comprehensive insights and performance metrics
          </p>
        </div>
        <div className="ra-header-actions">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="date-selector"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <button className="btn-secondary" onClick={loadData}>
            <RefreshCw size={16} />
            Refresh
          </button>
          <button className="btn-primary">
            <Download size={16} />
            Export Report
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="ra-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab ${activeTab === tab.id ? "tab--active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="ra-content"
        >
          {/* Overview Tab */}
          {activeTab === "overview" && overviewData && (
            <div className="ra-overview">
              <div className="metrics-grid">
                <motion.div
                  className="metric-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -4 }}
                >
                  <div
                    className="metric-icon"
                    style={{
                      backgroundColor: "#dbeafe",
                      color: "#3b82f6",
                    }}
                  >
                    <Users size={24} />
                  </div>
                  <div className="metric-content">
                    <div className="metric-label">Total Students</div>
                    <div className="metric-value">
                      {overviewData.totalStudents}
                    </div>
                    <div className="metric-change metric-change--up">
                      <TrendingUp size={14} />
                      +12%
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="metric-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  whileHover={{ y: -4 }}
                >
                  <div
                    className="metric-icon"
                    style={{
                      backgroundColor: "#dcfce7",
                      color: "#10b981",
                    }}
                  >
                    <UserCheck size={24} />
                  </div>
                  <div className="metric-content">
                    <div className="metric-label">Total Faculty</div>
                    <div className="metric-value">
                      {overviewData.totalFaculty}
                    </div>
                    <div className="metric-change metric-change--up">
                      <TrendingUp size={14} />
                      +5
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="metric-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  whileHover={{ y: -4 }}
                >
                  <div
                    className="metric-icon"
                    style={{
                      backgroundColor: "#fef3c7",
                      color: "#f59e0b",
                    }}
                  >
                    <Award size={24} />
                  </div>
                  <div className="metric-content">
                    <div className="metric-label">Average GPA</div>
                    <div className="metric-value">
                      {overviewData.averageGPA}
                    </div>
                    <div className="metric-change metric-change--down">
                      <TrendingDown size={14} />
                      -0.05
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="metric-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ y: -4 }}
                >
                  <div
                    className="metric-icon"
                    style={{
                      backgroundColor: "#ddd6fe",
                      color: "#8b5cf6",
                    }}
                  >
                    <CheckCircle size={24} />
                  </div>
                  <div className="metric-content">
                    <div className="metric-label">Attendance Rate</div>
                    <div className="metric-value">
                      {overviewData.attendanceRate}%
                    </div>
                    <div className="metric-change metric-change--up">
                      <TrendingUp size={14} />
                      +3.1%
                    </div>
                  </div>
                </motion.div>
              </div>

              <div className="charts-grid">
                {enrollmentTrends && (
                  <div className="chart-card">
                    <div className="chart-header">
                      <h3>Enrollment Trends</h3>
                      <button className="btn-icon">
                        <Download size={16} />
                      </button>
                    </div>
                    <SimpleLineChart
                      data={enrollmentTrends.data}
                      labels={enrollmentTrends.labels}
                      color="#3b82f6"
                      height={250}
                    />
                  </div>
                )}

                {programDistribution && (
                  <div className="chart-card">
                    <div className="chart-header">
                      <h3>Program Distribution</h3>
                      <button className="btn-icon">
                        <Download size={16} />
                      </button>
                    </div>
                    <SimplePieChart
                      data={programDistribution.data}
                      labels={programDistribution.labels}
                      colors={programDistribution.colors}
                      height={300}
                    />
                  </div>
                )}
              </div>

              <div className="quick-stats">
                <div className="stat-item">
                  <GraduationCap size={20} />
                  <div>
                    <div className="stat-value">156</div>
                    <div className="stat-label">Total Courses</div>
                  </div>
                </div>
                <div className="stat-item">
                  <Users size={20} />
                  <div>
                    <div className="stat-value">
                      {overviewData.totalFaculty}
                    </div>
                    <div className="stat-label">Faculty Members</div>
                  </div>
                </div>
                <div className="stat-item">
                  <Building size={20} />
                  <div>
                    <div className="stat-value">12</div>
                    <div className="stat-label">Departments</div>
                  </div>
                </div>
                <div className="stat-item">
                  <CheckCircle size={20} />
                  <div>
                    <div className="stat-value">92%</div>
                    <div className="stat-label">Success Rate</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Students Tab */}
          {activeTab === "students" && demographics && (
            <div className="ra-students">
              <div className="charts-grid">
                <div className="chart-card">
                  <div className="chart-header">
                    <h3>Students by Program</h3>
                    <button className="btn-icon">
                      <Download size={16} />
                    </button>
                  </div>
                  <SimpleBarChart
                    data={demographics.byProgram.data}
                    labels={demographics.byProgram.labels}
                    colors={demographics.byProgram.colors}
                    height={250}
                  />
                </div>

                <div className="chart-card">
                  <div className="chart-header">
                    <h3>GPA Distribution</h3>
                    <button className="btn-icon">
                      <Download size={16} />
                    </button>
                  </div>
                  <SimpleBarChart
                    data={demographics.gpaDistribution.data}
                    labels={demographics.gpaDistribution.labels}
                    colors={demographics.gpaDistribution.colors}
                    height={250}
                  />
                </div>
              </div>

              {programPerformance.length > 0 && (
                <div className="performance-table-card">
                  <div className="chart-header">
                    <h3>Program Performance</h3>
                    <button className="btn-secondary btn-sm">
                      <Download size={14} /> Export
                    </button>
                  </div>
                  <div className="table-container">
                    <table className="performance-table">
                      <thead>
                        <tr>
                          <th>Program</th>
                          <th>Students</th>
                          <th>Avg GPA</th>
                          <th>Pass Rate</th>
                          <th>Performance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {programPerformance.map((item) => (
                          <tr key={item.program}>
                            <td className="program-name">{item.program}</td>
                            <td>{item.students}</td>
                            <td>
                              <span className="gpa-badge">{item.avgGPA}</span>
                            </td>
                            <td>{item.passRate}%</td>
                            <td>
                              <div className="progress-bar">
                                <div
                                  className="progress-fill"
                                  style={{
                                    width: `${item.passRate}%`,
                                    backgroundColor:
                                      item.passRate >= 90
                                        ? "#10b981"
                                        : item.passRate >= 85
                                        ? "#3b82f6"
                                        : "#f59e0b",
                                  }}
                                ></div>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Academic Tab */}
          {activeTab === "academic" && (
            <div className="ra-academic">
              <div className="charts-grid">
                {courseCompletion && (
                  <div className="chart-card">
                    <div className="chart-header">
                      <h3>Course Completion Rates</h3>
                      <button className="btn-icon">
                        <Download size={16} />
                      </button>
                    </div>
                    <SimpleBarChart
                      data={courseCompletion.data}
                      labels={courseCompletion.labels}
                      colors={courseCompletion.colors}
                      height={250}
                    />
                  </div>
                )}

                {attendanceStats && (
                  <div className="chart-card">
                    <div className="chart-header">
                      <h3>Weekly Attendance</h3>
                      <button className="btn-icon">
                        <Download size={16} />
                      </button>
                    </div>
                    <SimpleLineChart
                      data={attendanceStats.weekly.data}
                      labels={attendanceStats.weekly.labels}
                      color="#8b5cf6"
                      height={250}
                    />
                    <div className="chart-footer">
                      Average: {attendanceStats.weekly.average}%
                    </div>
                  </div>
                )}
              </div>

              {topCourses.length > 0 && (
                <div className="top-courses-card">
                  <div className="chart-header">
                    <h3>Top Performing Courses</h3>
                    <button className="btn-secondary btn-sm">View All</button>
                  </div>
                  <div className="courses-list">
                    {topCourses.map((course, index) => (
                      <motion.div
                        key={course.name}
                        className="course-item"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="course-rank">#{index + 1}</div>
                        <div className="course-info">
                          <div className="course-name">{course.name}</div>
                          <div className="course-meta">
                            <span>
                              <Users size={14} /> {course.enrollment} students
                            </span>
                            <span>
                              <Award size={14} /> {course.rating} rating
                            </span>
                            <span>
                              <CheckCircle size={14} /> {course.completion}%
                              completion
                            </span>
                          </div>
                        </div>
                        <div className="course-badge">{course.completion}%</div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Attendance Tab */}
          {activeTab === "attendance" && attendanceStats && (
            <div className="ra-attendance">
              <div className="charts-grid">
                <div className="chart-card">
                  <div className="chart-header">
                    <h3>Weekly Attendance Pattern</h3>
                    <button className="btn-icon">
                      <Download size={16} />
                    </button>
                  </div>
                  <SimpleBarChart
                    data={attendanceStats.weekly.data}
                    labels={attendanceStats.weekly.labels}
                    colors={[
                      "#3b82f6",
                      "#3b82f6",
                      "#3b82f6",
                      "#3b82f6",
                      "#3b82f6",
                    ]}
                    height={250}
                  />
                  <div className="chart-footer">
                    Weekly Average: {attendanceStats.weekly.average}%
                  </div>
                </div>

                <div className="chart-card">
                  <div className="chart-header">
                    <h3>Attendance by Department</h3>
                    <button className="btn-icon">
                      <Download size={16} />
                    </button>
                  </div>
                  <SimpleBarChart
                    data={attendanceStats.byDepartment.data}
                    labels={attendanceStats.byDepartment.labels}
                    colors={attendanceStats.byDepartment.colors}
                    height={250}
                  />
                </div>
              </div>

              {monthlyAttendance && (
                <div className="charts-grid">
                  <div className="chart-card chart-card--wide">
                    <div className="chart-header">
                      <h3>Monthly Attendance Trends</h3>
                      <button className="btn-icon">
                        <Download size={16} />
                      </button>
                    </div>
                    <SimpleLineChart
                      data={monthlyAttendance.data}
                      labels={monthlyAttendance.labels}
                      color="#8b5cf6"
                      height={250}
                    />
                  </div>
                </div>
              )}

              <div className="insights-grid">
                <div className="insight-card">
                  <div
                    className="insight-icon"
                    style={{ backgroundColor: "#dcfce7", color: "#10b981" }}
                  >
                    <CheckCircle size={24} />
                  </div>
                  <div className="insight-content">
                    <div className="insight-value">
                      {attendanceStats.byDepartment.data[0]}%
                    </div>
                    <div className="insight-label">Best Department</div>
                    <div className="insight-detail">
                      {attendanceStats.byDepartment.labels[0]}
                    </div>
                  </div>
                </div>
                <div className="insight-card">
                  <div
                    className="insight-icon"
                    style={{ backgroundColor: "#fef3c7", color: "#f59e0b" }}
                  >
                    <AlertCircle size={24} />
                  </div>
                  <div className="insight-content">
                    <div className="insight-value">
                      {Math.min(...attendanceStats.byDepartment.data)}%
                    </div>
                    <div className="insight-label">Needs Improvement</div>
                    <div className="insight-detail">
                      {
                        attendanceStats.byDepartment.labels[
                          attendanceStats.byDepartment.data.indexOf(
                            Math.min(...attendanceStats.byDepartment.data)
                          )
                        ]
                      }
                    </div>
                  </div>
                </div>
                <div className="insight-card">
                  <div
                    className="insight-icon"
                    style={{ backgroundColor: "#dbeafe", color: "#3b82f6" }}
                  >
                    <TrendingUp size={24} />
                  </div>
                  <div className="insight-content">
                    <div className="insight-value">+2.3%</div>
                    <div className="insight-label">Month over Month</div>
                    <div className="insight-detail">Overall Improvement</div>
                  </div>
                </div>
                <div className="insight-card">
                  <div
                    className="insight-icon"
                    style={{ backgroundColor: "#e0e7ff", color: "#6366f1" }}
                  >
                    <Users size={24} />
                  </div>
                  <div className="insight-content">
                    <div className="insight-value">
                      {Math.round(
                        (attendanceStats.weekly.average / 100) *
                          (overviewData?.totalStudents || 0)
                      )}
                    </div>
                    <div className="insight-label">Present Today</div>
                    <div className="insight-detail">
                      {attendanceStats.weekly.average}% of total
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
