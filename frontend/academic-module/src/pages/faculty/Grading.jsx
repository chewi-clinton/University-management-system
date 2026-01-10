import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FileSpreadsheet,
  Plus,
  Upload,
  TrendingUp,
  Download,
  Save,
  Lock,
  Calculator,
  Award,
} from "lucide-react";
import Container from "../../components/shared/layout/Container";
import Card from "../../components/shared/layout/Card";
import Button from "../../components/shared/ui/Button";
import Select from "../../components/shared/ui/Select";
import Badge from "../../components/shared/ui/Badge";
import Modal from "../../components/shared/feedback/Modal";
import Skeleton from "../../components/shared/feedback/Skeleton";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import facultyService from "../../services/api/facultyService";
import "../../styles/pages/Grading.css";

const Grading = () => {
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState({});
  const [editingCell, setEditingCell] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showCurveModal, setShowCurveModal] = useState(false);
  const [showFinalizeModal, setShowFinalizeModal] = useState(false);
  const [saveStatus, setSaveStatus] = useState("saved");
  const [error, setError] = useState(null);

  // Assessment types based on your backend Grade model
  const assessmentTypes = [
    { id: "assignment", name: "Assignment", maxMarks: 100, weightage: 20 },
    { id: "quiz", name: "Quiz", maxMarks: 50, weightage: 10 },
    { id: "midterm", name: "Midterm", maxMarks: 100, weightage: 30 },
    { id: "final", name: "Final Exam", maxMarks: 100, weightage: 40 },
  ];

  // Load courses on mount
  useEffect(() => {
    loadCourses();
  }, []);

  // Load students and grades when course changes
  useEffect(() => {
    if (selectedCourse) {
      loadCourseData(selectedCourse);
    }
  }, [selectedCourse]);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const response = await facultyService.getCourses({ is_visible: true });
      const coursesData = response.results || response;

      setCourses(
        coursesData.map((course) => ({
          value: course.id.toString(),
          label: `${course.course?.course_code || "N/A"} - ${
            course.course?.course_name || "Untitled"
          } (Section ${course.section || "A"})`,
        }))
      );

      if (coursesData.length > 0) {
        setSelectedCourse(coursesData[0].id.toString());
      }
    } catch (error) {
      console.error("Error loading courses:", error);
      setError("Failed to load courses. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const loadCourseData = async (offeringId) => {
    try {
      setLoading(true);
      setError(null);

      // Fetch students enrolled in the course
      const registrationsResponse = await facultyService.getCourseStudents(
        offeringId
      );
      const registrations =
        registrationsResponse.results || registrationsResponse;

      // Fetch all grades for this offering
      const gradesResponse = await facultyService.getGrades({
        offering: offeringId,
      });
      const gradesData = gradesResponse.results || gradesResponse;

      // Transform students data
      const studentsData = registrations.map((reg) => ({
        id: reg.student.student_id,
        name:
          reg.student.full_name ||
          `${reg.student.first_name || ""} ${
            reg.student.last_name || ""
          }`.trim(),
        regNumber: reg.student.university_reg_number,
        registrationId: reg.id,
      }));

      setStudents(studentsData);

      // Transform grades data into a nested structure
      // grades[studentId][assessmentType] = { gradeId, marksObtained, maxMarks, isFinalized }
      const gradesMap = {};

      gradesData.forEach((grade) => {
        const studentId = grade.student.student_id;
        const assessmentType = grade.assessment_type;

        if (!gradesMap[studentId]) {
          gradesMap[studentId] = {};
        }

        gradesMap[studentId][assessmentType] = {
          gradeId: grade.grade_id,
          marksObtained: grade.marks_obtained || 0,
          maxMarks: grade.max_marks || 100,
          isFinalized: grade.is_finalized,
          assessmentName: grade.assessment_name,
        };
      });

      setGrades(gradesMap);
    } catch (error) {
      console.error("Error loading course data:", error);
      setError("Failed to load course data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCellEdit = async (studentId, assessmentType, value) => {
    const numValue = parseFloat(value);
    const assessment = assessmentTypes.find((a) => a.id === assessmentType);

    if (isNaN(numValue) || numValue < 0 || numValue > assessment.maxMarks) {
      return;
    }

    // Check if grade is finalized
    const existingGrade = grades[studentId]?.[assessmentType];
    if (existingGrade?.isFinalized) {
      alert("This grade is finalized and cannot be edited.");
      return;
    }

    setSaveStatus("saving");

    try {
      const gradeData = {
        student_id: studentId,
        offering_id: parseInt(selectedCourse),
        assessment_type: assessmentType,
        assessment_name: assessment.name,
        marks_obtained: numValue,
        max_marks: assessment.maxMarks,
        is_finalized: false,
      };

      let response;
      if (existingGrade?.gradeId) {
        // Update existing grade
        response = await facultyService.updateGrade(
          existingGrade.gradeId,
          gradeData
        );
      } else {
        // Create new grade
        response = await facultyService.submitGrade(gradeData);
      }

      // Update local state
      setGrades((prev) => ({
        ...prev,
        [studentId]: {
          ...prev[studentId],
          [assessmentType]: {
            gradeId: response.grade_id,
            marksObtained: numValue,
            maxMarks: assessment.maxMarks,
            isFinalized: false,
            assessmentName: assessment.name,
          },
        },
      }));

      setSaveStatus("saved");
    } catch (error) {
      console.error("Error saving grade:", error);
      setSaveStatus("error");
      alert("Failed to save grade. Please try again.");
    }
  };

  const calculateTotal = (studentId) => {
    if (assessmentTypes.length === 0) return 0;

    let totalWeightedScore = 0;
    let totalWeight = 0;

    assessmentTypes.forEach((assessment) => {
      const grade = grades[studentId]?.[assessment.id];
      if (!grade) return;

      const marksObtained = grade.marksObtained || 0;
      const maxMarks = grade.maxMarks || assessment.maxMarks;

      if (maxMarks <= 0) return;

      const percentage = (marksObtained / maxMarks) * 100;
      totalWeightedScore += (percentage * assessment.weightage) / 100;
      totalWeight += assessment.weightage;
    });

    const finalTotal =
      totalWeight > 0 ? (totalWeightedScore / totalWeight) * 100 : 0;
    return Number(finalTotal.toFixed(2));
  };

  const getLetterGrade = (percentage) => {
    if (percentage >= 90) return "A";
    if (percentage >= 85) return "A-";
    if (percentage >= 80) return "B+";
    if (percentage >= 75) return "B";
    if (percentage >= 70) return "B-";
    if (percentage >= 65) return "C+";
    if (percentage >= 60) return "C";
    if (percentage >= 55) return "C-";
    if (percentage >= 50) return "D";
    return "F";
  };

  const getCellColor = (value, maxValue) => {
    const percentage = (value / maxValue) * 100;
    if (percentage >= 90) return "excellent";
    if (percentage >= 70) return "good";
    if (percentage >= 50) return "average";
    return "poor";
  };

  const calculateStatistics = () => {
    if (students.length === 0) {
      return {
        average: "0.00",
        median: "0.00",
        passRate: "0.00",
        stdDev: "0.00",
        highest: "0.00",
        lowest: "0.00",
      };
    }

    const totals = students
      .map((student) => calculateTotal(student.id))
      .filter((t) => typeof t === "number" && !isNaN(t));

    if (totals.length === 0) {
      return {
        average: "0.00",
        median: "0.00",
        passRate: "0.00",
        stdDev: "0.00",
        highest: "0.00",
        lowest: "0.00",
      };
    }

    const sum = totals.reduce((a, b) => a + b, 0);
    const average = sum / totals.length;
    const sorted = [...totals].sort((a, b) => a - b);
    const median = sorted[Math.floor(sorted.length / 2)];
    const passing = totals.filter((t) => t >= 50).length;
    const passRate = (passing / totals.length) * 100;

    const variance =
      totals.reduce((acc, t) => acc + Math.pow(t - average, 2), 0) /
      totals.length;
    const stdDev = Math.sqrt(variance);

    return {
      average: average.toFixed(2),
      median: median.toFixed(2),
      passRate: passRate.toFixed(2),
      stdDev: stdDev.toFixed(2),
      highest: Math.max(...totals).toFixed(2),
      lowest: Math.min(...totals).toFixed(2),
    };
  };

  const getGradeDistribution = () => {
    const distribution = { A: 0, "B+": 0, B: 0, C: 0, D: 0, F: 0 };

    students.forEach((student) => {
      const total = calculateTotal(student.id);
      const letter = getLetterGrade(total);

      if (letter === "A" || letter === "A-") distribution.A++;
      else if (letter === "B+") distribution["B+"]++;
      else if (letter === "B" || letter === "B-") distribution.B++;
      else if (letter.startsWith("C")) distribution.C++;
      else if (letter === "D") distribution.D++;
      else distribution.F++;
    });

    return Object.entries(distribution).map(([grade, count]) => ({
      grade,
      count,
      percentage:
        students.length > 0
          ? ((count / students.length) * 100).toFixed(1)
          : "0.0",
    }));
  };

  const handleFinalizeGrades = async () => {
    try {
      setLoading(true);

      // Finalize all grades for this course
      const allGrades = [];
      Object.entries(grades).forEach(([studentId, studentGrades]) => {
        Object.entries(studentGrades).forEach(([assessmentType, grade]) => {
          if (grade.gradeId && !grade.isFinalized) {
            allGrades.push(grade.gradeId);
          }
        });
      });

      await Promise.all(
        allGrades.map((gradeId) => facultyService.finalizeGrade(gradeId))
      );

      alert("Grades finalized successfully!");
      setShowFinalizeModal(false);

      // Reload data to reflect finalized status
      await loadCourseData(selectedCourse);
    } catch (error) {
      console.error("Error finalizing grades:", error);
      alert("Failed to finalize grades. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const statistics = calculateStatistics();
  const gradeDistribution = getGradeDistribution();

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

  if (loading && courses.length === 0) {
    return (
      <Container>
        <div className="grading">
          <Skeleton variant="text" width="300px" height="40px" />
          <Skeleton
            variant="text"
            width="400px"
            height="20px"
            style={{ marginTop: "8px" }}
          />
          <Skeleton
            variant="rectangular"
            height="600px"
            style={{ marginTop: "24px" }}
          />
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <div className="grading">
          <Card variant="flat">
            <div style={{ padding: "2rem", textAlign: "center" }}>
              <p style={{ color: "var(--error-500)", marginBottom: "1rem" }}>
                {error}
              </p>
              <Button onClick={loadCourses}>Retry</Button>
            </div>
          </Card>
        </div>
      </Container>
    );
  }

  if (courses.length === 0) {
    return (
      <Container>
        <div className="grading">
          <Card variant="flat">
            <div style={{ padding: "2rem", textAlign: "center" }}>
              <p>No courses available. Please contact your administrator.</p>
            </div>
          </Card>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <motion.div
        className="grading"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        {/* Header */}
        <div className="grading__header">
          <div className="grading__header-content">
            <h1 className="grading__title">Grading</h1>
            <p className="grading__subtitle">Enter and manage student grades</p>
          </div>
          <div className="grading__save-status">
            {saveStatus === "saving" && (
              <Badge variant="warning">
                <Save size={14} /> Saving...
              </Badge>
            )}
            {saveStatus === "saved" && (
              <Badge variant="success">All changes saved</Badge>
            )}
            {saveStatus === "error" && (
              <Badge variant="error">Save failed</Badge>
            )}
          </div>
        </div>

        {/* Controls */}
        <motion.div variants={itemVariants}>
          <Card variant="flat" className="grading__controls">
            <div className="grading__controls-left">
              <div className="grading__control-group">
                <label className="grading__control-label">Course:</label>
                <Select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  options={courses}
                />
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Spreadsheet Grid */}
        <motion.div variants={itemVariants}>
          <Card variant="elevated" className="grading__grid-card">
            {loading ? (
              <Skeleton variant="rectangular" height="400px" />
            ) : (
              <div className="grading__grid-wrapper">
                <div className="grading__grid-scroll">
                  <table className="grading__grid">
                    <thead className="grading__grid-header">
                      <tr>
                        <th className="grading__grid-cell grading__grid-cell--fixed grading__grid-cell--header">
                          Student
                        </th>
                        {assessmentTypes.map((assessment) => (
                          <th
                            key={assessment.id}
                            className="grading__grid-cell grading__grid-cell--header"
                          >
                            <div className="grading__header-content">
                              <div className="grading__header-name">
                                {assessment.name}
                              </div>
                              <div className="grading__header-info">
                                Max: {assessment.maxMarks} |{" "}
                                {assessment.weightage}%
                              </div>
                            </div>
                          </th>
                        ))}
                        <th className="grading__grid-cell grading__grid-cell--header grading__grid-cell--total">
                          <div className="grading__header-content">
                            <div className="grading__header-name">Total</div>
                            <div className="grading__header-info">100%</div>
                          </div>
                        </th>
                        <th className="grading__grid-cell grading__grid-cell--header grading__grid-cell--grade">
                          Grade
                        </th>
                      </tr>
                    </thead>
                    <tbody className="grading__grid-body">
                      {students.map((student) => {
                        const total = calculateTotal(student.id);
                        const letterGrade = getLetterGrade(total);

                        return (
                          <tr key={student.id} className="grading__grid-row">
                            <td className="grading__grid-cell grading__grid-cell--fixed grading__grid-cell--student">
                              <div className="grading__student-info">
                                <div className="grading__student-name">
                                  {student.name}
                                </div>
                                <div className="grading__student-reg">
                                  {student.regNumber}
                                </div>
                              </div>
                            </td>
                            {assessmentTypes.map((assessment) => {
                              const grade = grades[student.id]?.[assessment.id];
                              const value = grade?.marksObtained || 0;
                              const isFinalized = grade?.isFinalized || false;
                              const isEditing =
                                editingCell ===
                                `${student.id}-${assessment.id}`;
                              const colorClass = getCellColor(
                                value,
                                assessment.maxMarks
                              );

                              return (
                                <td
                                  key={assessment.id}
                                  className={`grading__grid-cell grading__grid-cell--editable grading__grid-cell--${colorClass} ${
                                    isFinalized
                                      ? "grading__grid-cell--finalized"
                                      : ""
                                  }`}
                                  onClick={() =>
                                    !isFinalized &&
                                    setEditingCell(
                                      `${student.id}-${assessment.id}`
                                    )
                                  }
                                  title={
                                    isFinalized
                                      ? "Grade is finalized"
                                      : "Click to edit"
                                  }
                                >
                                  {isEditing && !isFinalized ? (
                                    <input
                                      type="number"
                                      className="grading__grid-input"
                                      value={value}
                                      min="0"
                                      max={assessment.maxMarks}
                                      onChange={(e) =>
                                        handleCellEdit(
                                          student.id,
                                          assessment.id,
                                          e.target.value
                                        )
                                      }
                                      onBlur={() => setEditingCell(null)}
                                      onKeyDown={(e) => {
                                        if (
                                          e.key === "Enter" ||
                                          e.key === "Tab"
                                        ) {
                                          setEditingCell(null);
                                        }
                                      }}
                                      autoFocus
                                    />
                                  ) : (
                                    <div className="grading__grade-display">
                                      {value}/{assessment.maxMarks}
                                      {isFinalized && (
                                        <Lock
                                          size={12}
                                          style={{ marginLeft: "4px" }}
                                        />
                                      )}
                                    </div>
                                  )}
                                </td>
                              );
                            })}
                            <td className="grading__grid-cell grading__grid-cell--total">
                              <div className="grading__total-value">
                                {total}%
                              </div>
                            </td>
                            <td className="grading__grid-cell grading__grid-cell--grade">
                              <Badge
                                variant={
                                  letterGrade.startsWith("A")
                                    ? "success"
                                    : letterGrade.startsWith("B")
                                    ? "primary"
                                    : letterGrade.startsWith("C")
                                    ? "warning"
                                    : "error"
                                }
                              >
                                {letterGrade}
                              </Badge>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Statistics */}
        <motion.div
          variants={itemVariants}
          className="grading__statistics-section"
        >
          <div className="grading__stats-cards">
            <Card variant="flat" className="grading__stat-card">
              <div className="grading__stat-header">
                <Calculator size={20} className="grading__stat-icon" />
                <h3>Class Statistics</h3>
              </div>
              <div className="grading__stat-grid">
                <div className="grading__stat-item">
                  <span className="grading__stat-label">Average:</span>
                  <span className="grading__stat-value">
                    {statistics.average}%
                  </span>
                </div>
                <div className="grading__stat-item">
                  <span className="grading__stat-label">Median:</span>
                  <span className="grading__stat-value">
                    {statistics.median}%
                  </span>
                </div>
                <div className="grading__stat-item">
                  <span className="grading__stat-label">Pass Rate:</span>
                  <span className="grading__stat-value">
                    {statistics.passRate}%
                  </span>
                </div>
                <div className="grading__stat-item">
                  <span className="grading__stat-label">Std Deviation:</span>
                  <span className="grading__stat-value">
                    {statistics.stdDev}
                  </span>
                </div>
                <div className="grading__stat-item">
                  <span className="grading__stat-label">Highest:</span>
                  <span className="grading__stat-value">
                    {statistics.highest}%
                  </span>
                </div>
                <div className="grading__stat-item">
                  <span className="grading__stat-label">Lowest:</span>
                  <span className="grading__stat-value">
                    {statistics.lowest}%
                  </span>
                </div>
              </div>
            </Card>

            <Card variant="flat" className="grading__chart-card">
              <div className="grading__chart-header">
                <Award size={20} className="grading__chart-icon" />
                <h3>Grade Distribution</h3>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={gradeDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="grade" />
                  <YAxis />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="grading__chart-tooltip">
                            <p className="grading__tooltip-label">
                              Grade {payload[0].payload.grade}
                            </p>
                            <p className="grading__tooltip-value">
                              {payload[0].value} students (
                              {payload[0].payload.percentage}%)
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="count" fill="var(--primary-500)" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div variants={itemVariants}>
          <Card variant="flat" className="grading__actions">
            <div className="grading__actions-left">
              <Button
                variant="outline"
                onClick={() => alert("Feature coming soon!")}
              >
                <Upload size={16} />
                Bulk Upload CSV
              </Button>
            </div>
            <div className="grading__actions-right">
              <Button
                variant="outline"
                onClick={() => alert("Feature coming soon!")}
              >
                <Download size={16} />
                Export
              </Button>
              <Button
                variant="primary"
                onClick={() => setShowFinalizeModal(true)}
              >
                <Lock size={16} />
                Finalize Grades
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Finalize Grades Modal */}
        <Modal
          isOpen={showFinalizeModal}
          onClose={() => setShowFinalizeModal(false)}
          title="Finalize Grades"
        >
          <div className="grading__modal-content">
            <p className="grading__modal-text">
              Are you sure you want to finalize grades for this course? Once
              finalized:
            </p>
            <ul className="grading__modal-list">
              <li>Grades will be locked and cannot be edited</li>
              <li>Students will be able to view their final grades</li>
              <li>Grade reports will be generated</li>
              <li>This action cannot be undone</li>
            </ul>
            <div className="grading__modal-actions">
              <Button
                variant="outline"
                onClick={() => setShowFinalizeModal(false)}
              >
                Cancel
              </Button>
              <Button variant="primary" onClick={handleFinalizeGrades}>
                Finalize Grades
              </Button>
            </div>
          </div>
        </Modal>
      </motion.div>
    </Container>
  );
};

export default Grading;
