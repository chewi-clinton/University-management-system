import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import Skeleton from "../../components/shared/feedback/skeleton";
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
import "../../styles/pages/Grading.css";

// Mock Data
const mockCourses = [
  { value: "1", label: "CS301 - Data Structures (Section A)" },
  { value: "2", label: "CS201 - Programming Fundamentals (Section B)" },
  { value: "3", label: "CS401 - Advanced Algorithms (Section A)" },
];

const mockAssessments = [
  {
    id: 1,
    name: "Assignment 1",
    maxMarks: 50,
    weightage: 20,
    dueDate: "2024-01-15",
  },
  {
    id: 2,
    name: "Assignment 2",
    maxMarks: 50,
    weightage: 20,
    dueDate: "2024-02-10",
  },
  {
    id: 3,
    name: "Midterm Exam",
    maxMarks: 40,
    weightage: 30,
    dueDate: "2024-02-25",
  },
  {
    id: 4,
    name: "Final Exam",
    maxMarks: 100,
    weightage: 30,
    dueDate: "2024-04-15",
  },
];

const mockStudents = [
  {
    id: 1,
    name: "John Doe",
    regNumber: "UNI-2024-0123",
    grades: { 1: 45, 2: 48, 3: 38, 4: 85 },
  },
  {
    id: 2,
    name: "Jane Smith",
    regNumber: "UNI-2024-0124",
    grades: { 1: 50, 2: 49, 3: 40, 4: 90 },
  },
  {
    id: 3,
    name: "Mike Chen",
    regNumber: "UNI-2024-0125",
    grades: { 1: 42, 2: 45, 3: 35, 4: 78 },
  },
  {
    id: 4,
    name: "Sarah Johnson",
    regNumber: "UNI-2024-0126",
    grades: { 1: 48, 2: 47, 3: 39, 4: 88 },
  },
  {
    id: 5,
    name: "David Lee",
    regNumber: "UNI-2024-0127",
    grades: { 1: 38, 2: 40, 3: 32, 4: 70 },
  },
];

const Grading = () => {
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState("1");
  const [assessments, setAssessments] = useState([]);
  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState({});
  const [editingCell, setEditingCell] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showCurveModal, setShowCurveModal] = useState(false);
  const [showFinalizeModal, setShowFinalizeModal] = useState(false);
  const [saveStatus, setSaveStatus] = useState("saved"); // saved | saving | error
  const [newAssessment, setNewAssessment] = useState({
    name: "",
    maxMarks: "",
    weightage: "",
    dueDate: "",
  });

  useEffect(() => {
    setTimeout(() => {
      setAssessments(mockAssessments);
      setStudents(mockStudents);

      // Initialize grades
      const initialGrades = {};
      mockStudents.forEach((student) => {
        initialGrades[student.id] = { ...student.grades };
      });
      setGrades(initialGrades);

      setLoading(false);
    }, 800);
  }, [selectedCourse]);

  const calculateTotal = (studentId) => {
    if (assessments.length === 0) return 0;

    let totalWeightedScore = 0;
    let totalWeight = 0;

    assessments.forEach((assessment) => {
      const grade = grades[studentId]?.[assessment.id] ?? 0;
      const maxMarks = assessment.maxMarks || 0;

      if (maxMarks <= 0) return;

      const percentage = (grade / maxMarks) * 100;
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

  const handleCellEdit = (studentId, assessmentId, value) => {
    const numValue = parseFloat(value);
    const assessment = assessments.find((a) => a.id === assessmentId);

    if (isNaN(numValue) || numValue < 0 || numValue > assessment.maxMarks) {
      return;
    }

    setSaveStatus("saving");
    setGrades((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [assessmentId]: numValue,
      },
    }));

    setTimeout(() => {
      setSaveStatus("saved");
    }, 500);
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
      else if (letter === "B+") distribution["B+"];
      else if (letter === "B" || letter === "B-") distribution.B++;
      else if (letter.startsWith("C")) distribution.C++;
      else if (letter === "D") distribution.D++;
      else distribution.F++;
    });

    return Object.entries(distribution).map(([grade, count]) => ({
      grade,
      count,
      percentage: ((count / students.length) * 100).toFixed(1),
    }));
  };

  const handleCreateAssessment = () => {
    if (
      !newAssessment.name ||
      !newAssessment.maxMarks ||
      !newAssessment.weightage
    ) {
      return;
    }

    const newId = Math.max(...assessments.map((a) => a.id), 0) + 1;
    setAssessments([
      ...assessments,
      {
        ...newAssessment,
        id: newId,
        maxMarks: parseFloat(newAssessment.maxMarks),
        weightage: parseFloat(newAssessment.weightage),
      },
    ]);

    // Initialize grades for new assessment
    const updatedGrades = { ...grades };
    students.forEach((student) => {
      if (!updatedGrades[student.id]) updatedGrades[student.id] = {};
      updatedGrades[student.id][newId] = 0;
    });
    setGrades(updatedGrades);

    setShowCreateModal(false);
    setNewAssessment({ name: "", maxMarks: "", weightage: "", dueDate: "" });
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

  if (loading) {
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
                  options={mockCourses}
                />
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowCreateModal(true)}
              >
                <Plus size={16} />
                Create Assessment
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Spreadsheet Grid */}
        <motion.div variants={itemVariants}>
          <Card variant="elevated" className="grading__grid-card">
            <div className="grading__grid-wrapper">
              <div className="grading__grid-scroll">
                <table className="grading__grid">
                  <thead className="grading__grid-header">
                    <tr>
                      <th className="grading__grid-cell grading__grid-cell--fixed grading__grid-cell--header">
                        Student
                      </th>
                      {assessments.map((assessment) => (
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
                          {assessments.map((assessment) => {
                            const value =
                              grades[student.id]?.[assessment.id] ?? 0;
                            const isEditing =
                              editingCell === `${student.id}-${assessment.id}`;
                            const colorClass = getCellColor(
                              value,
                              assessment.maxMarks || 1
                            );

                            return (
                              <td
                                key={assessment.id}
                                className={`grading__grid-cell grading__grid-cell--editable grading__grid-cell--${colorClass}`}
                                onClick={() =>
                                  setEditingCell(
                                    `${student.id}-${assessment.id}`
                                  )
                                }
                              >
                                {isEditing ? (
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
                                    {value}/{assessment.maxMarks || 0}
                                  </div>
                                )}
                              </td>
                            );
                          })}
                          <td className="grading__grid-cell grading__grid-cell--total">
                            <div className="grading__total-value">{total}%</div>
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
                onClick={() => setShowUploadModal(true)}
              >
                <Upload size={16} />
                Bulk Upload CSV
              </Button>
              <Button variant="outline" onClick={() => setShowCurveModal(true)}>
                <TrendingUp size={16} />
                Curve Grades
              </Button>
            </div>
            <div className="grading__actions-right">
              <Button variant="outline">
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

        {/* Create Assessment Modal */}
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Create New Assessment"
        >
          <div className="grading__modal-content">
            <div className="grading__form-group">
              <label className="grading__form-label">Assessment Name</label>
              <input
                type="text"
                className="grading__form-input"
                value={newAssessment.name}
                onChange={(e) =>
                  setNewAssessment({ ...newAssessment, name: e.target.value })
                }
                placeholder="e.g., Assignment 3"
              />
            </div>
            <div className="grading__form-row">
              <div className="grading__form-group">
                <label className="grading__form-label">Max Marks</label>
                <input
                  type="number"
                  className="grading__form-input"
                  value={newAssessment.maxMarks}
                  onChange={(e) =>
                    setNewAssessment({
                      ...newAssessment,
                      maxMarks: e.target.value,
                    })
                  }
                  placeholder="50"
                />
              </div>
              <div className="grading__form-group">
                <label className="grading__form-label">Weightage (%)</label>
                <input
                  type="number"
                  className="grading__form-input"
                  value={newAssessment.weightage}
                  onChange={(e) =>
                    setNewAssessment({
                      ...newAssessment,
                      weightage: e.target.value,
                    })
                  }
                  placeholder="20"
                />
              </div>
            </div>
            <div className="grading__form-group">
              <label className="grading__form-label">Due Date</label>
              <input
                type="date"
                className="grading__form-input"
                value={newAssessment.dueDate}
                onChange={(e) =>
                  setNewAssessment({
                    ...newAssessment,
                    dueDate: e.target.value,
                  })
                }
              />
            </div>
            <div className="grading__modal-actions">
              <Button
                variant="outline"
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </Button>
              <Button variant="primary" onClick={handleCreateAssessment}>
                Create Assessment
              </Button>
            </div>
          </div>
        </Modal>

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
              <Button
                variant="primary"
                onClick={() => {
                  setShowFinalizeModal(false);
                  alert("Grades finalized successfully!");
                }}
              >
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
