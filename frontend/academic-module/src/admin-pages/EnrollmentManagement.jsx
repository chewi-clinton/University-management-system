import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ClipboardList,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  Check,
  X,
  RefreshCw,
} from "lucide-react";
import { adminService } from "../services/api/adminService";

export default function EnrollmentManagement() {
  const [enrollments, setEnrollments] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterSemester, setFilterSemester] = useState("all");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [confirmingId, setConfirmingId] = useState(null);

  // Load initial data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [enrollmentsRes, semestersRes] = await Promise.all([
        adminService.getEnrollments(),
        adminService.getSemesters(),
      ]);

      if (enrollmentsRes.success) {
        setEnrollments(enrollmentsRes.data);
      } else {
        setError(enrollmentsRes.error);
      }

      if (semestersRes.success) {
        setSemesters(semestersRes.data);
      } else {
        setError(semestersRes.error);
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
    total: enrollments.length,
    confirmed: enrollments.filter((e) => e.status === "confirmed").length,
    pending: enrollments.filter((e) => e.status === "pending").length,
    rejected: enrollments.filter((e) => e.status === "rejected").length,
  };

  // Filter enrollments
  const filteredEnrollments = enrollments.filter((enrollment) => {
    const studentName = enrollment.student
      ? `${enrollment.student.first_name || ""} ${
          enrollment.student.last_name || ""
        }`.toLowerCase()
      : "";
    const enrollmentNumber = (enrollment.enrollment_number || "").toLowerCase();
    const matchesSearch =
      studentName.includes(searchTerm.toLowerCase()) ||
      enrollmentNumber.includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || enrollment.status === filterStatus;
    const matchesSemester =
      filterSemester === "all" ||
      enrollment.semester?.semester_id === parseInt(filterSemester);

    return matchesSearch && matchesStatus && matchesSemester;
  });

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleConfirmEnrollment = async (enrollmentId) => {
    setError(null);
    setConfirmingId(enrollmentId);

    try {
      const result = await adminService.confirmEnrollment(enrollmentId);

      if (result.success) {
        showSuccess("Enrollment confirmed successfully");
        await loadData();
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("Failed to confirm enrollment");
      console.error(err);
    } finally {
      setConfirmingId(null);
    }
  };

  const openDetailsModal = (enrollment) => {
    setSelectedEnrollment(enrollment);
    setShowDetailsModal(true);
  };

  const getStatusColor = (status) => {
    const colors = {
      confirmed: "#10b981",
      pending: "#f59e0b",
      rejected: "#ef4444",
      cancelled: "#6b7280",
    };
    return colors[status] || "#6b7280";
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle size={16} />;
      case "pending":
        return <Clock size={16} />;
      case "rejected":
        return <XCircle size={16} />;
      default:
        return <ClipboardList size={16} />;
    }
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
          <p style={{ color: "#6b7280" }}>Loading enrollments...</p>
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
            Enrollment Management
          </h1>
          <p style={{ color: "#6b7280", fontSize: "16px" }}>
            Manage student enrollments and course registrations
          </p>
        </div>
        <button
          onClick={loadData}
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
          <RefreshCw size={18} /> Refresh
        </button>
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
          title="Total Enrollments"
          value={stats.total}
          icon={<ClipboardList size={24} />}
          color="#3b82f6"
        />
        <StatCard
          title="Confirmed"
          value={stats.confirmed}
          icon={<CheckCircle size={24} />}
          color="#10b981"
        />
        <StatCard
          title="Pending"
          value={stats.pending}
          icon={<Clock size={24} />}
          color="#f59e0b"
        />
        <StatCard
          title="Rejected"
          value={stats.rejected}
          icon={<XCircle size={24} />}
          color="#ef4444"
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
              Search Enrollments
            </label>
            <input
              type="text"
              placeholder="Search by student name or enrollment #..."
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
              Semester
            </label>
            <select
              value={filterSemester}
              onChange={(e) => setFilterSemester(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                fontSize: "14px",
              }}
            >
              <option value="all">All Semesters</option>
              {semesters.map((sem) => (
                <option key={sem.semester_id} value={sem.semester_id}>
                  {sem.semester_name || `Semester ${sem.semester_number}`} -{" "}
                  {sem.session?.academic_year}
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
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="rejected">Rejected</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Enrollments Table */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          overflow: "hidden",
        }}
      >
        {filteredEnrollments.length === 0 ? (
          <div
            style={{
              padding: "60px 20px",
              textAlign: "center",
              color: "#6b7280",
            }}
          >
            <p style={{ fontSize: "18px", marginBottom: "8px" }}>
              No enrollments found
            </p>
            <p style={{ fontSize: "14px" }}>
              {searchTerm || filterStatus !== "all" || filterSemester !== "all"
                ? "Try adjusting your filters"
                : "No enrollment records available"}
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
                    "Enrollment #",
                    "Student",
                    "Program",
                    "Semester",
                    "Status",
                    "Date",
                    "Confirmed By",
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
                {filteredEnrollments.map((enrollment) => (
                  <tr
                    key={enrollment.enrollment_id}
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
                      {enrollment.enrollment_number ||
                        `ENR-${enrollment.enrollment_id}`}
                    </td>
                    <td
                      style={{
                        padding: "16px",
                        fontSize: "14px",
                        color: "#111827",
                      }}
                    >
                      {enrollment.student
                        ? `${enrollment.student.first_name || ""} ${
                            enrollment.student.last_name || ""
                          }`.trim() || "N/A"
                        : "N/A"}
                    </td>
                    <td
                      style={{
                        padding: "16px",
                        fontSize: "14px",
                        color: "#6b7280",
                      }}
                    >
                      {enrollment.student?.program?.program_name || "N/A"}
                    </td>
                    <td
                      style={{
                        padding: "16px",
                        fontSize: "14px",
                        color: "#6b7280",
                      }}
                    >
                      {enrollment.semester?.semester_name ||
                        `Semester ${
                          enrollment.semester?.semester_number || "N/A"
                        }`}
                    </td>
                    <td style={{ padding: "16px" }}>
                      <span
                        style={{
                          padding: "4px 12px",
                          borderRadius: "12px",
                          fontSize: "12px",
                          fontWeight: "500",
                          backgroundColor: `${getStatusColor(
                            enrollment.status
                          )}20`,
                          color: getStatusColor(enrollment.status),
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        {getStatusIcon(enrollment.status)}
                        {enrollment.status?.charAt(0).toUpperCase() +
                          enrollment.status?.slice(1) || "Unknown"}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "16px",
                        fontSize: "14px",
                        color: "#6b7280",
                      }}
                    >
                      {enrollment.enrollment_date
                        ? new Date(
                            enrollment.enrollment_date
                          ).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td
                      style={{
                        padding: "16px",
                        fontSize: "14px",
                        color: "#6b7280",
                      }}
                    >
                      {enrollment.confirmed_by_admin
                        ? `${
                            enrollment.confirmed_by_admin.user?.first_name || ""
                          } ${
                            enrollment.confirmed_by_admin.user?.last_name || ""
                          }`.trim()
                        : "-"}
                    </td>
                    <td style={{ padding: "16px" }}>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <ActionButton
                          onClick={() => openDetailsModal(enrollment)}
                          title="View Details"
                          color="#3b82f6"
                        >
                          <Eye size={16} />
                        </ActionButton>
                        {enrollment.status === "pending" && (
                          <ActionButton
                            onClick={() =>
                              handleConfirmEnrollment(enrollment.enrollment_id)
                            }
                            title="Confirm Enrollment"
                            color="#10b981"
                            disabled={confirmingId === enrollment.enrollment_id}
                          >
                            {confirmingId === enrollment.enrollment_id ? (
                              <RefreshCw
                                size={16}
                                style={{ animation: "spin 1s linear infinite" }}
                              />
                            ) : (
                              <Check size={16} />
                            )}
                          </ActionButton>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Details Modal */}
      <AnimatePresence>
        {showDetailsModal && selectedEnrollment && (
          <Modal onClose={() => setShowDetailsModal(false)}>
            <h2
              style={{
                fontSize: "24px",
                fontWeight: "700",
                marginBottom: "24px",
              }}
            >
              Enrollment Details
            </h2>
            <div style={{ display: "grid", gap: "16px" }}>
              <DetailRow
                label="Enrollment Number"
                value={
                  selectedEnrollment.enrollment_number ||
                  `ENR-${selectedEnrollment.enrollment_id}`
                }
              />
              <DetailRow
                label="Student"
                value={
                  selectedEnrollment.student
                    ? `${selectedEnrollment.student.first_name || ""} ${
                        selectedEnrollment.student.last_name || ""
                      }`.trim()
                    : "N/A"
                }
              />
              <DetailRow
                label="University Reg #"
                value={
                  selectedEnrollment.student?.university_reg_number || "N/A"
                }
              />
              <DetailRow
                label="Program"
                value={
                  selectedEnrollment.student?.program?.program_name || "N/A"
                }
              />
              <DetailRow
                label="Semester"
                value={
                  selectedEnrollment.semester?.semester_name ||
                  `Semester ${
                    selectedEnrollment.semester?.semester_number || "N/A"
                  }`
                }
              />
              <DetailRow
                label="Academic Year"
                value={
                  selectedEnrollment.semester?.session?.academic_year || "N/A"
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
                      backgroundColor: `${getStatusColor(
                        selectedEnrollment.status
                      )}20`,
                      color: getStatusColor(selectedEnrollment.status),
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    {getStatusIcon(selectedEnrollment.status)}
                    {selectedEnrollment.status?.charAt(0).toUpperCase() +
                      selectedEnrollment.status?.slice(1)}
                  </span>
                }
              />
              <DetailRow
                label="Enrollment Date"
                value={
                  selectedEnrollment.enrollment_date
                    ? new Date(
                        selectedEnrollment.enrollment_date
                      ).toLocaleDateString()
                    : "N/A"
                }
              />
              {selectedEnrollment.confirmed_by_admin && (
                <>
                  <DetailRow
                    label="Confirmed By"
                    value={`${
                      selectedEnrollment.confirmed_by_admin.user?.first_name ||
                      ""
                    } ${
                      selectedEnrollment.confirmed_by_admin.user?.last_name ||
                      ""
                    }`.trim()}
                  />
                  <DetailRow
                    label="Confirmed At"
                    value={
                      selectedEnrollment.confirmed_at
                        ? new Date(
                            selectedEnrollment.confirmed_at
                          ).toLocaleString()
                        : "N/A"
                    }
                  />
                </>
              )}
              <DetailRow
                label="Payment Status"
                value={selectedEnrollment.payment_status || "Not specified"}
              />
              <DetailRow
                label="Remarks"
                value={selectedEnrollment.remarks || "No remarks"}
              />
            </div>
            <div
              style={{
                marginTop: "24px",
                display: "flex",
                gap: "12px",
                justifyContent: "flex-end",
              }}
            >
              {selectedEnrollment.status === "pending" && (
                <button
                  onClick={() => {
                    handleConfirmEnrollment(selectedEnrollment.enrollment_id);
                    setShowDetailsModal(false);
                  }}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#10b981",
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
                  <Check size={18} /> Confirm Enrollment
                </button>
              )}
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

function ActionButton({ onClick, title, color, disabled, children }) {
  return (
    <button
      onClick={onClick}
      title={title}
      disabled={disabled}
      style={{
        padding: "6px 12px",
        backgroundColor: disabled ? "#d1d5db" : color,
        color: "white",
        border: "none",
        borderRadius: "6px",
        fontSize: "12px",
        cursor: disabled ? "not-allowed" : "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: disabled ? 0.6 : 1,
      }}
    >
      {children}
    </button>
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
