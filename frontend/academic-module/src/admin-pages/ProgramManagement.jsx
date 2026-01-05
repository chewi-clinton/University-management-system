import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  CheckCircle,
  GraduationCap,
  ScrollText,
  Microscope,
  Plus,
  Search,
  Eye,
  Edit,
  Play,
  Pause,
  Trash2,
  X,
  AlertCircle,
} from "lucide-react";
import { adminService } from "../services/api/adminService";
import "../styles/admin-pages/program-management.css";

export default function ProgramManagement() {
  const [programs, setPrograms] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const [formData, setFormData] = useState({
    program_code: "",
    program_name: "",
    program_type: "undergraduate",
    duration_years: 4,
    total_credits: 120,
    department_id: "",
    description: "",
    admission_requirements: "",
    is_active: true,
  });

  const PROGRAM_TYPES = [
    "undergraduate",
    "postgraduate",
    "doctoral",
    "certificate",
    "diploma",
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [programsRes, departmentsRes] = await Promise.all([
        adminService.getPrograms(),
        adminService.getDepartments(),
      ]);

      if (programsRes.success) {
        setPrograms(programsRes.data);
      } else {
        setError(programsRes.error);
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
    total: programs.length,
    active: programs.filter((p) => p.is_active).length,
    undergraduate: programs.filter((p) => p.program_type === "undergraduate")
      .length,
    postgraduate: programs.filter((p) => p.program_type === "postgraduate")
      .length,
    doctoral: programs.filter((p) => p.program_type === "doctoral").length,
  };

  const filteredPrograms = programs.filter((program) => {
    const matchesSearch =
      program.program_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      program.program_code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType =
      filterType === "all" || program.program_type === filterType;
    const matchesDepartment =
      filterDepartment === "all" ||
      program.department?.department_id === parseInt(filterDepartment);
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && program.is_active) ||
      (filterStatus === "inactive" && !program.is_active);

    return matchesSearch && matchesType && matchesDepartment && matchesStatus;
  });

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleCreateProgram = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const result = await adminService.createProgram(formData);

      if (result.success) {
        showSuccess("Program created successfully");
        setShowCreateModal(false);
        resetForm();
        await loadData();
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("Failed to create program");
      console.error(err);
    }
  };

  const handleEditProgram = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const result = await adminService.updateProgram(
        selectedProgram.program_id,
        formData
      );

      if (result.success) {
        showSuccess("Program updated successfully");
        setShowEditModal(false);
        resetForm();
        await loadData();
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("Failed to update program");
      console.error(err);
    }
  };

  const handleDeleteProgram = async (programId) => {
    if (window.confirm("Are you sure you want to delete this program?")) {
      setError(null);

      try {
        const result = await adminService.deleteProgram(programId);

        if (result.success) {
          showSuccess("Program deleted successfully");
          await loadData();
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError("Failed to delete program");
        console.error(err);
      }
    }
  };

  const toggleProgramStatus = async (program) => {
    setError(null);

    try {
      const result = await adminService.updateProgram(program.program_id, {
        is_active: !program.is_active,
      });

      if (result.success) {
        showSuccess(
          `Program ${result.data.is_active ? "activated" : "deactivated"}`
        );
        await loadData();
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("Failed to update program status");
      console.error(err);
    }
  };

  const openEditModal = (program) => {
    setSelectedProgram(program);
    setFormData({
      program_code: program.program_code,
      program_name: program.program_name,
      program_type: program.program_type,
      duration_years: program.duration_years,
      total_credits: program.total_credits,
      department_id: program.department?.department_id || "",
      description: program.description || "",
      admission_requirements: program.admission_requirements || "",
      is_active: program.is_active,
    });
    setShowEditModal(true);
  };

  const openDetailsModal = (program) => {
    setSelectedProgram(program);
    setShowDetailsModal(true);
  };

  const resetForm = () => {
    setFormData({
      program_code: "",
      program_name: "",
      program_type: "undergraduate",
      duration_years: 4,
      total_credits: 120,
      department_id: "",
      description: "",
      admission_requirements: "",
      is_active: true,
    });
    setSelectedProgram(null);
    setError(null);
  };

  const getProgramTypeColor = (type) => {
    const colors = {
      undergraduate: "#3b82f6",
      postgraduate: "#8b5cf6",
      doctoral: "#ec4899",
      certificate: "#f59e0b",
      diploma: "#10b981",
    };
    return colors[type] || "#6b7280";
  };

  if (loading) {
    return (
      <div className="program-loading">
        <div className="program-loading__spinner" />
        <p className="program-loading__text">Loading programs...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="program-management"
    >
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="program-management__success"
          >
            <CheckCircle size={20} style={{ marginRight: "8px" }} />
            {successMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <div className="program-management__error">
          <AlertCircle size={18} style={{ marginRight: "8px" }} />
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="program-management__error-close"
          >
            <X size={18} />
          </button>
        </div>
      )}

      <div className="program-management__header">
        <h1>Program Management</h1>
        <p>Manage academic programs and degree offerings</p>
      </div>

      <div className="program-management__stats">
        <StatCard
          title="Total Programs"
          value={stats.total}
          icon={<BookOpen size={28} />}
          color="#3b82f6"
        />
        <StatCard
          title="Active Programs"
          value={stats.active}
          icon={<CheckCircle size={28} />}
          color="#10b981"
        />
        <StatCard
          title="Undergraduate"
          value={stats.undergraduate}
          icon={<GraduationCap size={28} />}
          color="#f59e0b"
        />
        <StatCard
          title="Postgraduate"
          value={stats.postgraduate}
          icon={<ScrollText size={28} />}
          color="#8b5cf6"
        />
        <StatCard
          title="Doctoral"
          value={stats.doctoral}
          icon={<Microscope size={28} />}
          color="#ec4899"
        />
      </div>

      <div className="program-management__filters">
        <div className="program-management__filters-grid">
          <div className="program-management__filter-group">
            <label className="program-management__filter-label">
              Search Programs
            </label>
            <div className="program-management__search-wrapper">
              <Search size={18} className="program-management__search-icon" />
              <input
                type="text"
                placeholder="Search by name or code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="program-management__filter-input"
              />
            </div>
          </div>

          <div className="program-management__filter-group">
            <label className="program-management__filter-label">
              Program Type
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="program-management__filter-select"
            >
              <option value="all">All Types</option>
              {PROGRAM_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="program-management__filter-group">
            <label className="program-management__filter-label">
              Department
            </label>
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="program-management__filter-select"
            >
              <option value="all">All Departments</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          <div className="program-management__filter-group">
            <label className="program-management__filter-label">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="program-management__filter-select"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="program-management__filters-actions">
          <button
            onClick={() => setShowCreateModal(true)}
            className="program-management__create-btn"
          >
            <Plus size={20} style={{ marginRight: "8px" }} />
            Create New Program
          </button>
        </div>
      </div>

      <div className="program-management__table-container">
        {filteredPrograms.length === 0 ? (
          <div className="program-management__empty">
            <p className="program-management__empty-title">No programs found</p>
            <p className="program-management__empty-text">
              {searchTerm || filterType !== "all" || filterDepartment !== "all"
                ? "Try adjusting your filters"
                : "Create your first program to get started"}
            </p>
          </div>
        ) : (
          <div className="program-management__table-wrapper">
            <table className="program-management__table">
              <thead>
                <tr>
                  <th>Program Code</th>
                  <th>Program Name</th>
                  <th>Type</th>
                  <th>Department</th>
                  <th>Duration</th>
                  <th>Credits</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPrograms.map((program) => (
                  <tr key={program.program_id}>
                    <td>
                      <span className="program-code">
                        {program.program_code}
                      </span>
                    </td>
                    <td>
                      <span className="program-name">
                        {program.program_name}
                      </span>
                    </td>
                    <td>
                      <span
                        className="program-type-badge"
                        style={{
                          backgroundColor: `${getProgramTypeColor(
                            program.program_type
                          )}20`,
                          color: getProgramTypeColor(program.program_type),
                          borderColor: `${getProgramTypeColor(
                            program.program_type
                          )}40`,
                        }}
                      >
                        {program.program_type.charAt(0).toUpperCase() +
                          program.program_type.slice(1)}
                      </span>
                    </td>
                    <td>{program.department?.department_name || "N/A"}</td>
                    <td>{program.duration_years} years</td>
                    <td>{program.total_credits}</td>
                    <td>
                      <span
                        className={`program-status-badge program-status-badge--${
                          program.is_active ? "active" : "inactive"
                        }`}
                      >
                        {program.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      <div className="program-actions">
                        <button
                          onClick={() => openDetailsModal(program)}
                          className="program-action-btn program-action-btn--view"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => openEditModal(program)}
                          className="program-action-btn program-action-btn--edit"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => toggleProgramStatus(program)}
                          className={`program-action-btn ${
                            program.is_active
                              ? "program-action-btn--toggle-inactive"
                              : "program-action-btn--toggle-active"
                          }`}
                          title={program.is_active ? "Deactivate" : "Activate"}
                        >
                          {program.is_active ? (
                            <Pause size={18} />
                          ) : (
                            <Play size={18} />
                          )}
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteProgram(program.program_id)
                          }
                          className="program-action-btn program-action-btn--delete"
                          title="Delete"
                        >
                          <Trash2 size={18} />
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
            <h2 className="program-modal__title">Create New Program</h2>
            <form onSubmit={handleCreateProgram}>
              <ProgramForm
                formData={formData}
                setFormData={setFormData}
                departments={departments}
                programTypes={PROGRAM_TYPES}
              />
              <div className="program-modal__actions">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    resetForm();
                  }}
                  className="program-modal__btn program-modal__btn--secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="program-modal__btn program-modal__btn--primary"
                >
                  Create Program
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
            <h2 className="program-modal__title">Edit Program</h2>
            <form onSubmit={handleEditProgram}>
              <ProgramForm
                formData={formData}
                setFormData={setFormData}
                departments={departments}
                programTypes={PROGRAM_TYPES}
              />
              <div className="program-modal__actions">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    resetForm();
                  }}
                  className="program-modal__btn program-modal__btn--secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="program-modal__btn program-modal__btn--primary"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </Modal>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDetailsModal && selectedProgram && (
          <Modal onClose={() => setShowDetailsModal(false)}>
            <h2 className="program-modal__title">Program Details</h2>
            <div>
              <DetailRow
                label="Program Code"
                value={selectedProgram.program_code}
              />
              <DetailRow
                label="Program Name"
                value={selectedProgram.program_name}
              />
              <DetailRow
                label="Program Type"
                value={
                  <span
                    className="program-type-badge"
                    style={{
                      backgroundColor: `${getProgramTypeColor(
                        selectedProgram.program_type
                      )}20`,
                      color: getProgramTypeColor(selectedProgram.program_type),
                      borderColor: `${getProgramTypeColor(
                        selectedProgram.program_type
                      )}40`,
                    }}
                  >
                    {selectedProgram.program_type.charAt(0).toUpperCase() +
                      selectedProgram.program_type.slice(1)}
                  </span>
                }
              />
              <DetailRow
                label="Duration"
                value={`${selectedProgram.duration_years} years`}
              />
              <DetailRow
                label="Total Credits"
                value={selectedProgram.total_credits}
              />
              <DetailRow
                label="Department"
                value={selectedProgram.department?.department_name || "N/A"}
              />
              <DetailRow
                label="Faculty"
                value={
                  selectedProgram.department?.faculty?.faculty_name || "N/A"
                }
              />
              <DetailRow
                label="Description"
                value={selectedProgram.description || "No description"}
              />
              <DetailRow
                label="Admission Requirements"
                value={
                  selectedProgram.admission_requirements ||
                  "No requirements specified"
                }
              />
              <DetailRow
                label="Status"
                value={
                  <span
                    className={`program-status-badge program-status-badge--${
                      selectedProgram.is_active ? "active" : "inactive"
                    }`}
                  >
                    {selectedProgram.is_active ? "Active" : "Inactive"}
                  </span>
                }
              />
              <DetailRow
                label="Created Date"
                value={
                  selectedProgram.created_at
                    ? new Date(selectedProgram.created_at).toLocaleDateString()
                    : "N/A"
                }
              />
            </div>
            <div className="program-modal__actions">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="program-modal__btn program-modal__btn--primary"
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
    <motion.div whileHover={{ scale: 1.02 }} className="program-stat-card">
      <div className="program-stat-card__content">
        <p className="program-stat-card__title">{title}</p>
        <p className="program-stat-card__value">{value}</p>
      </div>
      <div className="program-stat-card__icon" style={{ color }}>
        {icon}
      </div>
    </motion.div>
  );
}

function ProgramForm({ formData, setFormData, departments, programTypes }) {
  return (
    <div className="program-form">
      <div className="program-form__row">
        <div className="program-form__group">
          <label className="program-form__label">Program Code *</label>
          <input
            type="text"
            required
            value={formData.program_code}
            onChange={(e) =>
              setFormData({ ...formData, program_code: e.target.value })
            }
            className="program-form__input"
          />
        </div>
        <div className="program-form__group">
          <label className="program-form__label">Program Type *</label>
          <select
            required
            value={formData.program_type}
            onChange={(e) =>
              setFormData({ ...formData, program_type: e.target.value })
            }
            className="program-form__select"
          >
            {programTypes.map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="program-form__group">
        <label className="program-form__label">Program Name *</label>
        <input
          type="text"
          required
          value={formData.program_name}
          onChange={(e) =>
            setFormData({ ...formData, program_name: e.target.value })
          }
          className="program-form__input"
        />
      </div>

      <div className="program-form__group">
        <label className="program-form__label">Department *</label>
        <select
          required
          value={formData.department_id}
          onChange={(e) =>
            setFormData({ ...formData, department_id: e.target.value })
          }
          className="program-form__select"
        >
          <option value="">Select Department</option>
          {departments.map((dept) => (
            <option key={dept.id} value={dept.id}>
              {dept.name}
            </option>
          ))}
        </select>
      </div>

      <div className="program-form__row">
        <div className="program-form__group">
          <label className="program-form__label">Duration (Years) *</label>
          <input
            type="number"
            required
            min="1"
            max="10"
            value={formData.duration_years}
            onChange={(e) =>
              setFormData({
                ...formData,
                duration_years: parseInt(e.target.value),
              })
            }
            className="program-form__input"
          />
        </div>
        <div className="program-form__group">
          <label className="program-form__label">Total Credits *</label>
          <input
            type="number"
            required
            min="1"
            value={formData.total_credits}
            onChange={(e) =>
              setFormData({
                ...formData,
                total_credits: parseInt(e.target.value),
              })
            }
            className="program-form__input"
          />
        </div>
      </div>

      <div className="program-form__group">
        <label className="program-form__label">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          rows="4"
          className="program-form__textarea"
        />
      </div>

      <div className="program-form__group">
        <label className="program-form__label">Admission Requirements</label>
        <textarea
          value={formData.admission_requirements}
          onChange={(e) =>
            setFormData({ ...formData, admission_requirements: e.target.value })
          }
          rows="3"
          className="program-form__textarea"
        />
      </div>

      <div className="program-form__checkbox-group">
        <input
          type="checkbox"
          id="is_active"
          checked={formData.is_active}
          onChange={(e) =>
            setFormData({ ...formData, is_active: e.target.checked })
          }
          className="program-form__checkbox"
        />
        <label htmlFor="is_active" className="program-form__checkbox-label">
          Program is active
        </label>
      </div>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="program-detail-row">
      <span className="program-detail-row__label">{label}:</span>
      <span className="program-detail-row__value">{value}</span>
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
      className="program-modal-overlay"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="program-modal"
      >
        <div className="program-modal__content">{children}</div>
      </motion.div>
    </motion.div>
  );
}
