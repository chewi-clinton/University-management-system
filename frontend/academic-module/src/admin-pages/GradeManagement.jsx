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

  // Form state for adding/editing grade
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

  // Calculate statistics
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

  // Filter grades
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
      // Calculate percentage
      const percentage =
        (parseFloat(gradeForm.marks_obtained) /
          parseFloat(gradeForm.max_marks)) *
        100;

      // Auto-calculate letter grade if not provided
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
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "50px",
              height: "50px",
              border: "4px solid #f3f4f6",
              borderTop: "4px solid #1e40af",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 16px",
            }}
          />
          <p style={{ color: "#6b7280" }}>Loading grades...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); }}`}</style>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ padding: "24px" }}
    >
      {/* Success Message */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              position: "fixed",
              top: "20px",
              right: "20px",
              backgroundColor: "#10b981",
              color: "white",
              padding: "16px 24px",
              borderRadius: "8px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              zIndex: 1000,
            }}
          >
            ✓ {successMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Message */}
      {error && (
        <div
          style={{
            backgroundColor: "#fee",
            border: "1px solid #fcc",
            color: "#c33",
            padding: "12px 16px",
            borderRadius: "8px",
            marginBottom: "20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            style={{
              background: "none",
              border: "none",
              color: "#c33",
              cursor: "pointer",
              fontSize: "18px",
            }}
          >
            ×
          </button>
        </div>
      )}

      {/* Header */}
      <div
        style={{
          marginBottom: "32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "32px",
              fontWeight: "700",
              color: "#111827",
              marginBottom: "8px",
            }}
          >
            Grade Management
          </h1>
          <p style={{ color: "#6b7280", fontSize: "16px" }}>
            Manage student grades and academic performance
          </p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={exportToCSV}
            style={{
              padding: "10px 20px",
              backgroundColor: "#10b981",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "500",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Download size={18} /> Export
          </button>
          <button
            onClick={loadData}
            style={{
              padding: "10px 20px",
              backgroundColor: "#6b7280",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "500",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <RefreshCw size={18} /> Refresh
          </button>
          <button
            onClick={() => {
              resetForm();
              setShowAddGradeModal(true);
            }}
            style={{
              padding: "10px 20px",
              backgroundColor: "#1e40af",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "500",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Plus size={18} /> Add Grade
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          marginBottom: "24px",
          borderBottom: "2px solid #e5e7eb",
        }}
      >
        <TabButton
          active={activeTab === "grades"}
          onClick={() => setActiveTab("grades")}
          icon={<FileText size={18} />}
          label="Grades"
        />
        <TabButton
          active={activeTab === "analytics"}
          onClick={() => setActiveTab("analytics")}
          icon={<BarChart3 size={18} />}
          label="Analytics"
        />
      </div>

      {/* Grades Tab */}
      {activeTab === "grades" && (
        <>
          {/* Statistics Cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "20px",
              marginBottom: "32px",
            }}
          >
            <StatCard
              icon={<FileText size={24} />}
              title="Total Grades"
              value={stats.totalGrades}
              color="#3b82f6"
            />
            <StatCard
              icon={<CheckCircle size={24} />}
              title="Finalized"
              value={stats.finalized}
              color="#10b981"
            />
            <StatCard
              icon={<XCircle size={24} />}
              title="Pending"
              value={stats.pending}
              color="#f59e0b"
            />
            <StatCard
              icon={<TrendingUp size={24} />}
              title="Average Marks"
              value={`${stats.avgMarks}%`}
              color="#8b5cf6"
            />
          </div>

          {/* Filters */}
          <div
            style={{
              backgroundColor: "white",
              padding: "24px",
              borderRadius: "12px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              marginBottom: "24px",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "16px",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: "500",
                    marginBottom: "8px",
                  }}
                >
                  Search
                </label>
                <div style={{ position: "relative" }}>
                  <Search
                    size={18}
                    style={{
                      position: "absolute",
                      left: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#6b7280",
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Search by student, course..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 12px 10px 40px",
                      border: "1px solid #d1d5db",
                      borderRadius: "8px",
                      fontSize: "14px",
                    }}
                  />
                </div>
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: "500",
                    marginBottom: "8px",
                  }}
                >
                  Course
                </label>
                <select
                  value={filterOffering}
                  onChange={(e) => setFilterOffering(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "14px",
                  }}
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

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: "500",
                    marginBottom: "8px",
                  }}
                >
                  Status
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "14px",
                  }}
                >
                  <option value="all">All Status</option>
                  <option value="finalized">Finalized</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>
          </div>

          {/* Grades Table */}
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              overflow: "hidden",
            }}
          >
            {filteredGrades.length === 0 ? (
              <div
                style={{
                  padding: "60px 20px",
                  textAlign: "center",
                  color: "#6b7280",
                }}
              >
                <p style={{ fontSize: "18px", marginBottom: "8px" }}>
                  No grades found
                </p>
                <p style={{ fontSize: "14px" }}>
                  {searchTerm ||
                  filterOffering !== "all" ||
                  filterStatus !== "all"
                    ? "Try adjusting your filters"
                    : "Add your first grade to get started"}
                </p>
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead
                    style={{
                      backgroundColor: "#f9fafb",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
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
                        <th
                          key={header}
                          style={{
                            padding: "12px 16px",
                            textAlign: "left",
                            fontSize: "12px",
                            fontWeight: "600",
                            color: "#6b7280",
                            textTransform: "uppercase",
                          }}
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredGrades.map((grade) => (
                      <motion.tr
                        key={grade.grade_id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ borderBottom: "1px solid #f3f4f6" }}
                      >
                        <td style={{ padding: "16px" }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "12px",
                            }}
                          >
                            <div
                              style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "50%",
                                backgroundColor: "#3b82f6",
                                color: "white",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontWeight: "600",
                              }}
                            >
                              {grade.student?.first_name?.charAt(0) || "?"}
                            </div>
                            <span
                              style={{
                                fontSize: "14px",
                                fontWeight: "500",
                                color: "#111827",
                              }}
                            >
                              {grade.student
                                ? `${grade.student.first_name || ""} ${
                                    grade.student.last_name || ""
                                  }`.trim()
                                : "N/A"}
                            </span>
                          </div>
                        </td>
                        <td
                          style={{
                            padding: "16px",
                            fontSize: "14px",
                            color: "#6b7280",
                          }}
                        >
                          {grade.student?.university_reg_number || "N/A"}
                        </td>
                        <td style={{ padding: "16px" }}>
                          <div>
                            <div
                              style={{
                                fontSize: "14px",
                                fontWeight: "500",
                                color: "#1e40af",
                              }}
                            >
                              {grade.offering?.course?.course_code || "N/A"}
                            </div>
                            <div style={{ fontSize: "12px", color: "#6b7280" }}>
                              {grade.offering?.course?.course_name || ""}
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: "16px" }}>
                          <div>
                            <div style={{ fontSize: "14px", color: "#111827" }}>
                              {grade.assessment_name || "N/A"}
                            </div>
                            <div style={{ fontSize: "12px", color: "#6b7280" }}>
                              {grade.assessment_type?.replace("_", " ") || ""}
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: "16px" }}>
                          <div>
                            <span
                              style={{
                                fontSize: "14px",
                                fontWeight: "500",
                                color: "#111827",
                              }}
                            >
                              {grade.marks_obtained}/{grade.max_marks}
                            </span>
                            <span
                              style={{
                                fontSize: "12px",
                                color: "#6b7280",
                                marginLeft: "4px",
                              }}
                            >
                              (
                              {(
                                (grade.marks_obtained / grade.max_marks) *
                                100
                              ).toFixed(1)}
                              %)
                            </span>
                          </div>
                        </td>
                        <td style={{ padding: "16px" }}>
                          <span
                            style={{
                              padding: "4px 12px",
                              borderRadius: "12px",
                              fontSize: "12px",
                              fontWeight: "600",
                              backgroundColor: `${getGradeColor(
                                grade.grade
                              )}20`,
                              color: getGradeColor(grade.grade),
                            }}
                          >
                            {grade.grade || "N/A"}
                          </span>
                        </td>
                        <td style={{ padding: "16px" }}>
                          <span
                            style={{
                              padding: "4px 12px",
                              borderRadius: "12px",
                              fontSize: "12px",
                              fontWeight: "500",
                              backgroundColor: grade.is_finalized
                                ? "#10b98120"
                                : "#f59e0b20",
                              color: grade.is_finalized ? "#10b981" : "#f59e0b",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            {grade.is_finalized ? (
                              <CheckCircle size={14} />
                            ) : (
                              <XCircle size={14} />
                            )}
                            {grade.is_finalized ? "Finalized" : "Draft"}
                          </span>
                        </td>
                        <td style={{ padding: "16px" }}>
                          <div style={{ display: "flex", gap: "8px" }}>
                            <ActionButton
                              onClick={() => openDetailsModal(grade)}
                              title="View"
                              color="#3b82f6"
                            >
                              <Eye size={16} />
                            </ActionButton>
                            <ActionButton
                              onClick={() => openEditModal(grade)}
                              title="Edit"
                              color="#f59e0b"
                            >
                              <Edit size={16} />
                            </ActionButton>
                            <ActionButton
                              onClick={() =>
                                handleFinalizeGrade(grade.grade_id)
                              }
                              title={
                                grade.is_finalized ? "Unfinalize" : "Finalize"
                              }
                              color={grade.is_finalized ? "#6b7280" : "#10b981"}
                            >
                              {grade.is_finalized ? (
                                <Unlock size={16} />
                              ) : (
                                <Lock size={16} />
                              )}
                            </ActionButton>
                            <ActionButton
                              onClick={() => handleDeleteGrade(grade.grade_id)}
                              title="Delete"
                              color="#dc2626"
                            >
                              <Trash2 size={16} />
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

      {/* Analytics Tab */}
      {activeTab === "analytics" && gradeDistribution && (
        <div
          style={{
            backgroundColor: "white",
            padding: "32px",
            borderRadius: "12px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <h3
            style={{
              fontSize: "20px",
              fontWeight: "700",
              marginBottom: "24px",
            }}
          >
            Grade Distribution
          </h3>
          <div style={{ display: "grid", gap: "16px" }}>
            {gradeDistribution.map((item) => (
              <div
                key={item.grade}
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      fontSize: "18px",
                      fontWeight: "600",
                      color: getGradeColor(item.grade),
                    }}
                  >
                    {item.grade}
                  </span>
                  <span style={{ fontSize: "14px", color: "#6b7280" }}>
                    {item.count} students ({item.percentage}%)
                  </span>
                </div>
                <div
                  style={{
                    width: "100%",
                    height: "12px",
                    backgroundColor: "#f3f4f6",
                    borderRadius: "6px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${item.percentage}%`,
                      height: "100%",
                      backgroundColor: getGradeColor(item.grade),
                      transition: "width 0.3s ease",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add/Edit Grade Modal */}
      <AnimatePresence>
        {showAddGradeModal && (
          <Modal
            onClose={() => {
              setShowAddGradeModal(false);
              resetForm();
            }}
          >
            <h2
              style={{
                fontSize: "24px",
                fontWeight: "700",
                marginBottom: "8px",
              }}
            >
              {selectedGrade ? "Edit Grade" : "Add New Grade"}
            </h2>
            <p style={{ color: "#6b7280", marginBottom: "24px" }}>
              Enter the grade details below
            </p>

            <form
              onSubmit={handleSubmitGrade}
              style={{ display: "grid", gap: "16px" }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px",
                }}
              >
                <FormField label="Course Offering *" required>
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

                <FormField label="Assessment Type *" required>
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

              <FormField label="Assessment Name *" required>
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

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: "16px",
                }}
              >
                <FormField label="Marks Obtained *" required>
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

                <FormField label="Maximum Marks *" required>
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

              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
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
                  style={{ width: "16px", height: "16px", cursor: "pointer" }}
                />
                <label
                  htmlFor="finalized"
                  style={{
                    fontSize: "14px",
                    color: "#374151",
                    cursor: "pointer",
                  }}
                >
                  Mark as finalized
                </label>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  justifyContent: "flex-end",
                  marginTop: "8px",
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setShowAddGradeModal(false);
                    resetForm();
                  }}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#e5e7eb",
                    color: "#374151",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "14px",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#1e40af",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "14px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <Plus size={18} />
                  {selectedGrade ? "Update Grade" : "Add Grade"}
                </button>
              </div>
            </form>
          </Modal>
        )}
      </AnimatePresence>

      {/* Grade Details Modal */}
      <AnimatePresence>
        {showDetailsModal && selectedGrade && (
          <Modal onClose={() => setShowDetailsModal(false)}>
            <h2
              style={{
                fontSize: "24px",
                fontWeight: "700",
                marginBottom: "24px",
              }}
            >
              Grade Details
            </h2>

            <div style={{ display: "grid", gap: "24px" }}>
              {/* Student & Grade Summary */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "start",
                }}
              >
                <div>
                  <h3
                    style={{
                      fontSize: "20px",
                      fontWeight: "600",
                      color: "#111827",
                      marginBottom: "4px",
                    }}
                  >
                    {selectedGrade.student
                      ? `${selectedGrade.student.first_name || ""} ${
                          selectedGrade.student.last_name || ""
                        }`.trim()
                      : "N/A"}
                  </h3>
                  <p style={{ fontSize: "14px", color: "#6b7280" }}>
                    {selectedGrade.student?.university_reg_number || "N/A"}
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span
                    style={{
                      padding: "8px 16px",
                      borderRadius: "12px",
                      fontSize: "24px",
                      fontWeight: "700",
                      backgroundColor: `${getGradeColor(
                        selectedGrade.grade
                      )}20`,
                      color: getGradeColor(selectedGrade.grade),
                      display: "inline-block",
                    }}
                  >
                    {selectedGrade.grade || "N/A"}
                  </span>
                  <p
                    style={{
                      fontSize: "12px",
                      color: "#6b7280",
                      marginTop: "8px",
                    }}
                  >
                    {selectedGrade.marks_obtained}/{selectedGrade.max_marks} (
                    {(
                      (selectedGrade.marks_obtained / selectedGrade.max_marks) *
                      100
                    ).toFixed(1)}
                    %)
                  </p>
                </div>
              </div>

              {/* Course Information */}
              <div>
                <h4
                  style={{
                    fontSize: "16px",
                    fontWeight: "600",
                    marginBottom: "12px",
                    color: "#111827",
                  }}
                >
                  Course Information
                </h4>
                <div style={{ display: "grid", gap: "8px" }}>
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

              {/* Assessment Information */}
              <div>
                <h4
                  style={{
                    fontSize: "16px",
                    fontWeight: "600",
                    marginBottom: "12px",
                    color: "#111827",
                  }}
                >
                  Assessment Details
                </h4>
                <div style={{ display: "grid", gap: "8px" }}>
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
                        style={{
                          padding: "4px 12px",
                          borderRadius: "12px",
                          fontSize: "12px",
                          fontWeight: "500",
                          backgroundColor: selectedGrade.is_finalized
                            ? "#10b98120"
                            : "#f59e0b20",
                          color: selectedGrade.is_finalized
                            ? "#10b981"
                            : "#f59e0b",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        {selectedGrade.is_finalized ? (
                          <CheckCircle size={14} />
                        ) : (
                          <XCircle size={14} />
                        )}
                        {selectedGrade.is_finalized ? "Finalized" : "Draft"}
                      </span>
                    }
                  />
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "24px",
              }}
            >
              <button
                onClick={() => setShowDetailsModal(false)}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#1e40af",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "14px",
                  cursor: "pointer",
                }}
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

// Helper Components
function StatCard({ icon, title, value, color }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      style={{
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        borderLeft: `4px solid ${color}`,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <p
            style={{ color: "#6b7280", fontSize: "14px", marginBottom: "8px" }}
          >
            {title}
          </p>
          <p style={{ fontSize: "32px", fontWeight: "700", color: "#111827" }}>
            {value}
          </p>
        </div>
        <div style={{ color }}>{icon}</div>
      </div>
    </motion.div>
  );
}

function TabButton({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "12px 24px",
        backgroundColor: "transparent",
        color: active ? "#1e40af" : "#6b7280",
        border: "none",
        borderBottom: active ? "2px solid #1e40af" : "2px solid transparent",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: "500",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        transition: "all 0.2s",
      }}
    >
      {icon}
      {label}
    </button>
  );
}

function ActionButton({ onClick, title, color, children }) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        padding: "6px 12px",
        backgroundColor: color,
        color: "white",
        border: "none",
        borderRadius: "6px",
        fontSize: "12px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {children}
    </button>
  );
}

function FormField({ label, required, children }) {
  return (
    <div>
      <label
        style={{
          display: "block",
          fontSize: "14px",
          fontWeight: "500",
          marginBottom: "8px",
          color: "#374151",
        }}
      >
        {label}
      </label>
      <div style={{ width: "100%" }}>
        {React.cloneElement(children, {
          style: {
            width: "100%",
            padding: "10px 12px",
            border: "1px solid #d1d5db",
            borderRadius: "8px",
            fontSize: "14px",
            fontFamily: "inherit",
          },
        })}
      </div>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "180px 1fr",
        gap: "16px",
        padding: "12px 0",
        borderBottom: "1px solid #f3f4f6",
      }}
    >
      <span style={{ fontSize: "14px", fontWeight: "600", color: "#6b7280" }}>
        {label}:
      </span>
      <span style={{ fontSize: "14px", color: "#111827" }}>{value}</span>
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
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "20px",
      }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          padding: "32px",
          maxWidth: "700px",
          width: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow:
            "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
