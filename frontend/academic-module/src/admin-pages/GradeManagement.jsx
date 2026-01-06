import React, { useState, useEffect } from "react";
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
  RefreshCw,
} from "lucide-react";
import { adminService } from "../services/api/adminService";
import "../styles/admin-pages/GradeManagement.css";

export default function GradeManagement() {
  const [grades, setGrades] = useState([]);
  const [courseOfferings, setCourseOfferings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAddGradeModal, setShowAddGradeModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOffering, setFilterOffering] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [activeTab, setActiveTab] = useState("grades");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [gradeDistribution, setGradeDistribution] = useState(null);

  const [gradeForm, setGradeForm] = useState({
    student_id: "",
    offering_id: "",
    assessment_type: "midterm",
    assessment_name: "",
    marks_obtained: "",
    max_marks: 100,
    grade: "",
    is_finalized: false,
  });

  const assessmentTypes = [
    { value: "assignment", label: "Assignment" },
    { value: "quiz", label: "Quiz" },
    { value: "midterm", label: "Midterm Exam" },
    { value: "final", label: "Final Exam" },
    { value: "project", label: "Project" },
    { value: "presentation", label: "Presentation" },
    { value: "lab", label: "Lab Work" },
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [gradesRes, offeringsRes, distributionRes] = await Promise.all([
        adminService.getGrades(),
        adminService.getCourseOfferings(),
        adminService.getGradeDistribution(),
      ]);

      if (gradesRes.success) {
        setGrades(gradesRes.data);
      } else {
        setError(gradesRes.error);
      }

      if (offeringsRes.success) {
        setCourseOfferings(offeringsRes.data);
      }

      if (distributionRes.success) {
        setGradeDistribution(distributionRes.data);
      }
    } catch (err) {
      setError("Failed to load data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    totalGrades: grades.length,
    finalized: grades.filter((g) => g.is_finalized).length,
    avgMarks:
      grades.length > 0
        ? (
            grades.reduce((sum, g) => sum + (g.marks_obtained || 0), 0) /
            grades.length
          ).toFixed(1)
        : 0,
    pending: grades.filter((g) => !g.is_finalized).length,
  };

  const filteredGrades = grades.filter((grade) => {
    const studentName = grade.student
      ? `${grade.student.first_name || ""} ${
          grade.student.last_name || ""
        }`.toLowerCase()
      : "";
    const regNumber = grade.student?.university_reg_number?.toLowerCase() || "";
    const courseName = grade.offering?.course?.course_name?.toLowerCase() || "";
    const courseCode = grade.offering?.course?.course_code?.toLowerCase() || "";

    const matchesSearch =
      studentName.includes(searchTerm.toLowerCase()) ||
      regNumber.includes(searchTerm.toLowerCase()) ||
      courseName.includes(searchTerm.toLowerCase()) ||
      courseCode.includes(searchTerm.toLowerCase());

    const matchesOffering =
      filterOffering === "all" ||
      grade.offering?.offering_id === parseInt(filterOffering);

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "finalized" && grade.is_finalized) ||
      (filterStatus === "draft" && !grade.is_finalized);

    return matchesSearch && matchesOffering && matchesStatus;
  });

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleSubmitGrade = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const percentage =
        (parseFloat(gradeForm.marks_obtained) /
          parseFloat(gradeForm.max_marks)) *
        100;

      let letterGrade = gradeForm.grade;
      if (!letterGrade) {
        letterGrade = calculateLetterGrade(percentage);
      }

      const gradeData = {
        ...gradeForm,
        marks_obtained: parseFloat(gradeForm.marks_obtained),
        max_marks: parseFloat(gradeForm.max_marks),
        grade: letterGrade,
      };

      const result = selectedGrade
        ? await adminService.updateGrade(selectedGrade.grade_id, gradeData)
        : await adminService.createGrade(gradeData);

      if (result.success) {
        showSuccess(
          selectedGrade
            ? "Grade updated successfully"
            : "Grade added successfully"
        );
        setShowAddGradeModal(false);
        resetForm();
        await loadData();
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("Failed to save grade");
      console.error(err);
    }
  };

  const calculateLetterGrade = (percentage) => {
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

  const handleFinalizeGrade = async (gradeId) => {
    setError(null);
    try {
      const grade = grades.find((g) => g.grade_id === gradeId);
      const result = await adminService.updateGrade(gradeId, {
        is_finalized: !grade.is_finalized,
      });

      if (result.success) {
        showSuccess(
          `Grade ${result.data.is_finalized ? "finalized" : "unfinalized"}`
        );
        await loadData();
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("Failed to update grade status");
      console.error(err);
    }
  };

  const handleDeleteGrade = async (gradeId) => {
    if (window.confirm("Are you sure you want to delete this grade record?")) {
      setError(null);
      try {
        const result = await adminService.deleteGrade(gradeId);
        if (result.success) {
          showSuccess("Grade deleted successfully");
          await loadData();
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError("Failed to delete grade");
        console.error(err);
      }
    }
  };

  const openDetailsModal = (grade) => {
    setSelectedGrade(grade);
    setShowDetailsModal(true);
  };

  const openEditModal = (grade) => {
    setSelectedGrade(grade);
    setGradeForm({
      student_id: grade.student?.student_id || "",
      offering_id: grade.offering?.offering_id || "",
      assessment_type: grade.assessment_type || "midterm",
      assessment_name: grade.assessment_name || "",
      marks_obtained: grade.marks_obtained || "",
      max_marks: grade.max_marks || 100,
      grade: grade.grade || "",
      is_finalized: grade.is_finalized || false,
    });
    setShowAddGradeModal(true);
  };

  const resetForm = () => {
    setGradeForm({
      student_id: "",
      offering_id: "",
      assessment_type: "midterm",
      assessment_name: "",
      marks_obtained: "",
      max_marks: 100,
      grade: "",
      is_finalized: false,
    });
    setSelectedGrade(null);
  };

  const getGradeColor = (letterGrade) => {
    const colors = {
      A: "#1a5c3a",
      "A-": "#2d7a52",
      "B+": "#1e4a7a",
      B: "#2a5f92",
      "B-": "#3a75aa",
      "C+": "#8a5c1f",
      C: "#a67532",
      "C-": "#b88d4a",
      D: "#8c2828",
      F: "#6e1f1f",
    };
    return colors[letterGrade] || "#525252";
  };

  const exportToCSV = () => {
    const headers = [
      "Student",
      "Reg Number",
      "Course",
      "Assessment",
      "Marks",
      "Grade",
      "Status",
    ];
    const rows = filteredGrades.map((grade) => [
      grade.student
        ? `${grade.student.first_name || ""} ${
            grade.student.last_name || ""
          }`.trim()
        : "N/A",
      grade.student?.university_reg_number || "N/A",
      `${grade.offering?.course?.course_code || ""} - ${
        grade.offering?.course?.course_name || ""
      }`,
      grade.assessment_name || "N/A",
      `${grade.marks_obtained}/${grade.max_marks}`,
      grade.grade || "N/A",
      grade.is_finalized ? "Finalized" : "Draft",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `grades_export_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showSuccess("Grades exported successfully");
  };

  if (loading) {
    return (
      <div className="grade-management__loading">
        <div className="grade-management__spinner" />
        <p>Loading grades...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grade-management"
    >
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grade-management__success"
          >
            <CheckCircle size={16} />
            {successMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <div className="grade-management__error">
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="grade-management__error-close"
          >
            ×
          </button>
        </div>
      )}

      <div className="grade-management__header">
        <div className="grade-management__header-content">
          <h1 className="grade-management__title">Grade Management</h1>
          <p className="grade-management__subtitle">
            Manage student grades and academic performance
          </p>
        </div>
        <div className="grade-management__actions">
          <button onClick={exportToCSV} className="btn btn--secondary">
            <Download size={16} />
            Export
          </button>
          <button onClick={loadData} className="btn btn--secondary">
            <RefreshCw size={16} />
            Refresh
          </button>
          <button
            onClick={() => {
              resetForm();
              setShowAddGradeModal(true);
            }}
            className="btn btn--primary"
          >
            <Plus size={16} />
            Add Grade
          </button>
        </div>
      </div>

      <div className="grade-management__tabs">
        <TabButton
          active={activeTab === "grades"}
          onClick={() => setActiveTab("grades")}
          icon={<FileText size={16} />}
          label="Grades"
        />
        <TabButton
          active={activeTab === "analytics"}
          onClick={() => setActiveTab("analytics")}
          icon={<BarChart3 size={16} />}
          label="Analytics"
        />
      </div>

      {activeTab === "grades" && (
        <>
          <div className="grade-management__stats">
            <StatCard
              icon={<FileText size={20} />}
              title="Total Grades"
              value={stats.totalGrades}
              color="#2c4a6e"
            />
            <StatCard
              icon={<CheckCircle size={20} />}
              title="Finalized"
              value={stats.finalized}
              color="#1a5c3a"
            />
            <StatCard
              icon={<XCircle size={20} />}
              title="Pending"
              value={stats.pending}
              color="#8a5c1f"
            />
            <StatCard
              icon={<TrendingUp size={20} />}
              title="Average Marks"
              value={`${stats.avgMarks}%`}
              color="#524a75"
            />
          </div>

          <div className="grade-management__filters">
            <div className="filter-group">
              <div className="filter-field">
                <label>Search</label>
                <div className="filter-field__input-wrapper">
                  <Search size={16} className="filter-field__icon" />
                  <input
                    type="text"
                    placeholder="Search by student, course..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="filter-field__input"
                  />
                </div>
              </div>

              <div className="filter-field">
                <label>Course</label>
                <select
                  value={filterOffering}
                  onChange={(e) => setFilterOffering(e.target.value)}
                  className="filter-field__select"
                >
                  <option value="all">All Courses</option>
                  {courseOfferings.map((offering) => (
                    <option
                      key={offering.offering_id}
                      value={offering.offering_id}
                    >
                      {offering.course?.course_code} -{" "}
                      {offering.course?.course_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-field">
                <label>Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="filter-field__select"
                >
                  <option value="all">All Status</option>
                  <option value="finalized">Finalized</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grade-management__table-wrapper">
            {filteredGrades.length === 0 ? (
              <div className="grade-management__empty">
                <p className="grade-management__empty-title">No grades found</p>
                <p className="grade-management__empty-text">
                  {searchTerm ||
                  filterOffering !== "all" ||
                  filterStatus !== "all"
                    ? "Try adjusting your filters"
                    : "Add your first grade to get started"}
                </p>
              </div>
            ) : (
              <div className="grade-table__container">
                <table className="grade-table">
                  <thead>
                    <tr>
                      {[
                        "Student",
                        "Reg Number",
                        "Course",
                        "Assessment",
                        "Marks",
                        "Grade",
                        "Status",
                        "Actions",
                      ].map((header) => (
                        <th key={header}>{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredGrades.map((grade) => (
                      <motion.tr
                        key={grade.grade_id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <td>
                          <div className="grade-table__student">
                            <div
                              className="grade-table__avatar"
                              style={{
                                backgroundColor: getGradeColor(
                                  grade.grade || "F"
                                ),
                              }}
                            >
                              {grade.student?.first_name?.charAt(0) || "?"}
                            </div>
                            <span className="grade-table__student-name">
                              {grade.student
                                ? `${grade.student.first_name || ""} ${
                                    grade.student.last_name || ""
                                  }`.trim()
                                : "N/A"}
                            </span>
                          </div>
                        </td>
                        <td className="grade-table__reg">
                          {grade.student?.university_reg_number || "N/A"}
                        </td>
                        <td>
                          <div className="grade-table__course">
                            <div className="grade-table__course-code">
                              {grade.offering?.course?.course_code || "N/A"}
                            </div>
                            <div className="grade-table__course-name">
                              {grade.offering?.course?.course_name || ""}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="grade-table__assessment">
                            <div className="grade-table__assessment-name">
                              {grade.assessment_name || "N/A"}
                            </div>
                            <div className="grade-table__assessment-type">
                              {grade.assessment_type?.replace("_", " ") || ""}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="grade-table__marks">
                            <span className="grade-table__marks-value">
                              {grade.marks_obtained}/{grade.max_marks}
                            </span>
                            <span className="grade-table__marks-percent">
                              (
                              {(
                                (grade.marks_obtained / grade.max_marks) *
                                100
                              ).toFixed(1)}
                              %)
                            </span>
                          </div>
                        </td>
                        <td>
                          <span
                            className="grade-table__grade-badge"
                            style={{
                              backgroundColor: `${getGradeColor(
                                grade.grade
                              )}15`,
                              color: getGradeColor(grade.grade),
                            }}
                          >
                            {grade.grade || "N/A"}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`grade-table__status ${
                              grade.is_finalized
                                ? "grade-table__status--finalized"
                                : "grade-table__status--draft"
                            }`}
                          >
                            {grade.is_finalized ? (
                              <CheckCircle size={12} />
                            ) : (
                              <XCircle size={12} />
                            )}
                            {grade.is_finalized ? "Finalized" : "Draft"}
                          </span>
                        </td>
                        <td>
                          <div className="grade-table__actions">
                            <ActionButton
                              onClick={() => openDetailsModal(grade)}
                              title="View"
                              variant="view"
                            >
                              <Eye size={14} />
                            </ActionButton>
                            <ActionButton
                              onClick={() => openEditModal(grade)}
                              title="Edit"
                              variant="edit"
                            >
                              <Edit size={14} />
                            </ActionButton>
                            <ActionButton
                              onClick={() =>
                                handleFinalizeGrade(grade.grade_id)
                              }
                              title={
                                grade.is_finalized ? "Unfinalize" : "Finalize"
                              }
                              variant="toggle"
                            >
                              {grade.is_finalized ? (
                                <Unlock size={14} />
                              ) : (
                                <Lock size={14} />
                              )}
                            </ActionButton>
                            <ActionButton
                              onClick={() => handleDeleteGrade(grade.grade_id)}
                              title="Delete"
                              variant="delete"
                            >
                              <Trash2 size={14} />
                            </ActionButton>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {activeTab === "analytics" && gradeDistribution && (
        <div className="grade-management__analytics">
          <h3 className="grade-management__analytics-title">
            Grade Distribution
          </h3>
          <div className="grade-distribution">
            {gradeDistribution.map((item) => (
              <div key={item.grade} className="grade-distribution__item">
                <div className="grade-distribution__header">
                  <span
                    className="grade-distribution__grade"
                    style={{ color: getGradeColor(item.grade) }}
                  >
                    {item.grade}
                  </span>
                  <span className="grade-distribution__count">
                    {item.count} students ({item.percentage}%)
                  </span>
                </div>
                <div className="grade-distribution__bar">
                  <div
                    className="grade-distribution__bar-fill"
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: getGradeColor(item.grade),
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <AnimatePresence>
        {showAddGradeModal && (
          <Modal
            onClose={() => {
              setShowAddGradeModal(false);
              resetForm();
            }}
          >
            <h2 className="modal__title">
              {selectedGrade ? "Edit Grade" : "Add New Grade"}
            </h2>
            <p className="modal__subtitle">Enter the grade details below</p>

            <form onSubmit={handleSubmitGrade} className="grade-form">
              <div className="grade-form__grid">
                <FormField label="Course Offering" required>
                  <select
                    required
                    value={gradeForm.offering_id}
                    onChange={(e) =>
                      setGradeForm({
                        ...gradeForm,
                        offering_id: e.target.value,
                      })
                    }
                  >
                    <option value="">Select Course</option>
                    {courseOfferings.map((offering) => (
                      <option
                        key={offering.offering_id}
                        value={offering.offering_id}
                      >
                        {offering.course?.course_code} -{" "}
                        {offering.course?.course_name}
                      </option>
                    ))}
                  </select>
                </FormField>

                <FormField label="Assessment Type" required>
                  <select
                    required
                    value={gradeForm.assessment_type}
                    onChange={(e) =>
                      setGradeForm({
                        ...gradeForm,
                        assessment_type: e.target.value,
                      })
                    }
                  >
                    {assessmentTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </FormField>
              </div>

              <FormField label="Assessment Name" required>
                <input
                  type="text"
                  required
                  placeholder="e.g., Midterm Exam"
                  value={gradeForm.assessment_name}
                  onChange={(e) =>
                    setGradeForm({
                      ...gradeForm,
                      assessment_name: e.target.value,
                    })
                  }
                />
              </FormField>

              <div className="grade-form__grid grade-form__grid--three">
                <FormField label="Marks Obtained" required>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.1"
                    value={gradeForm.marks_obtained}
                    onChange={(e) =>
                      setGradeForm({
                        ...gradeForm,
                        marks_obtained: e.target.value,
                      })
                    }
                  />
                </FormField>

                <FormField label="Maximum Marks" required>
                  <input
                    type="number"
                    required
                    min="1"
                    value={gradeForm.max_marks}
                    onChange={(e) =>
                      setGradeForm({ ...gradeForm, max_marks: e.target.value })
                    }
                  />
                </FormField>

                <FormField label="Letter Grade">
                  <input
                    type="text"
                    placeholder="Auto-calculated"
                    value={gradeForm.grade}
                    onChange={(e) =>
                      setGradeForm({ ...gradeForm, grade: e.target.value })
                    }
                  />
                </FormField>
              </div>

              <div className="grade-form__checkbox">
                <input
                  type="checkbox"
                  id="finalized"
                  checked={gradeForm.is_finalized}
                  onChange={(e) =>
                    setGradeForm({
                      ...gradeForm,
                      is_finalized: e.target.checked,
                    })
                  }
                />
                <label htmlFor="finalized">Mark as finalized</label>
              </div>

              <div className="modal__actions">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddGradeModal(false);
                    resetForm();
                  }}
                  className="btn btn--secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn--primary">
                  <Plus size={16} />
                  {selectedGrade ? "Update Grade" : "Add Grade"}
                </button>
              </div>
            </form>
          </Modal>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDetailsModal && selectedGrade && (
          <Modal onClose={() => setShowDetailsModal(false)}>
            <h2 className="modal__title">Grade Details</h2>

            <div className="grade-details">
              <div className="grade-details__header">
                <div>
                  <h3 className="grade-details__student-name">
                    {selectedGrade.student
                      ? `${selectedGrade.student.first_name || ""} ${
                          selectedGrade.student.last_name || ""
                        }`.trim()
                      : "N/A"}
                  </h3>
                  <p className="grade-details__reg-number">
                    {selectedGrade.student?.university_reg_number || "N/A"}
                  </p>
                </div>
                <div className="grade-details__grade-display">
                  <span
                    className="grade-details__grade-large"
                    style={{
                      backgroundColor: `${getGradeColor(
                        selectedGrade.grade
                      )}15`,
                      color: getGradeColor(selectedGrade.grade),
                    }}
                  >
                    {selectedGrade.grade || "N/A"}
                  </span>
                  <p className="grade-details__percentage">
                    {selectedGrade.marks_obtained}/{selectedGrade.max_marks} (
                    {(
                      (selectedGrade.marks_obtained / selectedGrade.max_marks) *
                      100
                    ).toFixed(1)}
                    %)
                  </p>
                </div>
              </div>

              <div className="grade-details__section">
                <h4 className="grade-details__section-title">
                  Course Information
                </h4>
                <div className="grade-details__rows">
                  <DetailRow
                    label="Course Code"
                    value={selectedGrade.offering?.course?.course_code || "N/A"}
                  />
                  <DetailRow
                    label="Course Name"
                    value={selectedGrade.offering?.course?.course_name || "N/A"}
                  />
                  <DetailRow
                    label="Section"
                    value={selectedGrade.offering?.section || "N/A"}
                  />
                  <DetailRow
                    label="Semester"
                    value={
                      selectedGrade.offering?.semester?.semester_name || "N/A"
                    }
                  />
                </div>
              </div>

              <div className="grade-details__section">
                <h4 className="grade-details__section-title">
                  Assessment Details
                </h4>
                <div className="grade-details__rows">
                  <DetailRow
                    label="Assessment Name"
                    value={selectedGrade.assessment_name || "N/A"}
                  />
                  <DetailRow
                    label="Assessment Type"
                    value={
                      selectedGrade.assessment_type?.replace("_", " ") || "N/A"
                    }
                  />
                  <DetailRow
                    label="Marks"
                    value={`${selectedGrade.marks_obtained}/${selectedGrade.max_marks}`}
                  />
                  <DetailRow
                    label="Percentage"
                    value={`${(
                      (selectedGrade.marks_obtained / selectedGrade.max_marks) *
                      100
                    ).toFixed(1)}%`}
                  />
                  <DetailRow
                    label="Graded By"
                    value={
                      selectedGrade.graded_by_faculty
                        ? `${
                            selectedGrade.graded_by_faculty.user?.first_name ||
                            ""
                          } ${
                            selectedGrade.graded_by_faculty.user?.last_name ||
                            ""
                          }`.trim()
                        : "N/A"
                    }
                  />
                  <DetailRow
                    label="Graded At"
                    value={
                      selectedGrade.graded_at
                        ? new Date(selectedGrade.graded_at).toLocaleString()
                        : "N/A"
                    }
                  />
                  <DetailRow
                    label="Status"
                    value={
                      <span
                        className={`grade-details__status ${
                          selectedGrade.is_finalized
                            ? "grade-details__status--finalized"
                            : "grade-details__status--draft"
                        }`}
                      >
                        {selectedGrade.is_finalized ? (
                          <CheckCircle size={12} />
                        ) : (
                          <XCircle size={12} />
                        )}
                        {selectedGrade.is_finalized ? "Finalized" : "Draft"}
                      </span>
                    }
                  />
                </div>
              </div>
            </div>

            <div className="modal__actions">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="btn btn--primary"
              >
                Close
              </button>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function StatCard({ icon, title, value, color }) {
  return (
    <motion.div whileHover={{ scale: 1.01 }} className="stat-card">
      <div className="stat-card__icon" style={{ color }}>
        {icon}
      </div>
      <div className="stat-card__content">
        <p className="stat-card__title">{title}</p>
        <p className="stat-card__value">{value}</p>
      </div>
    </motion.div>
  );
}

function TabButton({ active, onClick, icon, label }) {
  return (
    <button onClick={onClick} className={`tab ${active ? "tab--active" : ""}`}>
      {icon}
      {label}
    </button>
  );
}

function ActionButton({ onClick, title, variant, children }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`action-btn action-btn--${variant}`}
    >
      {children}
    </button>
  );
}

function FormField({ label, required, children }) {
  return (
    <div className="form-field">
      <label className="form-field__label">
        {label}
        {required && <span className="form-field__required">*</span>}
      </label>
      <div className="form-field__input">
        {React.cloneElement(children, {
          className: "form-field__control",
        })}
      </div>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="detail-row">
      <span className="detail-row__label">{label}</span>
      <span className="detail-row__value">{value}</span>
    </div>
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
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="modal"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
