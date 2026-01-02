import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { adminService } from "../services/api/adminService";

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

  // Form state
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

  // Load initial data
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

  // Statistics
  const stats = {
    total: programs.length,
    active: programs.filter((p) => p.is_active).length,
    undergraduate: programs.filter((p) => p.program_type === "undergraduate")
      .length,
    postgraduate: programs.filter((p) => p.program_type === "postgraduate")
      .length,
    doctoral: programs.filter((p) => p.program_type === "doctoral").length,
  };

  // Filter programs
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
          <p style={{ color: "#6b7280" }}>Loading programs...</p>
        </div>
        <style>
          {`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}
        </style>
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
          Program Management
        </h1>
        <p style={{ color: "#6b7280", fontSize: "16px" }}>
          Manage academic programs and degree offerings
        </p>
      </div>

      {/* Statistics Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px",
          marginBottom: "32px",
        }}
      >
        <StatCard
          title="Total Programs"
          value={stats.total}
          icon="📚"
          color="#3b82f6"
        />
        <StatCard
          title="Active Programs"
          value={stats.active}
          icon="✓"
          color="#10b981"
        />
        <StatCard
          title="Undergraduate"
          value={stats.undergraduate}
          icon="🎓"
          color="#f59e0b"
        />
        <StatCard
          title="Postgraduate"
          value={stats.postgraduate}
          icon="📖"
          color="#8b5cf6"
        />
        <StatCard
          title="Doctoral"
          value={stats.doctoral}
          icon="🔬"
          color="#ec4899"
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
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
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
              Search Programs
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
              Program Type
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                fontSize: "14px",
              }}
            >
              <option value="all">All Types</option>
              {PROGRAM_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
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
            }}
          >
            ➕ Create New Program
          </button>
        </div>
      </div>

      {/* Programs Table */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          overflow: "hidden",
        }}
      >
        {filteredPrograms.length === 0 ? (
          <div
            style={{
              padding: "60px 20px",
              textAlign: "center",
              color: "#6b7280",
            }}
          >
            <p style={{ fontSize: "18px", marginBottom: "8px" }}>
              No programs found
            </p>
            <p style={{ fontSize: "14px" }}>
              {searchTerm || filterType !== "all" || filterDepartment !== "all"
                ? "Try adjusting your filters"
                : "Create your first program to get started"}
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
                  <th
                    style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "#6b7280",
                      textTransform: "uppercase",
                    }}
                  >
                    Program Code
                  </th>
                  <th
                    style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "#6b7280",
                      textTransform: "uppercase",
                    }}
                  >
                    Program Name
                  </th>
                  <th
                    style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "#6b7280",
                      textTransform: "uppercase",
                    }}
                  >
                    Type
                  </th>
                  <th
                    style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "#6b7280",
                      textTransform: "uppercase",
                    }}
                  >
                    Department
                  </th>
                  <th
                    style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "#6b7280",
                      textTransform: "uppercase",
                    }}
                  >
                    Duration
                  </th>
                  <th
                    style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "#6b7280",
                      textTransform: "uppercase",
                    }}
                  >
                    Credits
                  </th>
                  <th
                    style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "#6b7280",
                      textTransform: "uppercase",
                    }}
                  >
                    Status
                  </th>
                  <th
                    style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "#6b7280",
                      textTransform: "uppercase",
                    }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredPrograms.map((program) => (
                  <tr
                    key={program.program_id}
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
                      {program.program_code}
                    </td>
                    <td
                      style={{
                        padding: "16px",
                        fontSize: "14px",
                        color: "#111827",
                      }}
                    >
                      {program.program_name}
                    </td>
                    <td style={{ padding: "16px" }}>
                      <span
                        style={{
                          padding: "4px 12px",
                          borderRadius: "12px",
                          fontSize: "12px",
                          fontWeight: "500",
                          backgroundColor: `${getProgramTypeColor(
                            program.program_type
                          )}20`,
                          color: getProgramTypeColor(program.program_type),
                        }}
                      >
                        {program.program_type.charAt(0).toUpperCase() +
                          program.program_type.slice(1)}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "16px",
                        fontSize: "14px",
                        color: "#6b7280",
                      }}
                    >
                      {program.department?.department_name || "N/A"}
                    </td>
                    <td
                      style={{
                        padding: "16px",
                        fontSize: "14px",
                        color: "#6b7280",
                      }}
                    >
                      {program.duration_years} years
                    </td>
                    <td
                      style={{
                        padding: "16px",
                        fontSize: "14px",
                        color: "#6b7280",
                      }}
                    >
                      {program.total_credits}
                    </td>
                    <td style={{ padding: "16px" }}>
                      <span
                        style={{
                          padding: "4px 12px",
                          borderRadius: "12px",
                          fontSize: "12px",
                          fontWeight: "500",
                          backgroundColor: program.is_active
                            ? "#10b98120"
                            : "#6b728020",
                          color: program.is_active ? "#10b981" : "#6b7280",
                        }}
                      >
                        {program.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td style={{ padding: "16px" }}>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          onClick={() => openDetailsModal(program)}
                          style={{
                            padding: "6px 12px",
                            backgroundColor: "#3b82f6",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            fontSize: "12px",
                            cursor: "pointer",
                          }}
                          title="View Details"
                        >
                          👁️
                        </button>
                        <button
                          onClick={() => openEditModal(program)}
                          style={{
                            padding: "6px 12px",
                            backgroundColor: "#f59e0b",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            fontSize: "12px",
                            cursor: "pointer",
                          }}
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => toggleProgramStatus(program)}
                          style={{
                            padding: "6px 12px",
                            backgroundColor: program.is_active
                              ? "#6b7280"
                              : "#10b981",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            fontSize: "12px",
                            cursor: "pointer",
                          }}
                          title={program.is_active ? "Deactivate" : "Activate"}
                        >
                          {program.is_active ? "⏸️" : "▶️"}
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteProgram(program.program_id)
                          }
                          style={{
                            padding: "6px 12px",
                            backgroundColor: "#dc2626",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            fontSize: "12px",
                            cursor: "pointer",
                          }}
                          title="Delete"
                        >
                          🗑️
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
              Create New Program
            </h2>
            <form onSubmit={handleCreateProgram}>
              <ProgramForm
                formData={formData}
                setFormData={setFormData}
                departments={departments}
                programTypes={PROGRAM_TYPES}
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
                  Create Program
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
              Edit Program
            </h2>
            <form onSubmit={handleEditProgram}>
              <ProgramForm
                formData={formData}
                setFormData={setFormData}
                departments={departments}
                programTypes={PROGRAM_TYPES}
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
        {showDetailsModal && selectedProgram && (
          <Modal onClose={() => setShowDetailsModal(false)}>
            <h2
              style={{
                fontSize: "24px",
                fontWeight: "700",
                marginBottom: "24px",
              }}
            >
              Program Details
            </h2>
            <div style={{ display: "grid", gap: "20px" }}>
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
                    style={{
                      padding: "4px 12px",
                      borderRadius: "12px",
                      fontSize: "12px",
                      fontWeight: "500",
                      backgroundColor: `${getProgramTypeColor(
                        selectedProgram.program_type
                      )}20`,
                      color: getProgramTypeColor(selectedProgram.program_type),
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
                    style={{
                      padding: "4px 12px",
                      borderRadius: "12px",
                      fontSize: "12px",
                      fontWeight: "500",
                      backgroundColor: selectedProgram.is_active
                        ? "#10b98120"
                        : "#6b728020",
                      color: selectedProgram.is_active ? "#10b981" : "#6b7280",
                    }}
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
        <div style={{ fontSize: "40px" }}>{icon}</div>
      </div>
    </motion.div>
  );
}

function ProgramForm({ formData, setFormData, departments, programTypes }) {
  return (
    <div style={{ display: "grid", gap: "16px" }}>
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}
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
            Program Code *
          </label>
          <input
            type="text"
            required
            value={formData.program_code}
            onChange={(e) =>
              setFormData({ ...formData, program_code: e.target.value })
            }
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
            Program Type *
          </label>
          <select
            required
            value={formData.program_type}
            onChange={(e) =>
              setFormData({ ...formData, program_type: e.target.value })
            }
            style={{
              width: "100%",
              padding: "10px 12px",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              fontSize: "14px",
            }}
          >
            {programTypes.map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>
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
          Program Name *
        </label>
        <input
          type="text"
          required
          value={formData.program_name}
          onChange={(e) =>
            setFormData({ ...formData, program_name: e.target.value })
          }
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
          Department *
        </label>
        <select
          required
          value={formData.department_id}
          onChange={(e) =>
            setFormData({ ...formData, department_id: e.target.value })
          }
          style={{
            width: "100%",
            padding: "10px 12px",
            border: "1px solid #d1d5db",
            borderRadius: "8px",
            fontSize: "14px",
          }}
        >
          <option value="">Select Department</option>
          {departments.map((dept) => (
            <option key={dept.id} value={dept.id}>
              {dept.name}
            </option>
          ))}
        </select>
      </div>

      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}
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
            Duration (Years) *
          </label>
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
            Total Credits *
          </label>
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
            style={{
              width: "100%",
              padding: "10px 12px",
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
            color: "#374151",
          }}
        >
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          rows="4"
          style={{
            width: "100%",
            padding: "10px 12px",
            border: "1px solid #d1d5db",
            borderRadius: "8px",
            fontSize: "14px",
            fontFamily: "inherit",
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
          Admission Requirements
        </label>
        <textarea
          value={formData.admission_requirements}
          onChange={(e) =>
            setFormData({ ...formData, admission_requirements: e.target.value })
          }
          rows="3"
          style={{
            width: "100%",
            padding: "10px 12px",
            border: "1px solid #d1d5db",
            borderRadius: "8px",
            fontSize: "14px",
            fontFamily: "inherit",
          }}
        />
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
          Program is active
        </label>
      </div>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "200px 1fr",
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
