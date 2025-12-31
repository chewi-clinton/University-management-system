import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  ChevronRight,
  BookOpen,
  Clock,
  Users,
  AlertCircle,
} from "lucide-react";
import Container from "../components/shared/layout/Container.jsx";
import Card from "../components/shared/layout/Card.jsx";
import Button from "../components/shared/ui/Button.jsx";
import Badge from "../components/shared/ui/Badge.jsx";
import Avatar from "../components/shared/ui/Avatar.jsx";
import ProgressBar from "../components/shared/ui/ProgressBar.jsx";
import { studentService } from "../services/api/studentService.js";

const Courses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await studentService.getCourses();

        if (response.success) {
          // Transform API data to match component structure
          const transformedCourses = response.data.map((registration) => ({
            id: registration.registration_id,
            code: registration.offering.course.course_code,
            name: registration.offering.course.course_name,
            description:
              registration.offering.course.description ||
              "No description available",
            instructor:
              registration.offering.faculty?.full_name || "Not assigned",
            instructorAvatar:
              registration.offering.faculty?.user?.profile_picture || null,
            credits: registration.offering.course.credit_hours,
            color: getRandomColor(),
            progress: calculateProgress(registration),
            students: registration.offering.current_enrollment || 0,
            schedule: formatSchedule(registration.offering.schedule),
            grade: registration.grade || "N/A",
            status: registration.status,
          }));

          setCourses(transformedCourses);
          setFilteredCourses(transformedCourses);
        } else {
          setError(response.error);
        }
      } catch (error) {
        console.error("Failed to fetch courses:", error);
        setError("Failed to load courses. Please try again later.");
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
      filtered = filtered.filter(
        (course) =>
          course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (activeFilter !== "all") {
      if (activeFilter === "ongoing") {
        filtered = filtered.filter((course) => course.status === "registered");
      } else if (activeFilter === "completed") {
        filtered = filtered.filter((course) => course.status === "completed");
      } else if (activeFilter === "dropped") {
        filtered = filtered.filter(
          (course) =>
            course.status === "withdrawn" || course.status === "dropped"
        );
      }
    }

    setFilteredCourses(filtered);
  }, [searchTerm, activeFilter, courses]);

  // Helper function to calculate progress based on current date and semester dates
  const calculateProgress = (registration) => {
    if (registration.status === "completed") return 100;
    if (
      registration.status === "withdrawn" ||
      registration.status === "dropped"
    )
      return 0;

    const semester = registration.offering.semester;
    if (!semester) return 0;

    const startDate = new Date(semester.start_date);
    const endDate = new Date(semester.end_date);
    const currentDate = new Date();

    if (currentDate < startDate) return 0;
    if (currentDate > endDate) return 100;

    const totalDuration = endDate - startDate;
    const elapsed = currentDate - startDate;
    const progress = Math.round((elapsed / totalDuration) * 100);

    return Math.min(Math.max(progress, 0), 100);
  };

  // Helper function to format schedule
  const formatSchedule = (schedule) => {
    if (!schedule) return "Not scheduled";
    try {
      const parsed = JSON.parse(schedule);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const first = parsed[0];
        return `${first.day} ${first.start_time}`;
      }
    } catch (e) {
      return schedule;
    }
    return "Not scheduled";
  };

  // Helper function to generate random course colors
  const getRandomColor = () => {
    const colors = [
      "#6366f1", // Indigo
      "#8b5cf6", // Violet
      "#ec4899", // Pink
      "#f59e0b", // Amber
      "#10b981", // Emerald
      "#3b82f6", // Blue
      "#06b6d4", // Cyan
      "#f97316", // Orange
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Helper function to get grade variant
  const getGradeVariant = (grade) => {
    if (!grade || grade === "N/A") return "neutral";
    const gradeValue = grade.charAt(0);
    if (gradeValue === "A") return "success";
    if (gradeValue === "B") return "info";
    if (gradeValue === "C") return "warning";
    return "danger";
  };

  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
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

  const filters = [
    { id: "all", label: "All Courses", count: courses.length },
    {
      id: "ongoing",
      label: "Ongoing",
      count: courses.filter((c) => c.status === "registered").length,
    },
    {
      id: "completed",
      label: "Completed",
      count: courses.filter((c) => c.status === "completed").length,
    },
    {
      id: "dropped",
      label: "Dropped",
      count: courses.filter(
        (c) => c.status === "withdrawn" || c.status === "dropped"
      ).length,
    },
  ];

  if (loading) {
    return (
      <Container>
        <div className="courses__skeleton">
          <div
            className="skeleton courses__skeleton-header"
            style={{ height: "80px", marginBottom: "24px" }}
          />
          <div
            className="skeleton-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "24px",
            }}
          >
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="skeleton course-card__skeleton"
                style={{ height: "380px", borderRadius: "12px" }}
              />
            ))}
          </div>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <motion.div
          className="courses__error"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            textAlign: "center",
            padding: "48px",
            backgroundColor: "var(--color-error-light, #fef2f2)",
            borderRadius: "12px",
            marginTop: "24px",
          }}
        >
          <AlertCircle
            size={48}
            style={{
              color: "var(--color-error, #ef4444)",
              marginBottom: "16px",
            }}
          />
          <h3
            style={{ fontSize: "20px", fontWeight: "600", marginBottom: "8px" }}
          >
            Failed to Load Courses
          </h3>
          <p
            style={{
              color: "var(--color-text-secondary, #6b7280)",
              marginBottom: "24px",
            }}
          >
            {error}
          </p>
          <Button variant="primary" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </motion.div>
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
        <motion.div
          className="courses__header"
          variants={itemVariants}
          style={{ marginBottom: "32px" }}
        >
          <div>
            <h1
              className="courses__title"
              style={{
                fontSize: "32px",
                fontWeight: "700",
                marginBottom: "8px",
              }}
            >
              My Courses
            </h1>
            <p
              className="courses__subtitle"
              style={{
                color: "var(--color-text-secondary, #6b7280)",
                fontSize: "16px",
              }}
            >
              Track your progress and manage your academic journey
            </p>
          </div>
          <div className="courses__search" style={{ marginTop: "16px" }}>
            <div
              className="search__input-wrapper"
              style={{ position: "relative", maxWidth: "400px" }}
            >
              <Search
                size={18}
                className="search__icon"
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--color-text-tertiary, #9ca3af)",
                }}
              />
              <input
                type="text"
                placeholder="Search courses, instructors..."
                className="search__input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px 10px 40px",
                  border: "1px solid var(--color-border, #e5e7eb)",
                  borderRadius: "8px",
                  fontSize: "14px",
                }}
              />
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          className="courses__filters"
          variants={itemVariants}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <div
            className="filters__list"
            style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}
          >
            {filters.map((filter) => (
              <button
                key={filter.id}
                className={`filter__btn ${
                  activeFilter === filter.id ? "filter__btn--active" : ""
                }`}
                onClick={() => setActiveFilter(filter.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 16px",
                  border: "1px solid var(--color-border, #e5e7eb)",
                  borderRadius: "8px",
                  backgroundColor:
                    activeFilter === filter.id
                      ? "var(--color-primary, #6366f1)"
                      : "white",
                  color:
                    activeFilter === filter.id
                      ? "white"
                      : "var(--color-text-primary, #111827)",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                  transition: "all 0.2s",
                }}
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
        <motion.div
          className="courses__grid"
          variants={itemVariants}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "24px",
          }}
        >
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
                style={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* Course Header */}
                <div
                  className="course-card__header"
                  style={{
                    backgroundColor: course.color,
                    padding: "16px",
                    borderRadius: "12px 12px 0 0",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div
                    className="course-card__code"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      color: "white",
                    }}
                  >
                    <BookOpen size={16} />
                    <span style={{ fontWeight: "600", fontSize: "14px" }}>
                      {course.code}
                    </span>
                  </div>
                  <Badge
                    variant="neutral"
                    size="xs"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.2)",
                      color: "white",
                    }}
                  >
                    {course.credits} credits
                  </Badge>
                </div>

                {/* Course Content */}
                <div
                  className="course-card__content"
                  style={{
                    padding: "20px",
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <h3
                    className="course-card__title"
                    style={{
                      fontSize: "18px",
                      fontWeight: "600",
                      marginBottom: "8px",
                      lineHeight: "1.4",
                    }}
                  >
                    {course.name}
                  </h3>
                  <p
                    className="course-card__description"
                    style={{
                      color: "var(--color-text-secondary, #6b7280)",
                      fontSize: "14px",
                      marginBottom: "16px",
                      lineHeight: "1.5",
                    }}
                  >
                    {course.description}
                  </p>

                  <div
                    className="course-card__instructor"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "16px",
                    }}
                  >
                    <Avatar
                      src={course.instructorAvatar}
                      alt={course.instructor}
                      size="xs"
                    />
                    <span
                      className="instructor__name"
                      style={{
                        fontSize: "14px",
                        color: "var(--color-text-secondary, #6b7280)",
                      }}
                    >
                      {course.instructor}
                    </span>
                  </div>

                  {/* Progress */}
                  <div
                    className="course-card__progress"
                    style={{ marginBottom: "16px" }}
                  >
                    <div
                      className="progress__header"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "8px",
                      }}
                    >
                      <span
                        className="progress__label"
                        style={{
                          fontSize: "13px",
                          color: "var(--color-text-tertiary, #9ca3af)",
                        }}
                      >
                        Progress
                      </span>
                      <span
                        className="progress__value"
                        style={{
                          fontSize: "13px",
                          fontWeight: "600",
                          color: "var(--color-text-primary, #111827)",
                        }}
                      >
                        {course.progress}%
                      </span>
                    </div>
                    <ProgressBar
                      value={course.progress}
                      size="sm"
                      showLabel={false}
                    />
                  </div>

                  {/* Course Stats */}
                  <div
                    className="course-card__stats"
                    style={{
                      display: "flex",
                      gap: "16px",
                      marginBottom: "16px",
                    }}
                  >
                    <div
                      className="stat__item"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        fontSize: "13px",
                        color: "var(--color-text-secondary, #6b7280)",
                      }}
                    >
                      <Users size={14} />
                      <span>{course.students} students</span>
                    </div>
                    <div
                      className="stat__item"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        fontSize: "13px",
                        color: "var(--color-text-secondary, #6b7280)",
                      }}
                    >
                      <Clock size={14} />
                      <span>{course.schedule}</span>
                    </div>
                  </div>

                  {/* Grade and Actions */}
                  <div
                    className="course-card__footer"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: "auto",
                      paddingTop: "16px",
                      borderTop: "1px solid var(--color-border, #e5e7eb)",
                    }}
                  >
                    <div
                      className="course-card__grade"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <span
                        className="grade__label"
                        style={{
                          fontSize: "13px",
                          color: "var(--color-text-tertiary, #9ca3af)",
                        }}
                      >
                        Grade:
                      </span>
                      <Badge variant={getGradeVariant(course.grade)} size="sm">
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
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
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
            style={{
              textAlign: "center",
              padding: "48px",
              backgroundColor: "var(--color-background-secondary, #f9fafb)",
              borderRadius: "12px",
              marginTop: "24px",
            }}
          >
            <BookOpen
              size={48}
              className="empty__icon"
              style={{
                color: "var(--color-text-tertiary, #9ca3af)",
                marginBottom: "16px",
              }}
            />
            <h3
              className="empty__title"
              style={{
                fontSize: "20px",
                fontWeight: "600",
                marginBottom: "8px",
              }}
            >
              No courses found
            </h3>
            <p
              className="empty__description"
              style={{
                color: "var(--color-text-secondary, #6b7280)",
                marginBottom: "24px",
              }}
            >
              Try adjusting your search or filter criteria
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setActiveFilter("all");
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
