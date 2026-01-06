import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  Clock,
  AlertTriangle,
  Calendar,
  Download,
  RefreshCw,
  Eye,
  X,
} from "lucide-react";
import { adminService } from "../services/api/adminService";
import "../styles/admin-pages/attendance-management.css";

export default function AttendanceManagement() {
  const [records, setRecords] = useState([]);
  const [courseOfferings, setCourseOfferings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCourse, setFilterCourse] = useState("all");
  const [filterDate, setFilterDate] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [recordsRes, offeringsRes] = await Promise.all([
        adminService.getAttendanceRecords(),
        adminService.getCourseOfferings(),
      ]);

      if (recordsRes.success) {
        setRecords(recordsRes.data);
      } else {
        setError(recordsRes.error || "Failed to load attendance records");
      }

      if (offeringsRes.success) {
        setCourseOfferings(offeringsRes.data);
      } else {
        setError(offeringsRes.error || "Failed to load course offerings");
      }
    } catch (err) {
      setError("Failed to load data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats for today
  const today = new Date().toISOString().split("T")[0];
  const todayRecords = records.filter((r) => r.attendance_date === today);

  const stats = {
    present: todayRecords.filter((r) => r.status === "present").length,
    late: todayRecords.filter((r) => r.status === "late").length,
    absent: todayRecords.filter((r) => r.status === "absent").length,
    rate:
      todayRecords.length > 0
        ? Math.round(
            (todayRecords.filter((r) => r.status === "present").length /
              todayRecords.length) *
              100
          )
        : 0,
  };

  const filteredRecords = records.filter((record) => {
    const matchesSearch =
      !searchTerm ||
      `${record.student?.first_name || ""} ${record.student?.last_name || ""}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || record.status === filterStatus;

    const matchesCourse =
      filterCourse === "all" ||
      record.offering?.offering_id === parseInt(filterCourse);

    const matchesDate =
      !filterDate || record.attendance_date?.startsWith(filterDate);

    return matchesSearch && matchesStatus && matchesCourse && matchesDate;
  });

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const openDetailsModal = (record) => {
    setSelectedRecord(record);
    setShowDetailsModal(true);
  };

  const getStatusColor = (status) => {
    const colors = {
      present: "present",
      late: "late",
      absent: "absent",
      excused: "excused",
    };
    return colors[status] || "";
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "present":
        return <CheckCircle size={16} />;
      case "late":
        return <Clock size={16} />;
      case "absent":
        return <AlertTriangle size={16} />;
      default:
        return <Calendar size={16} />;
    }
  };

  const exportToCSV = () => {
    const headers = [
      "Student",
      "Course",
      "Date",
      "Status",
      "Marked By",
      "Time",
    ];
    const rows = filteredRecords.map((record) => [
      record.student
        ? `${record.student.first_name || ""} ${
            record.student.last_name || ""
          }`.trim()
        : "N/A",
      record.offering?.course?.course_name || "N/A",
      record.attendance_date || "N/A",
      record.status || "N/A",
      record.marked_by_faculty
        ? `${record.marked_by_faculty.user?.first_name || ""} ${
            record.marked_by_faculty.user?.last_name || ""
          }`.trim()
        : "N/A",
      record.marked_at
        ? new Date(record.marked_at).toLocaleTimeString()
        : "N/A",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `attendance_report_${
      new Date().toISOString().split("T")[0]
    }.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showSuccess("Report exported successfully");
  };

  if (loading) {
    return (
      <div className="attendance-management__loading">
        <div className="attendance-management__loading-content">
          <div className="attendance-management__spinner" />
          <p className="attendance-management__loading-text">
            Loading attendance records...
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="attendance-management"
    >
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="attendance-management__success"
          >
            <CheckCircle size={18} />
            {successMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <div className="attendance-management__error">
          <AlertTriangle size={18} style={{ marginRight: "8px" }} />
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="attendance-management__error-close"
          >
            <X size={18} />
          </button>
        </div>
      )}

      <div className="attendance-management__header">
        <div className="attendance-management__header-content">
          <h1 className="attendance-management__title">
            Attendance Management
          </h1>
          <p className="attendance-management__subtitle">
            Monitor and manage student attendance records
          </p>
        </div>
        <div className="attendance-management__actions">
          <button
            onClick={exportToCSV}
            className="attendance-management__button attendance-management__button--export"
          >
            <Download size={18} style={{ marginRight: "8px" }} />
            Export CSV
          </button>
          <button
            onClick={loadData}
            className="attendance-management__button attendance-management__button--refresh"
          >
            <RefreshCw size={18} style={{ marginRight: "8px" }} />
            Refresh
          </button>
        </div>
      </div>

      <div className="attendance-management__stats">
        <StatCard
          title="Present Today"
          value={stats.present}
          icon={<CheckCircle size={24} />}
          variant="present"
        />
        <StatCard
          title="Late Today"
          value={stats.late}
          icon={<Clock size={24} />}
          variant="late"
        />
        <StatCard
          title="Absent Today"
          value={stats.absent}
          icon={<AlertTriangle size={24} />}
          variant="absent"
        />
        <StatCard
          title="Attendance Rate"
          value={`${stats.rate}%`}
          icon={<Calendar size={24} />}
          variant="rate"
        />
      </div>

      <div className="attendance-management__filters">
        <div className="attendance-management__filters-grid">
          <div className="attendance-management__filter-group">
            <label className="attendance-management__filter-label">
              Search Students
            </label>
            <input
              type="text"
              placeholder="Search by student name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="attendance-management__filter-input"
            />
          </div>

          <div className="attendance-management__filter-group">
            <label className="attendance-management__filter-label">
              Course
            </label>
            <select
              value={filterCourse}
              onChange={(e) => setFilterCourse(e.target.value)}
              className="attendance-management__filter-select"
            >
              <option value="all">All Courses</option>
              {courseOfferings.map((offering) => (
                <option key={offering.offering_id} value={offering.offering_id}>
                  {offering.course?.course_code} -{" "}
                  {offering.course?.course_name}
                </option>
              ))}
            </select>
          </div>

          <div className="attendance-management__filter-group">
            <label className="attendance-management__filter-label">
              Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="attendance-management__filter-select"
            >
              <option value="all">All Status</option>
              <option value="present">Present</option>
              <option value="late">Late</option>
              <option value="absent">Absent</option>
              <option value="excused">Excused</option>
            </select>
          </div>

          <div className="attendance-management__filter-group">
            <label className="attendance-management__filter-label">Date</label>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="attendance-management__filter-input"
            />
          </div>
        </div>
      </div>

      <div className="attendance-management__table-container">
        {filteredRecords.length === 0 ? (
          <div className="attendance-management__empty">
            <p className="attendance-management__empty-title">
              No attendance records found
            </p>
            <p className="attendance-management__empty-text">
              {searchTerm ||
              filterStatus !== "all" ||
              filterCourse !== "all" ||
              filterDate
                ? "Try adjusting your filters"
                : "No attendance records available"}
            </p>
          </div>
        ) : (
          <div className="attendance-management__table-wrapper">
            <table className="attendance-management__table">
              <thead className="attendance-management__table-header">
                <tr>
                  {[
                    "Student",
                    "Course",
                    "Date",
                    "Status",
                    "Marked By",
                    "Time",
                    "Actions",
                  ].map((header) => (
                    <th
                      key={header}
                      className="attendance-management__table-header-cell"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="attendance-management__table-body">
                {filteredRecords.map((record) => (
                  <tr
                    key={record.attendance_id}
                    className="attendance-management__table-row"
                  >
                    <td className="attendance-management__table-cell">
                      {record.student
                        ? `${record.student.first_name || ""} ${
                            record.student.last_name || ""
                          }`.trim() || "N/A"
                        : "N/A"}
                    </td>
                    <td className="attendance-management__table-cell">
                      <div className="attendance-management__course-info">
                        <div className="attendance-management__course-code">
                          {record.offering?.course?.course_code || "N/A"}
                        </div>
                        <div className="attendance-management__course-name">
                          {record.offering?.course?.course_name || ""}
                        </div>
                      </div>
                    </td>
                    <td className="attendance-management__table-cell attendance-management__table-cell--secondary">
                      {record.attendance_date
                        ? new Date(record.attendance_date).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="attendance-management__table-cell">
                      <span
                        className={`attendance-management__status-badge attendance-management__status-badge--${getStatusColor(
                          record.status
                        )}`}
                      >
                        {getStatusIcon(record.status)}
                        {record.status?.charAt(0).toUpperCase() +
                          record.status?.slice(1) || "Unknown"}
                      </span>
                    </td>
                    <td className="attendance-management__table-cell attendance-management__table-cell--secondary">
                      {record.marked_by_faculty
                        ? `${record.marked_by_faculty.user?.first_name || ""} ${
                            record.marked_by_faculty.user?.last_name || ""
                          }`.trim()
                        : "System"}
                    </td>
                    <td className="attendance-management__table-cell attendance-management__table-cell--secondary">
                      {record.marked_at
                        ? new Date(record.marked_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "N/A"}
                    </td>
                    <td className="attendance-management__table-cell">
                      <div className="attendance-management__actions-cell">
                        <ActionButton
                          onClick={() => openDetailsModal(record)}
                          title="View Details"
                          variant="view"
                        >
                          <Eye size={16} />
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

      <AnimatePresence>
        {showDetailsModal && selectedRecord && (
          <Modal onClose={() => setShowDetailsModal(false)}>
            <h2 className="attendance-management__modal-title">
              Attendance Details
            </h2>
            <div className="attendance-management__modal-content">
              <DetailRow
                label="Student"
                value={
                  selectedRecord.student
                    ? `${selectedRecord.student.first_name || ""} ${
                        selectedRecord.student.last_name || ""
                      }`.trim()
                    : "N/A"
                }
              />
              <DetailRow
                label="University Reg #"
                value={selectedRecord.student?.university_reg_number || "N/A"}
              />
              <DetailRow
                label="Course Code"
                value={selectedRecord.offering?.course?.course_code || "N/A"}
              />
              <DetailRow
                label="Course Name"
                value={selectedRecord.offering?.course?.course_name || "N/A"}
              />
              <DetailRow
                label="Section"
                value={selectedRecord.offering?.section || "N/A"}
              />
              <DetailRow
                label="Date"
                value={
                  selectedRecord.attendance_date
                    ? new Date(
                        selectedRecord.attendance_date
                      ).toLocaleDateString()
                    : "N/A"
                }
              />
              <DetailRow
                label="Status"
                value={
                  <span
                    className={`attendance-management__status-badge attendance-management__status-badge--${getStatusColor(
                      selectedRecord.status
                    )}`}
                  >
                    {getStatusIcon(selectedRecord.status)}
                    {selectedRecord.status?.charAt(0).toUpperCase() +
                      selectedRecord.status?.slice(1)}
                  </span>
                }
              />
              <DetailRow
                label="Marked By"
                value={
                  selectedRecord.marked_by_faculty
                    ? `${
                        selectedRecord.marked_by_faculty.user?.first_name || ""
                      } ${
                        selectedRecord.marked_by_faculty.user?.last_name || ""
                      }`.trim()
                    : "System"
                }
              />
              <DetailRow
                label="Marked At"
                value={
                  selectedRecord.marked_at
                    ? new Date(selectedRecord.marked_at).toLocaleString()
                    : "N/A"
                }
              />
              {selectedRecord.qr_token && (
                <DetailRow label="Method" value="QR Code Scan" />
              )}
              {selectedRecord.scanned_at && (
                <DetailRow
                  label="Scanned At"
                  value={new Date(selectedRecord.scanned_at).toLocaleString()}
                />
              )}
              <DetailRow
                label="Remarks"
                value={selectedRecord.remarks || "No remarks"}
              />
            </div>
            <div className="attendance-management__modal-actions">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="attendance-management__modal-button"
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

function StatCard({ title, value, icon, variant }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`attendance-management__stat-card attendance-management__stat-card--${variant}`}
    >
      <div className="attendance-management__stat-card-content">
        <div className="attendance-management__stat-card-details">
          <p className="attendance-management__stat-card-title">{title}</p>
          <p className="attendance-management__stat-card-value">{value}</p>
        </div>
        <div
          className={`attendance-management__stat-card-icon attendance-management__stat-card-icon--${variant}`}
        >
          {icon}
        </div>
      </div>
    </motion.div>
  );
}

function ActionButton({ onClick, title, variant, children }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`attendance-management__action-button attendance-management__action-button--${variant}`}
    >
      {children}
    </button>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="attendance-management__detail-row">
      <span className="attendance-management__detail-label">{label}:</span>
      <span className="attendance-management__detail-value">{value}</span>
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
      className="attendance-management__modal-overlay"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="attendance-management__modal"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
