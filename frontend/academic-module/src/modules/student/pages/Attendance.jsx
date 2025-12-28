import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Calendar as CalendarIcon,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import AppShell from "../../../shared/components/layout/AppShell";
import Card from "../../../shared/components/display/Card";
import { CircularProgress } from "../../../shared/components/display/CircularProgress";
import { ProgressBar } from "../../../shared/components/display/ProgressBar";
import { Badge } from "../../../shared/components/display/Badge";
import "./attendance.css";

const MOCK_ATTENDANCE = {
  overall: 92,
  totalClasses: 125,
  present: 115,
  missed: 10,
  courses: [
    {
      name: "Data Structures (CS301)",
      percentage: 85,
      total: 40,
      present: 34,
      status: "good",
    },
    {
      name: "Calculus II (MA202)",
      percentage: 72,
      total: 45,
      present: 32,
      status: "warning",
    },
    {
      name: "English (EN101)",
      percentage: 98,
      total: 40,
      present: 39,
      status: "good",
    },
  ],
  // Mock data for 6 weeks heatmap (1 = present, 0 = absent, null = no class)
  history: [
    [1, 1, 0, 1, 1],
    [1, 1, 1, 1, 0],
    [1, 0, 1, 1, 1],
    [1, 1, 1, 1, 1],
    [0, 1, 1, 0, 1],
    [1, 1, 1, 1, 1],
  ],
};

const Attendance = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <AppShell>
      <motion.div
        className="attendance-container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <header className="page-header">
          <h1>Attendance Tracker</h1>
          <p>Monitor your presence and eligibility for finals.</p>
        </header>

        {/* Hero Stats */}
        <div className="attendance-hero-grid">
          <Card className="overall-card">
            <div className="flex items-center gap-8">
              <CircularProgress
                value={MOCK_ATTENDANCE.overall}
                size={120}
                strokeWidth={10}
              />
              <div className="stats-info">
                <span className="label">Overall Attendance</span>
                <h2 className="text-3xl font-bold">
                  {MOCK_ATTENDANCE.overall}%
                </h2>
                <div className="pill-stats flex gap-4 mt-2">
                  <span className="text-success flex items-center gap-1">
                    <CheckCircle size={14} /> {MOCK_ATTENDANCE.present} Present
                  </span>
                  <span className="text-danger flex items-center gap-1">
                    <XCircle size={14} /> {MOCK_ATTENDANCE.missed} Missed
                  </span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="heatmap-card">
            <div className="card-header justify-between flex">
              <h3>Recent History</h3>
              <div className="flex gap-2">
                <button className="nav-btn">
                  <ChevronLeft size={16} />
                </button>
                <button className="nav-btn">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
            <div className="heatmap-grid">
              <div className="days-label">
                <span>M</span>
                <span>T</span>
                <span>W</span>
                <span>T</span>
                <span>F</span>
              </div>
              <div className="weeks-scroll">
                {MOCK_ATTENDANCE.history.map((week, wIdx) => (
                  <div key={wIdx} className="heatmap-week">
                    {week.map((day, dIdx) => (
                      <div
                        key={dIdx}
                        className={`heatmap-cell ${
                          day === 1 ? "present" : day === 0 ? "absent" : "empty"
                        }`}
                        title={day === 1 ? "Present" : "Absent"}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Course Breakdown */}
        <section className="course-breakdown mt-8">
          <h3 className="mb-4">Course-wise Breakdown</h3>
          <div className="breakdown-list">
            {MOCK_ATTENDANCE.courses.map((course, idx) => (
              <motion.div key={idx} variants={itemVariants}>
                <Card className="breakdown-item" variant="flat">
                  <div className="breakdown-header">
                    <div className="course-title">
                      <h4>{course.name}</h4>
                      <span className="text-xs text-secondary">
                        {course.present} / {course.total} Sessions
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      {course.percentage < 75 && (
                        <Badge variant="danger" className="animate-pulse">
                          <AlertCircle size={12} /> Low Attendance
                        </Badge>
                      )}
                      <span
                        className={`percentage-text ${
                          course.percentage < 75
                            ? "text-danger"
                            : "text-primary"
                        }`}
                      >
                        {course.percentage}%
                      </span>
                    </div>
                  </div>
                  <ProgressBar
                    progress={course.percentage}
                    color={
                      course.percentage < 75
                        ? "var(--error)"
                        : "var(--primary-500)"
                    }
                  />
                </Card>
              </motion.div>
            ))}
          </div>
        </section>
      </motion.div>
    </AppShell>
  );
};

export default Attendance;
