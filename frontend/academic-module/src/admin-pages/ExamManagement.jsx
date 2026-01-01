import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Calendar,
  MapPin,
  Clock,
  Users,
  FileText,
  Search,
  Plus,
  Edit,
  Eye,
  Trash2,
  CheckCircle,
  XCircle,
  Download,
  QrCode,
  UserCheck,
  AlertCircle,
  Filter,
  Building,
  ClipboardCheck,
} from "lucide-react";
import {
  mockExaminations,
  mockExamSchedules,
  mockAdmitCards,
  mockExamRooms,
  mockInvigilators,
} from "../mock-data/examsMock";
import "../styles/admin-pages/AdminExamManagement.css";

export default function AdminExamManagement() {
  const [examinations, setExaminations] = useState(mockExaminations);
  const [schedules, setSchedules] = useState(mockExamSchedules);
  const [admitCards, setAdmitCards] = useState(mockAdmitCards);
  const [activeTab, setActiveTab] = useState("examinations"); // examinations, schedules, admit-cards, rooms
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // Form state for creating examination
  const [examForm, setExamForm] = useState({
    examName: "",
    courseCode: "",
    courseName: "",
    instructor: "",
    examType: "final",
    totalMarks: 100,
    weightage: 40,
    duration: 180,
    instructions: "",
    syllabus: "",
    isActive: true,
  });

  // Form state for scheduling
  const [scheduleForm, setScheduleForm] = useState({
    examId: "",
    date: "",
    startTime: "",
    endTime: "",
    roomId: "",
    invigilatorId: "",
  });

  // Calculate statistics
  const stats = {
    totalExams: examinations.length,
    activeExams: examinations.filter((e) => e.isActive).length,
    scheduledExams: schedules.length,
    totalAdmitCards: admitCards.length,
    downloadedCards: admitCards.filter((a) => a.isDownloaded).length,
    eligibleStudents: admitCards.filter(
      (a) => a.eligibilityStatus === "eligible"
    ).length,
  };

  // Filter examinations
  const filteredExaminations = examinations.filter((exam) => {
    const matchesSearch =
      exam.examName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.course.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === "all" || exam.examType === filterType;
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && exam.isActive) ||
      (filterStatus === "inactive" && !exam.isActive);

    return matchesSearch && matchesType && matchesStatus;
  });

  // Filter schedules
  const filteredSchedules = schedules.filter((schedule) => {
    return (
      schedule.exam.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Filter admit cards
  const filteredAdmitCards = admitCards.filter((card) => {
    return (
      card.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.student.regNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.exam.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleCreateExam = (e) => {
    e.preventDefault();
    const newExam = {
      id: Math.max(...examinations.map((e) => e.id)) + 1,
      examName: examForm.examName,
      course: {
        code: examForm.courseCode,
        name: examForm.courseName,
        instructor: examForm.instructor,
      },
      examType: examForm.examType,
      totalMarks: parseInt(examForm.totalMarks),
      weightage: parseInt(examForm.weightage),
      duration: parseInt(examForm.duration),
      instructions: examForm.instructions,
      syllabus: examForm.syllabus.split("\n").filter((s) => s.trim()),
      isActive: examForm.isActive,
      createdAt: new Date().toISOString(),
      createdBy: "Current User",
    };
    setExaminations([...examinations, newExam]);
    setShowCreateModal(false);
    resetExamForm();
  };

  const handleCreateSchedule = (e) => {
    e.preventDefault();
    const exam = examinations.find(
      (e) => e.id === parseInt(scheduleForm.examId)
    );
    const room = mockExamRooms.find(
      (r) => r.id === parseInt(scheduleForm.roomId)
    );
    const invigilator = mockInvigilators.find(
      (i) => i.id === parseInt(scheduleForm.invigilatorId)
    );

    const newSchedule = {
      id: Math.max(...schedules.map((s) => s.id)) + 1,
      exam: {
        id: exam.id,
        name: exam.examName,
        course: `${exam.course.code} - ${exam.course.name}`,
      },
      date: scheduleForm.date,
      startTime: scheduleForm.startTime,
      endTime: scheduleForm.endTime,
      room: {
        id: room.id,
        roomNumber: room.roomNumber,
        building: room.building,
        capacity: room.capacity,
      },
      invigilator: {
        id: invigilator.id,
        name: invigilator.name,
      },
      enrolledStudents: 0,
      admitCardsGenerated: 0,
      status: "scheduled",
    };
    setSchedules([...schedules, newSchedule]);
    setShowScheduleModal(false);
    resetScheduleForm();
  };

  const deleteExamination = (id) => {
    if (window.confirm("Are you sure you want to delete this examination?")) {
      setExaminations(examinations.filter((e) => e.id !== id));
    }
  };

  const deleteSchedule = (id) => {
    if (window.confirm("Are you sure you want to delete this schedule?")) {
      setSchedules(schedules.filter((s) => s.id !== id));
    }
  };

  const toggleExamStatus = (id) => {
    setExaminations(
      examinations.map((e) =>
        e.id === id ? { ...e, isActive: !e.isActive } : e
      )
    );
  };

  const generateAdmitCard = (scheduleId) => {
    alert(`Generating admit cards for schedule #${scheduleId}`);
  };

  const openDetailsModal = (item) => {
    setSelectedItem(item);
    setShowDetailsModal(true);
  };

  const resetExamForm = () => {
    setExamForm({
      examName: "",
      courseCode: "",
      courseName: "",
      instructor: "",
      examType: "final",
      totalMarks: 100,
      weightage: 40,
      duration: 180,
      instructions: "",
      syllabus: "",
      isActive: true,
    });
  };

  const resetScheduleForm = () => {
    setScheduleForm({
      examId: "",
      date: "",
      startTime: "",
      endTime: "",
      roomId: "",
      invigilatorId: "",
    });
  };

  const getExamTypeColor = (type) => {
    const colors = {
      final: "#dc2626",
      midterm: "#f59e0b",
      quiz: "#3b82f6",
      practical: "#8b5cf6",
    };
    return colors[type] || "#6b7280";
  };

  const getStatusColor = (status) => {
    const colors = {
      scheduled: "#3b82f6",
      ongoing: "#f59e0b",
      completed: "#10b981",
      cancelled: "#6b7280",
    };
    return colors[status] || "#6b7280";
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="exam-management"
    >
      {/* Header */}
      <div className="exam-management__header">
        <div>
          <h1 className="exam-management__title">Exam Management</h1>
          <p className="exam-management__subtitle">
            Manage examinations, schedules, and admit cards
          </p>
        </div>
        <div className="exam-management__header-actions">
          {activeTab === "examinations" && (
            <button
              className="btn btn--primary"
              onClick={() => setShowCreateModal(true)}
            >
              <Plus size={18} />
              Create Exam
            </button>
          )}
          {activeTab === "schedules" && (
            <button
              className="btn btn--primary"
              onClick={() => setShowScheduleModal(true)}
            >
              <Plus size={18} />
              Schedule Exam
            </button>
          )}
          {activeTab === "admit-cards" && (
            <button className="btn btn--secondary">
              <Download size={18} />
              Download All
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="exam-management__tabs">
        <button
          className={`tab ${activeTab === "examinations" ? "tab--active" : ""}`}
          onClick={() => setActiveTab("examinations")}
        >
          <BookOpen size={18} />
          Examinations
        </button>
        <button
          className={`tab ${activeTab === "schedules" ? "tab--active" : ""}`}
          onClick={() => setActiveTab("schedules")}
        >
          <Calendar size={18} />
          Schedules
        </button>
        <button
          className={`tab ${activeTab === "admit-cards" ? "tab--active" : ""}`}
          onClick={() => setActiveTab("admit-cards")}
        >
          <FileText size={18} />
          Admit Cards
        </button>
        <button
          className={`tab ${activeTab === "rooms" ? "tab--active" : ""}`}
          onClick={() => setActiveTab("rooms")}
        >
          <Building size={18} />
          Exam Rooms
        </button>
      </div>

      {/* Statistics */}
      <div className="exam-management__stats">
        <StatCard
          icon={<BookOpen />}
          title="Total Exams"
          value={stats.totalExams}
          color="#3b82f6"
        />
        <StatCard
          icon={<Calendar />}
          title="Scheduled"
          value={stats.scheduledExams}
          color="#10b981"
        />
        <StatCard
          icon={<FileText />}
          title="Admit Cards"
          value={stats.totalAdmitCards}
          color="#f59e0b"
        />
        <StatCard
          icon={<CheckCircle />}
          title="Eligible Students"
          value={stats.eligibleStudents}
          color="#8b5cf6"
        />
      </div>

      {/* Examinations Tab */}
      {activeTab === "examinations" && (
        <>
          {/* Filters */}
          <div className="exam-management__filters">
            <div className="filter-group">
              <div className="input-with-icon">
                <Search size={18} />
                <input
                  type="text"
                  placeholder="Search examinations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="filter-input"
                />
              </div>

              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Types</option>
                <option value="final">Final</option>
                <option value="midterm">Midterm</option>
                <option value="quiz">Quiz</option>
                <option value="practical">Practical</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Examinations Grid */}
          <div className="examinations-grid">
            {filteredExaminations.map((exam) => (
              <motion.div
                key={exam.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="exam-card"
              >
                <div className="exam-card__header">
                  <div>
                    <h3 className="exam-card__title">{exam.examName}</h3>
                    <p className="exam-card__course">
                      {exam.course.code} - {exam.course.name}
                    </p>
                  </div>
                  <span
                    className="exam-type-badge"
                    style={{
                      backgroundColor: `${getExamTypeColor(exam.examType)}20`,
                      color: getExamTypeColor(exam.examType),
                    }}
                  >
                    {exam.examType.toUpperCase()}
                  </span>
                </div>

                <div className="exam-card__details">
                  <div className="exam-detail">
                    <Clock size={16} />
                    <span>{exam.duration} minutes</span>
                  </div>
                  <div className="exam-detail">
                    <FileText size={16} />
                    <span>{exam.totalMarks} marks</span>
                  </div>
                  <div className="exam-detail">
                    <UserCheck size={16} />
                    <span>{exam.weightage}% weightage</span>
                  </div>
                </div>

                <div className="exam-card__instructor">
                  <Users size={14} />
                  <span>{exam.course.instructor}</span>
                </div>

                <div className="exam-card__status">
                  {exam.isActive ? (
                    <span className="status-badge status-badge--active">
                      <CheckCircle size={14} />
                      Active
                    </span>
                  ) : (
                    <span className="status-badge status-badge--inactive">
                      <XCircle size={14} />
                      Inactive
                    </span>
                  )}
                </div>

                <div className="exam-card__actions">
                  <button
                    className="action-btn action-btn--view"
                    onClick={() => openDetailsModal(exam)}
                    title="View Details"
                  >
                    <Eye size={16} />
                  </button>
                  <button className="action-btn action-btn--edit" title="Edit">
                    <Edit size={16} />
                  </button>
                  <button
                    className="action-btn action-btn--toggle"
                    onClick={() => toggleExamStatus(exam.id)}
                    title={exam.isActive ? "Deactivate" : "Activate"}
                  >
                    {exam.isActive ? (
                      <XCircle size={16} />
                    ) : (
                      <CheckCircle size={16} />
                    )}
                  </button>
                  <button
                    className="action-btn action-btn--delete"
                    onClick={() => deleteExamination(exam.id)}
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {/* Schedules Tab */}
      {activeTab === "schedules" && (
        <>
          <div className="exam-management__filters">
            <div className="filter-group">
              <div className="input-with-icon">
                <Search size={18} />
                <input
                  type="text"
                  placeholder="Search schedules..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="filter-input"
                />
              </div>
            </div>
          </div>

          <div className="schedules-table-container">
            <table className="schedules-table">
              <thead>
                <tr>
                  <th>Exam</th>
                  <th>Date & Time</th>
                  <th>Room</th>
                  <th>Invigilator</th>
                  <th>Students</th>
                  <th>Admit Cards</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSchedules.map((schedule) => (
                  <motion.tr
                    key={schedule.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <td>
                      <div className="schedule-exam">
                        <span className="schedule-exam__name">
                          {schedule.exam.name}
                        </span>
                        <span className="schedule-exam__course">
                          {schedule.exam.course}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="schedule-datetime">
                        <Calendar size={14} />
                        <span>
                          {new Date(schedule.date).toLocaleDateString()}
                        </span>
                        <Clock size={14} />
                        <span>
                          {schedule.startTime} - {schedule.endTime}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="schedule-room">
                        <MapPin size={14} />
                        <div>
                          <span className="schedule-room__number">
                            {schedule.room.roomNumber}
                          </span>
                          <span className="schedule-room__building">
                            {schedule.room.building}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="schedule-invigilator">
                        <UserCheck size={14} />
                        <span>{schedule.invigilator.name}</span>
                      </div>
                    </td>
                    <td>
                      <span className="student-count">
                        {schedule.enrolledStudents} / {schedule.room.capacity}
                      </span>
                    </td>
                    <td>
                      <div className="admit-card-progress">
                        <span>
                          {schedule.admitCardsGenerated} /{" "}
                          {schedule.enrolledStudents}
                        </span>
                        <div className="progress-bar">
                          <div
                            className="progress-bar__fill"
                            style={{
                              width: `${
                                (schedule.admitCardsGenerated /
                                  schedule.enrolledStudents) *
                                100
                              }%`,
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td>
                      <span
                        className="status-badge"
                        style={{
                          backgroundColor: `${getStatusColor(
                            schedule.status
                          )}20`,
                          color: getStatusColor(schedule.status),
                        }}
                      >
                        {schedule.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="action-btn action-btn--primary"
                          onClick={() => generateAdmitCard(schedule.id)}
                          title="Generate Admit Cards"
                        >
                          <QrCode size={16} />
                        </button>
                        <button
                          className="action-btn action-btn--edit"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          className="action-btn action-btn--delete"
                          onClick={() => deleteSchedule(schedule.id)}
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Admit Cards Tab */}
      {activeTab === "admit-cards" && (
        <>
          <div className="exam-management__filters">
            <div className="filter-group">
              <div className="input-with-icon">
                <Search size={18} />
                <input
                  type="text"
                  placeholder="Search admit cards..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="filter-input"
                />
              </div>
            </div>
          </div>

          <div className="admit-cards-grid">
            {filteredAdmitCards.map((card) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="admit-card"
              >
                <div className="admit-card__header">
                  <div className="admit-card__student">
                    <div className="student-avatar">
                      {card.student.name.charAt(0)}
                    </div>
                    <div>
                      <h4>{card.student.name}</h4>
                      <p>{card.student.regNumber}</p>
                    </div>
                  </div>
                  <span
                    className={`eligibility-badge ${
                      card.eligibilityStatus === "eligible"
                        ? "eligibility-badge--eligible"
                        : "eligibility-badge--not-eligible"
                    }`}
                  >
                    {card.eligibilityStatus === "eligible" ? (
                      <>
                        <CheckCircle size={14} /> Eligible
                      </>
                    ) : (
                      <>
                        <AlertCircle size={14} /> Not Eligible
                      </>
                    )}
                  </span>
                </div>

                <div className="admit-card__exam">
                  <h5>{card.exam.name}</h5>
                  <div className="admit-card__details">
                    <div className="admit-card__detail">
                      <Calendar size={14} />
                      <span>{card.exam.date}</span>
                    </div>
                    <div className="admit-card__detail">
                      <Clock size={14} />
                      <span>{card.exam.time}</span>
                    </div>
                    <div className="admit-card__detail">
                      <MapPin size={14} />
                      <span>Room {card.exam.room}</span>
                    </div>
                  </div>
                </div>

                <div className="admit-card__info">
                  <div className="info-item">
                    <span className="info-label">Seat Number:</span>
                    <span className="info-value">{card.seatNumber}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Issued:</span>
                    <span className="info-value">
                      {new Date(card.issuedDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Downloaded:</span>
                    <span className="info-value">
                      {card.isDownloaded ? (
                        <CheckCircle
                          size={14}
                          className="status-icon--success"
                        />
                      ) : (
                        <XCircle size={14} className="status-icon--warning" />
                      )}
                    </span>
                  </div>
                </div>

                <div className="admit-card__actions">
                  <button className="btn btn--sm btn--secondary">
                    <Eye size={14} />
                    Preview
                  </button>
                  <button className="btn btn--sm btn--primary">
                    <Download size={14} />
                    Download
                  </button>
                  <button className="btn btn--sm btn--secondary">
                    <QrCode size={14} />
                    QR Code
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {/* Exam Rooms Tab */}
      {activeTab === "rooms" && (
        <div className="rooms-grid">
          {mockExamRooms.map((room) => (
            <motion.div
              key={room.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="room-card"
            >
              <div className="room-card__header">
                <Building size={24} className="room-icon" />
                <div>
                  <h3 className="room-number">{room.roomNumber}</h3>
                  <p className="room-building">{room.building}</p>
                </div>
              </div>

              <div className="room-card__details">
                <div className="room-detail">
                  <Users size={16} />
                  <span>Capacity: {room.capacity}</span>
                </div>
                <div className="room-detail">
                  <span
                    className={`availability-badge ${
                      room.isAvailable
                        ? "availability-badge--available"
                        : "availability-badge--unavailable"
                    }`}
                  >
                    {room.isAvailable ? "Available" : "Not Available"}
                  </span>
                </div>
              </div>

              <div className="room-facilities">
                <h4>Facilities:</h4>
                <div className="facilities-list">
                  {room.facilities.map((facility, index) => (
                    <span key={index} className="facility-tag">
                      {facility}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Exam Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <Modal
            onClose={() => {
              setShowCreateModal(false);
              resetExamForm();
            }}
          >
            <h2 className="modal__title">Create New Examination</h2>
            <form onSubmit={handleCreateExam} className="exam-form">
              <div className="form-grid">
                <div className="form-field form-field--full">
                  <label>Exam Name *</label>
                  <input
                    type="text"
                    required
                    value={examForm.examName}
                    onChange={(e) =>
                      setExamForm({ ...examForm, examName: e.target.value })
                    }
                    placeholder="e.g., CS301 Final Exam"
                  />
                </div>

                <div className="form-field">
                  <label>Course Code *</label>
                  <input
                    type="text"
                    required
                    value={examForm.courseCode}
                    onChange={(e) =>
                      setExamForm({ ...examForm, courseCode: e.target.value })
                    }
                    placeholder="e.g., CS301"
                  />
                </div>

                <div className="form-field">
                  <label>Course Name *</label>
                  <input
                    type="text"
                    required
                    value={examForm.courseName}
                    onChange={(e) =>
                      setExamForm({ ...examForm, courseName: e.target.value })
                    }
                    placeholder="e.g., Data Structures"
                  />
                </div>

                <div className="form-field">
                  <label>Instructor *</label>
                  <input
                    type="text"
                    required
                    value={examForm.instructor}
                    onChange={(e) =>
                      setExamForm({ ...examForm, instructor: e.target.value })
                    }
                    placeholder="e.g., Dr. Jane Smith"
                  />
                </div>

                <div className="form-field">
                  <label>Exam Type *</label>
                  <select
                    required
                    value={examForm.examType}
                    onChange={(e) =>
                      setExamForm({ ...examForm, examType: e.target.value })
                    }
                  >
                    <option value="final">Final</option>
                    <option value="midterm">Midterm</option>
                    <option value="quiz">Quiz</option>
                    <option value="practical">Practical</option>
                  </select>
                </div>

                <div className="form-field">
                  <label>Total Marks *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={examForm.totalMarks}
                    onChange={(e) =>
                      setExamForm({ ...examForm, totalMarks: e.target.value })
                    }
                  />
                </div>

                <div className="form-field">
                  <label>Weightage (%) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="100"
                    value={examForm.weightage}
                    onChange={(e) =>
                      setExamForm({ ...examForm, weightage: e.target.value })
                    }
                  />
                </div>

                <div className="form-field">
                  <label>Duration (minutes) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={examForm.duration}
                    onChange={(e) =>
                      setExamForm({ ...examForm, duration: e.target.value })
                    }
                  />
                </div>

                <div className="form-field form-field--full">
                  <label>Instructions</label>
                  <textarea
                    value={examForm.instructions}
                    onChange={(e) =>
                      setExamForm({ ...examForm, instructions: e.target.value })
                    }
                    rows="3"
                    placeholder="Exam instructions..."
                  />
                </div>

                <div className="form-field form-field--full">
                  <label>Syllabus (one per line)</label>
                  <textarea
                    value={examForm.syllabus}
                    onChange={(e) =>
                      setExamForm({ ...examForm, syllabus: e.target.value })
                    }
                    rows="4"
                    placeholder="Chapter 1&#10;Chapter 2&#10;Lab assignments"
                  />
                </div>

                <div className="form-checkbox">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={examForm.isActive}
                    onChange={(e) =>
                      setExamForm({ ...examForm, isActive: e.target.checked })
                    }
                  />
                  <label htmlFor="isActive">Exam is active</label>
                </div>
              </div>

              <div className="modal__actions">
                <button
                  type="button"
                  className="btn btn--secondary"
                  onClick={() => {
                    setShowCreateModal(false);
                    resetExamForm();
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn--primary">
                  <Plus size={18} />
                  Create Exam
                </button>
              </div>
            </form>
          </Modal>
        )}
      </AnimatePresence>

      {/* Schedule Exam Modal */}
      <AnimatePresence>
        {showScheduleModal && (
          <Modal
            onClose={() => {
              setShowScheduleModal(false);
              resetScheduleForm();
            }}
          >
            <h2 className="modal__title">Schedule Examination</h2>
            <form onSubmit={handleCreateSchedule} className="schedule-form">
              <div className="form-grid">
                <div className="form-field form-field--full">
                  <label>Select Exam *</label>
                  <select
                    required
                    value={scheduleForm.examId}
                    onChange={(e) =>
                      setScheduleForm({
                        ...scheduleForm,
                        examId: e.target.value,
                      })
                    }
                  >
                    <option value="">Choose an exam...</option>
                    {examinations
                      .filter((e) => e.isActive)
                      .map((exam) => (
                        <option key={exam.id} value={exam.id}>
                          {exam.examName} ({exam.course.code})
                        </option>
                      ))}
                  </select>
                </div>

                <div className="form-field">
                  <label>Exam Date *</label>
                  <input
                    type="date"
                    required
                    value={scheduleForm.date}
                    onChange={(e) =>
                      setScheduleForm({ ...scheduleForm, date: e.target.value })
                    }
                  />
                </div>

                <div className="form-field">
                  <label>Start Time *</label>
                  <input
                    type="time"
                    required
                    value={scheduleForm.startTime}
                    onChange={(e) =>
                      setScheduleForm({
                        ...scheduleForm,
                        startTime: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="form-field">
                  <label>End Time *</label>
                  <input
                    type="time"
                    required
                    value={scheduleForm.endTime}
                    onChange={(e) =>
                      setScheduleForm({
                        ...scheduleForm,
                        endTime: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="form-field">
                  <label>Exam Room *</label>
                  <select
                    required
                    value={scheduleForm.roomId}
                    onChange={(e) =>
                      setScheduleForm({
                        ...scheduleForm,
                        roomId: e.target.value,
                      })
                    }
                  >
                    <option value="">Choose a room...</option>
                    {mockExamRooms
                      .filter((r) => r.isAvailable)
                      .map((room) => (
                        <option key={room.id} value={room.id}>
                          {room.roomNumber} - {room.building} (Capacity:{" "}
                          {room.capacity})
                        </option>
                      ))}
                  </select>
                </div>

                <div className="form-field">
                  <label>Invigilator *</label>
                  <select
                    required
                    value={scheduleForm.invigilatorId}
                    onChange={(e) =>
                      setScheduleForm({
                        ...scheduleForm,
                        invigilatorId: e.target.value,
                      })
                    }
                  >
                    <option value="">Choose an invigilator...</option>
                    {mockInvigilators
                      .filter((i) => i.isAvailable)
                      .map((invigilator) => (
                        <option key={invigilator.id} value={invigilator.id}>
                          {invigilator.name} ({invigilator.department})
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="modal__actions">
                <button
                  type="button"
                  className="btn btn--secondary"
                  onClick={() => {
                    setShowScheduleModal(false);
                    resetScheduleForm();
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn--primary">
                  <Calendar size={18} />
                  Schedule Exam
                </button>
              </div>
            </form>
          </Modal>
        )}
      </AnimatePresence>

      {/* Details Modal */}
      <AnimatePresence>
        {showDetailsModal && selectedItem && (
          <Modal onClose={() => setShowDetailsModal(false)}>
            <h2 className="modal__title">Examination Details</h2>
            <div className="exam-details">
              <div className="exam-details__header">
                <div>
                  <h3>{selectedItem.examName}</h3>
                  <p className="exam-details__course">
                    {selectedItem.course.code} - {selectedItem.course.name}
                  </p>
                </div>
                <span
                  className="exam-type-badge exam-type-badge--large"
                  style={{
                    backgroundColor: `${getExamTypeColor(
                      selectedItem.examType
                    )}20`,
                    color: getExamTypeColor(selectedItem.examType),
                  }}
                >
                  {selectedItem.examType.toUpperCase()}
                </span>
              </div>

              <div className="exam-details__section">
                <h4>Course Information</h4>
                <div className="detail-row">
                  <span className="detail-label">Instructor:</span>
                  <span className="detail-value">
                    {selectedItem.course.instructor}
                  </span>
                </div>
              </div>

              <div className="exam-details__section">
                <h4>Exam Details</h4>
                <div className="detail-row">
                  <span className="detail-label">Total Marks:</span>
                  <span className="detail-value">
                    {selectedItem.totalMarks}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Weightage:</span>
                  <span className="detail-value">
                    {selectedItem.weightage}%
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Duration:</span>
                  <span className="detail-value">
                    {selectedItem.duration} minutes
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Status:</span>
                  <span className="detail-value">
                    {selectedItem.isActive ? (
                      <span className="status-badge status-badge--active">
                        <CheckCircle size={14} /> Active
                      </span>
                    ) : (
                      <span className="status-badge status-badge--inactive">
                        <XCircle size={14} /> Inactive
                      </span>
                    )}
                  </span>
                </div>
              </div>

              {selectedItem.instructions && (
                <div className="exam-details__section">
                  <h4>Instructions</h4>
                  <p className="exam-details__text">
                    {selectedItem.instructions}
                  </p>
                </div>
              )}

              {selectedItem.syllabus && selectedItem.syllabus.length > 0 && (
                <div className="exam-details__section">
                  <h4>Syllabus</h4>
                  <ul className="syllabus-list">
                    {selectedItem.syllabus.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="exam-details__section">
                <h4>Metadata</h4>
                <div className="detail-row">
                  <span className="detail-label">Created By:</span>
                  <span className="detail-value">{selectedItem.createdBy}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Created At:</span>
                  <span className="detail-value">
                    {new Date(selectedItem.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="modal__actions">
              <button
                className="btn btn--secondary"
                onClick={() => setShowDetailsModal(false)}
              >
                Close
              </button>
              <button className="btn btn--primary">
                <Edit size={18} />
                Edit Exam
              </button>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Helper Components
function StatCard({ icon, title, value, color }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="stat-card"
      style={{ borderLeftColor: color }}
    >
      <div className="stat-card__icon" style={{ color }}>
        {icon}
      </div>
      <div className="stat-card__content">
        <span className="stat-card__title">{title}</span>
        <span className="stat-card__value">{value}</span>
      </div>
    </motion.div>
  );
}

function Modal({ onClose, children }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="modal-overlay"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="modal"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
