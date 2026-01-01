import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
} from "lucide-react";

// Mock Data
const mockData = {
  overview: {
    metrics: [
      {
        label: "Total Students",
        value: "1,247",
        change: "+12%",
        trend: "up",
        icon: Users,
        color: "#3b82f6",
      },
      {
        label: "Total Faculty",
        value: "89",
        change: "+5",
        trend: "up",
        icon: UserCheck,
        color: "#10b981",
      },
      {
        label: "Average GPA",
        value: "3.42",
        change: "-0.05",
        trend: "down",
        icon: Award,
        color: "#f59e0b",
      },
      {
        label: "Attendance Rate",
        value: "87.5%",
        change: "+3.1%",
        trend: "up",
        icon: CheckCircle,
        color: "#8b5cf6",
      },
    ],
    enrollmentTrends: {
      labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      datasets: [
        {
          label: "2024",
          data: [
            850, 920, 980, 1050, 1100, 1150, 1180, 1210, 1230, 1245, 1247, 1250,
          ],
          color: "#3b82f6",
        },
        {
          label: "2023",
          data: [
            750, 800, 850, 900, 950, 980, 1000, 1020, 1050, 1080, 1100, 1120,
          ],
          color: "#94a3b8",
        },
      ],
    },
    programDistribution: {
      labels: [
        "Computer Science",
        "Business Admin",
        "Engineering",
        "Mathematics",
        "Arts & Sciences",
      ],
      data: [31, 25, 24, 13, 7],
      colors: ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"],
    },
  },
  students: {
    demographics: {
      byProgram: {
        labels: [
          "Computer Science",
          "Business Admin",
          "Engineering",
          "Mathematics",
          "Arts & Sciences",
        ],
        data: [385, 312, 298, 156, 96],
        colors: ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"],
      },
      byYear: {
        labels: ["First Year", "Second Year", "Third Year", "Fourth Year"],
        data: [412, 385, 298, 152],
        colors: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"],
      },
      gpaDistribution: {
        labels: ["4.0", "3.5-3.9", "3.0-3.4", "2.5-2.9", "<2.5"],
        data: [89, 312, 498, 256, 92],
        colors: ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#991b1b"],
      },
    },
    performance: [
      {
        program: "Computer Science",
        students: 385,
        avgGPA: 3.65,
        passRate: 94,
      },
      { program: "Business Admin", students: 312, avgGPA: 3.42, passRate: 89 },
      { program: "Engineering", students: 298, avgGPA: 3.58, passRate: 91 },
      { program: "Mathematics", students: 156, avgGPA: 3.51, passRate: 87 },
      { program: "Arts & Sciences", students: 96, avgGPA: 3.38, passRate: 85 },
    ],
  },
  academic: {
    courseCompletion: {
      labels: [
        "Computer Science",
        "Mathematics",
        "English",
        "Business",
        "Physics",
        "Chemistry",
      ],
      data: [94, 87, 91, 89, 93, 85],
      colors: [
        "#3b82f6",
        "#8b5cf6",
        "#10b981",
        "#f59e0b",
        "#ef4444",
        "#06b6d4",
      ],
    },
    attendance: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      data: [89, 91, 88, 90, 85],
      average: 88.6,
    },
    topCourses: [
      {
        name: "Introduction to AI",
        enrollment: 245,
        rating: 4.8,
        completion: 96,
      },
      { name: "Data Structures", enrollment: 198, rating: 4.6, completion: 94 },
      {
        name: "Business Analytics",
        enrollment: 187,
        rating: 4.7,
        completion: 92,
      },
      { name: "Calculus II", enrollment: 176, rating: 4.5, completion: 88 },
      {
        name: "Digital Marketing",
        enrollment: 165,
        rating: 4.9,
        completion: 95,
      },
    ],
  },
  attendance: {
    weekly: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      data: [89, 91, 88, 90, 85],
      average: 88.6,
    },
    byDepartment: {
      labels: [
        "Computer Science",
        "Business",
        "Engineering",
        "Mathematics",
        "Arts",
      ],
      data: [92, 87, 89, 91, 85],
      colors: ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"],
    },
    monthly: {
      labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      data: [85, 86, 87, 88, 89, 88, 87, 89, 90, 89, 88, 87],
    },
  },
};

export default function ReportsAnalytics() {
  const [activeTab, setActiveTab] = useState("overview");
  const [dateRange, setDateRange] = useState("month");

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "students", label: "Students", icon: Users },
    { id: "academic", label: "Academic", icon: BookOpen },
    { id: "attendance", label: "Attendance", icon: CheckCircle },
  ];

  const SimpleLineChart = ({
    data,
    labels,
    color = "#3b82f6",
    height = 200,
  }) => {
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
          <button className="btn-secondary">
            <Filter size={16} />
            Filters
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
          {activeTab === "overview" && (
            <div className="ra-overview">
              <div className="metrics-grid">
                {mockData.overview.metrics.map((metric, index) => (
                  <motion.div
                    key={metric.label}
                    className="metric-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -4 }}
                  >
                    <div
                      className="metric-icon"
                      style={{
                        backgroundColor: `${metric.color}20`,
                        color: metric.color,
                      }}
                    >
                      <metric.icon size={24} />
                    </div>
                    <div className="metric-content">
                      <div className="metric-label">{metric.label}</div>
                      <div className="metric-value">{metric.value}</div>
                      <div
                        className={`metric-change metric-change--${metric.trend}`}
                      >
                        {metric.trend === "up" ? (
                          <TrendingUp size={14} />
                        ) : (
                          <TrendingDown size={14} />
                        )}
                        {metric.change}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="charts-grid">
                <div className="chart-card">
                  <div className="chart-header">
                    <h3>Enrollment Trends</h3>
                    <button className="btn-icon">
                      <Download size={16} />
                    </button>
                  </div>
                  <SimpleLineChart
                    data={mockData.overview.enrollmentTrends.datasets[0].data}
                    labels={mockData.overview.enrollmentTrends.labels}
                    color="#3b82f6"
                    height={250}
                  />
                </div>

                <div className="chart-card">
                  <div className="chart-header">
                    <h3>Program Distribution</h3>
                    <button className="btn-icon">
                      <Download size={16} />
                    </button>
                  </div>
                  <SimplePieChart
                    data={mockData.overview.programDistribution.data}
                    labels={mockData.overview.programDistribution.labels}
                    colors={mockData.overview.programDistribution.colors}
                    height={300}
                  />
                </div>
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
                    <div className="stat-value">89</div>
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
          {activeTab === "students" && (
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
                    data={mockData.students.demographics.byProgram.data}
                    labels={mockData.students.demographics.byProgram.labels}
                    colors={mockData.students.demographics.byProgram.colors}
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
                    data={mockData.students.demographics.gpaDistribution.data}
                    labels={
                      mockData.students.demographics.gpaDistribution.labels
                    }
                    colors={
                      mockData.students.demographics.gpaDistribution.colors
                    }
                    height={250}
                  />
                </div>
              </div>

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
                      {mockData.students.performance.map((item, index) => (
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
            </div>
          )}

          {/* Academic Tab */}
          {activeTab === "academic" && (
            <div className="ra-academic">
              <div className="charts-grid">
                <div className="chart-card">
                  <div className="chart-header">
                    <h3>Course Completion Rates</h3>
                    <button className="btn-icon">
                      <Download size={16} />
                    </button>
                  </div>
                  <SimpleBarChart
                    data={mockData.academic.courseCompletion.data}
                    labels={mockData.academic.courseCompletion.labels}
                    colors={mockData.academic.courseCompletion.colors}
                    height={250}
                  />
                </div>

                <div className="chart-card">
                  <div className="chart-header">
                    <h3>Weekly Attendance</h3>
                    <button className="btn-icon">
                      <Download size={16} />
                    </button>
                  </div>
                  <SimpleLineChart
                    data={mockData.academic.attendance.data}
                    labels={mockData.academic.attendance.labels}
                    color="#8b5cf6"
                    height={250}
                  />
                  <div className="chart-footer">
                    Average: {mockData.academic.attendance.average}%
                  </div>
                </div>
              </div>

              <div className="top-courses-card">
                <div className="chart-header">
                  <h3>Top Performing Courses</h3>
                  <button className="btn-secondary btn-sm">View All</button>
                </div>
                <div className="courses-list">
                  {mockData.academic.topCourses.map((course, index) => (
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
            </div>
          )}

          {/* Attendance Tab */}
          {activeTab === "attendance" && (
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
                    data={mockData.attendance.weekly.data}
                    labels={mockData.attendance.weekly.labels}
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
                    Weekly Average: {mockData.attendance.weekly.average}%
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
                    data={mockData.attendance.byDepartment.data}
                    labels={mockData.attendance.byDepartment.labels}
                    colors={mockData.attendance.byDepartment.colors}
                    height={250}
                  />
                </div>
              </div>

              <div className="charts-grid">
                <div className="chart-card chart-card--wide">
                  <div className="chart-header">
                    <h3>Monthly Attendance Trends</h3>
                    <button className="btn-icon">
                      <Download size={16} />
                    </button>
                  </div>
                  <SimpleLineChart
                    data={mockData.attendance.monthly.data}
                    labels={mockData.attendance.monthly.labels}
                    color="#8b5cf6"
                    height={250}
                  />
                </div>
              </div>

              <div className="insights-grid">
                <div className="insight-card">
                  <div
                    className="insight-icon"
                    style={{ backgroundColor: "#dcfce7", color: "#10b981" }}
                  >
                    <CheckCircle size={24} />
                  </div>
                  <div className="insight-content">
                    <div className="insight-value">92%</div>
                    <div className="insight-label">Best Department</div>
                    <div className="insight-detail">Computer Science</div>
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
                    <div className="insight-value">85%</div>
                    <div className="insight-label">Needs Improvement</div>
                    <div className="insight-detail">Arts Department</div>
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
                    <div className="insight-value">1,089</div>
                    <div className="insight-label">Present Today</div>
                    <div className="insight-detail">87% of total</div>
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
