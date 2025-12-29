import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Users, 
  Clock, 
  Calendar, 
  CheckSquare, 
  Award, 
  FileText,
  Video,
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import StatCard from '../../components/shared/ui/StatCard';
import Card from '../../components/shared/ui/Card';
import Button from '../../components/shared/ui/Button';
import Badge from '../../components/shared/ui/Badge';
import PerformanceWidget from '../../components/ui/PerformanceWidget';
import { useAuth } from '../../context/AuthContext';
import '../../../styles/pages/FacultyDashboard.css';

// Mock data
const mockFacultyCourses = [
  { 
    id: 1, 
    code: 'CS301', 
    name: 'Data Structures', 
    section: 'A', 
    enrolled: 45, 
    capacity: 50, 
    avgGrade: 78, 
    avgAttendance: 85, 
    schedule: 'Mon, Wed, Fri 9:00-10:30 AM', 
    room: 'A-101',
    color: '#3b82f6',
    semester: 'Fall 2024',
    credits: 3,
    pendingGrades: 12
  },
  { 
    id: 2, 
    code: 'CS201', 
    name: 'Programming Fundamentals', 
    section: 'B', 
    enrolled: 38, 
    capacity: 40, 
    avgGrade: 82, 
    avgAttendance: 90, 
    schedule: 'Tue, Thu 2:00-3:30 PM', 
    room: 'B-205',
    color: '#8b5cf6',
    semester: 'Fall 2024',
    credits: 4,
    pendingGrades: 5
  },
  { 
    id: 3, 
    code: 'CS401', 
    name: 'Advanced Algorithms', 
    section: 'A', 
    enrolled: 32, 
    capacity: 35, 
    avgGrade: 75, 
    avgAttendance: 88, 
    schedule: 'Mon, Wed 11:00-12:30 PM', 
    room: 'A-203',
    color: '#10b981',
    semester: 'Fall 2024',
    credits: 3,
    pendingGrades: 8
  }
];

const FacultyDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    courses: 0,
    students: 0,
    pending: 0,
    today: 0
  });
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Calculate stats
    const totalCourses = mockFacultyCourses.length;
    const totalStudents = mockFacultyCourses.reduce((sum, course) => sum + course.enrolled, 0);
    const totalPending = mockFacultyCourses.reduce((sum, course) => sum + course.pendingGrades, 0);
    
    // Mock today's classes (would be calculated based on current day)
    const todayClasses = mockFacultyCourses.filter(course => 
      course.schedule.includes(new Date().toLocaleDateString('en-US', { weekday: 'short' }))
    ).length;

    setStats({
      courses: totalCourses,
      students: totalStudents,
      pending: totalPending,
      today: todayClasses
    });

    // Update time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const getUpcomingClasses = () => {
    const now = currentTime;
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    return mockFacultyCourses
      .map(course => {
        const timeMatch = course.schedule.match(/(\d+):(\d+)/);
        if (timeMatch) {
          const classHour = parseInt(timeMatch[1]);
          const classMinute = parseInt(timeMatch[2]);
          const isPM = course.schedule.includes('PM');
          const classTime = classHour + (isPM && classHour !== 12 ? 12 : 0);
          
          return {
            ...course,
            classTime,
            classMinute,
            isUpcoming: classTime > currentHour || (classTime === currentHour && classMinute > currentMinute)
          };
        }
        return { ...course, isUpcoming: false };
      })
      .filter(course => course.isUpcoming)
      .slice(0, 3);
  };

  const upcomingClasses = getUpcomingClasses();

  const statCards = [
    {
      title: 'Active Courses',
      value: stats.courses,
      icon: BookOpen,
      color: 'blue',
      trend: 12
    },
    {
      title: 'Total Students',
      value: stats.students,
      icon: Users,
      color: 'purple',
      trend: 8
    },
    {
      title: 'Pending Grades',
      value: stats.pending,
      icon: Award,
      color: 'orange',
      trend: -5
    },
    {
      title: 'Classes Today',
      value: stats.today,
      icon: Calendar,
      color: 'green',
      trend: 0
    }
  ];

  const quickActions = [
    {
      title: 'Mark Attendance',
      icon: CheckSquare,
      path: '/faculty/attendance-marking',
      color: 'blue'
    },
    {
      title: 'Enter Grades',
      icon: Award,
      path: '/faculty/grading',
      color: 'green'
    },
    {
      title: 'Upload Material',
      icon: FileText,
      path: '/faculty/courses',
      color: 'purple'
    },
    {
      title: 'Schedule Class',
      icon: Video,
      path: '/faculty/virtual-class-setup',
      color: 'orange'
    }
  ];

  const pendingTasks = [
    {
      course: 'CS301 - Data Structures',
      task: 'Grade Assignment 3',
      count: 12,
      due: '2 days',
      priority: 'high'
    },
    {
      course: 'CS201 - Programming Fundamentals',
      task: 'Grade Assignment 2',
      count: 5,
      due: '5 days',
      priority: 'medium'
    }
  ];

  const coursePerformance = mockFacultyCourses.map(course => ({
    title: course.code,
    value: `${course.avgGrade}%`,
    change: course.avgGrade > 75 ? 3 : -2,
    chartData: [
      { value: course.avgGrade - 10 },
      { value: course.avgGrade - 5 },
      { value: course.avgGrade },
      { value: course.avgGrade + 3 },
      { value: course.avgGrade + 1 }
    ],
    color: course.color
  }));

  return (
    <div className="faculty-dashboard">
      <div className="faculty-dashboard__header">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1>Welcome back, {user?.name || 'Professor'}</h1>
          <p>Here's what's happening with your courses today.</p>
        </motion.div>
      </div>

      <div className="faculty-dashboard__stats">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <StatCard {...stat} />
          </motion.div>
        ))}
      </div>

      <div className="faculty-dashboard__grid">
        <div className="faculty-dashboard__section">
          <Card>
            <div className="faculty-dashboard__section-header">
              <h3>Today's Schedule</h3>
              <span className="faculty-dashboard__time">
                {currentTime.toLocaleTimeString('en-US', { 
                  hour: 'numeric', 
                  minute: '2-digit',
                  hour12: true 
                })}
              </span>
            </div>
            <div className="faculty-dashboard__schedule">
              {upcomingClasses.length > 0 ? (
                upcomingClasses.map((course, index) => (
                  <motion.div
                    key={course.id}
                    className={`schedule-item ${course.isUpcoming ? 'schedule-item--upcoming' : ''}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="schedule-item__time">
                      {course.schedule.match(/\d+:\d+ [AP]M/)?.[0] || 'TBD'}
                    </div>
                    <div className="schedule-item__details">
                      <h4>{course.code} - {course.name}</h4>
                      <p>Room: {course.room} • {course.enrolled} students</p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => navigate('/faculty/attendance-marking')}
                      className="schedule-item__action"
                    >
                      Take Attendance
                    </Button>
                  </motion.div>
                ))
              ) : (
                <p className="faculty-dashboard__no-classes">No classes scheduled for today</p>
              )}
            </div>
          </Card>

          <Card>
            <div className="faculty-dashboard__section-header">
              <h3>Quick Actions</h3>
            </div>
            <div className="faculty-dashboard__actions">
              {quickActions.map((action, index) => (
                <motion.div
                  key={action.title}
                  className="action-card"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(action.path)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className={`action-card__icon action-card__icon--${action.color}`}>
                    <action.icon size={24} />
                  </div>
                  <h4>{action.title}</h4>
                  <ArrowRight size={16} />
                </motion.div>
              ))}
            </div>
          </Card>
        </div>

        <div className="faculty-dashboard__section">
          <Card>
            <div className="faculty-dashboard__section-header">
              <h3>Pending Tasks</h3>
              <Badge variant="warning">{stats.pending} pending</Badge>
            </div>
            <div className="faculty-dashboard__pending">
              {pendingTasks.map((task, index) => (
                <motion.div
                  key={task.course}
                  className="pending-item"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="pending-item__info">
                    <h4>{task.course}</h4>
                    <p>{task.task} ({task.count} students)</p>
                    <span className={`pending-item__due ${task.priority === 'high' ? 'pending-item__due--urgent' : ''}`}>
                      Due: {task.due}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant={task.priority === 'high' ? 'primary' : 'secondary'}
                    onClick={() => navigate('/faculty/grading')}
                  >
                    Submit Grades
                  </Button>
                </motion.div>
              ))}
            </div>
          </Card>

          <Card>
            <div className="faculty-dashboard__section-header">
              <h3>Course Performance</h3>
            </div>
            <div className="faculty-dashboard__performance">
              {coursePerformance.map((performance, index) => (
                <motion.div
                  key={performance.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <PerformanceWidget {...performance} />
                </motion.div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;