import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Users,
  CalendarCheck,
  AlertCircle,
  Clock,
  Bell,
  ChevronRight,
  TrendingUp,
  FileText,
  Award,
  Video,
  ClipboardCheck,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import facultyService from "../../services/api/facultyService.js";
import Container from "../../components/shared/layout/Container.jsx";
import Card from "../../components/shared/layout/Card.jsx";
import StatCard from "../../components/shared/ui/StatCard.jsx";
import Button from "../../components/shared/ui/Button.jsx";
import Badge from "../../components/shared/ui/Badge.jsx";

const FacultyDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await facultyService.getDashboardData();
      setDashboardData(data);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      setError(error.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAttendance = () => {
    // Navigate to attendance marking page
    window.location.href = "/faculty/attendance";
  };

  const handleGradeSubmissions = () => {
    // Navigate to grading page
    window.location.href = "/faculty/grades";
  };

  const handleStartVirtualClass = async () => {
    try {
      // Get first course offering
      const courses = await facultyService.getCourses({ limit: 1 });
      if (courses.results && courses.results.length > 0) {
        const courseId = courses.results[0].id;

        // Create zoom class for today
        const today = new Date().toISOString().split("T")[0];
        const startTime = new Date().toTimeString().split(" ")[0];

        await facultyService.createZoomClass({
          offering_id: courseId,
          topic: "Virtual Class",
          schedule_date: today,
          start_time: startTime,
          duration_minutes: 60,
          platform: "zoom",
        });

        alert("Virtual class created successfully!");
      }
    } catch (error) {
      console.error("Error creating virtual class:", error);
      alert("Failed to create virtual class");
    }
  };

  const handleCreateAssignment = () => {
    // Navigate to assignment creation page
    window.location.href = "/faculty/assignments/create";
  };

  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
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
        <Card className="dashboard__error">
          <Card.Body>
            <div className="error__content">
              <AlertCircle size={48} className="error__icon" />
              <h2>Failed to Load Dashboard</h2>
              <p>{error}</p>
              <Button onClick={fetchDashboardData} variant="primary">
                Try Again
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  const {
    stats,
    todaySchedule,
    upcomingDeadlines,
    recentNotices,
    recentActivities,
  } = dashboardData || {};

  // Get user's first name, handling different user object structures
  const firstName =
    user?.first_name || user?.name?.split(" ")[0] || "Professor";

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
              Welcome back, Prof. {firstName}! 👋
            </h1>
            <p className="dashboard__subtitle">
              Here's an overview of your teaching activities today.
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
            value={stats?.totalCourses || 0}
            icon={BookOpen}
            color="primary"
            className="dashboard__stat-card"
          />
          <StatCard
            title="Total Students"
            value={stats?.totalStudents || 0}
            icon={Users}
            color="success"
            className="dashboard__stat-card"
          />
          <StatCard
            title="Attendance Rate"
            value={stats?.attendanceRate || 0}
            icon={CalendarCheck}
            color="info"
            suffix="%"
            decimal={1}
            className="dashboard__stat-card"
          />
          <StatCard
            title="Pending Grading"
            value={stats?.pendingGrading || 0}
            icon={Award}
            color="warning"
            className="dashboard__stat-card"
          />
        </motion.div>

        <div className="dashboard__grid">
          {/* Today's Schedule */}
          <motion.div variants={itemVariants}>
            <Card className="dashboard__schedule">
              <Card.Header>
                <h2 className="card__title">Today's Classes</h2>
                <Badge variant="primary" size="sm">
                  {todaySchedule?.length || 0} classes
                </Badge>
              </Card.Header>
              <Card.Body>
                {todaySchedule && todaySchedule.length > 0 ? (
                  <div className="schedule__list">
                    {todaySchedule.map((schedule, index) => (
                      <div key={index} className="schedule__item">
                        <div className="schedule__time">
                          <Clock size={16} />
                          <span>{schedule.time}</span>
                        </div>
                        <div className="schedule__details">
                          <h3 className="schedule__course">
                            {schedule.courseName}
                            <Badge variant="neutral" size="xs" className="ml-2">
                              {schedule.courseCode}
                            </Badge>
                          </h3>
                          <p className="schedule__meta">
                            {schedule.room} • {schedule.studentCount} students
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="schedule__action"
                        >
                          Start Class
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <CalendarCheck size={48} />
                    <p>No classes scheduled for today</p>
                  </div>
                )}
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
                  <Button
                    variant="elevated"
                    className="action__btn"
                    leftIcon={<ClipboardCheck size={20} />}
                    onClick={handleMarkAttendance}
                  >
                    Mark Attendance
                  </Button>
                  <Button
                    variant="elevated"
                    className="action__btn"
                    leftIcon={<Award size={20} />}
                    onClick={handleGradeSubmissions}
                  >
                    Grade Submissions
                  </Button>
                  <Button
                    variant="elevated"
                    className="action__btn"
                    leftIcon={<Video size={20} />}
                    onClick={handleStartVirtualClass}
                  >
                    Start Virtual Class
                  </Button>
                  <Button
                    variant="elevated"
                    className="action__btn"
                    leftIcon={<FileText size={20} />}
                    onClick={handleCreateAssignment}
                  >
                    Create Assignment
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </motion.div>

          {/* Upcoming Deadlines */}
          <motion.div variants={itemVariants}>
            <Card className="dashboard__deadlines">
              <Card.Header>
                <h2 className="card__title">Upcoming Tasks</h2>
                <Badge variant="error" size="sm">
                  {upcomingDeadlines?.length || 0} pending
                </Badge>
              </Card.Header>
              <Card.Body>
                {upcomingDeadlines && upcomingDeadlines.length > 0 ? (
                  <div className="deadlines__list">
                    {upcomingDeadlines.map((deadline) => (
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
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <AlertCircle size={48} />
                    <p>No upcoming tasks</p>
                  </div>
                )}
              </Card.Body>
            </Card>
          </motion.div>

          {/* Recent Activity */}
          <motion.div variants={itemVariants}>
            <Card className="dashboard__activity">
              <Card.Header>
                <h2 className="card__title">Recent Activity</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  className="activity__view-all"
                >
                  View All
                  <ChevronRight size={16} />
                </Button>
              </Card.Header>
              <Card.Body>
                {recentActivities && recentActivities.length > 0 ? (
                  <div className="activity__list">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="activity__item">
                        <div className="activity__icon">
                          {activity.type === "submission" && (
                            <FileText size={16} />
                          )}
                          {activity.type === "attendance" && (
                            <CalendarCheck size={16} />
                          )}
                          {activity.type === "query" && <Bell size={16} />}
                        </div>
                        <div className="activity__content">
                          <p className="activity__text">
                            <strong>{activity.student}</strong>{" "}
                            {activity.action}
                          </p>
                          <div className="activity__meta">
                            <span className="activity__course">
                              {activity.course}
                            </span>
                            <span className="activity__time">
                              {activity.time}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <Bell size={48} />
                    <p>No recent activity</p>
                  </div>
                )}
              </Card.Body>
            </Card>
          </motion.div>
        </div>

        {/* Recent Notices */}
        <motion.div variants={itemVariants}>
          <Card className="dashboard__notices">
            <Card.Header>
              <h2 className="card__title">Important Notices</h2>
              <Button variant="ghost" size="sm" className="notices__view-all">
                View All
                <ChevronRight size={16} />
              </Button>
            </Card.Header>
            <Card.Body>
              {recentNotices && recentNotices.length > 0 ? (
                <div className="notices__list notices__list--horizontal">
                  {recentNotices.map((notice) => (
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
                          {notice.content.substring(0, 120)}
                          {notice.content.length > 120 && "..."}
                        </p>
                        <div className="notice__meta">
                          <span className="notice__by">{notice.postedBy}</span>
                          <span className="notice__time">
                            {new Date(notice.postedDate).toLocaleDateString()}
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
                          {notice.priority}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <Bell size={48} />
                  <p>No notices available</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </motion.div>

        {/* Performance Overview */}
        <motion.div variants={itemVariants}>
          <Card className="dashboard__performance">
            <Card.Header>
              <h2 className="card__title">Course Performance Overview</h2>
              <div className="performance__legend">
                <div className="legend__item">
                  <div className="legend__color legend__color--primary" />
                  <span>Average Score</span>
                </div>
                <div className="legend__item">
                  <div className="legend__color legend__color--success" />
                  <span>Attendance Rate</span>
                </div>
              </div>
            </Card.Header>
            <Card.Body>
              <div className="performance__chart">
                <div className="chart__placeholder">
                  <TrendingUp size={48} />
                  <p>Course performance analytics will be displayed here</p>
                  <Button variant="outline" size="sm" className="mt-4">
                    View Detailed Analytics
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>
        </motion.div>
      </motion.div>
    </Container>
  );
};

export default FacultyDashboard;
