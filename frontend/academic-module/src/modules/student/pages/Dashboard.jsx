import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Award,
  CheckCircle,
  Clock,
  ExternalLink,
  FileText,
  Bell,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import AppShell from "../../../shared/components/layout/AppShell";
import { StatCard } from "../../../shared/components/display/StatCard";
import { Button } from "../../../shared/components/forms/Button";
import Card from "../../../shared/components/display/Card";
import { Badge } from "../../../shared/components/display/Badge";
import "./dashboard.css";

// Mock Data
const DASHBOARD_DATA = {
  student: {
    name: "John Doe",
    gpa: "3.84",
    courses: 12,
    attendance: 92,
    credits: 45,
  },
  schedule: [
    {
      id: 1,
      time: "09:00 AM",
      course: "CS301",
      room: "A-101",
      title: "Data Structures",
    },
    {
      id: 2,
      time: "10:30 AM",
      course: "MA202",
      room: "B-204",
      title: "Calculus II",
    },
    {
      id: 3,
      time: "02:00 PM",
      course: "EN101",
      room: "C-002",
      title: "English",
    },
  ],
  deadlines: [
    {
      id: 1,
      title: "Assignment 3",
      course: "CS301",
      due: "2 days",
      priority: "high",
    },
    {
      id: 2,
      title: "Lab Report",
      course: "MA202",
      due: "5 days",
      priority: "medium",
    },
  ],
  notices: [
    { id: 1, title: "Final Exam Schedule Out", time: "1h ago", type: "urgent" },
    { id: 2, title: "Library Hours Extended", time: "4h ago", type: "info" },
  ],
};

const Dashboard = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.98 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { staggerChildren: 0.1, duration: 0.4, ease: "easeOut" },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <AppShell>
      <motion.div
        className="dashboard-wrapper"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header Section */}
        <header className="dashboard-header">
          <div className="welcome-text">
            <h1>Welcome back, {DASHBOARD_DATA.student.name} 👋</h1>
            <p>Here is what's happening with your studies today.</p>
          </div>
          <div className="header-actions">
            <span className="current-date">
              {new Date().toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="stats-grid">
          <StatCard
            label="Enrolled Courses"
            value={DASHBOARD_DATA.student.courses}
            icon={BookOpen}
            color="#e87d26"
          />
          <StatCard
            label="Current GPA"
            value={DASHBOARD_DATA.student.gpa}
            icon={Award}
            color="#050041"
          />
          <StatCard
            label="Attendance"
            value={`${DASHBOARD_DATA.student.attendance}%`}
            icon={CheckCircle}
            color="#10b981"
          />
          <StatCard
            label="Total Credits"
            value={DASHBOARD_DATA.student.credits}
            icon={Clock}
            color="#3b82f6"
          />
        </div>

        <div className="dashboard-content-grid">
          {/* Main Column */}
          <div className="main-col">
            <Card title="Today's Schedule" className="schedule-card">
              <div className="card-header">
                <h3>Today's Schedule</h3>
                <Button variant="ghost" size="sm">
                  View Calendar <ExternalLink size={14} />
                </Button>
              </div>
              <div className="schedule-list">
                {DASHBOARD_DATA.schedule.map((item) => (
                  <motion.div
                    key={item.id}
                    className="schedule-item"
                    variants={itemVariants}
                  >
                    <div className="time-slot">
                      <span className="time">{item.time}</span>
                      <div className="line"></div>
                    </div>
                    <div className="course-info">
                      <span className="course-code">{item.course}</span>
                      <span className="course-title">{item.title}</span>
                      <span className="room-no">📍 Room {item.room}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>

            <Card className="deadlines-card">
              <div className="card-header">
                <h3>Upcoming Deadlines</h3>
              </div>
              <div className="deadline-list">
                {DASHBOARD_DATA.deadlines.map((item) => (
                  <div
                    key={item.id}
                    className={`deadline-item ${item.priority}`}
                  >
                    <div className="deadline-content">
                      <AlertTriangle size={18} className="warning-icon" />
                      <div>
                        <h4>{item.title}</h4>
                        <p>{item.course}</p>
                      </div>
                    </div>
                    <Badge
                      variant={item.priority === "high" ? "danger" : "warning"}
                    >
                      Due: {item.due}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar Column */}
          <div className="side-col">
            <Card className="quick-actions-card">
              <h3>Quick Actions</h3>
              <div className="actions-grid">
                <button className="action-btn">
                  <BookOpen size={20} /> Register
                </button>
                <button className="action-btn">
                  <Award size={20} /> Grades
                </button>
                <button className="action-btn">
                  <FileText size={20} /> Materials
                </button>
                <button className="action-btn">
                  <Bell size={20} /> Appeals
                </button>
              </div>
            </Card>

            <Card className="notices-card">
              <div className="card-header">
                <h3>Recent Notices</h3>
                <ArrowRight size={18} className="hover-arrow" />
              </div>
              <div className="notice-feed">
                {DASHBOARD_DATA.notices.map((notice) => (
                  <div key={notice.id} className="notice-item">
                    <div className={`notice-dot ${notice.type}`}></div>
                    <div className="notice-details">
                      <p className="notice-title">{notice.title}</p>
                      <span className="notice-time">{notice.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </motion.div>
    </AppShell>
  );
};

export default Dashboard;
