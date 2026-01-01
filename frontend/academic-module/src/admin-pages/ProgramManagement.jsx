import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Static data for testing
const STATIC_PROGRAMS = [
  {
    program_id: 1,
    program_code: "BSC-CS",
    program_name: "Bachelor of Science in Computer Science",
    program_type: "undergraduate",
    duration_years: 4,
    total_credits: 120,
    department: {
      department_id: 1,
      department_name: "Computer Science",
      faculty: { faculty_name: "Faculty of Science & Technology" },
    },
    description:
      "Comprehensive program covering fundamental and advanced topics in computer science.",
    admission_requirements: "High school diploma with mathematics and physics",
    created_at: "2023-01-15",
    is_active: true,
  },
  {
    program_id: 2,
    program_code: "MSC-DS",
    program_name: "Master of Science in Data Science",
    program_type: "postgraduate",
    duration_years: 2,
    total_credits: 60,
    department: {
      department_id: 1,
      department_name: "Computer Science",
      faculty: { faculty_name: "Faculty of Science & Technology" },
    },
    description:
      "Advanced program focusing on data analytics, machine learning, and big data technologies.",
    admission_requirements:
      "Bachelor's degree in Computer Science or related field",
    created_at: "2023-02-20",
    is_active: true,
  },
  {
    program_id: 3,
    program_code: "BSC-EE",
    program_name: "Bachelor of Science in Electrical Engineering",
    program_type: "undergraduate",
    duration_years: 4,
    total_credits: 128,
    department: {
      department_id: 2,
      department_name: "Electrical Engineering",
      faculty: { faculty_name: "Faculty of Engineering" },
    },
    description:
      "Program covering circuits, electronics, power systems, and telecommunications.",
    admission_requirements:
      "High school diploma with strong mathematics and physics background",
    created_at: "2023-01-10",
    is_active: true,
  },
  {
    program_id: 4,
    program_code: "MBA",
    program_name: "Master of Business Administration",
    program_type: "postgraduate",
    duration_years: 2,
    total_credits: 48,
    department: {
      department_id: 3,
      department_name: "Business Administration",
      faculty: { faculty_name: "Faculty of Business & Economics" },
    },
    description:
      "Executive MBA program for working professionals and business leaders.",
    admission_requirements: "Bachelor's degree and 2+ years work experience",
    created_at: "2023-03-05",
    is_active: true,
  },
  {
    program_id: 5,
    program_code: "BSC-ME",
    program_name: "Bachelor of Science in Mechanical Engineering",
    program_type: "undergraduate",
    duration_years: 4,
    total_credits: 130,
    department: {
      department_id: 4,
      department_name: "Mechanical Engineering",
      faculty: { faculty_name: "Faculty of Engineering" },
    },
    description:
      "Comprehensive mechanical engineering program with hands-on lab experience.",
    admission_requirements: "High school diploma with mathematics and physics",
    created_at: "2023-01-12",
    is_active: false,
  },
  {
    program_id: 6,
    program_code: "PHD-CS",
    program_name: "Doctor of Philosophy in Computer Science",
    program_type: "doctoral",
    duration_years: 4,
    total_credits: 90,
    department: {
      department_id: 1,
      department_name: "Computer Science",
      faculty: { faculty_name: "Faculty of Science & Technology" },
    },
    description: "Research-intensive doctoral program in computer science.",
    admission_requirements: "Master's degree with research experience",
    created_at: "2023-04-10",
    is_active: true,
  },
];

const STATIC_DEPARTMENTS = [
  {
    department_id: 1,
    department_name: "Computer Science",
    faculty_name: "Faculty of Science & Technology",
  },
  {
    department_id: 2,
    department_name: "Electrical Engineering",
    faculty_name: "Faculty of Engineering",
  },
  {
    department_id: 3,
    department_name: "Business Administration",
    faculty_name: "Faculty of Business & Economics",
  },
  {
    department_id: 4,
    department_name: "Mechanical Engineering",
    faculty_name: "Faculty of Engineering",
  },
  {
    department_id: 5,
    department_name: "Mathematics",
    faculty_name: "Faculty of Science & Technology",
  },
];

const PROGRAM_TYPES = [
  "undergraduate",
  "postgraduate",
  "doctoral",
  "certificate",
  "diploma",
];

export default function ProgramManagement() {
  const [programs, setPrograms] = useState(STATIC_PROGRAMS);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

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
      program.department.department_id === parseInt(filterDepartment);
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && program.is_active) ||
      (filterStatus === "inactive" && !program.is_active);

    return matchesSearch && matchesType && matchesDepartment && matchesStatus;
  });

  const handleCreateProgram = (e) => {
    e.preventDefault();
    const newProgram = {
      program_id: Math.max(...programs.map((p) => p.program_id)) + 1,
      ...formData,
      department: STATIC_DEPARTMENTS.find(
        (d) => d.department_id === parseInt(formData.department_id)
      ),
      created_at: new Date().toISOString().split("T")[0],
    };
    setPrograms([...programs, newProgram]);
    setShowCreateModal(false);
    resetForm();
  };

  const handleEditProgram = (e) => {
    e.preventDefault();
    setPrograms(
      programs.map((p) =>
        p.program_id === selectedProgram.program_id
          ? {
              ...p,
              ...formData,
              department: STATIC_DEPARTMENTS.find(
                (d) => d.department_id === parseInt(formData.department_id)
              ),
            }
          : p
      )
    );
    setShowEditModal(false);
    resetForm();
  };

  const handleDeleteProgram = (programId) => {
    if (window.confirm("Are you sure you want to delete this program?")) {
      setPrograms(programs.filter((p) => p.program_id !== programId));
    }
  };

  const toggleProgramStatus = (programId) => {
    setPrograms(
      programs.map((p) =>
        p.program_id === programId ? { ...p, is_active: !p.is_active } : p
      )
    );
  };

  const openEditModal = (program) => {
    setSelectedProgram(program);
    setFormData({
      program_code: program.program_code,
      program_name: program.program_name,
      program_type: program.program_type,
      duration_years: program.duration_years,
      total_credits: program.total_credits,
      department_id: program.department.department_id,
      description: program.description,
      admission_requirements: program.admission_requirements,
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ padding: "24px" }}
    >
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
              {STATIC_DEPARTMENTS.map((dept) => (
                <option key={dept.department_id} value={dept.department_id}>
                  {dept.department_name}
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
                    {program.department.department_name}
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
                        onClick={() => toggleProgramStatus(program.program_id)}
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
                        onClick={() => handleDeleteProgram(program.program_id)}
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
                departments={STATIC_DEPARTMENTS}
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
                departments={STATIC_DEPARTMENTS}
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
                value={selectedProgram.department.department_name}
              />
              <DetailRow
                label="Faculty"
                value={selectedProgram.department.faculty.faculty_name}
              />
              <DetailRow
                label="Description"
                value={selectedProgram.description}
              />
              <DetailRow
                label="Admission Requirements"
                value={selectedProgram.admission_requirements}
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
                value={new Date(
                  selectedProgram.created_at
                ).toLocaleDateString()}
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

function ProgramForm({ formData, setFormData, departments }) {
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
            {PROGRAM_TYPES.map((type) => (
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
            <option key={dept.department_id} value={dept.department_id}>
              {dept.department_name}
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
