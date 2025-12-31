import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  MapPin,
  FileText,
  Download,
  X,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { studentService } from "../services/api/studentService.js";
import "../styles/pages/Exams.css";

const Exams = () => {
  const [exams, setExams] = useState([]);
  const [admitCards, setAdmitCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedExam, setSelectedExam] = useState(null);
  const [showAdmitCard, setShowAdmitCard] = useState(false);
  const [expandedExam, setExpandedExam] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState({});
  const [studentProfile, setStudentProfile] = useState(null);

  useEffect(() => {
    const fetchExamsData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch student profile
        const profileResponse = await studentService.getMyProfile();
        if (profileResponse.success) {
          setStudentProfile(profileResponse.data);
        }

        // Fetch exam schedules
        const examsResponse = await studentService.getExamSchedules();
        console.log("Exams response:", examsResponse); // Debug log

        if (examsResponse.success) {
          // Handle both paginated and non-paginated responses
          const examSchedules = Array.isArray(examsResponse.data)
            ? examsResponse.data
            : examsResponse.data?.results || [];

          console.log("Exam schedules:", examSchedules); // Debug log
          processExamsData(examSchedules);
        } else {
          // If the API call failed but didn't throw an error
          setError(examsResponse.error || "Failed to load exam schedules");
        }

        // Fetch admit cards
        const admitCardsResponse = await studentService.getAdmitCards();
        console.log("Admit cards response:", admitCardsResponse); // Debug log

        if (admitCardsResponse.success) {
          // Handle both paginated and non-paginated responses
          const cards = Array.isArray(admitCardsResponse.data)
            ? admitCardsResponse.data
            : admitCardsResponse.data?.results || [];

          setAdmitCards(cards);
        }
      } catch (err) {
        console.error("Error fetching exams:", err);
        setError(err.message || "Failed to load exams data");
      } finally {
        setLoading(false);
      }
    };

    fetchExamsData();
  }, []);

  const processExamsData = (examSchedules) => {
    // Ensure examSchedules is an array
    if (!Array.isArray(examSchedules)) {
      console.error("examSchedules is not an array:", examSchedules);
      setExams([]);
      return;
    }

    const processedExams = examSchedules.map((schedule) => {
      const exam = schedule.exam;
      const offering = exam?.offering;
      const course = offering?.course;

      // Determine status based on exam date
      const examDate = new Date(schedule.exam_date);
      const now = new Date();
      const isPast = examDate < now;

      return {
        id: schedule.schedule_id,
        scheduleId: schedule.schedule_id,
        examId: exam?.exam_id,
        courseCode: course?.course_code || "N/A",
        courseName: course?.course_name || "Unknown Course",
        type: exam?.exam_type || "Exam",
        date: schedule.exam_date,
        startTime: schedule.start_time,
        endTime: schedule.end_time,
        time: `${schedule.start_time} - ${schedule.end_time}`,
        duration: calculateDuration(schedule.start_time, schedule.end_time),
        room: `${schedule.room?.building || "Building"} ${
          schedule.room?.room_number || "Room"
        }`,
        seat: schedule.seating_plan?.seat_number || "TBA",
        syllabus: exam?.syllabus_portion
          ? exam.syllabus_portion.split("\n").filter((s) => s.trim())
          : [],
        status: isPast ? "completed" : "upcoming",
        color: getRandomColor(),
        instructor: offering?.faculty?.full_name || "TBA",
        invigilator: schedule.invigilator?.full_name || "TBA",
        totalMarks: exam?.total_marks || 100,
        weightage: exam?.weightage || 0,
      };
    });

    setExams(processedExams);
  };

  const calculateDuration = (startTime, endTime) => {
    if (!startTime || !endTime) return "TBA";

    const start = new Date(`2000-01-01 ${startTime}`);
    const end = new Date(`2000-01-01 ${endTime}`);
    const diffMs = end - start;
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0 && minutes > 0) {
      return `${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours} hours`;
    } else {
      return `${minutes} minutes`;
    }
  };

  const getRandomColor = () => {
    const colors = [
      "#3b82f6",
      "#8b5cf6",
      "#10b981",
      "#f59e0b",
      "#ec4899",
      "#06b6d4",
      "#f97316",
      "#6366f1",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  useEffect(() => {
    // Calculate time remaining for upcoming exams
    const timer = setInterval(() => {
      const remaining = {};
      exams.forEach((exam) => {
        if (exam.status === "upcoming") {
          const examDateTime = new Date(`${exam.date}T${exam.startTime}`);
          const now = new Date();
          const diff = examDateTime - now;

          if (diff > 0) {
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor(
              (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
            );
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            remaining[exam.id] = { days, hours, minutes };
          } else {
            remaining[exam.id] = { days: 0, hours: 0, minutes: 0 };
          }
        }
      });
      setTimeRemaining(remaining);
    }, 1000);

    return () => clearInterval(timer);
  }, [exams]);

  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  };

  const upcomingExams = exams.filter((e) => e.status === "upcoming");
  const completedExams = exams.filter((e) => e.status === "completed");

  const toggleSyllabus = (examId) => {
    setExpandedExam(expandedExam === examId ? null : examId);
  };

  const openAdmitCard = (exam) => {
    // Find matching admit card if available
    const admitCard = admitCards.find(
      (card) => card.exam?.exam_id === exam.examId
    );
    setSelectedExam({ ...exam, admitCard });
    setShowAdmitCard(true);
  };

  const downloadAdmitCard = async (exam) => {
    try {
      const admitCard = admitCards.find(
        (card) => card.exam?.exam_id === exam.examId
      );
      if (admitCard) {
        // In a real implementation, this would download the PDF
        console.log("Downloading admit card:", admitCard);
        alert("Admit card download functionality will be implemented soon!");
      } else {
        alert("Admit card not yet available for this exam");
      }
    } catch (err) {
      console.error("Error downloading admit card:", err);
      alert("Failed to download admit card");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "TBA";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="exams">
        <div className="exams__container">
          <div
            className="skeleton"
            style={{ height: "80px", marginBottom: "24px" }}
          />
          <div
            className="skeleton"
            style={{
              height: "400px",
              marginBottom: "24px",
              borderRadius: "12px",
            }}
          />
          <div
            className="skeleton"
            style={{ height: "300px", borderRadius: "12px" }}
          />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="exams">
        <div className="exams__container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              textAlign: "center",
              padding: "48px",
              backgroundColor: "var(--color-error-light, #fef2f2)",
              borderRadius: "12px",
            }}
          >
            <AlertCircle
              size={48}
              style={{
                color: "var(--color-error, #ef4444)",
                marginBottom: "16px",
              }}
            />
            <h3
              style={{
                fontSize: "20px",
                fontWeight: "600",
                marginBottom: "8px",
              }}
            >
              Failed to Load Exams
            </h3>
            <p
              style={{
                color: "var(--color-text-secondary, #6b7280)",
                marginBottom: "24px",
              }}
            >
              {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: "10px 20px",
                backgroundColor: "var(--color-primary, #6366f1)",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Retry
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="exams">
      <motion.div
        className="exams__container"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="exams__header">
          <h1 className="exams__title">Exams</h1>
          <p className="exams__subtitle">
            View exam schedules, download admit cards, and check results
          </p>
        </motion.div>

        {/* Timeline */}
        <motion.div variants={itemVariants} className="exams__timeline">
          <h2 className="exams__section-title">Upcoming Exams</h2>

          {upcomingExams.length > 0 ? (
            <div className="exams__timeline-list">
              {upcomingExams.map((exam, index) => (
                <motion.div
                  key={exam.id}
                  className="exams__timeline-item"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="exams__timeline-marker">
                    <div
                      className="exams__timeline-dot"
                      style={{ backgroundColor: exam.color }}
                    >
                      <div className="exams__timeline-pulse" />
                    </div>
                    {index < upcomingExams.length - 1 && (
                      <div className="exams__timeline-line" />
                    )}
                  </div>

                  <div className="exams__exam-card">
                    <div className="exams__exam-header">
                      <div className="exams__exam-info">
                        <div
                          className="exams__exam-badge"
                          style={{ backgroundColor: exam.color }}
                        >
                          {exam.type}
                        </div>
                        <h3 className="exams__exam-title">
                          {exam.courseCode} - {exam.courseName}
                        </h3>
                        <p className="exams__exam-instructor">
                          Instructor: {exam.instructor}
                        </p>
                      </div>

                      {/* Countdown */}
                      {timeRemaining[exam.id] && (
                        <div className="exams__countdown">
                          <div className="exams__countdown-item">
                            <div className="exams__countdown-value">
                              {timeRemaining[exam.id].days}
                            </div>
                            <div className="exams__countdown-label">Days</div>
                          </div>
                          <div className="exams__countdown-separator">:</div>
                          <div className="exams__countdown-item">
                            <div className="exams__countdown-value">
                              {timeRemaining[exam.id].hours}
                            </div>
                            <div className="exams__countdown-label">Hours</div>
                          </div>
                          <div className="exams__countdown-separator">:</div>
                          <div className="exams__countdown-item">
                            <div className="exams__countdown-value">
                              {timeRemaining[exam.id].minutes}
                            </div>
                            <div className="exams__countdown-label">Mins</div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="exams__exam-details">
                      <div className="exams__detail">
                        <Calendar size={18} className="exams__detail-icon" />
                        <span>{formatDate(exam.date)}</span>
                      </div>
                      <div className="exams__detail">
                        <Clock size={18} className="exams__detail-icon" />
                        <span>
                          {exam.time} ({exam.duration})
                        </span>
                      </div>
                      <div className="exams__detail">
                        <MapPin size={18} className="exams__detail-icon" />
                        <span>
                          {exam.room} - Seat #{exam.seat}
                        </span>
                      </div>
                    </div>

                    {/* Syllabus */}
                    {exam.syllabus.length > 0 && (
                      <div className="exams__syllabus-section">
                        <button
                          className="exams__syllabus-toggle"
                          onClick={() => toggleSyllabus(exam.id)}
                        >
                          <FileText size={18} />
                          <span>Syllabus Coverage</span>
                          {expandedExam === exam.id ? (
                            <ChevronUp size={18} />
                          ) : (
                            <ChevronDown size={18} />
                          )}
                        </button>

                        <AnimatePresence>
                          {expandedExam === exam.id && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="exams__syllabus-content"
                            >
                              <ul className="exams__syllabus-list">
                                {exam.syllabus.map((topic, idx) => (
                                  <li
                                    key={idx}
                                    className="exams__syllabus-item"
                                  >
                                    <CheckCircle
                                      size={16}
                                      className="exams__syllabus-icon"
                                    />
                                    {topic}
                                  </li>
                                ))}
                              </ul>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}

                    <button
                      className="exams__admit-btn"
                      onClick={() => openAdmitCard(exam)}
                    >
                      <Download size={18} />
                      Download Admit Card
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="exams__empty">
              <AlertCircle size={48} />
              <p>No upcoming exams scheduled</p>
            </div>
          )}
        </motion.div>

        {/* Completed Exams */}
        {completedExams.length > 0 && (
          <motion.div
            variants={itemVariants}
            className="exams__completed-section"
          >
            <h2 className="exams__section-title">Completed Exams</h2>

            <div className="exams__completed-grid">
              {completedExams.map((exam) => (
                <div key={exam.id} className="exams__completed-card">
                  <div
                    className="exams__completed-header"
                    style={{ backgroundColor: exam.color }}
                  >
                    <div className="exams__completed-badge">{exam.type}</div>
                    <div className="exams__completed-grade">
                      {exam.grade || "Pending"}
                    </div>
                  </div>
                  <div className="exams__completed-body">
                    <h3 className="exams__completed-title">
                      {exam.courseCode} - {exam.courseName}
                    </h3>
                    {exam.score && (
                      <div className="exams__completed-score">
                        Score: {exam.score}/{exam.totalMarks}
                      </div>
                    )}
                    <div className="exams__completed-date">
                      <Calendar size={16} />
                      {formatDate(exam.date)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Admit Card Modal */}
      <AnimatePresence>
        {showAdmitCard && selectedExam && (
          <>
            <motion.div
              className="exams__modal-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAdmitCard(false)}
            />
            <motion.div
              className="exams__modal"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
            >
              <div className="exams__modal-header">
                <h3 className="exams__modal-title">Admit Card</h3>
                <button
                  className="exams__modal-close"
                  onClick={() => setShowAdmitCard(false)}
                >
                  <X size={24} />
                </button>
              </div>

              <div className="exams__admit-card">
                <div className="exams__admit-header">
                  <div className="exams__admit-logo">
                    <div className="exams__admit-logo-circle">UNI</div>
                  </div>
                  <div className="exams__admit-uni">
                    <h2>University Name</h2>
                    <p>Academic Year 2024-2025</p>
                  </div>
                </div>

                <div className="exams__admit-title">EXAMINATION ADMIT CARD</div>

                <div className="exams__admit-body">
                  <div className="exams__admit-row">
                    <div className="exams__admit-field">
                      <label>Student Name:</label>
                      <span>
                        {studentProfile?.first_name} {studentProfile?.last_name}
                      </span>
                    </div>
                    <div className="exams__admit-field">
                      <label>Registration Number:</label>
                      <span>{studentProfile?.university_reg_number}</span>
                    </div>
                  </div>

                  <div className="exams__admit-row">
                    <div className="exams__admit-field">
                      <label>Course Code:</label>
                      <span>{selectedExam.courseCode}</span>
                    </div>
                    <div className="exams__admit-field">
                      <label>Course Name:</label>
                      <span>{selectedExam.courseName}</span>
                    </div>
                  </div>

                  <div className="exams__admit-row">
                    <div className="exams__admit-field">
                      <label>Exam Type:</label>
                      <span>{selectedExam.type}</span>
                    </div>
                    <div className="exams__admit-field">
                      <label>Date:</label>
                      <span>{formatDate(selectedExam.date)}</span>
                    </div>
                  </div>

                  <div className="exams__admit-row">
                    <div className="exams__admit-field">
                      <label>Time:</label>
                      <span>{selectedExam.time}</span>
                    </div>
                    <div className="exams__admit-field">
                      <label>Duration:</label>
                      <span>{selectedExam.duration}</span>
                    </div>
                  </div>

                  <div className="exams__admit-row">
                    <div className="exams__admit-field">
                      <label>Venue:</label>
                      <span>{selectedExam.room}</span>
                    </div>
                    <div className="exams__admit-field">
                      <label>Seat Number:</label>
                      <span className="exams__admit-seat">
                        {selectedExam.seat}
                      </span>
                    </div>
                  </div>

                  {selectedExam.admitCard?.qr_code_data && (
                    <div className="exams__admit-qr">
                      <div className="exams__admit-qr-placeholder">
                        <div className="exams__admit-qr-code">QR Code</div>
                        <p>Scan for verification</p>
                      </div>
                    </div>
                  )}

                  <div className="exams__admit-instructions">
                    <h4>Important Instructions:</h4>
                    <ul>
                      <li>Please arrive 30 minutes before the exam starts</li>
                      <li>Bring a valid ID card along with this admit card</li>
                      <li>
                        Electronic devices are not allowed in the exam hall
                      </li>
                      <li>Follow all examination rules and regulations</li>
                    </ul>
                  </div>
                </div>

                <div className="exams__admit-footer">
                  <button
                    className="exams__admit-download"
                    onClick={() => downloadAdmitCard(selectedExam)}
                  >
                    <Download size={18} />
                    Download PDF
                  </button>
                  <button
                    className="exams__admit-print"
                    onClick={() => window.print()}
                  >
                    <FileText size={18} />
                    Print
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Exams;
