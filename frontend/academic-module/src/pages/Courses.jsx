import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, ChevronRight, BookOpen, Clock, Users } from 'lucide-react';
import Container from '../components/shared/layout/Container.jsx';
import Card from '../components/shared/layout/Card.jsx';
import Button from '../components/shared/ui/Button.jsx';
import Badge from '../components/shared/ui/Badge.jsx';
import Avatar from '../components/shared/ui/Avatar.jsx';
import ProgressBar from '../components/shared/ui/ProgressBar.jsx';
import { studentService } from '../services/api/student.service.js';

const Courses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await studentService.getCourses();
        setCourses(response.data.courses);
        setFilteredCourses(response.data.courses);
      } catch (error) {
        console.error('Failed to fetch courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    let filtered = courses;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(course => 
        course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (activeFilter !== 'all') {
      if (activeFilter === 'ongoing') {
        filtered = filtered.filter(course => course.progress < 100);
      } else if (activeFilter === 'completed') {
        filtered = filtered.filter(course => course.progress === 100);
      }
    }

    setFilteredCourses(filtered);
  }, [searchTerm, activeFilter, courses]);

  const containerVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
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

  const filters = [
    { id: 'all', label: 'All Courses', count: courses.length },
    { id: 'ongoing', label: 'Ongoing', count: courses.filter(c => c.progress < 100).length },
    { id: 'completed', label: 'Completed', count: courses.filter(c => c.progress === 100).length }
  ];

  if (loading) {
    return (
      <Container>
        <div className="courses__skeleton">
          <div className="skeleton courses__skeleton-header" />
          <div className="skeleton-grid">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton course-card__skeleton" />
            ))}
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <motion.div 
        className="courses"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        {/* Header */}
        <motion.div className="courses__header" variants={itemVariants}>
          <div>
            <h1 className="courses__title">My Courses</h1>
            <p className="courses__subtitle">
              Track your progress and manage your academic journey
            </p>
          </div>
          <div className="courses__search">
            <div className="search__input-wrapper">
              <Search size={18} className="search__icon" />
              <input
                type="text"
                placeholder="Search courses, instructors..."
                className="search__input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div className="courses__filters" variants={itemVariants}>
          <div className="filters__list">
            {filters.map(filter => (
              <button
                key={filter.id}
                className={`filter__btn ${activeFilter === filter.id ? 'filter__btn--active' : ''}`}
                onClick={() => setActiveFilter(filter.id)}
              >
                <span>{filter.label}</span>
                <Badge variant="neutral" size="xs">
                  {filter.count}
                </Badge>
              </button>
            ))}
          </div>
          <Button variant="outline" size="sm" leftIcon={<Filter size={16} />}>
            More Filters
          </Button>
        </motion.div>

        {/* Course Grid */}
        <motion.div className="courses__grid" variants={itemVariants}>
          {filteredCourses.map((course, index) => (
            <motion.div
              key={course.id}
              className="course-card__wrapper"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card 
                className="course-card"
                hover
                onClick={() => navigate(`/courses/${course.id}`)}
              >
                {/* Course Header */}
                <div className="course-card__header" style={{ backgroundColor: course.color }}>
                  <div className="course-card__code">
                    <BookOpen size={16} />
                    <span>{course.code}</span>
                  </div>
                  <Badge variant="neutral" size="xs">
                    {course.credits} credits
                  </Badge>
                </div>

                {/* Course Content */}
                <div className="course-card__content">
                  <h3 className="course-card__title">{course.name}</h3>
                  <p className="course-card__description">{course.description}</p>
                  
                  <div className="course-card__instructor">
                    <Avatar
                      src={course.instructorAvatar}
                      alt={course.instructor}
                      size="xs"
                    />
                    <span className="instructor__name">{course.instructor}</span>
                  </div>

                  {/* Progress */}
                  <div className="course-card__progress">
                    <div className="progress__header">
                      <span className="progress__label">Progress</span>
                      <span className="progress__value">{course.progress}%</span>
                    </div>
                    <ProgressBar 
                      value={course.progress} 
                      size="sm" 
                      showLabel={false}
                    />
                  </div>

                  {/* Course Stats */}
                  <div className="course-card__stats">
                    <div className="stat__item">
                      <Users size={14} />
                      <span>{course.students} students</span>
                    </div>
                    <div className="stat__item">
                      <Clock size={14} />
                      <span>{course.schedule}</span>
                    </div>
                  </div>

                  {/* Grade and Actions */}
                  <div className="course-card__footer">
                    <div className="course-card__grade">
                      <span className="grade__label">Grade:</span>
                      <Badge 
                        variant={course.grade === 'A' ? 'success' : 'warning'} 
                        size="sm"
                      >
                        {course.grade}
                      </Badge>
                    </div>
                    <Button 
                      variant="primary" 
                      size="sm"
                      className="course-card__action"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/courses/${course.id}`);
                      }}
                    >
                      View Details
                      <ChevronRight size={16} />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredCourses.length === 0 && (
          <motion.div 
            className="courses__empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <BookOpen size={48} className="empty__icon" />
            <h3 className="empty__title">No courses found</h3>
            <p className="empty__description">
              Try adjusting your search or filter criteria
            </p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                setActiveFilter('all');
              }}
            >
              Clear Filters
            </Button>
          </motion.div>
        )}
      </motion.div>
    </Container>
  );
};

export default Courses;