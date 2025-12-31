import React, { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  ArrowRight,
  Users,
  Clock,
  FileText,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import facultyService from "../../services/api/facultyService";
import Card from "../../components/shared/layout/Card";
import SearchInput from "../../components/shared/ui/SearchInput";
import Select from "../../components/shared/ui/Select";
import Badge from "../../components/shared/ui/Badge";
import ProgressBar from "../../components/shared/ui/ProgressBar";
import Button from "../../components/shared/ui/Button";
import "../../styles/pages/FacultyCourses.css";

const FacultyCourses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [semesters, setSemesters] = useState([
    { value: "all", label: "All Semesters" },
  ]);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await facultyService.getCoursesWithStats({
        is_visible: true,
      });

      setCourses(data.results || []);

      // Extract unique semesters from courses
      const uniqueSemesters = [...new Set(data.results.map((c) => c.semester))];
      const semesterOptions = [
        { value: "all", label: "All Semesters" },
        ...uniqueSemesters.map((sem) => ({ value: sem, label: sem })),
      ];
      setSemesters(semesterOptions);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
      setError(error.message || "Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  const sortOptions = [
    { value: "name", label: "Course Name" },
    { value: "code", label: "Course Code" },
    { value: "enrollment", label: "Enrollment" },
    { value: "performance", label: "Performance" },
  ];

  const filteredAndSortedCourses = useMemo(() => {
    let filtered = [...courses];

    // Filter by semester
    if (selectedSemester !== "all") {
      filtered = filtered.filter(
        (course) => course.semester === selectedSemester
      );
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (course) =>
          course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.code.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort courses
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "code":
          return a.code.localeCompare(b.code);
        case "enrollment":
          return b.enrolled - a.enrolled;
        case "performance":
          return b.avgGrade - a.avgGrade;
        default:
          return 0;
      }
    });

    return filtered;
  }, [courses, searchTerm, selectedSemester, sortBy]);

  const getEnrollmentPercentage = (enrolled, capacity) => {
    return Math.round((enrolled / capacity) * 100);
  };

  const getGradeColor = (grade) => {
    if (grade >= 80) return "success";
    if (grade >= 70) return "warning";
    return "error";
  };

  if (loading) {
    return (
      <div className="faculty-courses">
        <div className="faculty-courses__header">
          <h1>My Courses</h1>
          <p>Loading your courses...</p>
        </div>
        <div className="faculty-courses__loading">
          <div className="skeleton-grid">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="skeleton faculty-course-card__skeleton" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="faculty-courses">
        <div className="faculty-courses__header">
          <h1>My Courses</h1>
        </div>
        <Card className="faculty-courses__error">
          <Card.Body>
            <div className="error__content">
              <AlertCircle size={48} className="error__icon" />
              <h2>Failed to Load Courses</h2>
              <p>{error}</p>
              <Button
                onClick={fetchCourses}
                variant="primary"
                leftIcon={<RefreshCw size={16} />}
              >
                Try Again
              </Button>
            </div>
          </Card.Body>
        </Card>
      </div>
    );
  }

  return (
    <div className="faculty-courses">
      <div className="faculty-courses__header">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          My Courses
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          Manage your courses and track student progress
        </motion.p>
      </div>

      <motion.div
        className="faculty-courses__filters"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <SearchInput
          placeholder="Search courses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          icon={<Search size={20} />}
          className="faculty-courses__search"
        />
        <Select
          value={selectedSemester}
          onChange={(e) => setSelectedSemester(e.target.value)}
          options={semesters}
          className="faculty-courses__filter"
        />
        <Select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          options={sortOptions}
          className="faculty-courses__filter"
        />
        <Button
          onClick={fetchCourses}
          variant="outline"
          size="sm"
          leftIcon={<RefreshCw size={16} />}
          className="faculty-courses__refresh"
        >
          Refresh
        </Button>
      </motion.div>

      {courses.length === 0 && !loading && (
        <motion.div
          className="faculty-courses__empty"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <FileText size={48} />
          <h3>No courses assigned</h3>
          <p>
            You don't have any courses assigned yet. Contact administration for
            more information.
          </p>
        </motion.div>
      )}

      {filteredAndSortedCourses.length === 0 && courses.length > 0 && (
        <motion.div
          className="faculty-courses__empty"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Filter size={48} />
          <h3>No courses found</h3>
          <p>Try adjusting your search criteria or filters</p>
        </motion.div>
      )}

      {filteredAndSortedCourses.length > 0 && (
        <motion.div
          className="faculty-courses__grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {filteredAndSortedCourses.map((course, index) => {
            const enrollmentPercentage = getEnrollmentPercentage(
              course.enrolled,
              course.capacity
            );

            return (
              <motion.div
                key={course.id}
                className="faculty-course-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -4, boxShadow: "var(--shadow-lg)" }}
              >
                <div
                  className="faculty-course-card__header"
                  style={{ backgroundColor: course.color }}
                >
                  <div className="faculty-course-card__title">
                    <h3>
                      {course.code} - {course.section}
                    </h3>
                    <h4>{course.name}</h4>
                  </div>
                  <Badge
                    variant="secondary"
                    className="faculty-course-card__badge"
                  >
                    {course.semester}
                  </Badge>
                </div>

                <div className="faculty-course-card__content">
                  <div className="faculty-course-card__schedule">
                    <Clock size={16} />
                    <span>{course.schedule}</span>
                  </div>
                  <div className="faculty-course-card__room">
                    <span>Room: {course.room}</span>
                  </div>

                  <div className="faculty-course-card__enrollment">
                    <div className="faculty-course-card__enrollment-header">
                      <Users size={16} />
                      <span>
                        {course.enrolled}/{course.capacity} students
                      </span>
                    </div>
                    <ProgressBar
                      value={enrollmentPercentage}
                      size="sm"
                      color={enrollmentPercentage > 90 ? "success" : "primary"}
                    />
                  </div>

                  <div className="faculty-course-card__stats">
                    <div className="faculty-course-card__stat-item">
                      <span className="label">Avg Grade:</span>
                      <Badge variant={getGradeColor(course.avgGrade)}>
                        {course.avgGrade}%
                      </Badge>
                    </div>
                    <div className="faculty-course-card__stat-item">
                      <span className="label">Attendance:</span>
                      <span className="value">{course.avgAttendance}%</span>
                    </div>
                    <div className="faculty-course-card__stat-item">
                      <span className="label">Pending:</span>
                      <Badge
                        variant={
                          course.pendingGrades > 10 ? "error" : "warning"
                        }
                      >
                        {course.pendingGrades} grades
                      </Badge>
                    </div>
                  </div>

                  <div className="faculty-course-card__actions">
                    <Button
                      onClick={() =>
                        navigate(`/faculty/course-management/${course.id}`)
                      }
                      variant="primary"
                      size="sm"
                      fullWidth
                      icon={<ArrowRight size={16} />}
                    >
                      Manage Course
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
};

export default FacultyCourses;
