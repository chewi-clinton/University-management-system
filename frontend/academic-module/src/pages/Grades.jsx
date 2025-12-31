import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Star,
  Download,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  Award,
  AlertCircle,
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
import { studentService } from "../services/api/studentService.js";
import "../styles/pages/Grades.css";

const Grades = () => {
  const [gradesData, setGradesData] = useState(null);
  const [courseRegistrations, setCourseRegistrations] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState("");
  const [expandedCourse, setExpandedCourse] = useState(null);
  const [animatedGPA, setAnimatedGPA] = useState(0.0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [studentId, setStudentId] = useState(null);

  useEffect(() => {
    const fetchGradesData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get student profile first
        const profileResponse = await studentService.getMyProfile();
        if (!profileResponse.success) {
          throw new Error(profileResponse.error);
        }
        const student = profileResponse.data;
        setStudentId(student.student_id);

        // Fetch course registrations (contains grades)
        const coursesResponse = await studentService.getCourses();
        if (coursesResponse.success) {
          setCourseRegistrations(coursesResponse.data);
        }

        // Fetch grades separately
        const gradesResponse = await studentService.getGrades();

        // Calculate GPA and process data
        calculateGradesData(coursesResponse.data, student);
      } catch (err) {
        console.error("Error fetching grades:", err);
        setError(err.message || "Failed to load grades data");
      } finally {
        setLoading(false);
      }
    };

    fetchGradesData();
  }, []);

  const calculateGradesData = (registrations, student) => {
    if (!registrations || registrations.length === 0) {
      setGradesData({
        currentGPA: student.current_gpa || 0,
        cumulativeGPA: student.cumulative_gpa || 0,
        totalCredits: 0,
        semesters: [],
        gpaHistory: [],
        courses: [],
      });
      return;
    }

    // Group registrations by semester
    const semesterMap = {};
    const coursesList = [];
    let totalCredits = 0;

    registrations.forEach((reg) => {
      const semester = reg.offering?.semester;
      if (!semester) return;

      const semesterKey = `${semester.semester_name} ${
        semester.session?.academic_year || ""
      }`;

      if (!semesterMap[semesterKey]) {
        semesterMap[semesterKey] = {
          id: semester.semester_id,
          name: semesterKey,
          gpa: 0,
          totalCredits: 0,
          totalPoints: 0,
          startDate: semester.start_date,
        };
      }

      // Calculate course data
      const course = reg.offering?.course;
      const gradePoints = reg.grade_points || 0;
      const credits = course?.credit_hours || 0;

      totalCredits += credits;
      semesterMap[semesterKey].totalCredits += credits;
      semesterMap[semesterKey].totalPoints += gradePoints * credits;

      coursesList.push({
        id: reg.registration_id,
        code: course?.course_code || "N/A",
        name: course?.course_name || "Unknown Course",
        credits: credits,
        grade: reg.grade || "N/A",
        gradePoints: gradePoints,
        semester: semesterKey,
        color: getRandomColor(),
        status: reg.status,
        offering: reg.offering,
      });
    });

    // Calculate GPA per semester
    const semestersList = Object.values(semesterMap).map((sem) => {
      sem.gpa =
        sem.totalCredits > 0
          ? (sem.totalPoints / sem.totalCredits).toFixed(2)
          : 0;
      return sem;
    });

    // Sort by date
    semestersList.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

    // Create GPA history for chart
    const gpaHistory = semestersList.map((sem) => ({
      semester: sem.name,
      gpa: parseFloat(sem.gpa),
    }));

    // Add current GPA point
    if (student.current_gpa) {
      gpaHistory.push({
        semester: "Current",
        gpa: parseFloat(student.current_gpa),
      });
    }

    setSemesters(semestersList);

    // Set the most recent semester as selected
    if (semestersList.length > 0 && !selectedSemester) {
      setSelectedSemester(semestersList[semestersList.length - 1].name);
    }

    setGradesData({
      currentGPA: parseFloat(student.current_gpa) || 0,
      cumulativeGPA: parseFloat(student.cumulative_gpa) || 0,
      totalCredits: totalCredits,
      semesters: semestersList,
      gpaHistory: gpaHistory,
      courses: coursesList,
    });
  };

  useEffect(() => {
    if (gradesData && gradesData.currentGPA > 0) {
      // Animate GPA counter
      const duration = 2000;
      const steps = 60;
      const targetGPA = parseFloat(gradesData.currentGPA) || 0;
      const increment = targetGPA / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= targetGPA) {
          setAnimatedGPA(targetGPA);
          clearInterval(timer);
        } else {
          setAnimatedGPA(current);
        }
      }, duration / steps);

      return () => clearInterval(timer);
    } else {
      setAnimatedGPA(0);
    }
  }, [gradesData]);

  const getRandomColor = () => {
    const colors = [
      "#3b82f6",
      "#8b5cf6",
      "#10b981",
      "#f59e0b",
      "#ec4899",
      "#06b6d4",
      "#f97316",
      "#6366f1",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

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
    if (!grade || grade === "N/A") return "#9ca3af";
    const gradeUpper = grade.toUpperCase();
    if (gradeUpper === "A" || gradeUpper === "A+") return "#10b981";
    if (gradeUpper === "A-" || gradeUpper === "B+") return "#3b82f6";
    if (gradeUpper === "B" || gradeUpper === "B-") return "#8b5cf6";
    if (gradeUpper === "C+" || gradeUpper === "C") return "#f59e0b";
    return "#ef4444";
  };

  const filteredCourses = gradesData
    ? gradesData.courses.filter(
        (course) => course.semester === selectedSemester
      )
    : [];

  const renderStars = (gpa) => {
    const gpaValue = parseFloat(gpa) || 0;
    const fullStars = Math.floor(gpaValue);
    const hasHalfStar = gpaValue % 1 >= 0.5;
    const stars = [];

    for (let i = 0; i < fullStars && i < 4; i++) {
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

  const handleDownloadTranscript = async () => {
    if (!studentId) return;

    try {
      const response = await studentService.getTranscript(studentId);
      if (response.success) {
        // Handle transcript download
        console.log("Transcript data:", response.data);
        alert("Transcript download feature coming soon!");
      }
    } catch (err) {
      console.error("Error downloading transcript:", err);
      alert("Failed to download transcript");
    }
  };

  if (loading) {
    return (
      <div className="grades">
        <div className="grades__container">
          <div
            className="skeleton"
            style={{ height: "80px", marginBottom: "24px" }}
          />
          <div
            className="skeleton"
            style={{
              height: "200px",
              marginBottom: "24px",
              borderRadius: "12px",
            }}
          />
          <div
            className="skeleton"
            style={{
              height: "350px",
              marginBottom: "24px",
              borderRadius: "12px",
            }}
          />
          <div
            className="skeleton"
            style={{ height: "400px", borderRadius: "12px" }}
          />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="grades">
        <div className="grades__container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              textAlign: "center",
              padding: "48px",
              backgroundColor: "var(--color-error-light, #fef2f2)",
              borderRadius: "12px",
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
              style={{
                fontSize: "20px",
                fontWeight: "600",
                marginBottom: "8px",
              }}
            >
              Failed to Load Grades
            </h3>
            <p
              style={{
                color: "var(--color-text-secondary, #6b7280)",
                marginBottom: "24px",
              }}
            >
              {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: "10px 20px",
                backgroundColor: "var(--color-primary, #6366f1)",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Retry
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  if (!gradesData) {
    return null;
  }

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
                {typeof animatedGPA === "number"
                  ? animatedGPA.toFixed(2)
                  : "0.00"}
                <span className="grades__gpa-max">/4.00</span>
              </div>
              <div className="grades__gpa-stars">
                {renderStars(gradesData?.currentGPA || 0)}
              </div>
            </div>
            <div className="grades__gpa-stats">
              <div className="grades__gpa-stat">
                <div className="grades__gpa-stat-value">
                  {gradesData.totalCredits}
                </div>
                <div className="grades__gpa-stat-label">Total Credits</div>
              </div>
              <div className="grades__gpa-stat">
                <div className="grades__gpa-stat-value">
                  <TrendingUp size={20} />
                </div>
                <div className="grades__gpa-stat-label">
                  {gradesData.gpaHistory.length > 1 &&
                  gradesData.gpaHistory[gradesData.gpaHistory.length - 1].gpa >=
                    gradesData.gpaHistory[gradesData.gpaHistory.length - 2].gpa
                    ? "Improving"
                    : "Status"}
                </div>
              </div>
            </div>
          </div>
          <button
            className="grades__download-btn"
            onClick={handleDownloadTranscript}
          >
            <Download size={20} />
            Download Transcript
          </button>
        </motion.div>

        {/* GPA Trend Chart */}
        {gradesData?.gpaHistory?.length > 0 && (
          <motion.div variants={itemVariants} className="grades__chart-card">
            <h2 className="grades__chart-title">GPA Trend</h2>
            <div className="grades__chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={gradesData.gpaHistory}>
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
        )}

        {/* Semester Selector */}
        {semesters.length > 0 && (
          <motion.div variants={itemVariants} className="grades__controls">
            <div className="grades__semester-selector">
              <label className="grades__semester-label">Select Semester:</label>
              <select
                className="grades__semester-select"
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
              >
                {semesters.map((semester) => (
                  <option key={semester.id} value={semester.name}>
                    {semester.name} - GPA: {semester.gpa}
                  </option>
                ))}
              </select>
            </div>
          </motion.div>
        )}

        {/* Course Grades */}
        <motion.div variants={itemVariants} className="grades__courses">
          <h2 className="grades__courses-title">Course Grades</h2>

          {filteredCourses.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "48px",
                color: "var(--color-text-secondary, #6b7280)",
              }}
            >
              No grades available for this semester
            </div>
          ) : (
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
                        <ChevronUp
                          size={20}
                          className="grades__course-chevron"
                        />
                      ) : (
                        <ChevronDown
                          size={20}
                          className="grades__course-chevron"
                        />
                      )}
                    </div>
                  </div>

                  {/* Expanded Details - Note: Assessment breakdown requires separate Grade API call */}
                  {expandedCourse === course.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="grades__course-expanded"
                    >
                      <div className="grades__course-info-detailed">
                        <p>
                          <strong>Status:</strong> {course.status}
                        </p>
                        <p>
                          <strong>Instructor:</strong>{" "}
                          {course.offering?.faculty?.full_name || "N/A"}
                        </p>
                        <p>
                          <strong>Section:</strong>{" "}
                          {course.offering?.section || "N/A"}
                        </p>
                        <p
                          style={{
                            marginTop: "12px",
                            fontSize: "14px",
                            color: "#6b7280",
                          }}
                        >
                          Assessment breakdown will be available when individual
                          grade records are published.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Grades;
