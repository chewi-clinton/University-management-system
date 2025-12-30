import React, { useState, useMemo } from "react";
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
  X,
  MessageSquare,
  Download,
  Filter,
  SlidersHorizontal,
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
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "../../styles/pages/StudentDirectory.css";

// Mock data remains unchanged
const mockStudents = [
  {
    id: 1,
    name: "John Doe",
    regNumber: "UNI-2024-0123",
    email: "john@student.edu",
    phone: "+1234567891",
    gpa: 3.8,
    attendance: 92,
    currentGrade: "A",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    program: "Computer Science",
    semester: 4,
    courses: [
      { code: "CS301", name: "Data Structures", grade: "A", percentage: 92 },
      {
        code: "CS201",
        name: "Programming Fundamentals",
        grade: "A",
        percentage: 88,
      },
    ],
  },
  {
    id: 2,
    name: "Jane Smith",
    regNumber: "UNI-2024-0124",
    email: "jane@student.edu",
    phone: "+1234567892",
    gpa: 3.9,
    attendance: 95,
    currentGrade: "A",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=JaneS",
    program: "Computer Science",
    semester: 4,
    courses: [
      { code: "CS301", name: "Data Structures", grade: "A", percentage: 95 },
      {
        code: "CS201",
        name: "Programming Fundamentals",
        grade: "A",
        percentage: 90,
      },
    ],
  },
  {
    id: 3,
    name: "Mike Chen",
    regNumber: "UNI-2024-0125",
    email: "mike@student.edu",
    phone: "+1234567893",
    gpa: 3.2,
    attendance: 78,
    currentGrade: "B",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
    program: "Computer Science",
    semester: 4,
    courses: [
      { code: "CS301", name: "Data Structures", grade: "B", percentage: 78 },
      {
        code: "CS201",
        name: "Programming Fundamentals",
        grade: "B+",
        percentage: 82,
      },
    ],
  },
  {
    id: 4,
    name: "Sarah Johnson",
    regNumber: "UNI-2024-0126",
    email: "sarah@student.edu",
    phone: "+1234567894",
    gpa: 3.6,
    attendance: 89,
    currentGrade: "A-",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    program: "Computer Science",
    semester: 4,
    courses: [
      { code: "CS301", name: "Data Structures", grade: "A-", percentage: 86 },
      {
        code: "CS201",
        name: "Programming Fundamentals",
        grade: "A",
        percentage: 88,
      },
    ],
  },
  {
    id: 5,
    name: "David Lee",
    regNumber: "UNI-2024-0127",
    email: "david@student.edu",
    phone: "+1234567895",
    gpa: 2.9,
    attendance: 72,
    currentGrade: "C+",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
    program: "Computer Science",
    semester: 4,
    courses: [
      { code: "CS301", name: "Data Structures", grade: "C+", percentage: 72 },
      {
        code: "CS201",
        name: "Programming Fundamentals",
        grade: "B",
        percentage: 75,
      },
    ],
  },
  {
    id: 6,
    name: "Emily Brown",
    regNumber: "UNI-2024-0128",
    email: "emily@student.edu",
    phone: "+1234567896",
    gpa: 3.7,
    attendance: 94,
    currentGrade: "A",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
    program: "Computer Science",
    semester: 4,
    courses: [
      { code: "CS301", name: "Data Structures", grade: "A", percentage: 90 },
      {
        code: "CS201",
        name: "Programming Fundamentals",
        grade: "A",
        percentage: 89,
      },
    ],
  },
  {
    id: 7,
    name: "Alex Martinez",
    regNumber: "UNI-2024-0129",
    email: "alex@student.edu",
    phone: "+1234567897",
    gpa: 3.4,
    attendance: 85,
    currentGrade: "B+",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    program: "Computer Science",
    semester: 4,
    courses: [
      { code: "CS301", name: "Data Structures", grade: "B+", percentage: 84 },
      {
        code: "CS201",
        name: "Programming Fundamentals",
        grade: "A-",
        percentage: 86,
      },
    ],
  },
  {
    id: 8,
    name: "Lisa Wang",
    regNumber: "UNI-2024-0130",
    email: "lisa@student.edu",
    phone: "+1234567898",
    gpa: 3.5,
    attendance: 88,
    currentGrade: "A-",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa",
    program: "Computer Science",
    semester: 4,
    courses: [
      { code: "CS301", name: "Data Structures", grade: "A-", percentage: 87 },
      {
        code: "CS201",
        name: "Programming Fundamentals",
        grade: "A-",
        percentage: 85,
      },
    ],
  },
];

// Mock performance trend data
const getPerformanceTrend = () => [
  { assessment: "Assignment 1", score: 85 },
  { assessment: "Assignment 2", score: 88 },
  { assessment: "Quiz 1", score: 82 },
  { assessment: "Midterm", score: 90 },
  { assessment: "Assignment 3", score: 92 },
  { assessment: "Quiz 2", score: 89 },
];

const StudentDirectory = () => {
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'list' | 'table'
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [privateNotes, setPrivateNotes] = useState({});

  // Filters
  const [filters, setFilters] = useState({
    course: "all",
    gpaMin: 0,
    gpaMax: 4,
    attendance: "all",
    sortBy: "name",
  });

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const filteredAndSortedStudents = useMemo(() => {
    let filtered = mockStudents.filter((student) => {
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

      return matchesSearch && matchesGPA && matchesAttendance;
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
  }, [searchQuery, filters]);

  const handleViewStudent = (student) => {
    setSelectedStudent(student);
    setIsDetailModalOpen(true);
  };

  const handleEmailStudent = (student) => {
    window.location.href = `mailto:${student.email}`;
  };

  const handleSaveNotes = (studentId, notes) => {
    setPrivateNotes((prev) => ({
      ...prev,
      [studentId]: notes,
    }));
    console.log("Saving notes for student:", studentId, notes);
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
          {(student.gpa ?? 0).toFixed(2)}
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

  return (
    <div className="student-directory">
      {/* Header and controls unchanged */}
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
          <Button variant="outline" icon={Download}>
            Export List
          </Button>
        </div>
      </motion.div>

      {/* Controls section unchanged */}
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

      {/* Filters and results count unchanged */}
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
          Showing {filteredAndSortedStudents.length} of {mockStudents.length}{" "}
          students
        </p>
      </motion.div>

      {/* Grid, List, and Table views with safe GPA rendering */}
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
                        {(student.gpa ?? 0).toFixed(2)}
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
                        {(student.gpa ?? 0).toFixed(2)}
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

      {/* Student Detail Modal - Fixed GPA rendering */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedStudent(null);
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
                    {(selectedStudent.gpa ?? 0).toFixed(2)}
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

            {/* Rest of modal content unchanged */}
            <div className="student-detail__section">
              <h3>Courses with Prof. Smith</h3>
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
                        {course.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="student-detail__section">
              <h3>Attendance Across Courses</h3>
              <div className="student-detail__attendance-bars">
                {selectedStudent.courses.map((course, index) => (
                  <div key={index} className="student-detail__attendance-item">
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
                ))}
              </div>
            </div>

            <div className="student-detail__section">
              <h3>Performance Trend</h3>
              <div className="student-detail__chart">
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={getPerformanceTrend()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="assessment"
                      stroke="#6b7280"
                      fontSize={12}
                    />
                    <YAxis stroke="#6b7280" fontSize={12} domain={[0, 100]} />
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
