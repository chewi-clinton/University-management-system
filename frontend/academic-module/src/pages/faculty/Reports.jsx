// src/pages/faculty/Reports.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import Card from "../../components/shared/layout/Card";
import Select from "../../components/shared/ui/Select";
import Button from "../../components/shared/ui/Button";
import DatePicker from "../../components/shared/ui/DatePicker";
import LineChart from "../../components/shared/charts/LineChart";
import BarChart from "../../components/shared/charts/BarChart";
import PieChart from "../../components/shared/charts/PieChart";
import Table from "../../components/shared/ui/Table";
import "../../styles/pages/Reports.css";

// Embedded mock data directly in the file (no external import required)
const mockFacultyCourses = [
  { id: 1, code: "CS301", name: "Data Structures", section: "A" },
  { id: 2, code: "CS201", name: "Programming Fundamentals", section: "B" },
  { id: 3, code: "CS401", name: "Advanced Algorithms", section: "A" },
];

const mockStudents = [
  {
    id: 1,
    name: "John Doe",
    regNumber: "UNI-2024-0123",
    gpa: 3.8,
    attendance: 92,
  },
  {
    id: 2,
    name: "Jane Smith",
    regNumber: "UNI-2024-0124",
    gpa: 3.9,
    attendance: 95,
  },
  {
    id: 3,
    name: "Mike Chen",
    regNumber: "UNI-2024-0125",
    gpa: 3.2,
    attendance: 78,
  },
  {
    id: 4,
    name: "Sarah Johnson",
    regNumber: "UNI-2024-0126",
    gpa: 3.6,
    attendance: 89,
  },
  {
    id: 5,
    name: "David Lee",
    regNumber: "UNI-2024-0127",
    gpa: 2.9,
    attendance: 72,
  },
];

const Reports = () => {
  const [reportType, setReportType] = useState("course-performance");
  const [selectedCourse, setSelectedCourse] = useState(
    mockFacultyCourses[0].id
  );
  const [dateFrom, setDateFrom] = useState("2024-01-01");
  const [dateTo, setDateTo] = useState("2024-12-31");

  // Report content based on selected type using embedded mock data
  const getReportContent = () => {
    switch (reportType) {
      case "course-performance":
        return {
          charts: [
            {
              type: "bar",
              title: "Grade Distribution",
              data: [
                { name: "A", Students: 12 },
                { name: "A-", Students: 10 },
                { name: "B+", Students: 18 },
                { name: "B", Students: 8 },
                { name: "C", Students: 3 },
                { name: "F", Students: 2 },
              ],
            },
            {
              type: "line",
              title: "GPA Trend Over Semesters",
              data: [
                { name: "Fall 2022", GPA: 3.4 },
                { name: "Spring 2023", GPA: 3.5 },
                { name: "Fall 2023", GPA: 3.6 },
                { name: "Spring 2024", GPA: 3.7 },
                { name: "Fall 2024", GPA: 3.8 },
              ],
            },
          ],
          table: {
            title: "Top 5 Performers",
            columns: ["Rank", "Student", "Reg #", "GPA", "Attendance %"],
            rows: mockStudents
              .sort((a, b) => b.gpa - a.gpa)
              .slice(0, 5)
              .map((s, i) => [
                i + 1,
                s.name,
                s.regNumber,
                s.gpa.toFixed(2),
                s.attendance,
              ]),
          },
          stats: {
            Average: "78%",
            Median: "80%",
            "Pass Rate": "92%",
            "Std Dev": "8.5",
          },
        };

      case "attendance":
        return {
          charts: [
            {
              type: "line",
              title: "Attendance Trend (Last 30 Days)",
              data: [
                { name: "Week 1", Attendance: 85 },
                { name: "Week 2", Attendance: 88 },
                { name: "Week 3", Attendance: 82 },
                { name: "Week 4", Attendance: 90 },
                { name: "Week 5", Attendance: 87 },
              ],
            },
          ],
          table: {
            title: "Student Attendance Summary",
            columns: [
              "Student",
              "Reg #",
              "Present",
              "Absent",
              "Late",
              "Percentage",
            ],
            rows: mockStudents.map((s) => [
              s.name,
              s.regNumber,
              Math.round((s.attendance / 100) * 45),
              5,
              2,
              `${s.attendance}%`,
            ]),
          },
        };

      case "grade-distribution":
        return {
          charts: [
            {
              type: "pie",
              title: "Overall Grade Distribution",
              data: [
                { name: "A", value: 30 },
                { name: "B+", value: 25 },
                { name: "B", value: 20 },
                { name: "C", value: 15 },
                { name: "F", value: 10 },
              ],
            },
            {
              type: "bar",
              title: "Assessment-wise Average Marks",
              data: [
                { name: "Assignment 1", Average: 42 },
                { name: "Assignment 2", Average: 45 },
                { name: "Midterm", Average: 35 },
                { name: "Final", Average: 82 },
              ],
            },
          ],
          stats: {
            Average: "78%",
            Median: "80%",
            "Pass Rate": "92%",
            Highest: "95%",
            Lowest: "62%",
          },
        };

      case "student-progress":
        return {
          charts: [
            {
              type: "line",
              title: "Individual Performance Trend - John Doe",
              data: [
                { name: "Assignment 1", Score: 45 },
                { name: "Assignment 2", Score: 48 },
                { name: "Midterm", Score: 38 },
                { name: "Final", Score: 85 },
              ],
            },
          ],
          table: {
            title: "Assessment Breakdown",
            columns: ["Assessment", "Score", "Max", "Percentage", "Weightage"],
            rows: [
              ["Assignment 1", 45, 50, "90%", "20%"],
              ["Assignment 2", 48, 50, "96%", "20%"],
              ["Midterm", 38, 40, "95%", "30%"],
              ["Final", 85, 100, "85%", "30%"],
            ],
          },
        };

      default:
        return {};
    }
  };

  const content = getReportContent();

  const handleExport = (format) => {
    alert(`Exporting report as ${format.toUpperCase()}... (Mock action)`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="reports">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="reports__header"
      >
        <h1>Reports</h1>
        <p>Generate and view comprehensive academic reports</p>
      </motion.div>

      <div className="reports__layout">
        <aside className="reports__sidebar">
          <Card className="reports__type-selector">
            <h3>Report Types</h3>
            <div
              className="reports__type-option"
              data-active={reportType === "course-performance"}
              onClick={() => setReportType("course-performance")}
            >
              Course Performance
            </div>
            <div
              className="reports__type-option"
              data-active={reportType === "attendance"}
              onClick={() => setReportType("attendance")}
            >
              Attendance Report
            </div>
            <div
              className="reports__type-option"
              data-active={reportType === "grade-distribution"}
              onClick={() => setReportType("grade-distribution")}
            >
              Grade Distribution
            </div>
            <div
              className="reports__type-option"
              data-active={reportType === "student-progress"}
              onClick={() => setReportType("student-progress")}
            >
              Student Progress
            </div>
          </Card>
        </aside>

        <section className="reports__content">
          <Card className="reports__filters-card">
            <div className="reports__filters">
              <Select
                label="Course"
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                options={mockFacultyCourses.map((c) => ({
                  value: c.id,
                  label: `${c.code} - ${c.name}`,
                }))}
              />
              <DatePicker
                label="From"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
              <DatePicker
                label="To"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
            <div className="reports__export">
              <Button onClick={() => handleExport("pdf")} variant="secondary">
                Export PDF
              </Button>
              <Button onClick={() => handleExport("excel")} variant="secondary">
                Export Excel
              </Button>
              <Button onClick={handlePrint} variant="primary">
                Print
              </Button>
            </div>
          </Card>

          <div className="reports__visualization">
            {content.charts?.map((chart, idx) => (
              <Card key={idx} className="reports__chart-card">
                <h3>{chart.title}</h3>
                {chart.type === "line" && (
                  <LineChart data={chart.data} title={chart.title} />
                )}
                {chart.type === "bar" && (
                  <BarChart data={chart.data} title={chart.title} />
                )}
                {chart.type === "pie" && (
                  <PieChart data={chart.data} title={chart.title} />
                )}
              </Card>
            ))}

            {content.stats && (
              <Card className="reports__stats">
                <h3>Statistics</h3>
                <div className="reports__stats-grid">
                  {Object.entries(content.stats).map(([key, value]) => (
                    <div key={key} className="reports__stat-item">
                      <span className="reports__stat-label">
                        {key.charAt(0).toUpperCase() +
                          key.slice(1).replace(/([A-Z])/g, " $1")}
                      </span>
                      <span className="reports__stat-value">{value}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {content.table && (
              <Card className="reports__table-card">
                <h3>{content.table.title}</h3>
                <Table
                  columns={content.table.columns}
                  data={content.table.rows}
                />
              </Card>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Reports;
