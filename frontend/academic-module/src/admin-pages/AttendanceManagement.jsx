import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
  Eye,
  Edit,
  RefreshCw,
  Filter,
  Download,
} from "lucide-react";
import { adminService } from "../services/api/adminService";

export default function AttendanceManagement() {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [attendanceSummaries, setAttendanceSummaries] = useState([]);
  const [courseOfferings, setCourseOfferings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCourse, setFilterCourse] = useState("all");
  const [filterDate, setFilterDate] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Load initial data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [attendanceRes, summariesRes, offeringsRes] = await Promise.all([
        adminService.getAttendance(),
        adminService.getAttendanceSummaries(),
        adminService.getCourseOfferings(),
      ]);

      if (attendanceRes.success) {
        setAttendanceRecords(attendanceRes.data);
      } else {
        setError(attendanceRes.error);
      }

      if (summariesRes.success) {
        setAttendanceSummaries(summariesRes.data);
      }

      if (offeringsRes.success) {
        setCourseOfferings(offeringsRes.data);
      }
    } catch (err) {
      setError("Failed to load data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics for today
  const getTodayStats = () => {
    const today = new Date().toISOString().split("T")[0];
    const todayRecords = attendanceRecords.filter((record) =>
      record.attendance_date?.startsWith(today)
    );

    const present = todayRecords.filter((r) => r.status === "present").length;
    const late = todayRecords.filter((r) => r.status === "late").length;
    const absent = todayRecords.filter((r) => r.status === "absent").length;
    const total = present + late + absent;
    const rate = total > 0 ? (((present + late) / total) * 100).toFixed(1) : 0;

    return { present, late, absent, rate };
  };

  // Calculate overall statistics from summaries
  const getOverallStats = () => {
    if (attendanceSummaries.length === 0) {
      return getTodayStats();
    }

    const totalAttendance = attendanceSummaries.reduce(
      (sum, s) => sum + (s.attendance_percentage || 0),
      0
    );
    const avgRate =
      attendanceSummaries.length > 0
        ? (totalAttendance / attendanceSummaries.length).toFixed(1)
        : 0;

    const today = getTodayStats();
    return { ...today, rate: avgRate };
  };

  const stats = getOverallStats();

  // Filter attendance records
  const filteredRecords = attendanceRecords.filter((record) => {
    const studentName = record.student
      ? `${record.student.first_name || ""} ${
          record.student.last_name || ""
        }`.toLowerCase()
      : "";
    const matchesSearch = studentName.includes(searchTerm.toLowerCase());
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
      present: "#10b981",
      late: "#f59e0b",
      absent: "#ef4444",
      excused: "#3b82f6",
    };
    return colors[status] || "#6b7280";
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
          <p style={{ color: "#6b7280" }}>Loading attendance records...</p>
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
            Attendance Management
          </h1>
          <p style={{ color: "#6b7280", fontSize: "16px" }}>
            Monitor and manage student attendance records
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
            <Download size={18} /> Export CSV
          </button>
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
          title="Present Today"
          value={stats.present}
          icon={<CheckCircle size={24} />}
          color="#10b981"
        />
        <StatCard
          title="Late Today"
          value={stats.late}
          icon={<Clock size={24} />}
          color="#f59e0b"
        />
        <StatCard
          title="Absent Today"
          value={stats.absent}
          icon={<AlertTriangle size={24} />}
          color="#ef4444"
        />
        <StatCard
          title="Attendance Rate"
          value={`${stats.rate}%`}
          icon={<Calendar size={24} />}
          color="#3b82f6"
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
              Search Students
            </label>
            <input
              type="text"
              placeholder="Search by student name..."
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
              Course
            </label>
            <select
              value={filterCourse}
              onChange={(e) => setFilterCourse(e.target.value)}
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
                <option key={offering.offering_id} value={offering.offering_id}>
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
              <option value="present">Present</option>
              <option value="late">Late</option>
              <option value="absent">Absent</option>
              <option value="excused">Excused</option>
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
              Date
            </label>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
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
      </div>

      {/* Attendance Table */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          overflow: "hidden",
        }}
      >
        {filteredRecords.length === 0 ? (
          <div
            style={{
              padding: "60px 20px",
              textAlign: "center",
              color: "#6b7280",
            }}
          >
            <p style={{ fontSize: "18px", marginBottom: "8px" }}>
              No attendance records found
            </p>
            <p style={{ fontSize: "14px" }}>
              {searchTerm ||
              filterStatus !== "all" ||
              filterCourse !== "all" ||
              filterDate
                ? "Try adjusting your filters"
                : "No attendance records available"}
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
                    "Course",
                    "Date",
                    "Status",
                    "Marked By",
                    "Time",
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
                {filteredRecords.map((record) => (
                  <tr
                    key={record.attendance_id}
                    style={{ borderBottom: "1px solid #f3f4f6" }}
                  >
                    <td
                      style={{
                        padding: "16px",
                        fontSize: "14px",
                        color: "#111827",
                      }}
                    >
                      {record.student
                        ? `${record.student.first_name || ""} ${
                            record.student.last_name || ""
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
                      <div>
                        <div style={{ fontWeight: "500", color: "#1e40af" }}>
                          {record.offering?.course?.course_code || "N/A"}
                        </div>
                        <div style={{ fontSize: "12px" }}>
                          {record.offering?.course?.course_name || ""}
                        </div>
                      </div>
                    </td>
                    <td
                      style={{
                        padding: "16px",
                        fontSize: "14px",
                        color: "#6b7280",
                      }}
                    >
                      {record.attendance_date
                        ? new Date(record.attendance_date).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td style={{ padding: "16px" }}>
                      <span
                        style={{
                          padding: "4px 12px",
                          borderRadius: "12px",
                          fontSize: "12px",
                          fontWeight: "500",
                          backgroundColor: `${getStatusColor(record.status)}20`,
                          color: getStatusColor(record.status),
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        {getStatusIcon(record.status)}
                        {record.status?.charAt(0).toUpperCase() +
                          record.status?.slice(1) || "Unknown"}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "16px",
                        fontSize: "14px",
                        color: "#6b7280",
                      }}
                    >
                      {record.marked_by_faculty
                        ? `${record.marked_by_faculty.user?.first_name || ""} ${
                            record.marked_by_faculty.user?.last_name || ""
                          }`.trim()
                        : "System"}
                    </td>
                    <td
                      style={{
                        padding: "16px",
                        fontSize: "14px",
                        color: "#6b7280",
                      }}
                    >
                      {record.marked_at
                        ? new Date(record.marked_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "N/A"}
                    </td>
                    <td style={{ padding: "16px" }}>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <ActionButton
                          onClick={() => openDetailsModal(record)}
                          title="View Details"
                          color="#3b82f6"
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

      {/* Details Modal */}
      <AnimatePresence>
        {showDetailsModal && selectedRecord && (
          <Modal onClose={() => setShowDetailsModal(false)}>
            <h2
              style={{
                fontSize: "24px",
                fontWeight: "700",
                marginBottom: "24px",
              }}
            >
              Attendance Details
            </h2>
            <div style={{ display: "grid", gap: "16px" }}>
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
                    style={{
                      padding: "4px 12px",
                      borderRadius: "12px",
                      fontSize: "12px",
                      fontWeight: "500",
                      backgroundColor: `${getStatusColor(
                        selectedRecord.status
                      )}20`,
                      color: getStatusColor(selectedRecord.status),
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
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
