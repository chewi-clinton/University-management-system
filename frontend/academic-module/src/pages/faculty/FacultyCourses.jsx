import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  ArrowRight,
  Users,
  Clock,
  FileText,
} from "lucide-react";
import Card from "../../components/shared/layout/Card";
import SearchInput from "../../components/shared/ui/SearchInput";
import Select from "../../components/shared/ui/Select";
import Badge from "../../components/shared/ui/Badge";
import ProgressBar from "../../components/shared/ui/ProgressBar";
import Button from "../../components/shared/ui/Button";
import "../../../styles/pages/FacultyCourses.css";

// Mock data
const mockFacultyCourses = [
  {
    id: 1,
    code: "CS301",
    name: "Data Structures",
    section: "A",
    enrolled: 45,
    capacity: 50,
    avgGrade: 78,
    avgAttendance: 85,
    schedule: "Mon, Wed, Fri 9:00-10:30 AM",
    room: "A-101",
    color: "#3b82f6",
    semester: "Fall 2024",
    credits: 3,
    pendingGrades: 12,
    description:
      "Introduction to fundamental data structures including arrays, linked lists, stacks, queues, trees, and graphs.",
  },
  {
    id: 2,
    code: "CS201",
    name: "Programming Fundamentals",
    section: "B",
    enrolled: 38,
    capacity: 40,
    avgGrade: 82,
    avgAttendance: 90,
    schedule: "Tue, Thu 2:00-3:30 PM",
    room: "B-205",
    color: "#8b5cf6",
    semester: "Fall 2024",
    credits: 4,
    pendingGrades: 5,
    description:
      "Basic programming concepts, problem-solving techniques, and introduction to programming languages.",
  },
  {
    id: 3,
    code: "CS401",
    name: "Advanced Algorithms",
    section: "A",
    enrolled: 32,
    capacity: 35,
    avgGrade: 75,
    avgAttendance: 88,
    schedule: "Mon, Wed 11:00-12:30 PM",
    room: "A-203",
    color: "#10b981",
    semester: "Fall 2024",
    credits: 3,
    pendingGrades: 8,
    description:
      "Advanced algorithm design and analysis including dynamic programming, greedy algorithms, and complexity theory.",
  },
  {
    id: 4,
    code: "CS205",
    name: "Database Systems",
    section: "A",
    enrolled: 42,
    capacity: 45,
    avgGrade: 80,
    avgAttendance: 92,
    schedule: "Wed, Fri 1:00-2:30 PM",
    room: "C-301",
    color: "#f59e0b",
    semester: "Fall 2024",
    credits: 3,
    pendingGrades: 3,
    description:
      "Database design, SQL, normalization, and database management systems.",
  },
];

const FacultyCourses = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  const semesters = [
    { value: "all", label: "All Semesters" },
    { value: "Fall 2024", label: "Fall 2024" },
    { value: "Spring 2024", label: "Spring 2024" },
    { value: "Summer 2024", label: "Summer 2024" },
  ];

  const sortOptions = [
    { value: "name", label: "Course Name" },
    { value: "code", label: "Course Code" },
    { value: "enrollment", label: "Enrollment" },
    { value: "performance", label: "Performance" },
  ];

  const filteredAndSortedCourses = useMemo(() => {
    let filtered = mockFacultyCourses;

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
  }, [searchTerm, selectedSemester, sortBy]);

  const getEnrollmentPercentage = (enrolled, capacity) => {
    return Math.round((enrolled / capacity) * 100);
  };

  const getGradeColor = (grade) => {
    if (grade >= 80) return "success";
    if (grade >= 70) return "warning";
    return "error";
  };

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
      </motion.div>

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
                      variant={course.pendingGrades > 10 ? "error" : "warning"}
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

      {filteredAndSortedCourses.length === 0 && (
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
    </div>
  );
};

export default FacultyCourses;
