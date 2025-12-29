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
import Container from "../../components/shared/layout/Container.jsx";
import Card from "../../components/shared/layout/Card.jsx";
import StatCard from "../../components/shared/ui/StatCard.jsx";
import Button from "../../components/shared/ui/Button.jsx";
import Badge from "../../components/shared/ui/Badge.jsx";

const FacultyDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock data
        setDashboardData({
          stats: {
            totalCourses: 5,
            totalStudents: 142,
            attendanceRate: 87.5,
            pendingGrading: 23,
          },
          todaySchedule: [
            {
              time: "09:00 AM - 10:30 AM",
              courseName: "Data Structures & Algorithms",
              courseCode: "CS301",
              room: "Room 204",
              studentCount: 45,
            },
            {
              time: "11:00 AM - 12:30 PM",
              courseName: "Database Management Systems",
              courseCode: "CS402",
              room: "Lab 3",
              studentCount: 38,
            },
            {
              time: "02:00 PM - 03:30 PM",
              courseName: "Software Engineering",
              courseCode: "CS501",
              room: "Room 305",
              studentCount: 32,
            },
          ],
          upcomingDeadlines: [
            {
              id: 1,
              title: "Midterm Exam Grading",
              course: "Data Structures & Algorithms",
              date: "2024-12-30",
              priority: "urgent",
            },
            {
              id: 2,
              title: "Assignment 3 Review",
              course: "Database Management Systems",
              date: "2024-12-31",
              priority: "important",
            },
            {
              id: 3,
              title: "Project Proposal Evaluation",
              course: "Software Engineering",
              date: "2025-01-02",
              priority: "normal",
            },
          ],
          recentNotices: [
            {
              id: 1,
              title: "Faculty Meeting - End of Semester Review",
              content:
                "All faculty members are requested to attend the end of semester review meeting scheduled for next week.",
              postedBy: "Dean Office",
              postedDate: "2024-12-28",
              priority: "important",
              isRead: false,
            },
            {
              id: 2,
              title: "Exam Schedule Released",
              content:
                "The final examination schedule for Fall 2024 has been published. Please review and confirm your exam slots.",
              postedBy: "Academic Affairs",
              postedDate: "2024-12-27",
              priority: "urgent",
              isRead: false,
            },
            {
              id: 3,
              title: "New LMS Features Available",
              content:
                "Check out the new automated grading features now available in the Learning Management System.",
              postedBy: "IT Department",
              postedDate: "2024-12-26",
              priority: "normal",
              isRead: true,
            },
          ],
          recentActivities: [
            {
              id: 1,
              type: "submission",
              student: "John Smith",
              course: "CS301",
              action: "submitted Assignment 5",
              time: "2 hours ago",
            },
            {
              id: 2,
              type: "attendance",
              student: "Emma Wilson",
              course: "CS402",
              action: "marked present",
              time: "4 hours ago",
            },
            {
              id: 3,
              type: "query",
              student: "Michael Brown",
              course: "CS501",
              action: "posted a question in forum",
              time: "5 hours ago",
            },
          ],
        });
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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

  const {
    stats,
    todaySchedule,
    upcomingDeadlines,
    recentNotices,
    recentActivities,
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
              Welcome back, Prof. {user?.name?.split(" ")[0]}! 👋
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
            trend={{ value: 1, direction: "up" }}
            className="dashboard__stat-card"
          />
          <StatCard
            title="Total Students"
            value={stats?.totalStudents || 0}
            icon={Users}
            color="success"
            trend={{ value: 12, direction: "up" }}
            className="dashboard__stat-card"
          />
          <StatCard
            title="Attendance Rate"
            value={stats?.attendanceRate || 0}
            icon={CalendarCheck}
            color="info"
            suffix="%"
            decimal={1}
            trend={{ value: 3.2, direction: "up" }}
            className="dashboard__stat-card"
          />
          <StatCard
            title="Pending Grading"
            value={stats?.pendingGrading || 0}
            icon={Award}
            color="warning"
            trend={{ value: 5, direction: "down" }}
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
                <div className="schedule__list">
                  {todaySchedule?.map((schedule, index) => (
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
                  >
                    Mark Attendance
                  </Button>
                  <Button
                    variant="elevated"
                    className="action__btn"
                    leftIcon={<Award size={20} />}
                  >
                    Grade Submissions
                  </Button>
                  <Button
                    variant="elevated"
                    className="action__btn"
                    leftIcon={<Video size={20} />}
                  >
                    Start Virtual Class
                  </Button>
                  <Button
                    variant="elevated"
                    className="action__btn"
                    leftIcon={<FileText size={20} />}
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
                <div className="deadlines__list">
                  {upcomingDeadlines?.map((deadline) => (
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
                <div className="activity__list">
                  {recentActivities?.map((activity) => (
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
                          <strong>{activity.student}</strong> {activity.action}
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
              <div className="notices__list notices__list--horizontal">
                {recentNotices?.map((notice) => (
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
                        {notice.content.substring(0, 120)}...
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
