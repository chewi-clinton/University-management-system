import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  FileText
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import Container from '../components/shared/layout/Container.jsx';
import Card from '../components/shared/layout/Card.jsx';
import StatCard from '../components/shared/ui/StatCard.jsx';
import Button from '../components/shared/ui/Button.jsx';
import Badge from '../components/shared/ui/Badge.jsx';
import { studentService } from '../services/api/student.service.js';

const Dashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await studentService.getDashboard();
        setDashboardData(response.data);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
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
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { type: 'spring', stiffness: 100 }
    }
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

  const { stats, todaySchedule, upcomingDeadlines, recentNotices } = dashboardData || {};

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
              Welcome back, {user?.name?.split(' ')[0]}! 👋
            </h1>
            <p className="dashboard__subtitle">
              Here's what's happening with your studies today.
            </p>
          </div>
          <div className="dashboard__date">
            <Clock size={16} />
            <span>{new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</span>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div className="dashboard__stats" variants={itemVariants}>
          <StatCard
            title="Total Courses"
            value={stats?.totalCourses || 0}
            icon={BookOpen}
            color="primary"
            trend={{ value: 2, direction: 'up' }}
            className="dashboard__stat-card"
          />
          <StatCard
            title="Current GPA"
            value={stats?.currentGPA || 0}
            icon={Award}
            color="success"
            decimal={2}
            trend={{ value: 0.2, direction: 'up' }}
            className="dashboard__stat-card"
          />
          <StatCard
            title="Attendance"
            value={stats?.attendancePercentage || 0}
            icon={CalendarCheck}
            color="info"
            suffix="%"
            trend={{ value: 5, direction: 'up' }}
            className="dashboard__stat-card"
          />
          <StatCard
            title="Pending Tasks"
            value={stats?.pendingAssignments || 0}
            icon={AlertCircle}
            color="warning"
            trend={{ value: 1, direction: 'down' }}
            className="dashboard__stat-card"
          />
        </motion.div>

        <div className="dashboard__grid">
          {/* Today's Schedule */}
          <motion.div variants={itemVariants}>
            <Card className="dashboard__schedule">
              <Card.Header>
                <h2 className="card__title">Today's Schedule</h2>
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
                        <h3 className="schedule__course">{schedule.courseName}</h3>
                        <p className="schedule__meta">
                          {schedule.instructor} • {schedule.room}
                        </p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="schedule__action"
                      >
                        Join
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
                    leftIcon={<FileText size={20} />}
                  >
                    View Materials
                  </Button>
                  <Button 
                    variant="elevated" 
                    className="action__btn"
                    leftIcon={<CalendarCheck size={20} />}
                  >
                    Mark Attendance
                  </Button>
                  <Button 
                    variant="elevated" 
                    className="action__btn"
                    leftIcon={<Users size={20} />}
                  >
                    Virtual Class
                  </Button>
                  <Button 
                    variant="elevated" 
                    className="action__btn"
                    leftIcon={<Award size={20} />}
                  >
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
                        {new Date(deadline.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </motion.div>

          {/* Recent Notices */}
          <motion.div variants={itemVariants}>
            <Card className="dashboard__notices">
              <Card.Header>
                <h2 className="card__title">Recent Notices</h2>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="notices__view-all"
                >
                  View All
                  <ChevronRight size={16} />
                </Button>
              </Card.Header>
              <Card.Body>
                <div className="notices__list">
                  {recentNotices?.map((notice) => (
                    <div 
                      key={notice.id} 
                      className={`notice__item ${notice.isRead ? 'notice__item--read' : ''}`}
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
                          <span className="notice__by">{notice.postedBy}</span>
                          <span className="notice__time">
                            {new Date(notice.postedDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="notice__badge">
                        <Badge 
                          variant={notice.priority === 'urgent' ? 'error' : 
                                   notice.priority === 'important' ? 'warning' : 'neutral'}
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
        </div>

        {/* Performance Chart */}
        <motion.div variants={itemVariants}>
          <Card className="dashboard__performance">
            <Card.Header>
              <h2 className="card__title">Performance Overview</h2>
              <div className="performance__legend">
                <div className="legend__item">
                  <div className="legend__color legend__color--primary" />
                  <span>GPA Trend</span>
                </div>
                <div className="legend__item">
                  <div className="legend__color legend__color--success" />
                  <span>Attendance</span>
                </div>
              </div>
            </Card.Header>
            <Card.Body>
              <div className="performance__chart">
                {/* Placeholder for chart component */}
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