import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  BookOpen, 
  FileText, 
  BarChart3, 
  CalendarCheck, 
  Video,
  Download,
  Eye,
  Clock,
  Users
} from 'lucide-react';
import Container from '../components/shared/layout/Container.jsx';
import Card from '../components/shared/layout/Card.jsx';
import Button from '../components/shared/ui/Button.jsx';
import Avatar from '../components/shared/ui/Avatar.jsx';
import ProgressBar from '../components/shared/ui/ProgressBar.jsx';
import Tabs from '../components/shared/navigation/Tabs.jsx';
import { studentService } from '../services/api/student.service.js';

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('materials');

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        setLoading(true);
        const response = await studentService.getCourseDetails(id);
        setCourse(response.data.course);
      } catch (error) {
        console.error('Failed to fetch course details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCourseDetails();
    }
  }, [id]);

  const tabs = [
    { id: 'materials', label: 'Materials', icon: FileText },
    { id: 'grades', label: 'Grades', icon: BarChart3 },
    { id: 'attendance', label: 'Attendance', icon: CalendarCheck },
    { id: 'virtual-classes', label: 'Virtual Classes', icon: Video }
  ];

  const materials = [
    { id: 1, title: 'Lecture 1 Slides', type: 'pdf', size: '2.5 MB', date: '2025-01-15' },
    { id: 2, title: 'Assignment 1', type: 'pdf', size: '1.2 MB', date: '2025-01-10' },
    { id: 3, title: 'Tutorial Video', type: 'video', size: '45.8 MB', date: '2025-01-08' }
  ];

  const grades = [
    { name: 'Assignment 1', score: 95, maxScore: 100, weight: 15 },
    { name: 'Quiz 1', score: 88, maxScore: 100, weight: 10 },
    { name: 'Midterm', score: 0, maxScore: 100, weight: 30, status: 'upcoming' }
  ];

  if (loading) {
    return (
      <Container>
        <div className="course-details__skeleton">
          <div className="skeleton course-details__skeleton-hero" />
          <div className="skeleton-grid">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="skeleton course-details__skeleton-card" />
            ))}
          </div>
        </div>
      </Container>
    );
  }

  if (!course) {
    return (
      <Container>
        <div className="course-details__not-found">
          <h2>Course not found</h2>
          <Button onClick={() => navigate('/courses')}>
            Back to Courses
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="course-details">
        {/* Hero Section */}
        <div 
          className="course-details__hero"
          style={{ backgroundColor: course.color }}
        >
          <div className="hero__content">
            <Button
              variant="ghost"
              size="sm"
              className="hero__back"
              onClick={() => navigate('/courses')}
              leftIcon={<ArrowLeft size={16} />}
            >
              Back to Courses
            </Button>
            
            <div className="hero__info">
              <div className="hero__badge">
                <BookOpen size={16} />
                <span>{course.code}</span>
              </div>
              <h1 className="hero__title">{course.name}</h1>
              <p className="hero__description">{course.description}</p>
            </div>

            <div className="hero__stats">
              <div className="hero__stat">
                <span className="stat__label">Credits</span>
                <span className="stat__value">{course.credits}</span>
              </div>
              <div className="hero__stat">
                <span className="stat__label">Semester</span>
                <span className="stat__value">{course.semester}</span>
              </div>
              <div className="hero__stat">
                <span className="stat__label">Students</span>
                <span className="stat__value">{course.students}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Course Content */}
        <div className="course-details__content">
          {/* Instructor Card */}
          <Card className="instructor-card">
            <Card.Header>
              <h2 className="card__title">Course Instructor</h2>
            </Card.Header>
            <Card.Body>
              <div className="instructor__info">
                <Avatar
                  src={course.instructorAvatar}
                  alt={course.instructor}
                  size="lg"
                />
                <div className="instructor__details">
                  <h3 className="instructor__name">{course.instructor}</h3>
                  <p className="instructor__role">Professor</p>
                  <div className="instructor__contact">
                    <Button variant="outline" size="sm">
                      Send Message
                    </Button>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>

          {/* Progress Card */}
          <Card className="progress-card">
            <Card.Header>
              <h2 className="card__title">Course Progress</h2>
            </Card.Header>
            <Card.Body>
              <div className="progress__info">
                <div className="progress__percentage">
                  <span className="percentage__value">{course.progress}%</span>
                  <span className="percentage__label">Complete</span>
                </div>
                <ProgressBar value={course.progress} size="lg" />
              </div>
              <div className="progress__details">
                <div className="detail__item">
                  <span className="detail__label">Current Grade</span>
                  <Badge variant="success" size="lg">
                    {course.grade}
                  </Badge>
                </div>
                <div className="detail__item">
                  <span className="detail__label">Schedule</span>
                  <span className="detail__value">{course.schedule}</span>
                </div>
                <div className="detail__item">
                  <span className="detail__label">Location</span>
                  <span className="detail__value">{course.room}</span>
                </div>
              </div>
            </Card.Body>
          </Card>

          {/* Tabs */}
          <div className="course-details__tabs">
            <Tabs
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />

            <div className="tab-content">
              {/* Materials Tab */}
              {activeTab === 'materials' && (
                <div className="materials-tab">
                  <div className="materials__header">
                    <h3 className="tab__title">Course Materials</h3>
                    <Button variant="outline" size="sm">
                      Download All
                    </Button>
                  </div>
                  <div className="materials__list">
                    {materials.map(material => (
                      <Card key={material.id} className="material-card" variant="flat">
                        <div className="material__info">
                          <div className="material__icon">
                            <FileText size={20} />
                          </div>
                          <div className="material__details">
                            <h4 className="material__title">{material.title}</h4>
                            <p className="material__meta">
                              {material.size} • {material.date}
                            </p>
                          </div>
                        </div>
                        <div className="material__actions">
                          <Button variant="ghost" size="sm" leftIcon={<Eye size={16} />}>
                            Preview
                          </Button>
                          <Button variant="outline" size="sm" leftIcon={<Download size={16} />}>
                            Download
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Grades Tab */}
              {activeTab === 'grades' && (
                <div className="grades-tab">
                  <div className="grades__header">
                    <h3 className="tab__title">Grades & Assessments</h3>
                  </div>
                  <div className="grades__list">
                    {grades.map((grade, index) => (
                      <Card key={index} className="grade-card" variant="flat">
                        <div className="grade__info">
                          <h4 className="grade__name">{grade.name}</h4>
                          <p className="grade__weight">Weight: {grade.weight}%</p>
                        </div>
                        <div className="grade__score">
                          {grade.status === 'upcoming' ? (
                            <Badge variant="info" size="sm">
                              Upcoming
                            </Badge>
                          ) : (
                            <div className="score__value">
                              <span className="score__current">{grade.score}</span>
                              <span className="score__max">/ {grade.maxScore}</span>
                            </div>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Attendance Tab */}
              {activeTab === 'attendance' && (
                <div className="attendance-tab">
                  <div className="attendance__header">
                    <h3 className="tab__title">Attendance Record</h3>
                  </div>
                  <div className="attendance__summary">
                    <div className="summary__card">
                      <div className="summary__stat">
                        <span className="stat__value">85%</span>
                        <span className="stat__label">Attendance Rate</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Virtual Classes Tab */}
              {activeTab === 'virtual-classes' && (
                <div className="virtual-classes-tab">
                  <div className="virtual-classes__header">
                    <h3 className="tab__title">Virtual Classes</h3>
                  </div>
                  <div className="virtual-classes__list">
                    <Card className="virtual-class-card" variant="flat">
                      <div className="virtual-class__info">
                        <h4 className="virtual-class__title">Lecture 12: Binary Trees</h4>
                        <p className="virtual-class__schedule">Jan 22, 2025 • 9:00 AM - 10:30 AM</p>
                      </div>
                      <Button variant="primary" size="sm">
                        Join Class
                      </Button>
                    </Card>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default CourseDetails;