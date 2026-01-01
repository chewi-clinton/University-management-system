import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Users, BookOpen, Calendar, Award } from 'lucide-react';

export default function QuickStats({
  stats = [],
  loading = false,
  className = ''
}) {
  const defaultStats = [
    {
      title: 'Total Students',
      value: '1,247',
      trend: '+12%',
      isPositive: true,
      icon: <Users size={24} />,
      color: 'blue'
    },
    {
      title: 'Active Courses',
      value: '156',
      trend: '+5%',
      isPositive: true,
      icon: <BookOpen size={24} />,
      color: 'green'
    },
    {
      title: 'Attendance Rate',
      value: '87.5%',
      trend: '-2%',
      isPositive: false,
      icon: <Calendar size={24} />,
      color: 'yellow'
    },
    {
      title: 'Average GPA',
      value: '3.42',
      trend: '+0.3',
      isPositive: true,
      icon: <Award size={24} />,
      color: 'purple'
    }
  ];

  const displayStats = stats.length > 0 ? stats : defaultStats;

  const colorClasses = {
    blue: 'quick-stat--blue',
    green: 'quick-stat--green',
    yellow: 'quick-stat--yellow',
    purple: 'quick-stat--purple',
    red: 'quick-stat--red',
    gray: 'quick-stat--gray'
  };

  if (loading) {
    return (
      <div className={`quick-stats ${className}`}>
        {[...Array(4)].map((_, i) => (
          <div key={i} className="quick-stat quick-stat--skeleton">
            <div className="quick-stat__skeleton-icon"></div>
            <div className="quick-stat__skeleton-content">
              <div className="quick-stat__skeleton-title"></div>
              <div className="quick-stat__skeleton-value"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`quick-stats ${className}`}>
      {displayStats.map((stat, index) => (
        <motion.div
          key={stat.title || index}
          className={`quick-stat ${colorClasses[stat.color] || 'quick-stat--blue'}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="quick-stat__icon">
            {stat.icon}
          </div>

          <div className="quick-stat__content">
            <h3 className="quick-stat__title">
              {stat.title}
            </h3>
            
            <div className="quick-stat__value-wrapper">
              <span className="quick-stat__value">
                {stat.value}
              </span>
              
              {stat.trend && (
                <div className={`quick-stat__trend ${stat.isPositive ? 'quick-stat__trend--positive' : 'quick-stat__trend--negative'}`}>
                  {stat.isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  <span>{stat.trend}</span>
                </div>
              )}
            </div>

            {stat.subtitle && (
              <p className="quick-stat__subtitle">
                {stat.subtitle}
              </p>
            )}
          </div>

          {stat.action && (
            <button
              className="quick-stat__action"
              onClick={stat.action}
              aria-label={`Action for ${stat.title}`}
            >
              <motion.div
                whileHover={{ rotate: 90 }}
                transition={{ duration: 0.2 }}
              >
                →
              </motion.div>
            </button>
          )}
        </motion.div>
      ))}
    </div>
  );
}

// Pre-configured stat components for common use cases
export const StudentStats = ({ data, loading }) => {
  const stats = [
    {
      title: 'Total Students',
      value: data?.totalStudents || '0',
      trend: data?.trend || '+0%',
      isPositive: data?.isPositive !== false,
      icon: <Users size={24} />,
      color: 'blue'
    },
    {
      title: 'Active Students',
      value: data?.activeStudents || '0',
      trend: data?.activeTrend || '+0%',
      isPositive: data?.activeIsPositive !== false,
      icon: <Users size={24} />,
      color: 'green'
    },
    {
      title: 'New Admissions',
      value: data?.newAdmissions || '0',
      trend: data?.admissionTrend || '+0%',
      isPositive: data?.admissionIsPositive !== false,
      icon: <Users size={24} />,
      color: 'purple'
    },
    {
      title: 'Graduated',
      value: data?.graduated || '0',
      trend: data?.graduationTrend || '+0%',
      isPositive: data?.graduationIsPositive !== false,
      icon: <Award size={24} />,
      color: 'yellow'
    }
  ];

  return <QuickStats stats={stats} loading={loading} />;
};

export const CourseStats = ({ data, loading }) => {
  const stats = [
    {
      title: 'Total Courses',
      value: data?.totalCourses || '0',
      trend: data?.courseTrend || '+0%',
      isPositive: data?.courseIsPositive !== false,
      icon: <BookOpen size={24} />,
      color: 'blue'
    },
    {
      title: 'Active Courses',
      value: data?.activeCourses || '0',
      trend: data?.activeTrend || '+0%',
      isPositive: data?.activeIsPositive !== false,
      icon: <BookOpen size={24} />,
      color: 'green'
    },
    {
      title: 'Completed',
      value: data?.completedCourses || '0',
      trend: data?.completedTrend || '+0%',
      isPositive: data?.completedIsPositive !== false,
      icon: <Award size={24} />,
      color: 'purple'
    },
    {
      title: 'Avg. Enrollment',
      value: data?.avgEnrollment || '0',
      trend: data?.enrollmentTrend || '+0%',
      isPositive: data?.enrollmentIsPositive !== false,
      icon: <Users size={24} />,
      color: 'yellow'
    }
  ];

  return <QuickStats stats={stats} loading={loading} />;
};