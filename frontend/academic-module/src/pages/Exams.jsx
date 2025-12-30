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
import "../styles/pages/Exams.css";

// Mock Data
const mockExams = [
  {
    id: 1,
    courseCode: "CS301",
    courseName: "Data Structures",
    type: "Midterm",
    date: "2025-01-15",
    time: "9:00 AM - 12:00 PM",
    duration: "3 hours",
    room: "Engineering Block A-101",
    seat: "45",
    syllabus: [
      "Arrays and Strings",
      "Linked Lists",
      "Stacks and Queues",
      "Trees",
      "Graphs and Traversals",
    ],
    status: "upcoming",
    color: "#3b82f6",
    instructor: "Dr. Jane Smith",
  },
  {
    id: 2,
    courseCode: "MA202",
    courseName: "Calculus II",
    type: "Final",
    date: "2025-01-18",
    time: "2:00 PM - 5:00 PM",
    duration: "3 hours",
    room: "Mathematics Building B-205",
    seat: "28",
    syllabus: [
      "Integration Techniques",
      "Differential Equations",
      "Series and Sequences",
      "Multivariable Calculus",
      "Vector Calculus",
    ],
    status: "upcoming",
    color: "#8b5cf6",
    instructor: "Dr. Bob Johnson",
  },
  {
    id: 3,
    courseCode: "EN101",
    courseName: "English Composition",
    type: "Final",
    date: "2025-01-22",
    time: "10:00 AM - 1:00 PM",
    duration: "3 hours",
    room: "Humanities Building C-301",
    seat: "12",
    syllabus: [
      "Essay Writing",
      "Literary Analysis",
      "Research Methods",
      "Citation Styles",
      "Critical Thinking",
    ],
    status: "upcoming",
    color: "#10b981",
    instructor: "Prof. Sarah Lee",
  },
  {
    id: 4,
    courseCode: "PH201",
    courseName: "Physics I",
    type: "Midterm",
    date: "2024-12-10",
    time: "9:00 AM - 11:00 AM",
    duration: "2 hours",
    room: "Science Block D-102",
    seat: "33",
    syllabus: ["Mechanics", "Thermodynamics", "Waves", "Optics"],
    status: "completed",
    color: "#f59e0b",
    instructor: "Dr. Michael Chen",
    score: 88,
    grade: "A-",
  },
];

const Exams = () => {
  const [selectedExam, setSelectedExam] = useState(null);
  const [showAdmitCard, setShowAdmitCard] = useState(false);
  const [expandedExam, setExpandedExam] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState({});

  useEffect(() => {
    // Calculate time remaining for upcoming exams
    const timer = setInterval(() => {
      const remaining = {};
      mockExams.forEach((exam) => {
        if (exam.status === "upcoming") {
          const examDate = new Date(
            exam.date + " " + exam.time.split(" - ")[0]
          );
          const now = new Date();
          const diff = examDate - now;

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
  }, []);

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

  const upcomingExams = mockExams.filter((e) => e.status === "upcoming");
  const completedExams = mockExams.filter((e) => e.status === "completed");

  const toggleSyllabus = (examId) => {
    setExpandedExam(expandedExam === examId ? null : examId);
  };

  const openAdmitCard = (exam) => {
    setSelectedExam(exam);
    setShowAdmitCard(true);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

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
                                <li key={idx} className="exams__syllabus-item">
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
                    <div className="exams__completed-grade">{exam.grade}</div>
                  </div>
                  <div className="exams__completed-body">
                    <h3 className="exams__completed-title">
                      {exam.courseCode} - {exam.courseName}
                    </h3>
                    <div className="exams__completed-score">
                      Score: {exam.score}/100
                    </div>
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
                      <span>John Doe</span>
                    </div>
                    <div className="exams__admit-field">
                      <label>Roll Number:</label>
                      <span>UNI-2024-0123</span>
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

                  <div className="exams__admit-qr">
                    <div className="exams__admit-qr-placeholder">
                      <div className="exams__admit-qr-code">QR Code</div>
                      <p>Scan for verification</p>
                    </div>
                  </div>

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
                  <button className="exams__admit-download">
                    <Download size={18} />
                    Download PDF
                  </button>
                  <button className="exams__admit-print">
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
