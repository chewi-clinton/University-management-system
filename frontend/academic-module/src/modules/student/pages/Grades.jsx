import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Download,
  ChevronDown,
  Award,
  FileText,
  Filter,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import AppShell from "../../../shared/components/layout/AppShell";
import Card from "../../../shared/components/display/Card";
import { Button } from "../../../shared/components/forms/Button";
import { Badge } from "../../../shared/components/display/Badge";
import "./grades.css";

const GPA_TREND_DATA = [
  { semester: "Sem 1", gpa: 3.5 },
  { semester: "Sem 2", gpa: 3.7 },
  { semester: "Sem 3", gpa: 3.65 },
  { semester: "Sem 4", gpa: 3.84 },
];

const COURSE_GRADES = [
  {
    id: "cs301",
    name: "Data Structures (CS301)",
    grade: "A",
    overall: 92,
    assessments: [
      { label: "Assignments", score: 45, total: 50, weight: "20%" },
      { label: "Midterm", score: 38, total: 40, weight: "30%" },
      { label: "Final Exam", score: 85, total: 100, weight: "50%" },
    ],
  },
  {
    id: "ma202",
    name: "Calculus II (MA202)",
    grade: "B+",
    overall: 84,
    assessments: [
      { label: "Problem Sets", score: 40, total: 50, weight: "15%" },
      { label: "Midterm", score: 30, total: 40, weight: "35%" },
      { label: "Final Exam", score: 78, total: 100, weight: "50%" },
    ],
  },
];

const Grades = () => {
  const [selectedSemester, setSelectedSemester] = useState("Fall 2024");
  const [expandedCourse, setExpandedCourse] = useState(null);

  const toggleCourse = (id) => {
    setExpandedCourse(expandedCourse === id ? null : id);
  };

  return (
    <AppShell>
      <motion.div
        className="grades-page"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <header className="page-header flex justify-between items-end mb-6">
          <div>
            <h1>Academic Performance</h1>
            <p>Track your GPA trends and assessment results.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Download size={16} /> Transcript
            </Button>
            <div className="semester-select">
              <Filter size={14} />
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
              >
                <option>Fall 2024</option>
                <option>Spring 2024</option>
              </select>
            </div>
          </div>
        </header>

        <div className="grades-grid">
          {/* GPA Overview Card */}
          <Card className="gpa-summary-card">
            <div className="gpa-display">
              <div className="gpa-circle">
                <motion.h2
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  className="gpa-value"
                >
                  3.84
                </motion.h2>
                <span className="gpa-label">Cumulative GPA</span>
              </div>
              <div className="gpa-stats">
                <div className="stat-item">
                  <Award className="text-primary" size={20} />
                  <div>
                    <p className="font-bold">Dean's List</p>
                    <p className="text-xs text-secondary">
                      3 Consecutive Semesters
                    </p>
                  </div>
                </div>
                <div className="stat-item">
                  <TrendingUp className="text-success" size={20} />
                  <div>
                    <p className="font-bold">+0.19</p>
                    <p className="text-xs text-secondary">
                      Since last semester
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* GPA Trend Chart */}
          <Card className="trend-card">
            <h3>GPA Growth Trend</h3>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart
                  data={GPA_TREND_DATA}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorGpa" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="var(--primary-500)"
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--primary-500)"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="var(--gray-100)"
                  />
                  <XAxis
                    dataKey="semester"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    domain={[0, 4]}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "var(--shadow-lg)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="gpa"
                    stroke="var(--primary-500)"
                    fillOpacity={1}
                    fill="url(#colorGpa)"
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Detailed Grades List */}
        <section className="course-grades-section mt-8">
          <h3 className="mb-4">Semester Course Breakdown</h3>
          <div className="grades-list">
            {COURSE_GRADES.map((course) => (
              <motion.div key={course.id} className="grade-item-wrapper mb-4">
                <Card
                  className={`grade-course-card ${
                    expandedCourse === course.id ? "expanded" : ""
                  }`}
                  onClick={() => toggleCourse(course.id)}
                >
                  <div className="grade-card-header">
                    <div className="flex items-center gap-4">
                      <div className={`grade-badge grade-${course.grade[0]}`}>
                        {course.grade}
                      </div>
                      <div>
                        <h4>{course.name}</h4>
                        <p className="text-xs text-secondary">
                          Overall Percentage: {course.overall}%
                        </p>
                      </div>
                    </div>
                    <motion.div
                      animate={{
                        rotate: expandedCourse === course.id ? 180 : 0,
                      }}
                    >
                      <ChevronDown size={20} className="text-gray-400" />
                    </motion.div>
                  </div>

                  {expandedCourse === course.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      className="grade-details-content"
                    >
                      <div className="assessment-grid">
                        {course.assessments.map((asm, i) => (
                          <div key={i} className="asm-row">
                            <span className="asm-label">
                              {asm.label} ({asm.weight})
                            </span>
                            <div className="asm-progress-bg">
                              <div
                                className="asm-progress-bar"
                                style={{
                                  width: `${(asm.score / asm.total) * 100}%`,
                                }}
                              />
                            </div>
                            <span className="asm-score">
                              {asm.score}/{asm.total}
                            </span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        </section>
      </motion.div>
    </AppShell>
  );
};

export default Grades;
