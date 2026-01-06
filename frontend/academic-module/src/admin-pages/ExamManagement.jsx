import React, { useState, useEffect } from "react";
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
  Building,
  RefreshCw,
} from "lucide-react";
import { adminService } from "../services/api/adminService";
import "../styles/admin-pages/exam-management.css";

export default function AdminExamManagement() {
  const [examinations, setExaminations] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [admitCards, setAdmitCards] = useState([]);
  const [examRooms, setExamRooms] = useState([]);
  const [courseOfferings, setCourseOfferings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("examinations");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const [examForm, setExamForm] = useState({
    offering_id: "",
    exam_name: "",
    exam_type: "final",
    total_marks: 100,
    duration_minutes: 180,
    instructions: "",
    passing_marks: 40,
  });

  const [scheduleForm, setScheduleForm] = useState({
    exam_id: "",
    exam_date: "",
    start_time: "",
    end_time: "",
    room_id: "",
    invigilator_id: "",
  });

  const examTypes = [
    { value: "final", label: "Final Exam" },
    { value: "midterm", label: "Midterm Exam" },
    { value: "quiz", label: "Quiz" },
    { value: "practical", label: "Practical" },
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [examsRes, schedulesRes, admitCardsRes, roomsRes, offeringsRes] =
        await Promise.all([
          adminService.getExaminations?.() ||
            Promise.resolve({ success: true, data: [] }),
          adminService.getExamSchedules(),
          adminService.getAdmitCards?.() ||
            Promise.resolve({ success: true, data: [] }),
          adminService.getExamRooms?.() ||
            Promise.resolve({ success: true, data: [] }),
          adminService.getCourseOfferings(),
        ]);

      if (examsRes.success) setExaminations(examsRes.data);
      if (schedulesRes.success) setSchedules(schedulesRes.data);
      if (admitCardsRes.success) setAdmitCards(admitCardsRes.data);
      if (roomsRes.success) setExamRooms(roomsRes.data);
      if (offeringsRes.success) setCourseOfferings(offeringsRes.data);
    } catch (err) {
      setError("Failed to load data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    totalExams: examinations.length,
    scheduledExams: schedules.length,
    totalAdmitCards: admitCards.length,
    eligibleStudents: admitCards.filter(
      (a) => a.eligibility_status === "eligible"
    ).length,
  };

  const filteredExaminations = examinations.filter((exam) => {
    const matchesSearch =
      exam.exam_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.offering?.course?.course_code
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      exam.offering?.course?.course_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || exam.exam_type === filterType;
    return matchesSearch && matchesType;
  });

  const filteredSchedules = schedules.filter((schedule) => {
    return (
      schedule.exam?.exam_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      schedule.room?.room_number
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  });

  const filteredAdmitCards = admitCards.filter((card) => {
    const studentName = card.student
      ? `${card.student.first_name || ""} ${
          card.student.last_name || ""
        }`.toLowerCase()
      : "";
    return (
      studentName.includes(searchTerm.toLowerCase()) ||
      card.student?.university_reg_number
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      card.exam?.exam_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleCreateExam = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const result = await adminService.createExamination?.(examForm);
      if (result?.success) {
        showSuccess("Examination created successfully");
        setShowCreateModal(false);
        resetExamForm();
        await loadData();
      } else {
        setError(result?.error || "Failed to create examination");
      }
    } catch (err) {
      setError("Failed to create examination");
      console.error(err);
    }
  };

  const handleCreateSchedule = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const result = await adminService.createExamSchedule?.(scheduleForm);
      if (result?.success) {
        showSuccess("Exam scheduled successfully");
        setShowScheduleModal(false);
        resetScheduleForm();
        await loadData();
      } else {
        setError(result?.error || "Failed to schedule exam");
      }
    } catch (err) {
      setError("Failed to schedule exam");
      console.error(err);
    }
  };

  const handleDeleteExam = async (examId) => {
    if (window.confirm("Are you sure you want to delete this examination?")) {
      setError(null);
      try {
        const result = await adminService.deleteExamination?.(examId);
        if (result?.success) {
          showSuccess("Examination deleted successfully");
          await loadData();
        } else {
          setError(result?.error || "Failed to delete examination");
        }
      } catch (err) {
        setError("Failed to delete examination");
        console.error(err);
      }
    }
  };

  const handleDeleteSchedule = async (scheduleId) => {
    if (window.confirm("Are you sure you want to delete this schedule?")) {
      setError(null);
      try {
        const result = await adminService.deleteExamSchedule?.(scheduleId);
        if (result?.success) {
          showSuccess("Schedule deleted successfully");
          await loadData();
        } else {
          setError(result?.error || "Failed to delete schedule");
        }
      } catch (err) {
        setError("Failed to delete schedule");
        console.error(err);
      }
    }
  };

  const generateAdmitCards = async (scheduleId) => {
    setError(null);
    try {
      const result = await adminService.generateAdmitCards?.(scheduleId);
      if (result?.success) {
        showSuccess("Admit cards generated successfully");
        await loadData();
      } else {
        setError(result?.error || "Failed to generate admit cards");
      }
    } catch (err) {
      setError("Failed to generate admit cards");
      console.error(err);
    }
  };

  const openDetailsModal = (item) => {
    setSelectedItem(item);
    setShowDetailsModal(true);
  };

  const resetExamForm = () => {
    setExamForm({
      offering_id: "",
      exam_name: "",
      exam_type: "final",
      total_marks: 100,
      duration_minutes: 180,
      instructions: "",
      passing_marks: 40,
    });
  };

  const resetScheduleForm = () => {
    setScheduleForm({
      exam_id: "",
      exam_date: "",
      start_time: "",
      end_time: "",
      room_id: "",
      invigilator_id: "",
    });
  };

  const getExamTypeColor = (type) => {
    const colors = {
      final: "#8c2828",
      midterm: "#8a5c1f",
      quiz: "#1e4a7a",
      practical: "#524a75",
    };
    return colors[type] || "#525252";
  };

  if (loading) {
    return (
      <div className="exam-management__loading">
        <div className="exam-management__spinner" />
        <p>Loading exam data...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="exam-management"
    >
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="exam-management__success"
          >
            <CheckCircle size={16} />
            {successMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <div className="exam-management__error">
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="exam-management__error-close"
          >
            ×
          </button>
        </div>
      )}

      <div className="exam-management__header">
        <div className="exam-management__header-content">
          <h1 className="exam-management__title">Exam Management</h1>
          <p className="exam-management__subtitle">
            Manage examinations, schedules, and admit cards
          </p>
        </div>
        <div className="exam-management__actions">
          <button onClick={loadData} className="btn btn--secondary">
            <RefreshCw size={16} />
            Refresh
          </button>
          {activeTab === "examinations" && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn btn--primary"
            >
              <Plus size={16} />
              Create Exam
            </button>
          )}
          {activeTab === "schedules" && (
            <button
              onClick={() => setShowScheduleModal(true)}
              className="btn btn--primary"
            >
              <Plus size={16} />
              Schedule Exam
            </button>
          )}
        </div>
      </div>

      <div className="exam-management__tabs">
        <TabButton
          active={activeTab === "examinations"}
          onClick={() => setActiveTab("examinations")}
          icon={<BookOpen size={16} />}
          label="Examinations"
        />
        <TabButton
          active={activeTab === "schedules"}
          onClick={() => setActiveTab("schedules")}
          icon={<Calendar size={16} />}
          label="Schedules"
        />
        <TabButton
          active={activeTab === "admit-cards"}
          onClick={() => setActiveTab("admit-cards")}
          icon={<FileText size={16} />}
          label="Admit Cards"
        />
        <TabButton
          active={activeTab === "rooms"}
          onClick={() => setActiveTab("rooms")}
          icon={<Building size={16} />}
          label="Exam Rooms"
        />
      </div>

      <div className="exam-management__stats">
        <StatCard
          icon={<BookOpen size={20} />}
          title="Total Exams"
          value={stats.totalExams}
          color="#2c4a6e"
        />
        <StatCard
          icon={<Calendar size={20} />}
          title="Scheduled"
          value={stats.scheduledExams}
          color="#1a5c3a"
        />
        <StatCard
          icon={<FileText size={20} />}
          title="Admit Cards"
          value={stats.totalAdmitCards}
          color="#8a5c1f"
        />
        <StatCard
          icon={<CheckCircle size={20} />}
          title="Eligible Students"
          value={stats.eligibleStudents}
          color="#524a75"
        />
      </div>

      {activeTab === "examinations" && (
        <>
          <div className="exam-management__filters">
            <div className="filter-group filter-group--two">
              <div className="filter-field">
                <label>Search</label>
                <div className="filter-field__input-wrapper">
                  <Search size={16} className="filter-field__icon" />
                  <input
                    type="text"
                    placeholder="Search examinations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="filter-field__input"
                  />
                </div>
              </div>

              <div className="filter-field">
                <label>Exam Type</label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="filter-field__select"
                >
                  <option value="all">All Types</option>
                  {examTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {filteredExaminations.length === 0 ? (
            <div className="exam-management__empty">
              <p className="exam-management__empty-title">
                No examinations found
              </p>
              <p className="exam-management__empty-text">
                Create your first examination to get started
              </p>
            </div>
          ) : (
            <div className="exam-management__grid">
              {filteredExaminations.map((exam) => (
                <ExamCard
                  key={exam.exam_id}
                  exam={exam}
                  onView={openDetailsModal}
                  onDelete={handleDeleteExam}
                  getExamTypeColor={getExamTypeColor}
                />
              ))}
            </div>
          )}
        </>
      )}

      {activeTab === "schedules" && (
        <>
          <div className="exam-management__filters">
            <div className="filter-group filter-group--two">
              <div className="filter-field">
                <label>Search</label>
                <div className="filter-field__input-wrapper">
                  <Search size={16} className="filter-field__icon" />
                  <input
                    type="text"
                    placeholder="Search schedules..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="filter-field__input"
                  />
                </div>
              </div>
            </div>
          </div>

          {filteredSchedules.length === 0 ? (
            <EmptyState
              message="No schedules found"
              subMessage="Schedule an examination to get started"
            />
          ) : (
            <ScheduleTable
              schedules={filteredSchedules}
              onGenerateAdmitCards={generateAdmitCards}
              onDelete={handleDeleteSchedule}
            />
          )}
        </>
      )}

      {activeTab === "admit-cards" && (
        <>
          <div className="exam-management__filters">
            <div className="filter-group filter-group--two">
              <div className="filter-field">
                <label>Search</label>
                <div className="filter-field__input-wrapper">
                  <Search size={16} className="filter-field__icon" />
                  <input
                    type="text"
                    placeholder="Search admit cards..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="filter-field__input"
                  />
                </div>
              </div>
            </div>
          </div>

          {filteredAdmitCards.length === 0 ? (
            <EmptyState message="No admit cards found" />
          ) : (
            <div className="exam-management__grid">
              {filteredAdmitCards.map((card) => (
                <AdmitCardItem key={card.admit_card_id} card={card} />
              ))}
            </div>
          )}
        </>
      )}

      {activeTab === "rooms" && (
        <>
          {examRooms.length === 0 ? (
            <EmptyState message="No exam rooms found" />
          ) : (
            <div className="exam-management__grid exam-management__grid--three">
              {examRooms.map((room) => (
                <RoomCard key={room.room_id} room={room} />
              ))}
            </div>
          )}
        </>
      )}

      <AnimatePresence>
        {showCreateModal && (
          <Modal
            onClose={() => {
              setShowCreateModal(false);
              resetExamForm();
            }}
          >
            <CreateExamForm
              examForm={examForm}
              setExamForm={setExamForm}
              courseOfferings={courseOfferings}
              examTypes={examTypes}
              onSubmit={handleCreateExam}
              onCancel={() => {
                setShowCreateModal(false);
                resetExamForm();
              }}
            />
          </Modal>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showScheduleModal && (
          <Modal
            onClose={() => {
              setShowScheduleModal(false);
              resetScheduleForm();
            }}
          >
            <ScheduleExamForm
              scheduleForm={scheduleForm}
              setScheduleForm={setScheduleForm}
              examinations={examinations}
              examRooms={examRooms}
              onSubmit={handleCreateSchedule}
              onCancel={() => {
                setShowScheduleModal(false);
                resetScheduleForm();
              }}
            />
          </Modal>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDetailsModal && selectedItem && (
          <Modal onClose={() => setShowDetailsModal(false)}>
            <ExamDetails
              exam={selectedItem}
              getExamTypeColor={getExamTypeColor}
              onClose={() => setShowDetailsModal(false)}
            />
          </Modal>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function ExamCard({ exam, onView, onDelete, getExamTypeColor }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="exam-card"
    >
      <div className="exam-card__header">
        <div>
          <h3 className="exam-card__title">{exam.exam_name}</h3>
          <p className="exam-card__course">
            {exam.offering?.course?.course_code} -{" "}
            {exam.offering?.course?.course_name}
          </p>
        </div>
        <span
          className="exam-card__type-badge"
          style={{
            backgroundColor: `${getExamTypeColor(exam.exam_type)}15`,
            color: getExamTypeColor(exam.exam_type),
          }}
        >
          {exam.exam_type}
        </span>
      </div>

      <div className="exam-card__details">
        <div className="exam-card__detail">
          <Clock size={14} />
          <span>{exam.duration_minutes} minutes</span>
        </div>
        <div className="exam-card__detail">
          <FileText size={14} />
          <span>{exam.total_marks} marks</span>
        </div>
        {exam.offering?.faculty && (
          <div className="exam-card__detail">
            <Users size={14} />
            <span>
              {exam.offering.faculty.user?.first_name}{" "}
              {exam.offering.faculty.user?.last_name}
            </span>
          </div>
        )}
      </div>

      <div className="exam-card__actions">
        <ActionButton onClick={() => onView(exam)} title="View" variant="view">
          <Eye size={14} />
        </ActionButton>
        <ActionButton
          onClick={() => onDelete(exam.exam_id)}
          title="Delete"
          variant="delete"
        >
          <Trash2 size={14} />
        </ActionButton>
      </div>
    </motion.div>
  );
}

function ScheduleTable({ schedules, onGenerateAdmitCards, onDelete }) {
  return (
    <div className="schedule-table__wrapper">
      <div className="schedule-table__container">
        <table className="schedule-table">
          <thead>
            <tr>
              {["Exam", "Date & Time", "Room", "Invigilator", "Actions"].map(
                (header) => (
                  <th key={header}>{header}</th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {schedules.map((schedule) => (
              <tr key={schedule.schedule_id}>
                <td>
                  <div className="schedule-table__exam">
                    <div className="schedule-table__exam-name">
                      {schedule.exam?.exam_name || "N/A"}
                    </div>
                    <div className="schedule-table__exam-code">
                      {schedule.exam?.offering?.course?.course_code}
                    </div>
                  </div>
                </td>
                <td>
                  <div className="schedule-table__datetime">
                    <div className="schedule-table__date">
                      <Calendar size={12} />
                      <span>
                        {schedule.exam_date
                          ? new Date(schedule.exam_date).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </div>
                    <div className="schedule-table__time">
                      <Clock size={12} />
                      <span>
                        {schedule.start_time} - {schedule.end_time}
                      </span>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="schedule-table__room">
                    <MapPin size={12} />
                    <div>
                      <div className="schedule-table__room-number">
                        {schedule.room?.room_number || "N/A"}
                      </div>
                      <div className="schedule-table__room-building">
                        {schedule.room?.building || ""}
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="schedule-table__invigilator">
                    <UserCheck size={12} />
                    <span>
                      {schedule.invigilator?.user?.first_name}{" "}
                      {schedule.invigilator?.user?.last_name}
                    </span>
                  </div>
                </td>
                <td>
                  <div className="schedule-table__actions">
                    <ActionButton
                      onClick={() => onGenerateAdmitCards(schedule.schedule_id)}
                      title="Generate Admit Cards"
                      variant="generate"
                    >
                      <QrCode size={14} />
                    </ActionButton>
                    <ActionButton
                      onClick={() => onDelete(schedule.schedule_id)}
                      title="Delete"
                      variant="delete"
                    >
                      <Trash2 size={14} />
                    </ActionButton>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdmitCardItem({ card }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="admit-card"
    >
      <div className="admit-card__header">
        <div className="admit-card__student">
          <div
            className="admit-card__avatar"
            style={{ backgroundColor: "#2c4a6e" }}
          >
            {card.student?.first_name?.charAt(0) || "?"}
          </div>
          <div>
            <h4 className="admit-card__student-name">
              {card.student
                ? `${card.student.first_name || ""} ${
                    card.student.last_name || ""
                  }`.trim()
                : "N/A"}
            </h4>
            <p className="admit-card__reg-number">
              {card.student?.university_reg_number || "N/A"}
            </p>
          </div>
        </div>
        <span
          className={`admit-card__status ${
            card.eligibility_status === "eligible"
              ? "admit-card__status--eligible"
              : "admit-card__status--not-eligible"
          }`}
        >
          {card.eligibility_status === "eligible" ? (
            <>
              <CheckCircle size={12} />
              Eligible
            </>
          ) : (
            <>
              <AlertCircle size={12} />
              Not Eligible
            </>
          )}
        </span>
      </div>

      <div className="admit-card__content">
        <h5 className="admit-card__exam-name">
          {card.exam?.exam_name || "N/A"}
        </h5>
        <div className="admit-card__details">
          <div className="admit-card__detail">
            <Calendar size={12} />
            <span>
              {card.exam?.schedules?.[0]?.exam_date
                ? new Date(
                    card.exam.schedules[0].exam_date
                  ).toLocaleDateString()
                : "N/A"}
            </span>
          </div>
          <div className="admit-card__detail">
            <Clock size={12} />
            <span>{card.exam?.schedules?.[0]?.start_time || "N/A"}</span>
          </div>
          <div className="admit-card__detail">
            <MapPin size={12} />
            <span>Room {card.seat_number || "TBA"}</span>
          </div>
        </div>
      </div>

      <div className="admit-card__info">
        <div className="admit-card__info-item">
          <span className="admit-card__info-label">Seat:</span>
          <span className="admit-card__info-value">
            {card.seat_number || "N/A"}
          </span>
        </div>
        <div className="admit-card__info-item">
          <span className="admit-card__info-label">Downloaded:</span>
          {card.is_downloaded ? (
            <CheckCircle size={12} className="admit-card__info-icon--success" />
          ) : (
            <XCircle size={12} className="admit-card__info-icon--warning" />
          )}
        </div>
      </div>

      <div className="admit-card__actions">
        <button className="admit-card__btn admit-card__btn--secondary">
          <Eye size={12} />
          Preview
        </button>
        <button className="admit-card__btn admit-card__btn--primary">
          <Download size={12} />
          Download
        </button>
      </div>
    </motion.div>
  );
}

function RoomCard({ room }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="room-card"
    >
      <div className="room-card__header">
        <Building size={20} className="room-card__icon" />
        <div>
          <h3 className="room-card__title">{room.room_number}</h3>
          <p className="room-card__building">{room.building}</p>
        </div>
      </div>

      <div className="room-card__capacity">
        <Users size={14} />
        <span>Capacity: {room.capacity}</span>
      </div>
    </motion.div>
  );
}

function CreateExamForm({
  examForm,
  setExamForm,
  courseOfferings,
  examTypes,
  onSubmit,
  onCancel,
}) {
  return (
    <>
      <h2 className="modal__title">Create New Examination</h2>
      <p className="modal__subtitle">Enter the examination details</p>

      <form onSubmit={onSubmit} className="exam-form">
        <FormField label="Course Offering" required>
          <select
            required
            value={examForm.offering_id}
            onChange={(e) =>
              setExamForm({ ...examForm, offering_id: e.target.value })
            }
          >
            <option value="">Select Course</option>
            {courseOfferings.map((offering) => (
              <option key={offering.offering_id} value={offering.offering_id}>
                {offering.course?.course_code} - {offering.course?.course_name}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Exam Name" required>
          <input
            type="text"
            required
            placeholder="e.g., CS301 Final Exam"
            value={examForm.exam_name}
            onChange={(e) =>
              setExamForm({ ...examForm, exam_name: e.target.value })
            }
          />
        </FormField>

        <div className="exam-form__grid">
          <FormField label="Exam Type" required>
            <select
              required
              value={examForm.exam_type}
              onChange={(e) =>
                setExamForm({ ...examForm, exam_type: e.target.value })
              }
            >
              {examTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Duration (minutes)" required>
            <input
              type="number"
              required
              min="1"
              value={examForm.duration_minutes}
              onChange={(e) =>
                setExamForm({ ...examForm, duration_minutes: e.target.value })
              }
            />
          </FormField>
        </div>

        <div className="exam-form__grid">
          <FormField label="Total Marks" required>
            <input
              type="number"
              required
              min="1"
              value={examForm.total_marks}
              onChange={(e) =>
                setExamForm({ ...examForm, total_marks: e.target.value })
              }
            />
          </FormField>

          <FormField label="Passing Marks" required>
            <input
              type="number"
              required
              min="1"
              value={examForm.passing_marks}
              onChange={(e) =>
                setExamForm({ ...examForm, passing_marks: e.target.value })
              }
            />
          </FormField>
        </div>

        <FormField label="Instructions">
          <textarea
            rows="4"
            placeholder="Exam instructions..."
            value={examForm.instructions}
            onChange={(e) =>
              setExamForm({ ...examForm, instructions: e.target.value })
            }
          />
        </FormField>

        <div className="modal__actions">
          <button
            type="button"
            onClick={onCancel}
            className="btn btn--secondary"
          >
            Cancel
          </button>
          <button type="submit" className="btn btn--primary">
            <Plus size={16} />
            Create Exam
          </button>
        </div>
      </form>
    </>
  );
}

function ScheduleExamForm({
  scheduleForm,
  setScheduleForm,
  examinations,
  examRooms,
  onSubmit,
  onCancel,
}) {
  return (
    <>
      <h2 className="modal__title">Schedule Examination</h2>
      <p className="modal__subtitle">Set the exam date, time, and location</p>

      <form onSubmit={onSubmit} className="exam-form">
        <FormField label="Select Exam" required>
          <select
            required
            value={scheduleForm.exam_id}
            onChange={(e) =>
              setScheduleForm({ ...scheduleForm, exam_id: e.target.value })
            }
          >
            <option value="">Choose an exam...</option>
            {examinations.map((exam) => (
              <option key={exam.exam_id} value={exam.exam_id}>
                {exam.exam_name}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Exam Date" required>
          <input
            type="date"
            required
            value={scheduleForm.exam_date}
            onChange={(e) =>
              setScheduleForm({ ...scheduleForm, exam_date: e.target.value })
            }
          />
        </FormField>

        <div className="exam-form__grid">
          <FormField label="Start Time" required>
            <input
              type="time"
              required
              value={scheduleForm.start_time}
              onChange={(e) =>
                setScheduleForm({ ...scheduleForm, start_time: e.target.value })
              }
            />
          </FormField>

          <FormField label="End Time" required>
            <input
              type="time"
              required
              value={scheduleForm.end_time}
              onChange={(e) =>
                setScheduleForm({ ...scheduleForm, end_time: e.target.value })
              }
            />
          </FormField>
        </div>

        <FormField label="Exam Room" required>
          <select
            required
            value={scheduleForm.room_id}
            onChange={(e) =>
              setScheduleForm({ ...scheduleForm, room_id: e.target.value })
            }
          >
            <option value="">Choose a room...</option>
            {examRooms.map((room) => (
              <option key={room.room_id} value={room.room_id}>
                {room.room_number} - {room.building} (Capacity: {room.capacity})
              </option>
            ))}
          </select>
        </FormField>

        <div className="modal__actions">
          <button
            type="button"
            onClick={onCancel}
            className="btn btn--secondary"
          >
            Cancel
          </button>
          <button type="submit" className="btn btn--primary">
            <Calendar size={16} />
            Schedule Exam
          </button>
        </div>
      </form>
    </>
  );
}

function ExamDetails({ exam, getExamTypeColor, onClose }) {
  return (
    <>
      <h2 className="modal__title">Examination Details</h2>

      <div className="exam-details">
        <div className="exam-details__header">
          <div>
            <h3 className="exam-details__exam-name">{exam.exam_name}</h3>
            <p className="exam-details__course">
              {exam.offering?.course?.course_code} -{" "}
              {exam.offering?.course?.course_name}
            </p>
          </div>
          <span
            className="exam-details__type-badge"
            style={{
              backgroundColor: `${getExamTypeColor(exam.exam_type)}15`,
              color: getExamTypeColor(exam.exam_type),
            }}
          >
            {exam.exam_type}
          </span>
        </div>

        <div className="exam-details__section">
          <h4 className="exam-details__section-title">Exam Details</h4>
          <div className="exam-details__rows">
            <DetailRow label="Total Marks" value={exam.total_marks} />
            <DetailRow label="Passing Marks" value={exam.passing_marks} />
            <DetailRow
              label="Duration"
              value={`${exam.duration_minutes} minutes`}
            />
          </div>
        </div>

        {exam.instructions && (
          <div className="exam-details__section">
            <h4 className="exam-details__section-title">Instructions</h4>
            <p className="exam-details__instructions">{exam.instructions}</p>
          </div>
        )}
      </div>

      <div className="modal__actions">
        <button onClick={onClose} className="btn btn--primary">
          Close
        </button>
      </div>
    </>
  );
}

function EmptyState({ message, subMessage }) {
  return (
    <div className="exam-management__empty">
      <p className="exam-management__empty-title">{message}</p>
      {subMessage && (
        <p className="exam-management__empty-text">{subMessage}</p>
      )}
    </div>
  );
}

function StatCard({ icon, title, value, color }) {
  return (
    <motion.div whileHover={{ scale: 1.01 }} className="stat-card">
      <div className="stat-card__icon" style={{ color }}>
        {icon}
      </div>
      <div className="stat-card__content">
        <p className="stat-card__title">{title}</p>
        <p className="stat-card__value">{value}</p>
      </div>
    </motion.div>
  );
}

function TabButton({ active, onClick, icon, label }) {
  return (
    <button onClick={onClick} className={`tab ${active ? "tab--active" : ""}`}>
      {icon}
      {label}
    </button>
  );
}

function ActionButton({ onClick, title, variant, children }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`action-btn action-btn--${variant}`}
    >
      {children}
    </button>
  );
}

function FormField({ label, required, children }) {
  return (
    <div className="form-field">
      <label className="form-field__label">
        {label}
        {required && <span className="form-field__required">*</span>}
      </label>
      <div className="form-field__input">
        {React.cloneElement(children, {
          className: "form-field__control",
        })}
      </div>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="detail-row">
      <span className="detail-row__label">{label}</span>
      <span className="detail-row__value">{value}</span>
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
      className="modal-overlay"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="modal"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
