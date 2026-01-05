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
import "../styles/admin-pages/enrollment-management.css";

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

  const stats = {
    total: enrollments.length,
    confirmed: enrollments.filter((e) => e.status === "confirmed").length,
    pending: enrollments.filter((e) => e.status === "pending").length,
    rejected: enrollments.filter((e) => e.status === "rejected").length,
  };

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
      <div className="enrollment-loading">
        <div className="enrollment-loading__spinner" />
        <p className="enrollment-loading__text">Loading enrollments...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="enrollment-management"
    >
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="enrollment-management__success"
          >
            ✓ {successMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <div className="enrollment-management__error">
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="enrollment-management__error-close"
          >
            ×
          </button>
        </div>
      )}

      <div className="enrollment-management__header">
        <div className="enrollment-management__header-content">
          <h1>Enrollment Management</h1>
          <p>Manage student enrollments and course registrations</p>
        </div>
        <button
          onClick={loadData}
          className="enrollment-management__refresh-btn"
        >
          <RefreshCw size={18} /> Refresh
        </button>
      </div>

      <div className="enrollment-management__stats">
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

      <div className="enrollment-management__filters">
        <div className="enrollment-management__filters-grid">
          <div className="enrollment-management__filter-group">
            <label className="enrollment-management__filter-label">
              Search Enrollments
            </label>
            <input
              type="text"
              placeholder="Search by student name or enrollment #..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="enrollment-management__filter-input"
            />
          </div>

          <div className="enrollment-management__filter-group">
            <label className="enrollment-management__filter-label">
              Semester
            </label>
            <select
              value={filterSemester}
              onChange={(e) => setFilterSemester(e.target.value)}
              className="enrollment-management__filter-select"
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

          <div className="enrollment-management__filter-group">
            <label className="enrollment-management__filter-label">
              Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="enrollment-management__filter-select"
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

      <div className="enrollment-management__table-container">
        {filteredEnrollments.length === 0 ? (
          <div className="enrollment-management__empty">
            <p className="enrollment-management__empty-title">
              No enrollments found
            </p>
            <p className="enrollment-management__empty-text">
              {searchTerm || filterStatus !== "all" || filterSemester !== "all"
                ? "Try adjusting your filters"
                : "No enrollment records available"}
            </p>
          </div>
        ) : (
          <div className="enrollment-management__table-wrapper">
            <table className="enrollment-management__table">
              <thead>
                <tr>
                  <th>Enrollment #</th>
                  <th>Student</th>
                  <th>Program</th>
                  <th>Semester</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Confirmed By</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEnrollments.map((enrollment) => (
                  <tr key={enrollment.enrollment_id}>
                    <td>
                      <span className="enrollment-number">
                        {enrollment.enrollment_number ||
                          `ENR-${enrollment.enrollment_id}`}
                      </span>
                    </td>
                    <td>
                      <span className="enrollment-student-name">
                        {enrollment.student
                          ? `${enrollment.student.first_name || ""} ${
                              enrollment.student.last_name || ""
                            }`.trim() || "N/A"
                          : "N/A"}
                      </span>
                    </td>
                    <td>
                      {enrollment.student?.program?.program_name || "N/A"}
                    </td>
                    <td>
                      {enrollment.semester?.semester_name ||
                        `Semester ${
                          enrollment.semester?.semester_number || "N/A"
                        }`}
                    </td>
                    <td>
                      <span
                        className={`enrollment-status-badge enrollment-status-badge--${enrollment.status}`}
                      >
                        {getStatusIcon(enrollment.status)}
                        {enrollment.status?.charAt(0).toUpperCase() +
                          enrollment.status?.slice(1) || "Unknown"}
                      </span>
                    </td>
                    <td>
                      {enrollment.enrollment_date
                        ? new Date(
                            enrollment.enrollment_date
                          ).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td>
                      {enrollment.confirmed_by_admin
                        ? `${
                            enrollment.confirmed_by_admin.user?.first_name || ""
                          } ${
                            enrollment.confirmed_by_admin.user?.last_name || ""
                          }`.trim()
                        : "-"}
                    </td>
                    <td>
                      <div className="enrollment-actions">
                        <button
                          onClick={() => openDetailsModal(enrollment)}
                          title="View Details"
                          className="enrollment-action-btn enrollment-action-btn--view"
                        >
                          <Eye size={16} />
                        </button>
                        {enrollment.status === "pending" && (
                          <button
                            onClick={() =>
                              handleConfirmEnrollment(enrollment.enrollment_id)
                            }
                            title="Confirm Enrollment"
                            className={`enrollment-action-btn ${
                              confirmingId === enrollment.enrollment_id
                                ? "enrollment-action-btn--disabled"
                                : "enrollment-action-btn--confirm"
                            }`}
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
                          </button>
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

      <AnimatePresence>
        {showDetailsModal && selectedEnrollment && (
          <Modal onClose={() => setShowDetailsModal(false)}>
            <h2 className="enrollment-modal__title">Enrollment Details</h2>
            <div>
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
                    className={`enrollment-status-badge enrollment-status-badge--${selectedEnrollment.status}`}
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
            <div className="enrollment-modal__actions">
              {selectedEnrollment.status === "pending" && (
                <button
                  onClick={() => {
                    handleConfirmEnrollment(selectedEnrollment.enrollment_id);
                    setShowDetailsModal(false);
                  }}
                  className="enrollment-modal__btn enrollment-modal__btn--success"
                >
                  <Check size={18} /> Confirm Enrollment
                </button>
              )}
              <button
                onClick={() => setShowDetailsModal(false)}
                className="enrollment-modal__btn enrollment-modal__btn--primary"
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
    <motion.div whileHover={{ scale: 1.02 }} className="enrollment-stat-card">
      <div className="enrollment-stat-card__content">
        <p className="enrollment-stat-card__title">{title}</p>
        <p className="enrollment-stat-card__value">{value}</p>
      </div>
      <div className="enrollment-stat-card__icon" style={{ color }}>
        {icon}
      </div>
    </motion.div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="enrollment-detail-row">
      <span className="enrollment-detail-row__label">{label}:</span>
      <span className="enrollment-detail-row__value">{value}</span>
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
      className="enrollment-modal-overlay"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="enrollment-modal"
      >
        <div className="enrollment-modal__content">{children}</div>
      </motion.div>
    </motion.div>
  );
}
