import { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  BookOpen,
  Download,
  Filter,
} from "lucide-react";

import LineChart from "../components/shared/charts/LineChart";
import BarChart from "../components/shared/charts/BarChart";
import PieChart from "../components/shared/charts/PieChart";
import { mockReports } from "../mock-data/reportsMock";

export default function ReportsAnalytics() {
  const [activeTab, setActiveTab] = useState("overview");
  const [dateRange, setDateRange] = useState("month");

  const tabs = [
    { id: "overview", label: "Overview", icon: <BarChart3 size={18} /> },
    { id: "students", label: "Students", icon: <Users size={18} /> },
    { id: "finance", label: "Finance", icon: <DollarSign size={18} /> },
    { id: "academic", label: "Academic", icon: <BookOpen size={18} /> },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="reports-analytics"
    >
      <div className="reports-analytics__header">
        <div>
          <h1>Reports & Analytics</h1>
          <p>Comprehensive insights and performance metrics</p>
        </div>
        <div className="reports-analytics__header-actions">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="reports-analytics__date-selector"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <button className="btn btn--secondary">
            <Download size={16} />
            Export Report
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="reports-analytics__tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`reports-analytics__tab ${
              activeTab === tab.id ? "reports-analytics__tab--active" : ""
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="reports-analytics__content">
        {activeTab === "overview" && (
          <div className="reports-analytics__overview">
            <div className="reports-analytics__charts">
              <div className="reports-analytics__chart-card">
                <h3>Enrollment Trends</h3>
                <LineChart
                  data={mockReports.enrollmentTrends.data}
                  labels={mockReports.enrollmentTrends.labels}
                  color="#3b82f6"
                  height={300}
                />
              </div>
              <div className="reports-analytics__chart-card">
                <h3>Revenue Distribution</h3>
                <PieChart
                  data={[10500, 1200, 800, 650, 350]}
                  labels={["Tuition", "Hostel", "Library", "Lab", "Other"]}
                  colors={[
                    "#3b82f6",
                    "#10b981",
                    "#f59e0b",
                    "#ef4444",
                    "#8b5cf6",
                  ]}
                  height={300}
                />
              </div>
              <div className="reports-analytics__chart-card">
                <h3>Department Performance</h3>
                <BarChart
                  data={[3.65, 3.58, 3.42, 3.51]}
                  labels={["CS", "MATH", "ENG", "BUS"]}
                  colors={["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b"]}
                  height={300}
                />
              </div>
            </div>

            <div className="reports-analytics__metrics">
              <div className="metric-card">
                <div className="metric-card__header">
                  <h4>Key Metrics</h4>
                </div>
                <div className="metric-card__content">
                  <div className="metric-item">
                    <span className="metric-label">Total Students</span>
                    <span className="metric-value">1,247</span>
                  </div>
                  <div className="metric-item">
                    <span className="metric-label">Total Faculty</span>
                    <span className="metric-value">89</span>
                  </div>
                  <div className="metric-item">
                    <span className="metric-label">Total Courses</span>
                    <span className="metric-value">156</span>{" "}
                    {/* ← Fixed: class → className */}
                  </div>
                  <div className="metric-item">
                    <span className="metric-label">Attendance Rate</span>
                    <span className="metric-value">87.5%</span>{" "}
                    {/* ← Fixed: class → className */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "students" && (
          <div className="reports-analytics__students">
            <h3>Student Analytics</h3>
            <div className="reports-analytics__chart-card">
              <h4>GPA Distribution</h4>
              <BarChart
                data={[245, 312, 198, 89, 45]}
                labels={["A", "B", "C", "D", "F"]}
                colors={["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#991b1b"]}
                height={300}
              />
            </div>
          </div>
        )}

        {activeTab === "finance" && (
          <div className="reports-analytics__finance">
            <h3>Financial Reports</h3>
            <div className="reports-analytics__chart-card">
              <h4>Revenue vs Expenses</h4>
              <LineChart
                data={[
                  800, 850, 900, 950, 1000, 1100, 1200, 1300, 1400, 1350, 1200,
                  1100,
                ]}
                labels={[
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
                ]}
                color="#10b981"
                height={300}
              />
            </div>
          </div>
        )}

        {activeTab === "academic" && (
          <div className="reports-analytics__academic">
            <h3>Academic Performance</h3>
            <div className="reports-analytics__chart-card">
              <h4>Course Completion Rates</h4>
              <BarChart
                data={[94, 87, 91, 89, 93, 85]}
                labels={["CS", "MATH", "ENG", "BUS", "PHY", "CHEM"]}
                colors={[
                  "#3b82f6",
                  "#8b5cf6",
                  "#10b981",
                  "#f59e0b",
                  "#ef4444",
                  "#06b6d4",
                ]}
                height={300}
              />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
