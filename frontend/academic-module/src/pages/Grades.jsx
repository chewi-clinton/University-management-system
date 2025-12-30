import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Star,
  Download,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  Award,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "../styles/pages/Grades.css";

// Mock Data
const mockGradesData = {
  currentGPA: 3.84,
  totalCredits: 45,
  semesters: [
    { id: 1, name: "Fall 2024", gpa: 3.75 },
    { id: 2, name: "Spring 2024", gpa: 3.82 },
    { id: 3, name: "Fall 2023", gpa: 3.65 },
    { id: 4, name: "Spring 2023", gpa: 3.9 },
  ],
  gpaHistory: [
    { semester: "Spring 2023", gpa: 3.9 },
    { semester: "Fall 2023", gpa: 3.65 },
    { semester: "Spring 2024", gpa: 3.82 },
    { semester: "Fall 2024", gpa: 3.75 },
    { semester: "Current", gpa: 3.84 },
  ],
  courses: [
    {
      id: 1,
      code: "CS301",
      name: "Data Structures",
      credits: 3,
      grade: "A",
      gradePoints: 4.0,
      semester: "Fall 2024",
      color: "#3b82f6",
      assessments: [
        { name: "Midterm Exam", score: 92, total: 100, weight: 30 },
        { name: "Final Exam", score: 88, total: 100, weight: 40 },
        { name: "Assignments", score: 95, total: 100, weight: 20 },
        { name: "Participation", score: 100, total: 100, weight: 10 },
      ],
    },
    {
      id: 2,
      code: "MA202",
      name: "Calculus II",
      credits: 4,
      grade: "B+",
      gradePoints: 3.3,
      semester: "Fall 2024",
      color: "#8b5cf6",
      assessments: [
        { name: "Midterm Exam", score: 85, total: 100, weight: 30 },
        { name: "Final Exam", score: 82, total: 100, weight: 40 },
        { name: "Assignments", score: 88, total: 100, weight: 20 },
        { name: "Quizzes", score: 90, total: 100, weight: 10 },
      ],
    },
    {
      id: 3,
      code: "EN101",
      name: "English Composition",
      credits: 3,
      grade: "A",
      gradePoints: 4.0,
      semester: "Fall 2024",
      color: "#10b981",
      assessments: [
        { name: "Essay 1", score: 95, total: 100, weight: 25 },
        { name: "Essay 2", score: 92, total: 100, weight: 25 },
        { name: "Final Essay", score: 98, total: 100, weight: 30 },
        { name: "Participation", score: 100, total: 100, weight: 20 },
      ],
    },
    {
      id: 4,
      code: "PH201",
      name: "Physics I",
      credits: 4,
      grade: "A-",
      gradePoints: 3.7,
      semester: "Fall 2024",
      color: "#f59e0b",
      assessments: [
        { name: "Midterm", score: 88, total: 100, weight: 30 },
        { name: "Final", score: 90, total: 100, weight: 40 },
        { name: "Labs", score: 95, total: 100, weight: 20 },
        { name: "Homework", score: 92, total: 100, weight: 10 },
      ],
    },
  ],
};

const Grades = () => {
  const [selectedSemester, setSelectedSemester] = useState("Fall 2024");
  const [expandedCourse, setExpandedCourse] = useState(null);
  const [animatedGPA, setAnimatedGPA] = useState(0);

  useEffect(() => {
    // Animate GPA counter
    const duration = 2000;
    const steps = 60;
    const increment = mockGradesData.currentGPA / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= mockGradesData.currentGPA) {
        setAnimatedGPA(mockGradesData.currentGPA);
        clearInterval(timer);
      } else {
        setAnimatedGPA(current);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, []);

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
    animate: { opacity: 1, y: 0 },
  };

  const toggleCourse = (courseId) => {
    setExpandedCourse(expandedCourse === courseId ? null : courseId);
  };

  const getGradeColor = (grade) => {
    if (grade === "A" || grade === "A+") return "#10b981";
    if (grade === "A-" || grade === "B+") return "#3b82f6";
    if (grade === "B" || grade === "B-") return "#8b5cf6";
    if (grade === "C+" || grade === "C") return "#f59e0b";
    return "#ef4444";
  };

  const filteredCourses = mockGradesData.courses.filter(
    (course) => course.semester === selectedSemester
  );

  const renderStars = (gpa) => {
    const fullStars = Math.floor(gpa);
    const hasHalfStar = gpa % 1 >= 0.5;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} size={24} fill="#e87d26" color="#e87d26" />);
    }
    if (hasHalfStar && fullStars < 4) {
      stars.push(
        <Star
          key="half"
          size={24}
          fill="#e87d26"
          color="#e87d26"
          style={{ opacity: 0.5 }}
        />
      );
    }
    return stars;
  };

  return (
    <div className="grades">
      <motion.div
        className="grades__container"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="grades__header">
          <h1 className="grades__title">Grades</h1>
          <p className="grades__subtitle">
            View your academic performance and GPA trends
          </p>
        </motion.div>

        {/* GPA Display */}
        <motion.div variants={itemVariants} className="grades__gpa-card">
          <div className="grades__gpa-content">
            <div className="grades__gpa-icon">
              <Award size={48} />
            </div>
            <div className="grades__gpa-info">
              <h2 className="grades__gpa-label">Cumulative GPA</h2>
              <div className="grades__gpa-value">
                {animatedGPA.toFixed(2)}
                <span className="grades__gpa-max">/4.00</span>
              </div>
              <div className="grades__gpa-stars">
                {renderStars(mockGradesData.currentGPA)}
              </div>
            </div>
            <div className="grades__gpa-stats">
              <div className="grades__gpa-stat">
                <div className="grades__gpa-stat-value">
                  {mockGradesData.totalCredits}
                </div>
                <div className="grades__gpa-stat-label">Total Credits</div>
              </div>
              <div className="grades__gpa-stat">
                <div className="grades__gpa-stat-value">
                  <TrendingUp size={20} />
                </div>
                <div className="grades__gpa-stat-label">Improving</div>
              </div>
            </div>
          </div>
          <button className="grades__download-btn">
            <Download size={20} />
            Download Transcript
          </button>
        </motion.div>

        {/* GPA Trend Chart */}
        <motion.div variants={itemVariants} className="grades__chart-card">
          <h2 className="grades__chart-title">GPA Trend</h2>
          <div className="grades__chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockGradesData.gpaHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="semester"
                  stroke="#6b7280"
                  style={{ fontSize: "0.875rem" }}
                />
                <YAxis
                  domain={[0, 4.0]}
                  stroke="#6b7280"
                  style={{ fontSize: "0.875rem" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    padding: "12px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="gpa"
                  stroke="#e87d26"
                  strokeWidth={3}
                  dot={{ fill: "#e87d26", r: 6 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Semester Selector */}
        <motion.div variants={itemVariants} className="grades__controls">
          <div className="grades__semester-selector">
            <label className="grades__semester-label">Select Semester:</label>
            <select
              className="grades__semester-select"
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
            >
              {mockGradesData.semesters.map((semester) => (
                <option key={semester.id} value={semester.name}>
                  {semester.name} - GPA: {semester.gpa}
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Course Grades */}
        <motion.div variants={itemVariants} className="grades__courses">
          <h2 className="grades__courses-title">Course Grades</h2>

          <div className="grades__courses-list">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="grades__course-card"
                onClick={() => toggleCourse(course.id)}
              >
                <div className="grades__course-header">
                  <div className="grades__course-info">
                    <div
                      className="grades__course-indicator"
                      style={{ backgroundColor: course.color }}
                    />
                    <div className="grades__course-details">
                      <h3 className="grades__course-title">
                        {course.code} - {course.name}
                      </h3>
                      <p className="grades__course-meta">
                        {course.credits} Credits • {course.semester}
                      </p>
                    </div>
                  </div>
                  <div className="grades__course-actions">
                    <div
                      className="grades__course-grade"
                      style={{
                        backgroundColor: getGradeColor(course.grade),
                        color: "white",
                      }}
                    >
                      {course.grade}
                    </div>
                    <div className="grades__course-points">
                      {course.gradePoints.toFixed(1)}
                    </div>
                    {expandedCourse === course.id ? (
                      <ChevronUp size={20} className="grades__course-chevron" />
                    ) : (
                      <ChevronDown
                        size={20}
                        className="grades__course-chevron"
                      />
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedCourse === course.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="grades__course-expanded"
                  >
                    <div className="grades__assessments">
                      <h4 className="grades__assessments-title">
                        Assessment Breakdown
                      </h4>
                      {course.assessments.map((assessment, idx) => (
                        <div key={idx} className="grades__assessment">
                          <div className="grades__assessment-header">
                            <span className="grades__assessment-name">
                              {assessment.name}
                            </span>
                            <span className="grades__assessment-score">
                              {assessment.score}/{assessment.total} (
                              {assessment.weight}%)
                            </span>
                          </div>
                          <div className="grades__assessment-bar-bg">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{
                                width: `${
                                  (assessment.score / assessment.total) * 100
                                }%`,
                              }}
                              transition={{ duration: 1, ease: "easeOut" }}
                              className="grades__assessment-bar-fill"
                              style={{
                                backgroundColor: course.color,
                                opacity:
                                  assessment.score / assessment.total >= 0.9
                                    ? 1
                                    : 0.7,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Grades;
