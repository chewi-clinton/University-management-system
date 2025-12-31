import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Video,
  Clock,
  Calendar,
  Download,
  Play,
  ExternalLink,
  Users,
  AlertCircle,
} from "lucide-react";
import Container from "../components/shared/layout/Container.jsx";
import Card from "../components/shared/layout/Card.jsx";
import Badge from "../components/shared/ui/Badge.jsx";
import Button from "../components/shared/ui/Button.jsx";
import Skeleton from "../components/shared/feedback/Skeleton.jsx";
import { studentService } from "../services/api/studentService.js";
import "../styles/pages/virtual-classes.css";

const VirtualClasses = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nextClass, setNextClass] = useState(null);
  const [upcomingClasses, setUpcomingClasses] = useState([]);
  const [recordedClasses, setRecordedClasses] = useState([]);
  const [timeLeft, setTimeLeft] = useState({});
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchVirtualClasses();
  }, []);

  const fetchVirtualClasses = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get student's registered courses
      const coursesResponse = await studentService.getCourses();
      console.log("Courses response:", coursesResponse);

      if (!coursesResponse.success) {
        throw new Error(coursesResponse.error || "Failed to load courses");
      }

      const registeredCourses = Array.isArray(coursesResponse.data)
        ? coursesResponse.data
        : coursesResponse.data?.results || [];

      setCourses(registeredCourses);

      // Fetch Zoom classes for all registered courses
      const allZoomClasses = [];

      for (const course of registeredCourses) {
        const offeringId = course.offering?.id;

        if (offeringId) {
          try {
            const zoomResponse = await studentService.getZoomClasses(
              offeringId
            );
            console.log(
              `Zoom classes for offering ${offeringId}:`,
              zoomResponse
            );

            if (zoomResponse.success) {
              const classes = Array.isArray(zoomResponse.data)
                ? zoomResponse.data
                : zoomResponse.data?.results || [];

              // Add course information to each class
              const classesWithCourseInfo = classes.map((zoomClass) => ({
                ...zoomClass,
                courseInfo: course.offering,
              }));

              allZoomClasses.push(...classesWithCourseInfo);
            }
          } catch (err) {
            console.error(
              `Error fetching zoom classes for offering ${offeringId}:`,
              err
            );
          }
        }
      }

      console.log("All Zoom classes:", allZoomClasses);

      // Process and categorize classes
      processVirtualClasses(allZoomClasses);
    } catch (err) {
      console.error("Error fetching virtual classes:", err);
      setError(err.message || "Failed to load virtual classes");
    } finally {
      setLoading(false);
    }
  };

  const processVirtualClasses = (zoomClasses) => {
    const now = new Date();

    // Separate upcoming and recorded classes
    const upcoming = [];
    const recorded = [];

    zoomClasses.forEach((zoomClass) => {
      const classDateTime = new Date(
        `${zoomClass.schedule_date} ${zoomClass.start_time}`
      );
      const isUpcoming = classDateTime > now && zoomClass.is_active;

      const processedClass = {
        id: zoomClass.zoom_class_id,
        courseCode: zoomClass.courseInfo?.course?.course_code || "N/A",
        courseName:
          zoomClass.courseInfo?.course?.course_name || "Unknown Course",
        title: zoomClass.topic,
        date: zoomClass.schedule_date,
        time: zoomClass.start_time,
        duration: zoomClass.duration_minutes,
        platform: zoomClass.platform === "zoom" ? "Zoom" : "Google Meet",
        platformColor: zoomClass.platform === "zoom" ? "#2D8CFF" : "#0F9D58",
        meetingLink: zoomClass.join_link,
        meetingId: zoomClass.meeting_id,
        passcode: zoomClass.passcode || null,
        instructor: zoomClass.courseInfo?.faculty?.user?.first_name
          ? `${zoomClass.courseInfo.faculty.user.first_name} ${zoomClass.courseInfo.faculty.user.last_name}`
          : zoomClass.created_by_faculty?.user?.first_name
          ? `${zoomClass.created_by_faculty.user.first_name} ${zoomClass.created_by_faculty.user.last_name}`
          : "Instructor",
        instructorAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${
          zoomClass.courseInfo?.faculty?.user?.email || "instructor"
        }`,
        status: isUpcoming ? "upcoming" : "recorded",
        recordingUrl: zoomClass.recording_url || null,
        thumbnail: `https://api.dicebear.com/7.x/shapes/svg?seed=${zoomClass.zoom_class_id}`,
      };

      if (isUpcoming) {
        upcoming.push(processedClass);
      } else if (zoomClass.recording_url) {
        recorded.push(processedClass);
      }
    });

    // Sort upcoming classes by date/time
    upcoming.sort((a, b) => {
      const dateA = new Date(`${a.date} ${a.time}`);
      const dateB = new Date(`${b.date} ${b.time}`);
      return dateA - dateB;
    });

    // Sort recorded classes by date (most recent first)
    recorded.sort((a, b) => {
      const dateA = new Date(`${a.date} ${a.time}`);
      const dateB = new Date(`${b.date} ${b.time}`);
      return dateB - dateA;
    });

    setNextClass(upcoming[0] || null);
    setUpcomingClasses(upcoming.slice(1));
    setRecordedClasses(recorded);
  };

  useEffect(() => {
    if (!nextClass) return;

    const calculateTimeLeft = () => {
      const classDateTime = new Date(`${nextClass.date} ${nextClass.time}`);
      const now = new Date();
      const difference = classDateTime - now;

      if (difference > 0) {
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ hours, minutes, seconds });
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [nextClass]);

  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { weekday: "short", month: "short", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  const canJoinClass = (classDate, classTime) => {
    const classDateTime = new Date(`${classDate} ${classTime}`);
    const now = new Date();
    const timeDiff = classDateTime - now;
    const minutesDiff = timeDiff / (1000 * 60);

    return minutesDiff <= 10 && minutesDiff >= -30;
  };

  const handleJoinClass = (meetingLink) => {
    if (meetingLink) {
      window.open(meetingLink, "_blank", "noopener,noreferrer");
    }
  };

  const handleDownloadRecording = (recordingUrl) => {
    if (recordingUrl) {
      window.open(recordingUrl, "_blank", "noopener,noreferrer");
    }
  };

  if (loading) {
    return (
      <Container>
        <div className="virtual-classes">
          <div className="virtual-classes__header">
            <Skeleton variant="text" width="300px" height="40px" />
            <Skeleton
              variant="text"
              width="400px"
              height="20px"
              style={{ marginTop: "8px" }}
            />
          </div>
          <Skeleton
            variant="rectangular"
            height="300px"
            style={{ marginBottom: "24px" }}
          />
          <Skeleton variant="rectangular" height="200px" />
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <div className="virtual-classes">
          <Card variant="flat" className="virtual-classes__error">
            <AlertCircle
              size={48}
              style={{ color: "#ef4444", marginBottom: "16px" }}
            />
            <h3
              style={{
                fontSize: "20px",
                fontWeight: "600",
                marginBottom: "8px",
              }}
            >
              Failed to Load Virtual Classes
            </h3>
            <p style={{ color: "#6b7280", marginBottom: "24px" }}>{error}</p>
            <Button variant="primary" onClick={fetchVirtualClasses}>
              Retry
            </Button>
          </Card>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <motion.div
        className="virtual-classes"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        <div className="virtual-classes__header">
          <h1 className="virtual-classes__title">Virtual Classes</h1>
          <p className="virtual-classes__subtitle">
            Join live sessions and access recorded lectures
          </p>
        </div>

        {/* Next Class Featured Card */}
        {nextClass && (
          <motion.div variants={itemVariants}>
            <Card variant="elevated" className="virtual-classes__featured">
              <div className="virtual-classes__featured-badge">
                <Badge variant="error">Next Class</Badge>
              </div>

              <div className="virtual-classes__featured-content">
                <div className="virtual-classes__featured-info">
                  <div className="virtual-classes__featured-meta">
                    <span className="virtual-classes__course-code">
                      {nextClass.courseCode}
                    </span>
                    <Badge
                      variant="primary"
                      style={{ backgroundColor: nextClass.platformColor }}
                    >
                      {nextClass.platform}
                    </Badge>
                  </div>

                  <h2 className="virtual-classes__featured-title">
                    {nextClass.title}
                  </h2>
                  <p className="virtual-classes__featured-course">
                    {nextClass.courseName}
                  </p>

                  <div className="virtual-classes__featured-details">
                    <div className="virtual-classes__detail">
                      <Calendar
                        className="virtual-classes__detail-icon"
                        size={18}
                      />
                      <span>{formatDate(nextClass.date)}</span>
                    </div>
                    <div className="virtual-classes__detail">
                      <Clock
                        className="virtual-classes__detail-icon"
                        size={18}
                      />
                      <span>
                        {nextClass.time} ({nextClass.duration} min)
                      </span>
                    </div>
                  </div>

                  <div className="virtual-classes__instructor">
                    <img
                      src={nextClass.instructorAvatar}
                      alt={nextClass.instructor}
                      className="virtual-classes__instructor-avatar"
                    />
                    <span className="virtual-classes__instructor-name">
                      {nextClass.instructor}
                    </span>
                  </div>

                  {nextClass.meetingId && (
                    <div className="virtual-classes__meeting-info">
                      <div className="virtual-classes__meeting-detail">
                        <span className="virtual-classes__meeting-label">
                          Meeting ID:
                        </span>
                        <span className="virtual-classes__meeting-value">
                          {nextClass.meetingId}
                        </span>
                      </div>
                      {nextClass.passcode && (
                        <div className="virtual-classes__meeting-detail">
                          <span className="virtual-classes__meeting-label">
                            Passcode:
                          </span>
                          <span className="virtual-classes__meeting-value">
                            {nextClass.passcode}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="virtual-classes__featured-timer">
                  <div className="virtual-classes__countdown">
                    <div className="virtual-classes__countdown-label">
                      Starts in
                    </div>
                    <div className="virtual-classes__countdown-values">
                      <div className="virtual-classes__countdown-item">
                        <span className="virtual-classes__countdown-number">
                          {String(timeLeft.hours || 0).padStart(2, "0")}
                        </span>
                        <span className="virtual-classes__countdown-unit">
                          hours
                        </span>
                      </div>
                      <span className="virtual-classes__countdown-separator">
                        :
                      </span>
                      <div className="virtual-classes__countdown-item">
                        <span className="virtual-classes__countdown-number">
                          {String(timeLeft.minutes || 0).padStart(2, "0")}
                        </span>
                        <span className="virtual-classes__countdown-unit">
                          mins
                        </span>
                      </div>
                      <span className="virtual-classes__countdown-separator">
                        :
                      </span>
                      <div className="virtual-classes__countdown-item">
                        <span className="virtual-classes__countdown-number">
                          {String(timeLeft.seconds || 0).padStart(2, "0")}
                        </span>
                        <span className="virtual-classes__countdown-unit">
                          secs
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="primary"
                    size="lg"
                    className="virtual-classes__join-button"
                    disabled={!canJoinClass(nextClass.date, nextClass.time)}
                    onClick={() => handleJoinClass(nextClass.meetingLink)}
                  >
                    <ExternalLink size={20} />
                    Join Class
                  </Button>

                  {!canJoinClass(nextClass.date, nextClass.time) && (
                    <p className="virtual-classes__join-hint">
                      Join button will be active 10 minutes before class
                    </p>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* This Week's Schedule */}
        {upcomingClasses.length > 0 && (
          <motion.div
            variants={itemVariants}
            className="virtual-classes__section"
          >
            <h2 className="virtual-classes__section-title">
              <Calendar size={24} />
              This Week's Schedule
            </h2>

            <div className="virtual-classes__list">
              {upcomingClasses.map((classItem, index) => (
                <motion.div
                  key={classItem.id}
                  variants={itemVariants}
                  custom={index}
                >
                  <Card variant="flat" className="virtual-classes__item">
                    <div className="virtual-classes__item-header">
                      <div className="virtual-classes__item-meta">
                        <span className="virtual-classes__item-code">
                          {classItem.courseCode}
                        </span>
                        <Badge
                          variant="primary"
                          size="sm"
                          style={{ backgroundColor: classItem.platformColor }}
                        >
                          {classItem.platform}
                        </Badge>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={!canJoinClass(classItem.date, classItem.time)}
                        onClick={() => handleJoinClass(classItem.meetingLink)}
                      >
                        <ExternalLink size={16} />
                        Join
                      </Button>
                    </div>

                    <h3 className="virtual-classes__item-title">
                      {classItem.title}
                    </h3>
                    <p className="virtual-classes__item-course">
                      {classItem.courseName}
                    </p>

                    <div className="virtual-classes__item-details">
                      <div className="virtual-classes__item-detail">
                        <Calendar size={16} />
                        <span>{formatDate(classItem.date)}</span>
                      </div>
                      <div className="virtual-classes__item-detail">
                        <Clock size={16} />
                        <span>{classItem.time}</span>
                      </div>
                      <div className="virtual-classes__item-detail">
                        <Video size={16} />
                        <span>{classItem.duration} min</span>
                      </div>
                    </div>

                    <div className="virtual-classes__item-footer">
                      <div className="virtual-classes__item-instructor">
                        <img
                          src={classItem.instructorAvatar}
                          alt={classItem.instructor}
                          className="virtual-classes__item-avatar"
                        />
                        <span>{classItem.instructor}</span>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Recorded Classes */}
        {recordedClasses.length > 0 && (
          <motion.div
            variants={itemVariants}
            className="virtual-classes__section"
          >
            <h2 className="virtual-classes__section-title">
              <Play size={24} />
              Recorded Classes
            </h2>

            <div className="virtual-classes__grid">
              {recordedClasses.map((recording, index) => (
                <motion.div
                  key={recording.id}
                  variants={itemVariants}
                  custom={index}
                >
                  <Card variant="flat" className="virtual-classes__recording">
                    <div className="virtual-classes__recording-thumbnail">
                      <img
                        src={recording.thumbnail}
                        alt={recording.title}
                        className="virtual-classes__recording-image"
                      />
                      <div className="virtual-classes__recording-overlay">
                        <div
                          className="virtual-classes__recording-play"
                          onClick={() =>
                            handleDownloadRecording(recording.recordingUrl)
                          }
                          style={{ cursor: "pointer" }}
                        >
                          <Play size={32} />
                        </div>
                        <div className="virtual-classes__recording-duration">
                          {recording.duration} min
                        </div>
                      </div>
                    </div>

                    <div className="virtual-classes__recording-content">
                      <div className="virtual-classes__recording-meta">
                        <span className="virtual-classes__recording-code">
                          {recording.courseCode}
                        </span>
                        <Badge variant="success" size="sm">
                          Recorded
                        </Badge>
                      </div>

                      <h3 className="virtual-classes__recording-title">
                        {recording.title}
                      </h3>
                      <p className="virtual-classes__recording-course">
                        {recording.courseName}
                      </p>

                      <div className="virtual-classes__recording-info">
                        <div className="virtual-classes__recording-detail">
                          <Calendar size={14} />
                          <span>{formatDate(recording.date)}</span>
                        </div>
                        <div className="virtual-classes__recording-detail">
                          <Clock size={14} />
                          <span>{recording.time}</span>
                        </div>
                      </div>

                      <div className="virtual-classes__recording-footer">
                        <div className="virtual-classes__recording-instructor">
                          <img
                            src={recording.instructorAvatar}
                            alt={recording.instructor}
                            className="virtual-classes__recording-avatar"
                          />
                          <span>{recording.instructor}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleDownloadRecording(recording.recordingUrl)
                          }
                        >
                          <Download size={16} />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {!nextClass &&
          upcomingClasses.length === 0 &&
          recordedClasses.length === 0 && (
            <Card variant="flat" className="virtual-classes__empty">
              <div className="virtual-classes__empty-content">
                <Video size={64} className="virtual-classes__empty-icon" />
                <h3 className="virtual-classes__empty-title">
                  No Virtual Classes
                </h3>
                <p className="virtual-classes__empty-text">
                  There are no upcoming or recorded classes at the moment.
                </p>
              </div>
            </Card>
          )}
      </motion.div>
    </Container>
  );
};

export default VirtualClasses;
