import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Award,
  TrendingUp,
  Users,
  FileText,
  Search,
  Filter,
  Plus,
  Edit,
  Eye,
  Trash2,
  CheckCircle,
  XCircle,
  BarChart3,
  Download,
  Upload,
  Lock,
  Unlock,
} from "lucide-react";
import {
  mockGrades,
  mockGradeDistribution,
  mockGPATrends,
  mockAssessmentTypes,
} from "../mock-data/gradesMock";
import "../styles/admin-pages/GradeManagement.css";

export default function GradeManagement() {
  const [grades, setGrades] = useState(mockGrades);
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAddAssessmentModal, setShowAddAssessmentModal] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSemester, setFilterSemester] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [activeTab, setActiveTab] = useState("grades"); // grades, analytics, bulk-upload

  // Form state for adding assessment
  const [assessmentForm, setAssessmentForm] = useState({
    name: "",
    type: "assignment",
    marksObtained: "",
    maxMarks: 100,
    weightage: 15,
    gradedAt: new Date().toISOString().split("T")[0],
    isFinalized: false,
  });

  // Calculate statistics
  const stats = {
    totalGrades: grades.length,
    finalized: grades.filter((g) => g.isFinalized).length,
    avgGPA: (
      grades.reduce((sum, g) => sum + g.gradePoints, 0) / grades.length
    ).toFixed(2),
    avgMarks: (
      grades.reduce((sum, g) => sum + g.totalMarks, 0) / grades.length
    ).toFixed(1),
  };

  // Filter grades
  const filteredGrades = grades.filter((grade) => {
    const matchesSearch =
      grade.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      grade.student.regNumber
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      grade.course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      grade.course.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSemester =
      filterSemester === "all" || grade.semester === filterSemester;
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "finalized" && grade.isFinalized) ||
      (filterStatus === "draft" && !grade.isFinalized);

    return matchesSearch && matchesSemester && matchesStatus;
  });

  const handleAddAssessment = (e) => {
    e.preventDefault();
    if (!selectedGrade) return;

    const newAssessment = {
      id: selectedGrade.assessments.length + 1,
      ...assessmentForm,
      marksObtained: parseFloat(assessmentForm.marksObtained),
      maxMarks: parseFloat(assessmentForm.maxMarks),
      weightage: parseFloat(assessmentForm.weightage),
    };

    const updatedGrades = grades.map((g) => {
      if (g.id === selectedGrade.id) {
        const updatedAssessments = [...g.assessments, newAssessment];
        const newTotalMarks = calculateTotalMarks(updatedAssessments);
        return {
          ...g,
          assessments: updatedAssessments,
          totalMarks: newTotalMarks,
          letterGrade: calculateLetterGrade(newTotalMarks),
          gradePoints: calculateGradePoints(newTotalMarks),
        };
      }
      return g;
    });

    setGrades(updatedGrades);
    setShowAddAssessmentModal(false);
    resetAssessmentForm();
  };

  const calculateTotalMarks = (assessments) => {
    return assessments.reduce((total, assessment) => {
      const percentage = (assessment.marksObtained / assessment.maxMarks) * 100;
      return total + (percentage * assessment.weightage) / 100;
    }, 0);
  };

  const calculateLetterGrade = (marks) => {
    if (marks >= 90) return "A";
    if (marks >= 85) return "A-";
    if (marks >= 80) return "B+";
    if (marks >= 75) return "B";
    if (marks >= 70) return "B-";
    if (marks >= 65) return "C+";
    if (marks >= 60) return "C";
    if (marks >= 55) return "C-";
    if (marks >= 50) return "D";
    return "F";
  };

  const calculateGradePoints = (marks) => {
    if (marks >= 90) return 4.0;
    if (marks >= 85) return 3.7;
    if (marks >= 80) return 3.3;
    if (marks >= 75) return 3.0;
    if (marks >= 70) return 2.7;
    if (marks >= 65) return 2.3;
    if (marks >= 60) return 2.0;
    if (marks >= 55) return 1.7;
    if (marks >= 50) return 1.0;
    return 0.0;
  };

  const toggleFinalized = (gradeId) => {
    setGrades(
      grades.map((g) =>
        g.id === gradeId ? { ...g, isFinalized: !g.isFinalized } : g
      )
    );
  };

  const deleteGrade = (gradeId) => {
    if (window.confirm("Are you sure you want to delete this grade record?")) {
      setGrades(grades.filter((g) => g.id !== gradeId));
    }
  };

  const openDetailsModal = (grade) => {
    setSelectedGrade(grade);
    setShowDetailsModal(true);
  };

  const openAddAssessmentModal = (grade) => {
    setSelectedGrade(grade);
    setShowAddAssessmentModal(true);
  };

  const resetAssessmentForm = () => {
    setAssessmentForm({
      name: "",
      type: "assignment",
      marksObtained: "",
      maxMarks: 100,
      weightage: 15,
      gradedAt: new Date().toISOString().split("T")[0],
      isFinalized: false,
    });
  };

  const getGradeColor = (letterGrade) => {
    const colors = {
      A: "#10b981",
      "A-": "#34d399",
      "B+": "#3b82f6",
      B: "#60a5fa",
      "B-": "#93c5fd",
      "C+": "#f59e0b",
      C: "#fbbf24",
      "C-": "#fcd34d",
      D: "#ef4444",
      F: "#dc2626",
    };
    return colors[letterGrade] || "#6b7280";
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grade-management"
    >
      {/* Header */}
      <div className="grade-management__header">
        <div>
          <h1 className="grade-management__title">Grade Management</h1>
          <p className="grade-management__subtitle">
            Manage student grades and academic performance
          </p>
        </div>
        <div className="grade-management__header-actions">
          <button className="btn btn--secondary">
            <Download size={18} />
            Export Grades
          </button>
          <button className="btn btn--primary">
            <Plus size={18} />
            Add Grade
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="grade-management__tabs">
        <button
          className={`tab ${activeTab === "grades" ? "tab--active" : ""}`}
          onClick={() => setActiveTab("grades")}
        >
          <FileText size={18} />
          Grades
        </button>
        <button
          className={`tab ${activeTab === "analytics" ? "tab--active" : ""}`}
          onClick={() => setActiveTab("analytics")}
        >
          <BarChart3 size={18} />
          Analytics
        </button>
        <button
          className={`tab ${activeTab === "bulk-upload" ? "tab--active" : ""}`}
          onClick={() => setActiveTab("bulk-upload")}
        >
          <Upload size={18} />
          Bulk Upload
        </button>
      </div>

      {/* Statistics Cards */}
      {activeTab === "grades" && (
        <>
          <div className="grade-management__stats">
            <StatCard
              icon={<FileText />}
              title="Total Grades"
              value={stats.totalGrades}
              color="#3b82f6"
            />
            <StatCard
              icon={<CheckCircle />}
              title="Finalized"
              value={stats.finalized}
              color="#10b981"
            />
            <StatCard
              icon={<Award />}
              title="Average GPA"
              value={stats.avgGPA}
              color="#8b5cf6"
            />
            <StatCard
              icon={<TrendingUp />}
              title="Average Marks"
              value={`${stats.avgMarks}%`}
              color="#f59e0b"
            />
          </div>

          {/* Filters */}
          <div className="grade-management__filters">
            <div className="filter-group">
              <div className="input-with-icon">
                <Search size={18} />
                <input
                  type="text"
                  placeholder="Search by student, course, or reg number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="filter-input"
                />
              </div>

              <select
                value={filterSemester}
                onChange={(e) => setFilterSemester(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Semesters</option>
                <option value="Fall 2024">Fall 2024</option>
                <option value="Spring 2024">Spring 2024</option>
                <option value="Fall 2023">Fall 2023</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Status</option>
                <option value="finalized">Finalized</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          {/* Grades Table */}
          <div className="grade-management__table-container">
            <table className="grade-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Reg Number</th>
                  <th>Course</th>
                  <th>Semester</th>
                  <th>Total Marks</th>
                  <th>Letter Grade</th>
                  <th>GPA</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredGrades.map((grade) => (
                  <motion.tr
                    key={grade.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <td className="student-cell">
                      <div className="student-avatar">
                        {grade.student.name.charAt(0)}
                      </div>
                      <span className="student-name">{grade.student.name}</span>
                    </td>
                    <td className="reg-number">{grade.student.regNumber}</td>
                    <td>
                      <div className="course-info">
                        <span className="course-code">{grade.course.code}</span>
                        <span className="course-name">{grade.course.name}</span>
                      </div>
                    </td>
                    <td>{grade.semester}</td>
                    <td>
                      <span className="marks-badge">
                        {grade.totalMarks.toFixed(1)}%
                      </span>
                    </td>
                    <td>
                      <span
                        className="grade-badge"
                        style={{
                          backgroundColor: `${getGradeColor(
                            grade.letterGrade
                          )}20`,
                          color: getGradeColor(grade.letterGrade),
                        }}
                      >
                        {grade.letterGrade}
                      </span>
                    </td>
                    <td className="gpa-cell">{grade.gradePoints.toFixed(1)}</td>
                    <td>
                      <span
                        className={`status-badge ${
                          grade.isFinalized
                            ? "status-badge--finalized"
                            : "status-badge--draft"
                        }`}
                      >
                        {grade.isFinalized ? (
                          <>
                            <CheckCircle size={14} />
                            Finalized
                          </>
                        ) : (
                          <>
                            <XCircle size={14} />
                            Draft
                          </>
                        )}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="action-btn action-btn--view"
                          onClick={() => openDetailsModal(grade)}
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          className="action-btn action-btn--edit"
                          onClick={() => openAddAssessmentModal(grade)}
                          title="Add Assessment"
                        >
                          <Plus size={16} />
                        </button>
                        <button
                          className="action-btn action-btn--toggle"
                          onClick={() => toggleFinalized(grade.id)}
                          title={grade.isFinalized ? "Unfinalize" : "Finalize"}
                        >
                          {grade.isFinalized ? (
                            <Unlock size={16} />
                          ) : (
                            <Lock size={16} />
                          )}
                        </button>
                        <button
                          className="action-btn action-btn--delete"
                          onClick={() => deleteGrade(grade.id)}
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Analytics Tab */}
      {activeTab === "analytics" && (
        <div className="analytics-container">
          <div className="analytics-grid">
            {/* Grade Distribution */}
            <div className="analytics-card">
              <h3 className="analytics-card__title">Grade Distribution</h3>
              <div className="grade-distribution">
                {mockGradeDistribution.overall.map((item) => (
                  <div key={item.grade} className="grade-distribution__item">
                    <div className="grade-distribution__header">
                      <span className="grade-distribution__grade">
                        {item.grade}
                      </span>
                      <span className="grade-distribution__percentage">
                        {item.percentage}%
                      </span>
                    </div>
                    <div className="grade-distribution__bar">
                      <div
                        className="grade-distribution__fill"
                        style={{
                          width: `${item.percentage}%`,
                          backgroundColor: getGradeColor(item.grade),
                        }}
                      />
                    </div>
                    <span className="grade-distribution__count">
                      {item.count} students
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* GPA Trends */}
            <div className="analytics-card">
              <h3 className="analytics-card__title">GPA Trends</h3>
              <div className="gpa-trends">
                {mockGPATrends.map((trend, index) => (
                  <div key={index} className="gpa-trend__item">
                    <div className="gpa-trend__info">
                      <span className="gpa-trend__semester">
                        {trend.semester}
                      </span>
                      <span className="gpa-trend__students">
                        {trend.totalStudents} students
                      </span>
                    </div>
                    <div className="gpa-trend__value">
                      <TrendingUp size={16} className="gpa-trend__icon" />
                      <span className="gpa-trend__gpa">{trend.avgGPA}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Assessment Types */}
            <div className="analytics-card analytics-card--full">
              <h3 className="analytics-card__title">
                Assessment Types & Weightages
              </h3>
              <div className="assessment-types">
                {mockAssessmentTypes.map((type) => (
                  <div key={type.type} className="assessment-type__item">
                    <span className="assessment-type__label">{type.label}</span>
                    <div className="assessment-type__weightage">
                      <span>Default: {type.defaultWeightage}%</span>
                      <span>Max: {type.maxWeightage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Upload Tab */}
      {activeTab === "bulk-upload" && (
        <div className="bulk-upload-container">
          <div className="bulk-upload-card">
            <Upload size={48} className="bulk-upload-icon" />
            <h3>Bulk Grade Upload</h3>
            <p>Upload a CSV or Excel file to import multiple grades at once</p>
            <div className="bulk-upload-actions">
              <button className="btn btn--secondary">
                <Download size={18} />
                Download Template
              </button>
              <button className="btn btn--primary">
                <Upload size={18} />
                Upload File
              </button>
            </div>
            <div className="bulk-upload-info">
              <p>
                <strong>Supported formats:</strong> CSV, XLSX, XLS
              </p>
              <p>
                <strong>Maximum file size:</strong> 10 MB
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Grade Details Modal */}
      <AnimatePresence>
        {showDetailsModal && selectedGrade && (
          <Modal onClose={() => setShowDetailsModal(false)}>
            <h2 className="modal__title">Grade Details</h2>

            <div className="grade-details">
              <div className="grade-details__header">
                <div>
                  <h3>{selectedGrade.student.name}</h3>
                  <p className="grade-details__reg">
                    {selectedGrade.student.regNumber}
                  </p>
                </div>
                <div className="grade-details__summary">
                  <span
                    className="grade-badge grade-badge--large"
                    style={{
                      backgroundColor: `${getGradeColor(
                        selectedGrade.letterGrade
                      )}20`,
                      color: getGradeColor(selectedGrade.letterGrade),
                    }}
                  >
                    {selectedGrade.letterGrade}
                  </span>
                  <div className="grade-details__stats">
                    <div>
                      <span className="label">Total Marks</span>
                      <span className="value">
                        {selectedGrade.totalMarks.toFixed(1)}%
                      </span>
                    </div>
                    <div>
                      <span className="label">GPA</span>
                      <span className="value">
                        {selectedGrade.gradePoints.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grade-details__course">
                <h4>Course Information</h4>
                <div className="detail-row">
                  <span className="detail-label">Course Code:</span>
                  <span className="detail-value">
                    {selectedGrade.course.code}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Course Name:</span>
                  <span className="detail-value">
                    {selectedGrade.course.name}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Semester:</span>
                  <span className="detail-value">{selectedGrade.semester}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Graded By:</span>
                  <span className="detail-value">{selectedGrade.gradedBy}</span>
                </div>
              </div>

              <div className="grade-details__assessments">
                <h4>Assessments</h4>
                <table className="assessments-table">
                  <thead>
                    <tr>
                      <th>Assessment</th>
                      <th>Type</th>
                      <th>Marks</th>
                      <th>Weightage</th>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedGrade.assessments.map((assessment) => (
                      <tr key={assessment.id}>
                        <td>{assessment.name}</td>
                        <td>
                          <span className="assessment-type-badge">
                            {assessment.type.replace("_", " ")}
                          </span>
                        </td>
                        <td>
                          {assessment.marksObtained}/{assessment.maxMarks}
                          <span className="percentage">
                            (
                            {(
                              (assessment.marksObtained / assessment.maxMarks) *
                              100
                            ).toFixed(1)}
                            %)
                          </span>
                        </td>
                        <td>{assessment.weightage}%</td>
                        <td>
                          {new Date(assessment.gradedAt).toLocaleDateString()}
                        </td>
                        <td>
                          {assessment.isFinalized ? (
                            <CheckCircle
                              size={16}
                              className="status-icon status-icon--success"
                            />
                          ) : (
                            <XCircle
                              size={16}
                              className="status-icon status-icon--warning"
                            />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="modal__actions">
              <button
                className="btn btn--secondary"
                onClick={() => setShowDetailsModal(false)}
              >
                Close
              </button>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* Add Assessment Modal */}
      <AnimatePresence>
        {showAddAssessmentModal && selectedGrade && (
          <Modal
            onClose={() => {
              setShowAddAssessmentModal(false);
              resetAssessmentForm();
            }}
          >
            <h2 className="modal__title">Add Assessment</h2>
            <p className="modal__subtitle">
              Adding assessment for {selectedGrade.student.name} -{" "}
              {selectedGrade.course.code}
            </p>

            <form onSubmit={handleAddAssessment} className="assessment-form">
              <div className="form-grid">
                <div className="form-field">
                  <label>Assessment Name *</label>
                  <input
                    type="text"
                    required
                    value={assessmentForm.name}
                    onChange={(e) =>
                      setAssessmentForm({
                        ...assessmentForm,
                        name: e.target.value,
                      })
                    }
                    placeholder="e.g., Midterm Exam"
                  />
                </div>

                <div className="form-field">
                  <label>Assessment Type *</label>
                  <select
                    required
                    value={assessmentForm.type}
                    onChange={(e) =>
                      setAssessmentForm({
                        ...assessmentForm,
                        type: e.target.value,
                      })
                    }
                  >
                    {mockAssessmentTypes.map((type) => (
                      <option key={type.type} value={type.type}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-field">
                  <label>Marks Obtained *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.1"
                    value={assessmentForm.marksObtained}
                    onChange={(e) =>
                      setAssessmentForm({
                        ...assessmentForm,
                        marksObtained: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="form-field">
                  <label>Maximum Marks *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={assessmentForm.maxMarks}
                    onChange={(e) =>
                      setAssessmentForm({
                        ...assessmentForm,
                        maxMarks: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="form-field">
                  <label>Weightage (%) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="100"
                    value={assessmentForm.weightage}
                    onChange={(e) =>
                      setAssessmentForm({
                        ...assessmentForm,
                        weightage: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="form-field">
                  <label>Graded Date *</label>
                  <input
                    type="date"
                    required
                    value={assessmentForm.gradedAt}
                    onChange={(e) =>
                      setAssessmentForm({
                        ...assessmentForm,
                        gradedAt: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="form-checkbox">
                <input
                  type="checkbox"
                  id="finalized"
                  checked={assessmentForm.isFinalized}
                  onChange={(e) =>
                    setAssessmentForm({
                      ...assessmentForm,
                      isFinalized: e.target.checked,
                    })
                  }
                />
                <label htmlFor="finalized">Mark as finalized</label>
              </div>

              <div className="modal__actions">
                <button
                  type="button"
                  className="btn btn--secondary"
                  onClick={() => {
                    setShowAddAssessmentModal(false);
                    resetAssessmentForm();
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn--primary">
                  <Plus size={18} />
                  Add Assessment
                </button>
              </div>
            </form>
          </Modal>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Helper Components
function StatCard({ icon, title, value, color }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="stat-card"
      style={{ borderLeftColor: color }}
    >
      <div className="stat-card__icon" style={{ color }}>
        {icon}
      </div>
      <div className="stat-card__content">
        <span className="stat-card__title">{title}</span>
        <span className="stat-card__value">{value}</span>
      </div>
    </motion.div>
  );
}

function Modal({ onClose, children }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="modal-overlay"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="modal"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
