import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Award,
  CalendarCheck,
  AlertCircle,
  Clock,
  Bell,
  ChevronRight,
  TrendingUp,
  Users,
  FileText,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import Container from "../components/shared/layout/Container.jsx";
import Card from "../components/shared/layout/Card.jsx";
import StatCard from "../components/shared/ui/StatCard.jsx";
import Button from "../components/shared/ui/Button.jsx";
import Badge from "../components/shared/ui/Badge.jsx";
import { studentService } from "../services/api/studentService.js";
import "../styles/pages/dashboard.css";
const Dashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        const result = await studentService.getDashboard();

        if (result.success) {
          setDashboardData(result.data);
        } else {
          setError(result.error || "Failed to load dashboard data");
        }
      } catch (err) {
        setError("An unexpected error occurred");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  if (loading) {
    return (
      <Container>
        <div className="dashboard__skeleton">
          <div className="skeleton dashboard__skeleton-header" />
          <div className="skeleton-grid">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="skeleton stat-card__skeleton" />
            ))}
          </div>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <div className="dashboard__error">
          <AlertCircle size={48} />
          <p>{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </Container>
    );
  }

  const {
    stats = {},
    todaySchedule = [],
    upcomingDeadlines = [],
    recentNotices = [],
  } = dashboardData || {};

  return (
    <Container>
      <motion.div
        className="dashboard"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        {/* Welcome Header */}
        <motion.div className="dashboard__header" variants={itemVariants}>
          <div>
            <h1 className="dashboard__title">
              Welcome back, {user?.name?.split(" ")[0] || "Student"}! 👋
            </h1>
            <p className="dashboard__subtitle">
              Here's what's happening with your studies today.
            </p>
          </div>
          <div className="dashboard__date">
            <Clock size={16} />
            <span>
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div className="dashboard__stats" variants={itemVariants}>
          <StatCard
            title="Total Courses"
            value={stats.totalCourses || 0}
            icon={BookOpen}
            color="primary"
            trend={{
              value: stats.courseChange || 0,
              direction: stats.courseChange >= 0 ? "up" : "down",
            }}
          />
          <StatCard
            title="Current GPA"
            value={stats.currentGPA || 0}
            icon={Award}
            color="success"
            decimal={2}
            trend={{
              value: stats.gpaChange || 0,
              direction: stats.gpaChange >= 0 ? "up" : "down",
            }}
          />
          <StatCard
            title="Attendance"
            value={stats.attendancePercentage || 0}
            icon={CalendarCheck}
            color="info"
            suffix="%"
            trend={{
              value: stats.attendanceChange || 0,
              direction: stats.attendanceChange >= 0 ? "up" : "down",
            }}
          />
          <StatCard
            title="Pending Tasks"
            value={stats.pendingAssignments || 0}
            icon={AlertCircle}
            color="warning"
          />
        </motion.div>

        <div className="dashboard__grid">
          {/* Today's Schedule */}
          <motion.div variants={itemVariants}>
            <Card className="dashboard__schedule">
              <Card.Header>
                <h2 className="card__title">Today's Schedule</h2>
                <Badge variant="primary" size="sm">
                  {todaySchedule.length} classes
                </Badge>
              </Card.Header>
              <Card.Body>
                <div className="schedule__list">
                  {todaySchedule.length > 0 ? (
                    todaySchedule.map((schedule, index) => (
                      <div key={index} className="schedule__item">
                        <div className="schedule__time">
                          <Clock size={16} />
                          <span>{schedule.time || schedule.start_time}</span>
                        </div>
                        <div className="schedule__details">
                          <h3 className="schedule__course">
                            {schedule.courseName ||
                              schedule.course?.course_name}
                          </h3>
                          <p className="schedule__meta">
                            {schedule.instructor || schedule.faculty?.full_name}{" "}
                            • {schedule.room || "Online"}
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          Join
                        </Button>
                      </div>
                    ))
                  ) : (
                    <p className="schedule__empty">
                      No classes scheduled today
                    </p>
                  )}
                </div>
              </Card.Body>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div variants={itemVariants}>
            <Card className="dashboard__actions">
              <Card.Header>
                <h2 className="card__title">Quick Actions</h2>
              </Card.Header>
              <Card.Body>
                <div className="actions__grid">
                  <Button variant="elevated" leftIcon={<FileText size={20} />}>
                    View Materials
                  </Button>
                  <Button
                    variant="elevated"
                    leftIcon={<CalendarCheck size={20} />}
                  >
                    Mark Attendance
                  </Button>
                  <Button variant="elevated" leftIcon={<Users size={20} />}>
                    Virtual Class
                  </Button>
                  <Button variant="elevated" leftIcon={<Award size={20} />}>
                    View Grades
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </motion.div>

          {/* Upcoming Deadlines */}
          <motion.div variants={itemVariants}>
            <Card className="dashboard__deadlines">
              <Card.Header>
                <h2 className="card__title">Upcoming Deadlines</h2>
                <Badge variant="error" size="sm">
                  {upcomingDeadlines.length} pending
                </Badge>
              </Card.Header>
              <Card.Body>
                <div className="deadlines__list">
                  {upcomingDeadlines.length > 0 ? (
                    upcomingDeadlines.map((deadline) => (
                      <div key={deadline.id} className="deadline__item">
                        <div className="deadline__icon">
                          <AlertCircle size={16} />
                        </div>
                        <div className="deadline__content">
                          <h3 className="deadline__title">{deadline.title}</h3>
                          <p className="deadline__course">{deadline.course}</p>
                        </div>
                        <div className="deadline__date">
                          {new Date(deadline.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No upcoming deadlines</p>
                  )}
                </div>
              </Card.Body>
            </Card>
          </motion.div>

          {/* Recent Notices */}
          <motion.div variants={itemVariants}>
            <Card className="dashboard__notices">
              <Card.Header>
                <h2 className="card__title">Recent Notices</h2>
                <Button variant="ghost" size="sm">
                  View All <ChevronRight size={16} />
                </Button>
              </Card.Header>
              <Card.Body>
                <div className="notices__list">
                  {recentNotices.length > 0 ? (
                    recentNotices.map((notice) => (
                      <div
                        key={notice.id}
                        className={`notice__item ${
                          notice.isRead ? "notice__item--read" : ""
                        }`}
                      >
                        <div className="notice__icon">
                          <Bell size={16} />
                        </div>
                        <div className="notice__content">
                          <h3 className="notice__title">{notice.title}</h3>
                          <p className="notice__preview">
                            {notice.content.substring(0, 80)}...
                          </p>
                          <div className="notice__meta">
                            <span className="notice__by">
                              {notice.postedBy || notice.posted_by_user?.name}
                            </span>
                            <span className="notice__time">
                              {new Date(
                                notice.postedDate || notice.post_date
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="notice__badge">
                          <Badge
                            variant={
                              notice.priority === "urgent"
                                ? "error"
                                : notice.priority === "important"
                                ? "warning"
                                : "neutral"
                            }
                            size="xs"
                          >
                            {notice.priority || "normal"}
                          </Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No recent notices</p>
                  )}
                </div>
              </Card.Body>
            </Card>
          </motion.div>
        </div>

        {/* Performance Chart Placeholder */}
        <motion.div variants={itemVariants}>
          <Card className="dashboard__performance">
            <Card.Header>
              <h2 className="card__title">Performance Overview</h2>
            </Card.Header>
            <Card.Body>
              <div className="performance__chart">
                <div className="chart__placeholder">
                  <TrendingUp size={48} />
                  <p>Performance chart will be displayed here</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </motion.div>
      </motion.div>
    </Container>
  );
};

export default Dashboard;
