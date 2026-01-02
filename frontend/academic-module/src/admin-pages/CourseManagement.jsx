import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Users,
  Clock,
  Award,
  Plus,
  Edit,
  Trash2,
  Eye,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { adminService } from "../services/api/adminService";

export default function AdminCourseManagement() {
  const [courses, setCourses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    course_code: "",
    course_name: "",
    department_id: "",
    credit_hours: 3,
    lecture_hours: 3,
    lab_hours: 0,
    is_elective: false,
    description: "",
    prerequisites: "",
    learning_outcomes: "",
    is_active: true,
  });

  // Load initial data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [coursesRes, departmentsRes] = await Promise.all([
        adminService.getCourses(),
        adminService.getDepartments(),
      ]);

      if (coursesRes.success) {
        setCourses(coursesRes.data);
      } else {
        setError(coursesRes.error);
      }

      if (departmentsRes.success) {
        setDepartments(departmentsRes.data);
      } else {
        setError(departmentsRes.error);
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
    total: courses.length,
    active: courses.filter((c) => c.is_active !== false).length,
    totalCredits: courses.reduce((sum, c) => sum + (c.credit_hours || 0), 0),
    elective: courses.filter((c) => c.is_elective).length,
  };

  // Filter courses
  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.course_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.course_code?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment =
      filterDepartment === "all" ||
      course.department?.department_id === parseInt(filterDepartment);
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && course.is_active !== false) ||
      (filterStatus === "inactive" && course.is_active === false);

    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const result = await adminService.createCourse(formData);

      if (result.success) {
        showSuccess("Course created successfully");
        setShowCreateModal(false);
        resetForm();
        await loadData();
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("Failed to create course");
      console.error(err);
    }
  };

  const handleEditCourse = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const result = await adminService.updateCourse(
        selectedCourse.course_id,
        formData
      );

      if (result.success) {
        showSuccess("Course updated successfully");
        setShowEditModal(false);
        resetForm();
        await loadData();
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("Failed to update course");
      console.error(err);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      setError(null);

      try {
        const result = await adminService.deleteCourse(courseId);

        if (result.success) {
          showSuccess("Course deleted successfully");
          await loadData();
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError("Failed to delete course");
        console.error(err);
      }
    }
  };

  const toggleCourseStatus = async (course) => {
    setError(null);

    try {
      const result = await adminService.updateCourse(course.course_id, {
        is_active: !course.is_active,
      });

      if (result.success) {
        showSuccess(
          `Course ${result.data.is_active ? "activated" : "deactivated"}`
        );
        await loadData();
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("Failed to update course status");
      console.error(err);
    }
  };

  const openEditModal = (course) => {
    setSelectedCourse(course);
    setFormData({
      course_code: course.course_code || "",
      course_name: course.course_name || "",
      department_id: course.department?.department_id || "",
      credit_hours: course.credit_hours || 3,
      lecture_hours: course.lecture_hours || 3,
      lab_hours: course.lab_hours || 0,
      is_elective: course.is_elective || false,
      description: course.description || "",
      prerequisites: course.prerequisites || "",
      learning_outcomes: course.learning_outcomes || "",
      is_active: course.is_active !== false,
    });
    setShowEditModal(true);
  };

  const openDetailsModal = (course) => {
    setSelectedCourse(course);
    setShowDetailsModal(true);
  };

  const resetForm = () => {
    setFormData({
      course_code: "",
      course_name: "",
      department_id: "",
      credit_hours: 3,
      lecture_hours: 3,
      lab_hours: 0,
      is_elective: false,
      description: "",
      prerequisites: "",
      learning_outcomes: "",
      is_active: true,
    });
    setSelectedCourse(null);
    setError(null);
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
          <p style={{ color: "#6b7280" }}>Loading courses...</p>
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
      <div style={{ marginBottom: "32px" }}>
        <h1
          style={{
            fontSize: "32px",
            fontWeight: "700",
            color: "#111827",
            marginBottom: "8px",
          }}
        >
          Course Management
        </h1>
        <p style={{ color: "#6b7280", fontSize: "16px" }}>
          Manage courses, curriculum, and academic programs
        </p>
      </div>

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
          title="Total Courses"
          value={stats.total}
          icon={<BookOpen size={24} />}
          color="#3b82f6"
        />
        <StatCard
          title="Active Courses"
          value={stats.active}
          icon={<Users size={24} />}
          color="#10b981"
        />
        <StatCard
          title="Total Credits"
          value={stats.totalCredits}
          icon={<Clock size={24} />}
          color="#f59e0b"
        />
        <StatCard
          title="Elective Courses"
          value={stats.elective}
          icon={<Award size={24} />}
          color="#8b5cf6"
        />
      </div>

      {/* Filters and Search */}
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
                color: "#374151",
              }}
            >
              Search Courses
            </label>
            <input
              type="text"
              placeholder="Search by name or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                fontSize: "14px",
              }}
            />
          </div>

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
              Department
            </label>
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                fontSize: "14px",
              }}
            >
              <option value="all">All Departments</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
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
                color: "#374151",
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
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div
          style={{
            marginTop: "16px",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <button
            onClick={() => setShowCreateModal(true)}
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
            <Plus size={18} /> Create New Course
          </button>
        </div>
      </div>

      {/* Courses Table */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          overflow: "hidden",
        }}
      >
        {filteredCourses.length === 0 ? (
          <div
            style={{
              padding: "60px 20px",
              textAlign: "center",
              color: "#6b7280",
            }}
          >
            <p style={{ fontSize: "18px", marginBottom: "8px" }}>
              No courses found
            </p>
            <p style={{ fontSize: "14px" }}>
              {searchTerm || filterDepartment !== "all"
                ? "Try adjusting your filters"
                : "Create your first course to get started"}
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
                    "Course Code",
                    "Course Name",
                    "Department",
                    "Credits",
                    "Type",
                    "Hours",
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
                {filteredCourses.map((course) => (
                  <tr
                    key={course.course_id}
                    style={{ borderBottom: "1px solid #f3f4f6" }}
                  >
                    <td
                      style={{
                        padding: "16px",
                        fontSize: "14px",
                        fontWeight: "500",
                        color: "#1e40af",
                      }}
                    >
                      {course.course_code}
                    </td>
                    <td
                      style={{
                        padding: "16px",
                        fontSize: "14px",
                        color: "#111827",
                      }}
                    >
                      {course.course_name}
                    </td>
                    <td
                      style={{
                        padding: "16px",
                        fontSize: "14px",
                        color: "#6b7280",
                      }}
                    >
                      {course.department?.department_name || "N/A"}
                    </td>
                    <td
                      style={{
                        padding: "16px",
                        fontSize: "14px",
                        color: "#6b7280",
                      }}
                    >
                      {course.credit_hours}
                    </td>
                    <td style={{ padding: "16px" }}>
                      <span
                        style={{
                          padding: "4px 12px",
                          borderRadius: "12px",
                          fontSize: "12px",
                          fontWeight: "500",
                          backgroundColor: course.is_elective
                            ? "#8b5cf620"
                            : "#3b82f620",
                          color: course.is_elective ? "#8b5cf6" : "#3b82f6",
                        }}
                      >
                        {course.is_elective ? "Elective" : "Core"}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "16px",
                        fontSize: "14px",
                        color: "#6b7280",
                      }}
                    >
                      L:{course.lecture_hours || 0} Lab:{course.lab_hours || 0}
                    </td>
                    <td style={{ padding: "16px" }}>
                      <span
                        style={{
                          padding: "4px 12px",
                          borderRadius: "12px",
                          fontSize: "12px",
                          fontWeight: "500",
                          backgroundColor:
                            course.is_active !== false
                              ? "#10b98120"
                              : "#6b728020",
                          color:
                            course.is_active !== false ? "#10b981" : "#6b7280",
                        }}
                      >
                        {course.is_active !== false ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td style={{ padding: "16px" }}>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <ActionButton
                          onClick={() => openDetailsModal(course)}
                          title="View"
                          color="#3b82f6"
                        >
                          <Eye size={16} />
                        </ActionButton>
                        <ActionButton
                          onClick={() => openEditModal(course)}
                          title="Edit"
                          color="#f59e0b"
                        >
                          <Edit size={16} />
                        </ActionButton>
                        <ActionButton
                          onClick={() => toggleCourseStatus(course)}
                          title={
                            course.is_active !== false
                              ? "Deactivate"
                              : "Activate"
                          }
                          color={
                            course.is_active !== false ? "#6b7280" : "#10b981"
                          }
                        >
                          {course.is_active !== false ? (
                            <ToggleRight size={16} />
                          ) : (
                            <ToggleLeft size={16} />
                          )}
                        </ActionButton>
                        <ActionButton
                          onClick={() => handleDeleteCourse(course.course_id)}
                          title="Delete"
                          color="#dc2626"
                        >
                          <Trash2 size={16} />
                        </ActionButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <Modal
            onClose={() => {
              setShowCreateModal(false);
              resetForm();
            }}
          >
            <h2
              style={{
                fontSize: "24px",
                fontWeight: "700",
                marginBottom: "24px",
              }}
            >
              Create New Course
            </h2>
            <form onSubmit={handleCreateCourse}>
              <CourseForm
                formData={formData}
                setFormData={setFormData}
                departments={departments}
              />
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  justifyContent: "flex-end",
                  marginTop: "24px",
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
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
                  }}
                >
                  Create Course
                </button>
              </div>
            </form>
          </Modal>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {showEditModal && (
          <Modal
            onClose={() => {
              setShowEditModal(false);
              resetForm();
            }}
          >
            <h2
              style={{
                fontSize: "24px",
                fontWeight: "700",
                marginBottom: "24px",
              }}
            >
              Edit Course
            </h2>
            <form onSubmit={handleEditCourse}>
              <CourseForm
                formData={formData}
                setFormData={setFormData}
                departments={departments}
              />
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  justifyContent: "flex-end",
                  marginTop: "24px",
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
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
                  }}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </Modal>
        )}
      </AnimatePresence>

      {/* Details Modal */}
      <AnimatePresence>
        {showDetailsModal && selectedCourse && (
          <Modal onClose={() => setShowDetailsModal(false)}>
            <h2
              style={{
                fontSize: "24px",
                fontWeight: "700",
                marginBottom: "24px",
              }}
            >
              Course Details
            </h2>
            <div style={{ display: "grid", gap: "16px" }}>
              <DetailRow
                label="Course Code"
                value={selectedCourse.course_code}
              />
              <DetailRow
                label="Course Name"
                value={selectedCourse.course_name}
              />
              <DetailRow
                label="Department"
                value={selectedCourse.department?.department_name || "N/A"}
              />
              <DetailRow
                label="Credit Hours"
                value={selectedCourse.credit_hours}
              />
              <DetailRow
                label="Lecture Hours"
                value={selectedCourse.lecture_hours || 0}
              />
              <DetailRow
                label="Lab Hours"
                value={selectedCourse.lab_hours || 0}
              />
              <DetailRow
                label="Type"
                value={selectedCourse.is_elective ? "Elective" : "Core"}
              />
              <DetailRow
                label="Description"
                value={selectedCourse.description || "No description"}
              />
              <DetailRow
                label="Prerequisites"
                value={selectedCourse.prerequisites || "None"}
              />
              <DetailRow
                label="Learning Outcomes"
                value={selectedCourse.learning_outcomes || "Not specified"}
              />
              <DetailRow
                label="Status"
                value={
                  selectedCourse.is_active !== false ? "Active" : "Inactive"
                }
              />
            </div>
            <div
              style={{
                marginTop: "24px",
                display: "flex",
                justifyContent: "flex-end",
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
function StatCard({ title, value, icon, color }) {
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

function CourseForm({ formData, setFormData, departments }) {
  return (
    <div style={{ display: "grid", gap: "16px" }}>
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}
      >
        <FormField label="Course Code *" required>
          <input
            type="text"
            required
            value={formData.course_code}
            onChange={(e) =>
              setFormData({ ...formData, course_code: e.target.value })
            }
          />
        </FormField>
        <FormField label="Credit Hours *" required>
          <input
            type="number"
            required
            min="1"
            max="12"
            value={formData.credit_hours}
            onChange={(e) =>
              setFormData({
                ...formData,
                credit_hours: parseInt(e.target.value),
              })
            }
          />
        </FormField>
      </div>

      <FormField label="Course Name *" required>
        <input
          type="text"
          required
          value={formData.course_name}
          onChange={(e) =>
            setFormData({ ...formData, course_name: e.target.value })
          }
        />
      </FormField>

      <FormField label="Department *" required>
        <select
          required
          value={formData.department_id}
          onChange={(e) =>
            setFormData({ ...formData, department_id: e.target.value })
          }
        >
          <option value="">Select Department</option>
          {departments.map((dept) => (
            <option key={dept.id} value={dept.id}>
              {dept.name}
            </option>
          ))}
        </select>
      </FormField>

      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}
      >
        <FormField label="Lecture Hours">
          <input
            type="number"
            min="0"
            max="10"
            value={formData.lecture_hours}
            onChange={(e) =>
              setFormData({
                ...formData,
                lecture_hours: parseInt(e.target.value),
              })
            }
          />
        </FormField>
        <FormField label="Lab Hours">
          <input
            type="number"
            min="0"
            max="10"
            value={formData.lab_hours}
            onChange={(e) =>
              setFormData({ ...formData, lab_hours: parseInt(e.target.value) })
            }
          />
        </FormField>
      </div>

      <FormField label="Description">
        <textarea
          rows="4"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
      </FormField>

      <FormField label="Prerequisites">
        <textarea
          rows="2"
          value={formData.prerequisites}
          onChange={(e) =>
            setFormData({ ...formData, prerequisites: e.target.value })
          }
        />
      </FormField>

      <FormField label="Learning Outcomes">
        <textarea
          rows="3"
          value={formData.learning_outcomes}
          onChange={(e) =>
            setFormData({ ...formData, learning_outcomes: e.target.value })
          }
        />
      </FormField>

      <div style={{ display: "flex", gap: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <input
            type="checkbox"
            id="is_elective"
            checked={formData.is_elective}
            onChange={(e) =>
              setFormData({ ...formData, is_elective: e.target.checked })
            }
            style={{ width: "16px", height: "16px", cursor: "pointer" }}
          />
          <label
            htmlFor="is_elective"
            style={{ fontSize: "14px", color: "#374151", cursor: "pointer" }}
          >
            Elective Course
          </label>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <input
            type="checkbox"
            id="is_active"
            checked={formData.is_active}
            onChange={(e) =>
              setFormData({ ...formData, is_active: e.target.checked })
            }
            style={{ width: "16px", height: "16px", cursor: "pointer" }}
          />
          <label
            htmlFor="is_active"
            style={{ fontSize: "14px", color: "#374151", cursor: "pointer" }}
          >
            Course is active
          </label>
        </div>
      </div>
    </div>
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
          maxWidth: "600px",
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
