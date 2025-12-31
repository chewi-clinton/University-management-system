import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Grid3x3,
  List,
  Table as TableIcon,
  Search,
  Mail,
  Phone,
  TrendingUp,
  Award,
  Calendar,
  BookOpen,
  Download,
  SlidersHorizontal,
  MessageSquare,
} from "lucide-react";
import Card from "../../components/shared/layout/Card";
import Button from "../../components/shared/ui/Button";
import Avatar from "../../components/shared/ui/Avatar";
import Badge from "../../components/shared/ui/Badge";
import Input from "../../components/shared/ui/Input";
import Select from "../../components/shared/ui/Select";
import Modal from "../../components/shared/feedback/Modal";
import Table from "../../components/shared/ui/Table";
import ProgressBar from "../../components/shared/ui/ProgressBar";
import Skeleton from "../../components/shared/feedback/skeleton";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import facultyService from "../../services/api/facultyService";
import api from "../../services/api/api";
import "../../styles/pages/StudentDirectory.css";

const StudentDirectory = () => {
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [privateNotes, setPrivateNotes] = useState({});
  const [error, setError] = useState(null);
  const [studentDetails, setStudentDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const [filters, setFilters] = useState({
    course: "all",
    gpaMin: 0,
    gpaMax: 4,
    attendance: "all",
    sortBy: "name",
  });

  useEffect(() => {
    loadStudentsData();
  }, []);

  const loadStudentsData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get faculty's courses
      const coursesResponse = await facultyService.getCourses({
        is_visible: true,
      });
      const coursesData = coursesResponse.results || coursesResponse;
      setCourses(coursesData);

      // Get all students enrolled in faculty's courses
      const allStudents = new Map();

      for (const course of coursesData) {
        try {
          const registrationsResponse = await facultyService.getCourseStudents(
            course.id
          );
          const registrations =
            registrationsResponse.results || registrationsResponse;

          for (const reg of registrations) {
            const student = reg.student;
            if (!allStudents.has(student.student_id)) {
              // Get student's attendance summary
              let attendancePercentage = 0;
              try {
                const attendanceResponse = await api.get(
                  "attendance-summaries/",
                  {
                    params: { student: student.student_id },
                  }
                );
                const summaries =
                  attendanceResponse.data.results || attendanceResponse.data;

                if (summaries.length > 0) {
                  const totalAttendance = summaries.reduce((sum, s) => {
                    const attended = s.classes_attended || 0;
                    const total = s.total_classes || 0;
                    return sum + (total > 0 ? (attended / total) * 100 : 0);
                  }, 0);
                  attendancePercentage = Math.round(
                    totalAttendance / summaries.length
                  );
                }
              } catch (err) {
                console.warn(
                  "Could not load attendance for student:",
                  student.student_id
                );
              }

              allStudents.set(student.student_id, {
                id: student.student_id,
                name:
                  student.full_name ||
                  `${student.first_name || ""} ${
                    student.last_name || ""
                  }`.trim(),
                regNumber: student.university_reg_number || "N/A",
                email: student.email || "N/A",
                phone: student.phone || "N/A",
                gpa: parseFloat(student.current_gpa) || 0,
                attendance: attendancePercentage,
                currentGrade: getLetterGrade(
                  parseFloat(student.current_gpa) || 0
                ),
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${student.student_id}`,
                program: student.program_name || "N/A",
                semester: student.current_semester || 1,
                courses: [],
              });
            }

            // Add course to student's course list
            const studentData = allStudents.get(student.student_id);
            studentData.courses.push({
              code: course.course?.course_code || "N/A",
              name: course.course?.course_name || "N/A",
              grade: reg.grade || "N/A",
              percentage: reg.grade_points ? (reg.grade_points / 4.0) * 100 : 0,
              registrationId: reg.id,
              offeringId: course.id,
            });
          }
        } catch (err) {
          console.warn(`Could not load students for course ${course.id}:`, err);
        }
      }

      setStudents(Array.from(allStudents.values()));
    } catch (error) {
      console.error("Error loading students:", error);
      setError("Failed to load student data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const loadStudentDetails = async (student) => {
    setLoadingDetails(true);
    try {
      // Get detailed grades for this student
      const gradesResponse = await api.get("grades/", {
        params: { student: student.id },
      });
      const grades = gradesResponse.data.results || gradesResponse.data;

      // Get attendance records
      const attendanceResponse = await api.get("attendance/", {
        params: { student: student.id },
      });
      const attendance =
        attendanceResponse.data.results || attendanceResponse.data;

      // Process performance trend from grades
      const performanceTrend = grades
        .filter((g) => g.is_finalized)
        .sort((a, b) => new Date(a.graded_at) - new Date(b.graded_at))
        .slice(-6)
        .map((g) => ({
          assessment: g.assessment_name || "Assessment",
          score:
            g.max_marks > 0
              ? Math.round((g.marks_obtained / g.max_marks) * 100)
              : 0,
        }));

      // Calculate attendance per course
      const courseAttendance = {};
      attendance.forEach((record) => {
        const courseId = record.offering?.id;
        if (!courseId) return;

        if (!courseAttendance[courseId]) {
          courseAttendance[courseId] = {
            present: 0,
            total: 0,
            courseName: record.offering?.course?.course_name || "N/A",
            courseCode: record.offering?.course?.course_code || "N/A",
          };
        }

        courseAttendance[courseId].total++;
        if (record.status === "present") {
          courseAttendance[courseId].present++;
        }
      });

      setStudentDetails({
        ...student,
        performanceTrend:
          performanceTrend.length > 0
            ? performanceTrend
            : [{ assessment: "No data", score: 0 }],
        courseAttendance: Object.values(courseAttendance).map((ca) => ({
          code: ca.courseCode,
          name: ca.courseName,
          percentage:
            ca.total > 0 ? Math.round((ca.present / ca.total) * 100) : 0,
        })),
      });
    } catch (error) {
      console.error("Error loading student details:", error);
      setStudentDetails({
        ...student,
        performanceTrend: [],
        courseAttendance: [],
      });
    } finally {
      setLoadingDetails(false);
    }
  };

  const getLetterGrade = (gpa) => {
    if (gpa >= 3.7) return "A";
    if (gpa >= 3.3) return "A-";
    if (gpa >= 3.0) return "B+";
    if (gpa >= 2.7) return "B";
    if (gpa >= 2.3) return "B-";
    if (gpa >= 2.0) return "C+";
    if (gpa >= 1.7) return "C";
    if (gpa >= 1.3) return "C-";
    if (gpa >= 1.0) return "D";
    return "F";
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const filteredAndSortedStudents = useMemo(() => {
    let filtered = students.filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.regNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesGPA =
        student.gpa >= filters.gpaMin && student.gpa <= filters.gpaMax;

      let matchesAttendance = true;
      if (filters.attendance === "above90") {
        matchesAttendance = student.attendance >= 90;
      } else if (filters.attendance === "75to90") {
        matchesAttendance = student.attendance >= 75 && student.attendance < 90;
      } else if (filters.attendance === "below75") {
        matchesAttendance = student.attendance < 75;
      }

      const matchesCourse =
        filters.course === "all" ||
        student.courses.some(
          (c) => c.offeringId?.toString() === filters.course
        );

      return matchesSearch && matchesGPA && matchesAttendance && matchesCourse;
    });

    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "gpa":
          return b.gpa - a.gpa;
        case "attendance":
          return b.attendance - a.attendance;
        case "regNumber":
          return a.regNumber.localeCompare(b.regNumber);
        default:
          return 0;
      }
    });

    return filtered;
  }, [students, searchQuery, filters]);

  const handleViewStudent = async (student) => {
    setSelectedStudent(student);
    setIsDetailModalOpen(true);
    await loadStudentDetails(student);
  };

  const handleEmailStudent = (student) => {
    window.location.href = `mailto:${student.email}`;
  };

  const handleSaveNotes = async (studentId, notes) => {
    setPrivateNotes((prev) => ({
      ...prev,
      [studentId]: notes,
    }));
    // TODO: Implement API call to save notes
    console.log("Saving notes for student:", studentId, notes);
  };

  const handleExportList = () => {
    const csvContent = [
      ["Name", "Reg Number", "Email", "Program", "GPA", "Attendance", "Grade"],
      ...filteredAndSortedStudents.map((s) => [
        s.name,
        s.regNumber,
        s.email,
        s.program,
        s.gpa.toFixed(2),
        `${s.attendance}%`,
        s.currentGrade,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `students_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const getGPAColor = (gpa) => {
    if (gpa >= 3.7) return "success";
    if (gpa >= 3.0) return "primary";
    if (gpa >= 2.5) return "warning";
    return "error";
  };

  const getAttendanceColor = (attendance) => {
    if (attendance >= 90) return "success";
    if (attendance >= 75) return "warning";
    return "error";
  };

  const tableColumns = [
    {
      key: "avatar",
      label: "",
      render: (student) => (
        <Avatar src={student.avatar} name={student.name} size="sm" />
      ),
    },
    {
      key: "name",
      label: "Name",
      sortable: true,
    },
    {
      key: "regNumber",
      label: "Reg Number",
      sortable: true,
    },
    {
      key: "program",
      label: "Program",
    },
    {
      key: "gpa",
      label: "GPA",
      sortable: true,
      render: (student) => (
        <Badge variant={getGPAColor(student.gpa)}>
          {student.gpa.toFixed(2)}
        </Badge>
      ),
    },
    {
      key: "attendance",
      label: "Attendance",
      sortable: true,
      render: (student) => (
        <Badge variant={getAttendanceColor(student.attendance)}>
          {student.attendance}%
        </Badge>
      ),
    },
    {
      key: "currentGrade",
      label: "Grade",
      render: (student) => (
        <Badge variant="primary">{student.currentGrade}</Badge>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (student) => (
        <div className="student-directory__table-actions">
          <Button
            variant="ghost"
            size="sm"
            icon={Mail}
            onClick={() => handleEmailStudent(student)}
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleViewStudent(student)}
          >
            View
          </Button>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="student-directory">
        <Skeleton variant="text" width="300px" height="40px" />
        <Skeleton
          variant="rectangular"
          height="600px"
          style={{ marginTop: "24px" }}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="student-directory">
        <Card variant="flat">
          <div style={{ padding: "2rem", textAlign: "center" }}>
            <p style={{ color: "var(--error-500)", marginBottom: "1rem" }}>
              {error}
            </p>
            <Button onClick={loadStudentsData}>Retry</Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="student-directory">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="student-directory__header"
      >
        <div>
          <h1>Student Directory</h1>
          <p>View and manage student information</p>
        </div>
        <div className="student-directory__header-actions">
          <Button variant="outline" icon={Download} onClick={handleExportList}>
            Export List
          </Button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="student-directory__controls"
      >
        <div className="student-directory__search-bar">
          <Input
            type="text"
            placeholder="Search by name, reg number, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={Search}
          />
        </div>

        <div className="student-directory__view-controls">
          <Button
            variant="ghost"
            size="sm"
            icon={SlidersHorizontal}
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            Filters
          </Button>

          <div className="student-directory__view-toggle">
            <button
              className={`student-directory__view-btn ${
                viewMode === "grid" ? "student-directory__view-btn--active" : ""
              }`}
              onClick={() => setViewMode("grid")}
              title="Grid View"
            >
              <Grid3x3 size={18} />
            </button>
            <button
              className={`student-directory__view-btn ${
                viewMode === "list" ? "student-directory__view-btn--active" : ""
              }`}
              onClick={() => setViewMode("list")}
              title="List View"
            >
              <List size={18} />
            </button>
            <button
              className={`student-directory__view-btn ${
                viewMode === "table"
                  ? "student-directory__view-btn--active"
                  : ""
              }`}
              onClick={() => setViewMode("table")}
              title="Table View"
            >
              <TableIcon size={18} />
            </button>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {isFilterOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="student-directory__filters">
              <div className="student-directory__filters-content">
                <div className="student-directory__filter-group">
                  <label>Course</label>
                  <Select
                    value={filters.course}
                    onChange={(e) =>
                      handleFilterChange("course", e.target.value)
                    }
                  >
                    <option value="all">All Courses</option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.id.toString()}>
                        {course.course?.course_code} -{" "}
                        {course.course?.course_name}
                      </option>
                    ))}
                  </Select>
                </div>

                <div className="student-directory__filter-group">
                  <label>GPA Range</label>
                  <div className="student-directory__range-inputs">
                    <Input
                      type="number"
                      min="0"
                      max="4"
                      step="0.1"
                      value={filters.gpaMin}
                      onChange={(e) =>
                        handleFilterChange(
                          "gpaMin",
                          parseFloat(e.target.value) || 0
                        )
                      }
                      placeholder="Min"
                    />
                    <span>to</span>
                    <Input
                      type="number"
                      min="0"
                      max="4"
                      step="0.1"
                      value={filters.gpaMax}
                      onChange={(e) =>
                        handleFilterChange(
                          "gpaMax",
                          parseFloat(e.target.value) || 4
                        )
                      }
                      placeholder="Max"
                    />
                  </div>
                </div>

                <div className="student-directory__filter-group">
                  <label>Attendance</label>
                  <Select
                    value={filters.attendance}
                    onChange={(e) =>
                      handleFilterChange("attendance", e.target.value)
                    }
                  >
                    <option value="all">All Students</option>
                    <option value="above90">Above 90%</option>
                    <option value="75to90">75% - 90%</option>
                    <option value="below75">Below 75%</option>
                  </Select>
                </div>

                <div className="student-directory__filter-group">
                  <label>Sort By</label>
                  <Select
                    value={filters.sortBy}
                    onChange={(e) =>
                      handleFilterChange("sortBy", e.target.value)
                    }
                  >
                    <option value="name">Name</option>
                    <option value="gpa">GPA (High to Low)</option>
                    <option value="attendance">Attendance (High to Low)</option>
                    <option value="regNumber">Registration Number</option>
                  </Select>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setFilters({
                      course: "all",
                      gpaMin: 0,
                      gpaMax: 4,
                      attendance: "all",
                      sortBy: "name",
                    });
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="student-directory__results"
      >
        <p className="student-directory__count">
          Showing {filteredAndSortedStudents.length} of {students.length}{" "}
          students
        </p>
      </motion.div>

      <AnimatePresence mode="wait">
        {viewMode === "grid" && (
          <motion.div
            key="grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="student-directory__grid"
          >
            {filteredAndSortedStudents.map((student, index) => (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="student-card">
                  <div className="student-card__header">
                    <Avatar
                      src={student.avatar}
                      name={student.name}
                      size="lg"
                    />
                    <div className="student-card__info">
                      <h3>{student.name}</h3>
                      <p className="student-card__reg">{student.regNumber}</p>
                      <p className="student-card__program">{student.program}</p>
                    </div>
                  </div>

                  <div className="student-card__stats">
                    <div className="student-card__stat">
                      <Award size={16} />
                      <span className="student-card__stat-label">GPA</span>
                      <Badge variant={getGPAColor(student.gpa)}>
                        {student.gpa.toFixed(2)}
                      </Badge>
                    </div>
                    <div className="student-card__stat">
                      <Calendar size={16} />
                      <span className="student-card__stat-label">
                        Attendance
                      </span>
                      <Badge variant={getAttendanceColor(student.attendance)}>
                        {student.attendance}%
                      </Badge>
                    </div>
                    <div className="student-card__stat">
                      <BookOpen size={16} />
                      <span className="student-card__stat-label">Grade</span>
                      <Badge variant="primary">{student.currentGrade}</Badge>
                    </div>
                  </div>

                  <div className="student-card__actions">
                    <Button
                      variant="outline"
                      size="sm"
                      icon={Mail}
                      onClick={() => handleEmailStudent(student)}
                    >
                      Email
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleViewStudent(student)}
                    >
                      View Profile
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        {viewMode === "list" && (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="student-directory__list"
          >
            {filteredAndSortedStudents.map((student, index) => (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.03 }}
              >
                <Card className="student-list-item">
                  <div className="student-list-item__main">
                    <Avatar
                      src={student.avatar}
                      name={student.name}
                      size="md"
                    />
                    <div className="student-list-item__info">
                      <div className="student-list-item__name-section">
                        <h3>{student.name}</h3>
                        <Badge variant="neutral" size="sm">
                          {student.regNumber}
                        </Badge>
                      </div>
                      <div className="student-list-item__details">
                        <span>
                          <Mail size={14} /> {student.email}
                        </span>
                        <span>
                          <Phone size={14} /> {student.phone}
                        </span>
                        <span>
                          <BookOpen size={14} /> {student.program}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="student-list-item__stats">
                    <div className="student-list-item__stat-box">
                      <span className="student-list-item__stat-label">GPA</span>
                      <Badge variant={getGPAColor(student.gpa)}>
                        {student.gpa.toFixed(2)}
                      </Badge>
                    </div>
                    <div className="student-list-item__stat-box">
                      <span className="student-list-item__stat-label">
                        Attendance
                      </span>
                      <Badge variant={getAttendanceColor(student.attendance)}>
                        {student.attendance}%
                      </Badge>
                    </div>
                    <div className="student-list-item__stat-box">
                      <span className="student-list-item__stat-label">
                        Grade
                      </span>
                      <Badge variant="primary">{student.currentGrade}</Badge>
                    </div>
                  </div>

                  <div className="student-list-item__actions">
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={Mail}
                      onClick={() => handleEmailStudent(student)}
                    />
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleViewStudent(student)}
                    >
                      View
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        {viewMode === "table" && (
          <motion.div
            key="table"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <Table columns={tableColumns} data={filteredAndSortedStudents} />
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {filteredAndSortedStudents.length === 0 && (
        <Card>
          <div className="student-directory__empty">
            <Search size={48} />
            <h3>No Students Found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        </Card>
      )}

      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedStudent(null);
          setStudentDetails(null);
        }}
        title="Student Details"
        size="large"
      >
        {selectedStudent && (
          <div className="student-detail">
            <div className="student-detail__header">
              <Avatar
                src={selectedStudent.avatar}
                name={selectedStudent.name}
                size="xl"
              />
              <div className="student-detail__header-info">
                <h2>{selectedStudent.name}</h2>
                <p className="student-detail__reg">
                  {selectedStudent.regNumber}
                </p>
                <div className="student-detail__contact">
                  <span>
                    <Mail size={14} /> {selectedStudent.email}
                  </span>
                  <span>
                    <Phone size={14} /> {selectedStudent.phone}
                  </span>
                </div>
                <Badge variant="primary">{selectedStudent.program}</Badge>
              </div>
            </div>

            <div className="student-detail__stats-row">
              <div className="student-detail__stat-card">
                <Award size={24} />
                <div>
                  <span className="student-detail__stat-label">GPA</span>
                  <span className="student-detail__stat-value">
                    {selectedStudent.gpa.toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="student-detail__stat-card">
                <Calendar size={24} />
                <div>
                  <span className="student-detail__stat-label">Attendance</span>
                  <span className="student-detail__stat-value">
                    {selectedStudent.attendance}%
                  </span>
                </div>
              </div>
              <div className="student-detail__stat-card">
                <BookOpen size={24} />
                <div>
                  <span className="student-detail__stat-label">
                    Current Grade
                  </span>
                  <span className="student-detail__stat-value">
                    {selectedStudent.currentGrade}
                  </span>
                </div>
              </div>
              <div className="student-detail__stat-card">
                <TrendingUp size={24} />
                <div>
                  <span className="student-detail__stat-label">Semester</span>
                  <span className="student-detail__stat-value">
                    {selectedStudent.semester}
                  </span>
                </div>
              </div>
            </div>

            {loadingDetails ? (
              <Skeleton variant="rectangular" height="200px" />
            ) : (
              <>
                <div className="student-detail__section">
                  <h3>Enrolled Courses</h3>
                  <div className="student-detail__courses">
                    {selectedStudent.courses.map((course, index) => (
                      <div key={index} className="student-detail__course-item">
                        <div className="student-detail__course-info">
                          <span className="student-detail__course-code">
                            {course.code}
                          </span>
                          <span className="student-detail__course-name">
                            {course.name}
                          </span>
                        </div>
                        <div className="student-detail__course-performance">
                          <Badge
                            variant={
                              course.grade.startsWith("A")
                                ? "success"
                                : course.grade.startsWith("B")
                                ? "primary"
                                : "warning"
                            }
                          >
                            {course.grade}
                          </Badge>
                          <span className="student-detail__course-percentage">
                            {Math.round(course.percentage)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {studentDetails?.courseAttendance &&
                  studentDetails.courseAttendance.length > 0 && (
                    <div className="student-detail__section">
                      <h3>Attendance Across Courses</h3>
                      <div className="student-detail__attendance-bars">
                        {studentDetails.courseAttendance.map(
                          (course, index) => (
                            <div
                              key={index}
                              className="student-detail__attendance-item"
                            >
                              <div className="student-detail__attendance-label">
                                <span>{course.code}</span>
                                <span>{course.percentage}%</span>
                              </div>
                              <ProgressBar
                                value={course.percentage}
                                max={100}
                                variant={
                                  course.percentage >= 90
                                    ? "success"
                                    : course.percentage >= 75
                                    ? "warning"
                                    : "error"
                                }
                              />
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                {studentDetails?.performanceTrend &&
                  studentDetails.performanceTrend.length > 0 && (
                    <div className="student-detail__section">
                      <h3>Performance Trend</h3>
                      <div className="student-detail__chart">
                        <ResponsiveContainer width="100%" height={250}>
                          <LineChart data={studentDetails.performanceTrend}>
                            <CartesianGrid
                              strokeDasharray="3 3"
                              stroke="#e5e7eb"
                            />
                            <XAxis
                              dataKey="assessment"
                              stroke="#6b7280"
                              fontSize={12}
                            />
                            <YAxis
                              stroke="#6b7280"
                              fontSize={12}
                              domain={[0, 100]}
                            />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "white",
                                border: "1px solid #e5e7eb",
                                borderRadius: "8px",
                              }}
                            />
                            <Line
                              type="monotone"
                              dataKey="score"
                              stroke="#e87d26"
                              strokeWidth={2}
                              dot={{ fill: "#e87d26", r: 4 }}
                              activeDot={{ r: 6 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}

                <div className="student-detail__section">
                  <h3>Private Notes (Faculty Only)</h3>
                  <textarea
                    className="student-detail__notes"
                    placeholder="Enter private notes about this student..."
                    value={privateNotes[selectedStudent.id] || ""}
                    onChange={(e) =>
                      setPrivateNotes((prev) => ({
                        ...prev,
                        [selectedStudent.id]: e.target.value,
                      }))
                    }
                    rows="4"
                  />
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() =>
                      handleSaveNotes(
                        selectedStudent.id,
                        privateNotes[selectedStudent.id] || ""
                      )
                    }
                  >
                    Save Notes
                  </Button>
                </div>
              </>
            )}

            <div className="student-detail__actions">
              <Button
                variant="primary"
                icon={Mail}
                onClick={() => handleEmailStudent(selectedStudent)}
              >
                Email Student
              </Button>
              <Button variant="outline" icon={MessageSquare}>
                Send Message
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default StudentDirectory;
