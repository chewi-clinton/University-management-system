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
import "../styles/admin-pages/course-management.css";

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

  const stats = {
    total: courses.length,
    active: courses.filter((c) => c.is_active !== false).length,
    totalCredits: courses.reduce((sum, c) => sum + (c.credit_hours || 0), 0),
    elective: courses.filter((c) => c.is_elective).length,
  };

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
      <div className="course-loading">
        <div className="course-loading__spinner" />
        <p className="course-loading__text">Loading courses...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="course-management"
    >
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="course-management__success"
          >
            ✓ {successMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <div className="course-management__error">
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="course-management__error-close"
          >
            ×
          </button>
        </div>
      )}

      <div className="course-management__header">
        <h1>Course Management</h1>
        <p>Manage courses, curriculum, and academic programs</p>
      </div>

      <div className="course-management__stats">
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

      <div className="course-management__filters">
        <div className="course-management__filters-grid">
          <div className="course-management__filter-group">
            <label className="course-management__filter-label">
              Search Courses
            </label>
            <input
              type="text"
              placeholder="Search by name or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="course-management__filter-input"
            />
          </div>

          <div className="course-management__filter-group">
            <label className="course-management__filter-label">
              Department
            </label>
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="course-management__filter-select"
            >
              <option value="all">All Departments</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          <div className="course-management__filter-group">
            <label className="course-management__filter-label">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="course-management__filter-select"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="course-management__filters-actions">
          <button
            onClick={() => setShowCreateModal(true)}
            className="course-management__create-btn"
          >
            <Plus size={18} /> Create New Course
          </button>
        </div>
      </div>

      <div className="course-management__table-container">
        {filteredCourses.length === 0 ? (
          <div className="course-management__empty">
            <p className="course-management__empty-title">No courses found</p>
            <p className="course-management__empty-text">
              {searchTerm || filterDepartment !== "all"
                ? "Try adjusting your filters"
                : "Create your first course to get started"}
            </p>
          </div>
        ) : (
          <div className="course-management__table-wrapper">
            <table className="course-management__table">
              <thead>
                <tr>
                  <th>Course Code</th>
                  <th>Course Name</th>
                  <th>Department</th>
                  <th>Credits</th>
                  <th>Type</th>
                  <th>Hours</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCourses.map((course) => (
                  <tr key={course.course_id}>
                    <td>
                      <span className="course-code">{course.course_code}</span>
                    </td>
                    <td>
                      <span className="course-name">{course.course_name}</span>
                    </td>
                    <td>{course.department?.department_name || "N/A"}</td>
                    <td>{course.credit_hours}</td>
                    <td>
                      <span
                        className={`course-type-badge ${
                          course.is_elective
                            ? "course-type-badge--elective"
                            : "course-type-badge--core"
                        }`}
                      >
                        {course.is_elective ? "Elective" : "Core"}
                      </span>
                    </td>
                    <td>
                      L:{course.lecture_hours || 0} Lab:{course.lab_hours || 0}
                    </td>
                    <td>
                      <span
                        className={`course-status-badge ${
                          course.is_active !== false
                            ? "course-status-badge--active"
                            : "course-status-badge--inactive"
                        }`}
                      >
                        {course.is_active !== false ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      <div className="course-actions">
                        <button
                          onClick={() => openDetailsModal(course)}
                          title="View"
                          className="course-action-btn course-action-btn--view"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => openEditModal(course)}
                          title="Edit"
                          className="course-action-btn course-action-btn--edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => toggleCourseStatus(course)}
                          title={
                            course.is_active !== false
                              ? "Deactivate"
                              : "Activate"
                          }
                          className={`course-action-btn ${
                            course.is_active !== false
                              ? "course-action-btn--toggle-inactive"
                              : "course-action-btn--toggle-active"
                          }`}
                        >
                          {course.is_active !== false ? (
                            <ToggleRight size={16} />
                          ) : (
                            <ToggleLeft size={16} />
                          )}
                        </button>
                        <button
                          onClick={() => handleDeleteCourse(course.course_id)}
                          title="Delete"
                          className="course-action-btn course-action-btn--delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showCreateModal && (
          <Modal
            onClose={() => {
              setShowCreateModal(false);
              resetForm();
            }}
          >
            <h2 className="course-modal__title">Create New Course</h2>
            <form onSubmit={handleCreateCourse}>
              <CourseForm
                formData={formData}
                setFormData={setFormData}
                departments={departments}
              />
              <div className="course-modal__actions">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    resetForm();
                  }}
                  className="course-modal__btn course-modal__btn--secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="course-modal__btn course-modal__btn--primary"
                >
                  Create Course
                </button>
              </div>
            </form>
          </Modal>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showEditModal && (
          <Modal
            onClose={() => {
              setShowEditModal(false);
              resetForm();
            }}
          >
            <h2 className="course-modal__title">Edit Course</h2>
            <form onSubmit={handleEditCourse}>
              <CourseForm
                formData={formData}
                setFormData={setFormData}
                departments={departments}
              />
              <div className="course-modal__actions">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    resetForm();
                  }}
                  className="course-modal__btn course-modal__btn--secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="course-modal__btn course-modal__btn--primary"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </Modal>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDetailsModal && selectedCourse && (
          <Modal onClose={() => setShowDetailsModal(false)}>
            <h2 className="course-modal__title">Course Details</h2>
            <div>
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
            <div className="course-modal__actions">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="course-modal__btn course-modal__btn--primary"
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

function StatCard({ title, value, icon, color }) {
  return (
    <motion.div whileHover={{ scale: 1.02 }} className="course-stat-card">
      <div className="course-stat-card__content">
        <p className="course-stat-card__title">{title}</p>
        <p className="course-stat-card__value">{value}</p>
      </div>
      <div className="course-stat-card__icon" style={{ color }}>
        {icon}
      </div>
    </motion.div>
  );
}

function CourseForm({ formData, setFormData, departments }) {
  return (
    <div className="course-form">
      <div className="course-form__row">
        <div className="course-form__group">
          <label className="course-form__label">Course Code *</label>
          <input
            type="text"
            required
            value={formData.course_code}
            onChange={(e) =>
              setFormData({ ...formData, course_code: e.target.value })
            }
            className="course-form__input"
          />
        </div>
        <div className="course-form__group">
          <label className="course-form__label">Credit Hours *</label>
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
            className="course-form__input"
          />
        </div>
      </div>

      <div className="course-form__group">
        <label className="course-form__label">Course Name *</label>
        <input
          type="text"
          required
          value={formData.course_name}
          onChange={(e) =>
            setFormData({ ...formData, course_name: e.target.value })
          }
          className="course-form__input"
        />
      </div>

      <div className="course-form__group">
        <label className="course-form__label">Department *</label>
        <select
          required
          value={formData.department_id}
          onChange={(e) =>
            setFormData({ ...formData, department_id: e.target.value })
          }
          className="course-form__select"
        >
          <option value="">Select Department</option>
          {departments.map((dept) => (
            <option key={dept.id} value={dept.id}>
              {dept.name}
            </option>
          ))}
        </select>
      </div>

      <div className="course-form__row">
        <div className="course-form__group">
          <label className="course-form__label">Lecture Hours</label>
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
            className="course-form__input"
          />
        </div>
        <div className="course-form__group">
          <label className="course-form__label">Lab Hours</label>
          <input
            type="number"
            min="0"
            max="10"
            value={formData.lab_hours}
            onChange={(e) =>
              setFormData({ ...formData, lab_hours: parseInt(e.target.value) })
            }
            className="course-form__input"
          />
        </div>
      </div>

      <div className="course-form__group">
        <label className="course-form__label">Description</label>
        <textarea
          rows="4"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="course-form__textarea"
        />
      </div>

      <div className="course-form__group">
        <label className="course-form__label">Prerequisites</label>
        <textarea
          rows="2"
          value={formData.prerequisites}
          onChange={(e) =>
            setFormData({ ...formData, prerequisites: e.target.value })
          }
          className="course-form__textarea"
        />
      </div>

      <div className="course-form__group">
        <label className="course-form__label">Learning Outcomes</label>
        <textarea
          rows="3"
          value={formData.learning_outcomes}
          onChange={(e) =>
            setFormData({ ...formData, learning_outcomes: e.target.value })
          }
          className="course-form__textarea"
        />
      </div>

      <div className="course-form__checkbox-group">
        <div className="course-form__checkbox-item">
          <input
            type="checkbox"
            id="is_elective"
            checked={formData.is_elective}
            onChange={(e) =>
              setFormData({ ...formData, is_elective: e.target.checked })
            }
            className="course-form__checkbox"
          />
          <label htmlFor="is_elective" className="course-form__checkbox-label">
            Elective Course
          </label>
        </div>
        <div className="course-form__checkbox-item">
          <input
            type="checkbox"
            id="is_active"
            checked={formData.is_active}
            onChange={(e) =>
              setFormData({ ...formData, is_active: e.target.checked })
            }
            className="course-form__checkbox"
          />
          <label htmlFor="is_active" className="course-form__checkbox-label">
            Course is active
          </label>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="course-detail-row">
      <span className="course-detail-row__label">{label}:</span>
      <span className="course-detail-row__value">{value}</span>
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
      className="course-modal-overlay"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="course-modal"
      >
        <div className="course-modal__content">{children}</div>
      </motion.div>
    </motion.div>
  );
}
