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
      final: "#dc2626",
      midterm: "#f59e0b",
      quiz: "#3b82f6",
      practical: "#8b5cf6",
    };
    return colors[type] || "#6b7280";
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
          <p style={{ color: "#6b7280" }}>Loading exam data...</p>
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
            Exam Management
          </h1>
          <p style={{ color: "#6b7280", fontSize: "16px" }}>
            Manage examinations, schedules, and admit cards
          </p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={loadData}
            style={{
              padding: "10px 20px",
              backgroundColor: "#6b7280",
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
          {activeTab === "examinations" && (
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
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <Plus size={18} /> Create Exam
            </button>
          )}
          {activeTab === "schedules" && (
            <button
              onClick={() => setShowScheduleModal(true)}
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
              <Plus size={18} /> Schedule Exam
            </button>
          )}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: "8px",
          marginBottom: "24px",
          borderBottom: "2px solid #e5e7eb",
        }}
      >
        <TabButton
          active={activeTab === "examinations"}
          onClick={() => setActiveTab("examinations")}
          icon={<BookOpen size={18} />}
          label="Examinations"
        />
        <TabButton
          active={activeTab === "schedules"}
          onClick={() => setActiveTab("schedules")}
          icon={<Calendar size={18} />}
          label="Schedules"
        />
        <TabButton
          active={activeTab === "admit-cards"}
          onClick={() => setActiveTab("admit-cards")}
          icon={<FileText size={18} />}
          label="Admit Cards"
        />
        <TabButton
          active={activeTab === "rooms"}
          onClick={() => setActiveTab("rooms")}
          icon={<Building size={18} />}
          label="Exam Rooms"
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
          marginBottom: "32px",
        }}
      >
        <StatCard
          icon={<BookOpen size={24} />}
          title="Total Exams"
          value={stats.totalExams}
          color="#3b82f6"
        />
        <StatCard
          icon={<Calendar size={24} />}
          title="Scheduled"
          value={stats.scheduledExams}
          color="#10b981"
        />
        <StatCard
          icon={<FileText size={24} />}
          title="Admit Cards"
          value={stats.totalAdmitCards}
          color="#f59e0b"
        />
        <StatCard
          icon={<CheckCircle size={24} />}
          title="Eligible Students"
          value={stats.eligibleStudents}
          color="#8b5cf6"
        />
      </div>

      {activeTab === "examinations" && (
        <>
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
                  }}
                >
                  Search
                </label>
                <div style={{ position: "relative" }}>
                  <Search
                    size={18}
                    style={{
                      position: "absolute",
                      left: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#6b7280",
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Search examinations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 12px 10px 40px",
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
                  }}
                >
                  Exam Type
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
            <div
              style={{
                backgroundColor: "white",
                padding: "60px 20px",
                borderRadius: "12px",
                textAlign: "center",
                color: "#6b7280",
              }}
            >
              <p style={{ fontSize: "18px", marginBottom: "8px" }}>
                No examinations found
              </p>
              <p style={{ fontSize: "14px" }}>
                Create your first examination to get started
              </p>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
                gap: "20px",
              }}
            >
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
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            placeholder="Search schedules..."
          />

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
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            placeholder="Search admit cards..."
          />

          {filteredAdmitCards.length === 0 ? (
            <EmptyState message="No admit cards found" />
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
                gap: "20px",
              }}
            >
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
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: "20px",
              }}
            >
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

// Component Definitions
function ExamCard({ exam, onView, onDelete, getExamTypeColor }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        backgroundColor: "white",
        padding: "24px",
        borderRadius: "12px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "start",
          marginBottom: "16px",
        }}
      >
        <div>
          <h3
            style={{
              fontSize: "18px",
              fontWeight: "600",
              color: "#111827",
              marginBottom: "4px",
            }}
          >
            {exam.exam_name}
          </h3>
          <p style={{ fontSize: "14px", color: "#6b7280" }}>
            {exam.offering?.course?.course_code} -{" "}
            {exam.offering?.course?.course_name}
          </p>
        </div>
        <span
          style={{
            padding: "4px 12px",
            borderRadius: "12px",
            fontSize: "12px",
            fontWeight: "600",
            backgroundColor: `${getExamTypeColor(exam.exam_type)}20`,
            color: getExamTypeColor(exam.exam_type),
            textTransform: "uppercase",
          }}
        >
          {exam.exam_type}
        </span>
      </div>

      <div style={{ display: "grid", gap: "8px", marginBottom: "16px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "14px",
            color: "#6b7280",
          }}
        >
          <Clock size={16} />
          <span>{exam.duration_minutes} minutes</span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "14px",
            color: "#6b7280",
          }}
        >
          <FileText size={16} />
          <span>{exam.total_marks} marks</span>
        </div>
        {exam.offering?.faculty && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "14px",
              color: "#6b7280",
            }}
          >
            <Users size={16} />
            <span>
              {exam.offering.faculty.user?.first_name}{" "}
              {exam.offering.faculty.user?.last_name}
            </span>
          </div>
        )}
      </div>

      <div
        style={{
          display: "flex",
          gap: "8px",
          paddingTop: "16px",
          borderTop: "1px solid #f3f4f6",
        }}
      >
        <ActionButton onClick={() => onView(exam)} title="View" color="#3b82f6">
          <Eye size={16} />
        </ActionButton>
        <ActionButton
          onClick={() => onDelete(exam.exam_id)}
          title="Delete"
          color="#dc2626"
        >
          <Trash2 size={16} />
        </ActionButton>
      </div>
    </motion.div>
  );
}

function ScheduleTable({ schedules, onGenerateAdmitCards, onDelete }) {
  return (
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
              {["Exam", "Date & Time", "Room", "Invigilator", "Actions"].map(
                (header) => (
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
                )
              )}
            </tr>
          </thead>
          <tbody>
            {schedules.map((schedule) => (
              <tr
                key={schedule.schedule_id}
                style={{ borderBottom: "1px solid #f3f4f6" }}
              >
                <td style={{ padding: "16px" }}>
                  <div>
                    <div
                      style={{
                        fontSize: "14px",
                        fontWeight: "500",
                        color: "#111827",
                      }}
                    >
                      {schedule.exam?.exam_name || "N/A"}
                    </div>
                    <div style={{ fontSize: "12px", color: "#6b7280" }}>
                      {schedule.exam?.offering?.course?.course_code}
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
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "4px",
                    }}
                  >
                    <Calendar size={14} />
                    <span>
                      {schedule.exam_date
                        ? new Date(schedule.exam_date).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <Clock size={14} />
                    <span>
                      {schedule.start_time} - {schedule.end_time}
                    </span>
                  </div>
                </td>
                <td style={{ padding: "16px" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <MapPin size={14} style={{ color: "#6b7280" }} />
                    <div>
                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: "500",
                          color: "#111827",
                        }}
                      >
                        {schedule.room?.room_number || "N/A"}
                      </div>
                      <div style={{ fontSize: "12px", color: "#6b7280" }}>
                        {schedule.room?.building || ""}
                      </div>
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
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <UserCheck size={14} />
                    <span>
                      {schedule.invigilator?.user?.first_name}{" "}
                      {schedule.invigilator?.user?.last_name}
                    </span>
                  </div>
                </td>
                <td style={{ padding: "16px" }}>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <ActionButton
                      onClick={() => onGenerateAdmitCards(schedule.schedule_id)}
                      title="Generate Admit Cards"
                      color="#10b981"
                    >
                      <QrCode size={16} />
                    </ActionButton>
                    <ActionButton
                      onClick={() => onDelete(schedule.schedule_id)}
                      title="Delete"
                      color="#dc2626"
                    >
                      <Trash2 size={16} />
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
      style={{
        backgroundColor: "white",
        padding: "24px",
        borderRadius: "12px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "16px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              backgroundColor: "#3b82f6",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "600",
            }}
          >
            {card.student?.first_name?.charAt(0) || "?"}
          </div>
          <div>
            <h4
              style={{ fontSize: "16px", fontWeight: "600", color: "#111827" }}
            >
              {card.student
                ? `${card.student.first_name || ""} ${
                    card.student.last_name || ""
                  }`.trim()
                : "N/A"}
            </h4>
            <p style={{ fontSize: "12px", color: "#6b7280" }}>
              {card.student?.university_reg_number || "N/A"}
            </p>
          </div>
        </div>
        <span
          style={{
            padding: "4px 12px",
            borderRadius: "12px",
            fontSize: "12px",
            fontWeight: "500",
            backgroundColor:
              card.eligibility_status === "eligible"
                ? "#10b98120"
                : "#ef444420",
            color:
              card.eligibility_status === "eligible" ? "#10b981" : "#ef4444",
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
            height: "fit-content",
          }}
        >
          {card.eligibility_status === "eligible" ? (
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

      <div style={{ marginBottom: "16px" }}>
        <h5
          style={{
            fontSize: "14px",
            fontWeight: "600",
            color: "#111827",
            marginBottom: "8px",
          }}
        >
          {card.exam?.exam_name || "N/A"}
        </h5>
        <div style={{ display: "grid", gap: "6px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "13px",
              color: "#6b7280",
            }}
          >
            <Calendar size={14} />
            <span>
              {card.exam?.schedules?.[0]?.exam_date
                ? new Date(
                    card.exam.schedules[0].exam_date
                  ).toLocaleDateString()
                : "N/A"}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "13px",
              color: "#6b7280",
            }}
          >
            <Clock size={14} />
            <span>{card.exam?.schedules?.[0]?.start_time || "N/A"}</span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "13px",
              color: "#6b7280",
            }}
          >
            <MapPin size={14} />
            <span>Room {card.seat_number || "TBA"}</span>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "8px",
          padding: "12px 0",
          borderTop: "1px solid #f3f4f6",
          fontSize: "13px",
        }}
      >
        <div>
          <span style={{ color: "#6b7280" }}>Seat:</span>
          <span
            style={{ color: "#111827", marginLeft: "4px", fontWeight: "500" }}
          >
            {card.seat_number || "N/A"}
          </span>
        </div>
        <div>
          <span style={{ color: "#6b7280" }}>Downloaded:</span>
          {card.is_downloaded ? (
            <CheckCircle
              size={14}
              style={{ color: "#10b981", marginLeft: "4px" }}
            />
          ) : (
            <XCircle
              size={14}
              style={{ color: "#f59e0b", marginLeft: "4px" }}
            />
          )}
        </div>
      </div>

      <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
        <button
          style={{
            flex: 1,
            padding: "8px 12px",
            backgroundColor: "#f3f4f6",
            color: "#374151",
            border: "none",
            borderRadius: "6px",
            fontSize: "13px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
          }}
        >
          <Eye size={14} /> Preview
        </button>
        <button
          style={{
            flex: 1,
            padding: "8px 12px",
            backgroundColor: "#1e40af",
            color: "white",
            border: "none",
            borderRadius: "6px",
            fontSize: "13px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
          }}
        >
          <Download size={14} /> Download
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
      style={{
        backgroundColor: "white",
        padding: "24px",
        borderRadius: "12px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "16px",
        }}
      >
        <Building size={24} style={{ color: "#3b82f6" }} />
        <div>
          <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#111827" }}>
            {room.room_number}
          </h3>
          <p style={{ fontSize: "14px", color: "#6b7280" }}>{room.building}</p>
        </div>
      </div>

      <div style={{ display: "grid", gap: "8px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "14px",
            color: "#6b7280",
          }}
        >
          <Users size={16} />
          <span>Capacity: {room.capacity}</span>
        </div>
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
      <h2 style={{ fontSize: "24px", fontWeight: "700", marginBottom: "8px" }}>
        Create New Examination
      </h2>
      <p style={{ color: "#6b7280", marginBottom: "24px" }}>
        Enter the examination details
      </p>

      <form onSubmit={onSubmit} style={{ display: "grid", gap: "16px" }}>
        <FormField label="Course Offering *" required>
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

        <FormField label="Exam Name *" required>
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

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
          }}
        >
          <FormField label="Exam Type *" required>
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

          <FormField label="Duration (minutes) *" required>
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

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
          }}
        >
          <FormField label="Total Marks *" required>
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

          <FormField label="Passing Marks *" required>
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

        <div
          style={{
            display: "flex",
            gap: "12px",
            justifyContent: "flex-end",
            marginTop: "8px",
          }}
        >
          <button
            type="button"
            onClick={onCancel}
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
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Plus size={18} /> Create Exam
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
      <h2 style={{ fontSize: "24px", fontWeight: "700", marginBottom: "8px" }}>
        Schedule Examination
      </h2>
      <p style={{ color: "#6b7280", marginBottom: "24px" }}>
        Set the exam date, time, and location
      </p>

      <form onSubmit={onSubmit} style={{ display: "grid", gap: "16px" }}>
        <FormField label="Select Exam *" required>
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

        <FormField label="Exam Date *" required>
          <input
            type="date"
            required
            value={scheduleForm.exam_date}
            onChange={(e) =>
              setScheduleForm({ ...scheduleForm, exam_date: e.target.value })
            }
          />
        </FormField>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
          }}
        >
          <FormField label="Start Time *" required>
            <input
              type="time"
              required
              value={scheduleForm.start_time}
              onChange={(e) =>
                setScheduleForm({ ...scheduleForm, start_time: e.target.value })
              }
            />
          </FormField>

          <FormField label="End Time *" required>
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

        <FormField label="Exam Room *" required>
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

        <div
          style={{
            display: "flex",
            gap: "12px",
            justifyContent: "flex-end",
            marginTop: "8px",
          }}
        >
          <button
            type="button"
            onClick={onCancel}
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
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Calendar size={18} /> Schedule Exam
          </button>
        </div>
      </form>
    </>
  );
}

function ExamDetails({ exam, getExamTypeColor, onClose }) {
  return (
    <>
      <h2 style={{ fontSize: "24px", fontWeight: "700", marginBottom: "24px" }}>
        Examination Details
      </h2>

      <div style={{ display: "grid", gap: "24px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "start",
          }}
        >
          <div>
            <h3
              style={{ fontSize: "20px", fontWeight: "600", color: "#111827" }}
            >
              {exam.exam_name}
            </h3>
            <p style={{ fontSize: "14px", color: "#6b7280" }}>
              {exam.offering?.course?.course_code} -{" "}
              {exam.offering?.course?.course_name}
            </p>
          </div>
          <span
            style={{
              padding: "6px 14px",
              borderRadius: "12px",
              fontSize: "14px",
              fontWeight: "600",
              backgroundColor: `${getExamTypeColor(exam.exam_type)}20`,
              color: getExamTypeColor(exam.exam_type),
              textTransform: "uppercase",
            }}
          >
            {exam.exam_type}
          </span>
        </div>

        <div>
          <h4
            style={{
              fontSize: "16px",
              fontWeight: "600",
              marginBottom: "12px",
            }}
          >
            Exam Details
          </h4>
          <div style={{ display: "grid", gap: "8px" }}>
            <DetailRow label="Total Marks" value={exam.total_marks} />
            <DetailRow label="Passing Marks" value={exam.passing_marks} />
            <DetailRow
              label="Duration"
              value={`${exam.duration_minutes} minutes`}
            />
          </div>
        </div>

        {exam.instructions && (
          <div>
            <h4
              style={{
                fontSize: "16px",
                fontWeight: "600",
                marginBottom: "12px",
              }}
            >
              Instructions
            </h4>
            <p
              style={{ fontSize: "14px", color: "#6b7280", lineHeight: "1.6" }}
            >
              {exam.instructions}
            </p>
          </div>
        )}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "24px",
        }}
      >
        <button
          onClick={onClose}
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
    </>
  );
}

function SearchBar({ searchTerm, setSearchTerm, placeholder }) {
  return (
    <div
      style={{
        backgroundColor: "white",
        padding: "24px",
        borderRadius: "12px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        marginBottom: "24px",
      }}
    >
      <div style={{ position: "relative" }}>
        <Search
          size={18}
          style={{
            position: "absolute",
            left: "12px",
            top: "50%",
            transform: "translateY(-50%)",
            color: "#6b7280",
          }}
        />
        <input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: "100%",
            padding: "10px 12px 10px 40px",
            border: "1px solid #d1d5db",
            borderRadius: "8px",
            fontSize: "14px",
          }}
        />
      </div>
    </div>
  );
}

function EmptyState({ message, subMessage }) {
  return (
    <div
      style={{
        backgroundColor: "white",
        padding: "60px 20px",
        borderRadius: "12px",
        textAlign: "center",
        color: "#6b7280",
      }}
    >
      <p style={{ fontSize: "18px", marginBottom: "8px" }}>{message}</p>
      {subMessage && <p style={{ fontSize: "14px" }}>{subMessage}</p>}
    </div>
  );
}

// Helper Components
function StatCard({ icon, title, value, color }) {
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

function TabButton({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "12px 24px",
        backgroundColor: "transparent",
        color: active ? "#1e40af" : "#6b7280",
        border: "none",
        borderBottom: active ? "2px solid #1e40af" : "2px solid transparent",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: "500",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        transition: "all 0.2s",
      }}
    >
      {icon}
      {label}
    </button>
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

function FormField({ label, required, children }) {
  return (
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
        {label}
      </label>
      <div style={{ width: "100%" }}>
        {React.cloneElement(children, {
          style: {
            width: "100%",
            padding: "10px 12px",
            border: "1px solid #d1d5db",
            borderRadius: "8px",
            fontSize: "14px",
            fontFamily: "inherit",
          },
        })}
      </div>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "150px 1fr",
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
