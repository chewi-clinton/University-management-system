import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Clock,
  QrCode,
  CheckSquare,
  Smartphone,
  Loader,
} from "lucide-react";
import Card from "../../components/shared/layout/Card";
import Button from "../../components/shared/ui/Button";
import Select from "../../components/shared/ui/Select";
import DatePicker from "../../components/shared/ui/DatePicker";
import Badge from "../../components/shared/ui/Badge";
import AttendanceToggle from "../../components/shared/ui/AttendanceToggle";
import QRCodeDisplay from "../../components/shared/ui/QRCodeDisplay";
import Modal from "../../components/shared/feedback/Modal";
import Toast from "../../components/shared/feedback/Toast";
import facultyService from "../../services/api/facultyService";
import "../../styles/pages/AttendanceMarking.css";

const AttendanceMarking = () => {
  const [mode, setMode] = useState("manual");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [attendance, setAttendance] = useState({});
  const [showQRModal, setShowQRModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  // API data states
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [existingAttendance, setExistingAttendance] = useState([]);
  const [qrData, setQrData] = useState(null);
  const [loading, setLoading] = useState({
    courses: false,
    students: false,
    attendance: false,
    saving: false,
    qr: false,
  });

  // Fetch faculty courses on mount
  useEffect(() => {
    fetchFacultyCourses();
  }, []);

  // Fetch students when course or date changes
  useEffect(() => {
    if (selectedCourse) {
      fetchCourseStudents();
      fetchExistingAttendance();
    }
  }, [selectedCourse, selectedDate]);

  const fetchFacultyCourses = async () => {
    setLoading((prev) => ({ ...prev, courses: true }));
    try {
      const profileResponse = await facultyService.getProfile();
      const facultyId = profileResponse.id;

      const response = await facultyService.getCourses({
        faculty: facultyId,
        is_visible: true,
      });

      const coursesData = response.results || response;

      // Filter out courses without valid IDs
      const validCourses = coursesData.filter((course) => course?.id != null);
      setCourses(validCourses);

      if (validCourses.length > 0) {
        setSelectedCourse(validCourses[0].id.toString());
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      showToastMessage("Failed to load courses", "error");
    } finally {
      setLoading((prev) => ({ ...prev, courses: false }));
    }
  };

  const fetchCourseStudents = async () => {
    setLoading((prev) => ({ ...prev, students: true }));
    try {
      const response = await facultyService.getCourseStudents(selectedCourse);
      const registrations = response.results || response;

      const studentsData = registrations.map((reg) => ({
        id: reg.student.student_id,
        name:
          reg.student.full_name ||
          `${reg.student.first_name} ${reg.student.last_name}`,
        regNumber: reg.student.university_reg_number,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${reg.student.student_id}`,
        registrationId: reg.id,
      }));

      setStudents(studentsData);

      // Initialize attendance state for new students
      const initialAttendance = {};
      studentsData.forEach((student) => {
        initialAttendance[student.id] = "absent";
      });
      setAttendance(initialAttendance);
    } catch (error) {
      console.error("Error fetching students:", error);
      showToastMessage("Failed to load students", "error");
    } finally {
      setLoading((prev) => ({ ...prev, students: false }));
    }
  };

  const fetchExistingAttendance = async () => {
    setLoading((prev) => ({ ...prev, attendance: true }));
    try {
      const dateString = selectedDate.toISOString().split("T")[0];
      const response = await facultyService.getAttendance({
        offering: selectedCourse,
        attendance_date: dateString,
      });

      const attendanceRecords = response.results || response;
      setExistingAttendance(attendanceRecords);

      // Update attendance state with existing records
      const updatedAttendance = { ...attendance };
      attendanceRecords.forEach((record) => {
        if (record.student?.student_id) {
          updatedAttendance[record.student.student_id] = record.status;
        }
      });
      setAttendance(updatedAttendance);
    } catch (error) {
      console.error("Error fetching existing attendance:", error);
      // Don't show error toast for 404 (no existing attendance)
      if (error.response?.status !== 404) {
        showToastMessage("Failed to load existing attendance", "error");
      }
    } finally {
      setLoading((prev) => ({ ...prev, attendance: false }));
    }
  };

  const handleAttendanceChange = (studentId, status) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: status,
    }));

    const student = students.find((s) => s.id === studentId);
    showToastMessage(
      `Attendance marked for ${student?.name}: ${status}`,
      "success"
    );
  };

  const markAllPresent = () => {
    const allPresent = {};
    students.forEach((student) => {
      allPresent[student.id] = "present";
    });
    setAttendance(allPresent);
    showToastMessage("All students marked as present", "success");
  };

  const saveAttendance = async () => {
    setLoading((prev) => ({ ...prev, saving: true }));
    try {
      const dateString = selectedDate.toISOString().split("T")[0];
      const attendancePromises = [];

      for (const student of students) {
        const status = attendance[student.id] || "absent";

        // Check if attendance already exists for this student
        const existingRecord = existingAttendance.find(
          (record) => record.student?.student_id === student.id
        );

        if (existingRecord) {
          // Update existing attendance
          attendancePromises.push(
            facultyService.updateAttendance(existingRecord.attendance_id, {
              status: status,
            })
          );
        } else {
          // Create new attendance record
          attendancePromises.push(
            facultyService.markAttendance({
              student_id: student.id,
              offering_id: parseInt(selectedCourse),
              attendance_date: dateString,
              status: status,
            })
          );
        }
      }

      await Promise.all(attendancePromises);
      showToastMessage("Attendance saved successfully!", "success");

      // Refresh attendance data
      await fetchExistingAttendance();
    } catch (error) {
      console.error("Error saving attendance:", error);
      showToastMessage("Failed to save attendance. Please try again.", "error");
    } finally {
      setLoading((prev) => ({ ...prev, saving: false }));
    }
  };

  const generateQRCode = async () => {
    setLoading((prev) => ({ ...prev, qr: true }));
    try {
      const dateString = selectedDate.toISOString().split("T")[0];
      const response = await facultyService.generateAttendanceQR(
        selectedCourse,
        dateString
      );

      setQrData(response);
      setShowQRModal(true);
      showToastMessage("QR Code generated successfully", "success");
    } catch (error) {
      console.error("Error generating QR code:", error);
      showToastMessage("Failed to generate QR code", "error");
    } finally {
      setLoading((prev) => ({ ...prev, qr: false }));
    }
  };

  const showToastMessage = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  const getMarkedCount = () => {
    return Object.values(attendance).filter((status) => status !== "absent")
      .length;
  };

  const getProgressPercentage = () => {
    if (students.length === 0) return 0;
    const marked = getMarkedCount();
    return Math.round((marked / students.length) * 100);
  };

  // Fixed: Added optional chaining to prevent undefined errors
  const course = courses.find((c) => c?.id?.toString() === selectedCourse);

  if (loading.courses) {
    return (
      <div className="attendance-marking">
        <div className="loading-state">
          <Loader className="spinner" size={48} />
          <p>Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="attendance-marking">
      <div className="attendance-marking__header">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Attendance Marking
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          Mark attendance for your classes
        </motion.p>
      </div>

      <motion.div
        className="attendance-marking__mode-toggle"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <button
          className={`attendance-marking__mode-btn ${
            mode === "manual" ? "active" : ""
          }`}
          onClick={() => setMode("manual")}
        >
          <CheckSquare size={20} />
          Manual Mode
        </button>
        <button
          className={`attendance-marking__mode-btn ${
            mode === "qr" ? "active" : ""
          }`}
          onClick={() => setMode("qr")}
        >
          <QrCode size={20} />
          QR Code Mode
        </button>
      </motion.div>

      <motion.div
        className="attendance-marking__controls"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <Select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          options={courses
            .filter((course) => course?.id != null)
            .map((course) => ({
              value: course.id.toString(),
              label: `${course.course?.course_code || "N/A"} - ${
                course.course?.course_name || "Untitled"
              } (${course.section || "A"})`,
            }))}
          className="attendance-marking__course-select"
          disabled={loading.students}
        />
        <DatePicker
          selected={selectedDate}
          onChange={setSelectedDate}
          className="attendance-marking__date-picker"
          disabled={loading.students}
        />
        {mode === "manual" && (
          <Button
            onClick={markAllPresent}
            variant="secondary"
            icon={<Users size={16} />}
            disabled={loading.students || students.length === 0}
          >
            Mark All Present
          </Button>
        )}
        {mode === "qr" && (
          <Button
            onClick={generateQRCode}
            variant="primary"
            icon={
              loading.qr ? (
                <Loader className="spinner" size={16} />
              ) : (
                <QrCode size={16} />
              )
            }
            disabled={loading.qr || !selectedCourse}
          >
            Generate QR Code
          </Button>
        )}
      </motion.div>

      {mode === "manual" && (
        <motion.div
          className="attendance-marking__manual-mode"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {loading.students ? (
            <div className="loading-state">
              <Loader className="spinner" size={32} />
              <p>Loading students...</p>
            </div>
          ) : students.length === 0 ? (
            <div className="empty-state">
              <Users size={48} />
              <p>No students enrolled in this course</p>
            </div>
          ) : (
            <>
              <div className="attendance-marking__progress">
                <div className="attendance-marking__progress-info">
                  <Users size={20} />
                  <span>
                    Progress: {getMarkedCount()}/{students.length} students
                    marked
                  </span>
                  <Badge variant="primary">{getProgressPercentage()}%</Badge>
                </div>
                <div className="attendance-marking__progress-bar">
                  <div
                    className="attendance-marking__progress-fill"
                    style={{ width: `${getProgressPercentage()}%` }}
                  />
                </div>
              </div>

              <div className="attendance-marking__student-list">
                {students.map((student, index) => (
                  <motion.div
                    key={student.id}
                    className="student-attendance-item"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.05 }}
                  >
                    <div className="student-attendance-item__info">
                      <img
                        src={student.avatar}
                        alt={student.name}
                        className="student-attendance-item__avatar"
                      />
                      <div>
                        <h4>{student.name}</h4>
                        <p>{student.regNumber}</p>
                      </div>
                    </div>
                    <AttendanceToggle
                      value={attendance[student.id] || "absent"}
                      onChange={(status) =>
                        handleAttendanceChange(student.id, status)
                      }
                    />
                  </motion.div>
                ))}
              </div>

              <div className="attendance-marking__actions">
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={saveAttendance}
                  disabled={loading.saving}
                  icon={
                    loading.saving ? (
                      <Loader className="spinner" size={20} />
                    ) : null
                  }
                >
                  {loading.saving ? "Saving..." : "Save Attendance"}
                </Button>
              </div>
            </>
          )}
        </motion.div>
      )}

      {mode === "qr" && (
        <motion.div
          className="attendance-marking__qr-mode"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="qr-mode__card">
            <div className="qr-mode__header">
              <QrCode size={32} />
              <div>
                <h3>QR Code Attendance</h3>
                <p>
                  {course?.course?.course_name || "Course"} (
                  {course?.section || "A"})
                </p>
              </div>
            </div>

            <div className="qr-mode__display">
              <div className="qr-mode__phone-mockup">
                <div className="qr-mode__phone-screen">
                  <Smartphone size={64} />
                  <p>Generate and display QR Code for students to scan</p>
                  <Button
                    onClick={generateQRCode}
                    variant="primary"
                    disabled={loading.qr}
                    icon={
                      loading.qr ? (
                        <Loader className="spinner" size={16} />
                      ) : (
                        <QrCode size={16} />
                      )
                    }
                  >
                    {loading.qr ? "Generating..." : "Generate QR Code"}
                  </Button>
                </div>
              </div>

              <div className="qr-mode__stats">
                <div className="qr-mode__stat">
                  <Users size={24} />
                  <div>
                    <span className="qr-mode__stat-value">
                      {getMarkedCount()}/{students.length}
                    </span>
                    <span className="qr-mode__stat-label">Students Marked</span>
                  </div>
                </div>

                <div className="qr-mode__progress-bar">
                  <div
                    className="qr-mode__progress-fill"
                    style={{ width: `${getProgressPercentage()}%` }}
                  />
                </div>

                <div className="qr-mode__live-feed">
                  <h4>Recent Check-ins</h4>
                  {existingAttendance.length === 0 ? (
                    <p className="qr-mode__empty">No check-ins yet</p>
                  ) : (
                    existingAttendance
                      .filter((record) => record.status === "present")
                      .slice(0, 5)
                      .map((record, index) => (
                        <div key={index} className="qr-mode__feed-item">
                          <span>{record.student?.full_name || "Student"}</span>
                          <Badge variant="success">
                            {new Date(record.marked_at).toLocaleTimeString()}
                          </Badge>
                        </div>
                      ))
                  )}
                </div>
              </div>
            </div>

            <div className="qr-mode__actions">
              <Button
                variant="secondary"
                onClick={generateQRCode}
                disabled={loading.qr}
              >
                Regenerate QR
              </Button>
              <Button variant="danger" onClick={() => setMode("manual")}>
                Close Session
              </Button>
            </div>
          </Card>
        </motion.div>
      )}

      <AnimatePresence>
        {showQRModal && qrData && (
          <Modal
            isOpen={showQRModal}
            onClose={() => setShowQRModal(false)}
            title="QR Code for Attendance"
            size="lg"
          >
            <QRCodeDisplay
              qrData={qrData.qr_code || qrData.payload}
              expiresIn={300}
              onRegenerate={generateQRCode}
            />
          </Modal>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showToast && (
          <Toast
            message={toastMessage}
            type={toastType}
            onClose={() => setShowToast(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AttendanceMarking;
