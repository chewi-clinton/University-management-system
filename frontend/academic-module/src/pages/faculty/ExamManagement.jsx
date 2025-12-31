import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Plus,
  Edit2,
  Trash2,
  FileText,
  Users,
  MapPin,
  Clock,
  Download,
  ChevronLeft,
  ChevronRight,
  Book,
  Award,
} from "lucide-react";
import Card from "../../components/shared/layout/Card";
import Button from "../../components/shared/ui/Button";
import Modal from "../../components/shared/feedback/Modal";
import Input from "../../components/shared/ui/Input";
import Select from "../../components/shared/ui/Select";
import Badge from "../../components/shared/ui/Badge";
import Skeleton from "../../components/shared/feedback/skeleton";
import facultyService from "../../services/api/facultyService";
import api from "../../services/api/api";
import "../../styles/pages/ExamManagement.css";

const examTypes = [
  { value: "midterm", label: "Midterm", color: "#3b82f6" },
  { value: "final", label: "Final", color: "#ef4444" },
  { value: "quiz", label: "Quiz", color: "#10b981" },
  { value: "practical", label: "Practical", color: "#8b5cf6" },
];

const ExamManagement = () => {
  const [loading, setLoading] = useState(true);
  const [exams, setExams] = useState([]);
  const [courses, setCourses] = useState([]);
  const [examRooms, setExamRooms] = useState([]);
  const [view, setView] = useState("calendar");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedExam, setSelectedExam] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [filterCourse, setFilterCourse] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [error, setError] = useState(null);
  const [saveStatus, setSaveStatus] = useState(null);

  const [formData, setFormData] = useState({
    offering_id: "",
    exam_type: "",
    exam_name: "",
    exam_date: "",
    start_time: "",
    end_time: "",
    room_id: "",
    total_marks: "",
    passing_marks: "",
    syllabus: "",
    instructions: "",
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [coursesResponse, examsResponse, roomsResponse] = await Promise.all(
        [
          facultyService.getCourses({ is_visible: true }),
          api.get("examinations/"),
          api.get("exam-rooms/"),
        ]
      );

      const coursesData = coursesResponse.results || coursesResponse;
      setCourses(coursesData);

      const examsData = examsResponse.data.results || examsResponse.data;

      // Enrich exam data with schedules
      const enrichedExams = await Promise.all(
        examsData.map(async (exam) => {
          try {
            const scheduleResponse = await api.get("exam-schedules/", {
              params: { exam: exam.exam_id },
            });
            const schedules =
              scheduleResponse.data.results || scheduleResponse.data;
            const schedule = schedules[0]; // Get first schedule

            return {
              id: exam.exam_id,
              offeringId: exam.offering?.id,
              courseName: exam.offering?.course?.course_code
                ? `${exam.offering.course.course_code} - ${exam.offering.course.course_name}`
                : "N/A",
              courseId: exam.offering?.course?.course_id,
              type: exam.exam_type,
              examName: exam.exam_name,
              date: schedule?.exam_date || null,
              startTime: schedule?.start_time || null,
              endTime: schedule?.end_time || null,
              duration: exam.duration_minutes || 180,
              room: schedule?.room?.room_number || "TBA",
              roomId: schedule?.room?.room_id,
              totalMarks: exam.total_marks,
              passingMarks: exam.passing_marks,
              weightage: exam.weightage_percentage || 0,
              syllabus: exam.syllabus_portion || "",
              instructions: exam.instructions || "",
              invigilator: schedule?.invigilator
                ? `${schedule.invigilator.user.first_name} ${schedule.invigilator.user.last_name}`
                : "TBA",
              enrolledStudents: exam.offering?.current_enrollment || 0,
              color: getExamTypeColor(exam.exam_type),
              scheduleId: schedule?.schedule_id,
            };
          } catch (error) {
            console.error(
              `Error loading schedule for exam ${exam.exam_id}:`,
              error
            );
            return {
              id: exam.exam_id,
              offeringId: exam.offering?.id,
              courseName: exam.offering?.course?.course_code
                ? `${exam.offering.course.course_code} - ${exam.offering.course.course_name}`
                : "N/A",
              courseId: exam.offering?.course?.course_id,
              type: exam.exam_type,
              examName: exam.exam_name,
              date: null,
              startTime: null,
              endTime: null,
              duration: exam.duration_minutes || 180,
              room: "TBA",
              totalMarks: exam.total_marks,
              passingMarks: exam.passing_marks,
              weightage: exam.weightage_percentage || 0,
              syllabus: exam.syllabus_portion || "",
              instructions: exam.instructions || "",
              enrolledStudents: exam.offering?.current_enrollment || 0,
              color: getExamTypeColor(exam.exam_type),
            };
          }
        })
      );

      setExams(enrichedExams);

      const roomsData = roomsResponse.data.results || roomsResponse.data;
      setExamRooms(roomsData);
    } catch (error) {
      console.error("Error loading data:", error);
      setError("Failed to load exam data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const getExamsForDate = (date) => {
    if (!date) return [];
    const dateStr = date.toISOString().split("T")[0];
    return exams.filter((exam) => exam.date === dateStr);
  };

  const filteredExams = useMemo(() => {
    return exams.filter((exam) => {
      const courseMatch =
        filterCourse === "all" || exam.courseId?.toString() === filterCourse;
      const typeMatch = filterType === "all" || exam.type === filterType;
      return courseMatch && typeMatch;
    });
  }, [exams, filterCourse, filterType]);

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    const examsOnDate = getExamsForDate(date);
    if (examsOnDate.length > 0) {
      setSelectedExam(examsOnDate[0]);
      setIsDetailsModalOpen(true);
    }
  };

  const handleCreateExam = () => {
    setFormData({
      offering_id: "",
      exam_type: "",
      exam_name: "",
      exam_date: "",
      start_time: "",
      end_time: "",
      room_id: "",
      total_marks: "",
      passing_marks: "",
      syllabus: "",
      instructions: "",
    });
    setIsCreateModalOpen(true);
  };

  const handleEditExam = (exam) => {
    setSelectedExam(exam);
    setFormData({
      offering_id: exam.offeringId?.toString() || "",
      exam_type: exam.type,
      exam_name: exam.examName,
      exam_date: exam.date || "",
      start_time: exam.startTime || "",
      end_time: exam.endTime || "",
      room_id: exam.roomId?.toString() || "",
      total_marks: exam.totalMarks?.toString() || "",
      passing_marks: exam.passingMarks?.toString() || "",
      syllabus: exam.syllabus,
      instructions: exam.instructions,
    });
    setIsDetailsModalOpen(false);
    setIsEditModalOpen(true);
  };

  const handleDeleteExam = async (examId) => {
    if (window.confirm("Are you sure you want to delete this exam?")) {
      try {
        await api.delete(`examinations/${examId}/`);
        setExams(exams.filter((e) => e.id !== examId));
        setIsDetailsModalOpen(false);
        setSaveStatus({
          type: "success",
          message: "Exam deleted successfully",
        });
      } catch (error) {
        console.error("Error deleting exam:", error);
        setSaveStatus({ type: "error", message: "Failed to delete exam" });
      }
    }
  };

  const handleSubmitCreate = async (e) => {
    e.preventDefault();
    setSaveStatus({ type: "loading", message: "Creating exam..." });

    try {
      // Calculate duration
      const duration = calculateDuration(
        formData.start_time,
        formData.end_time
      );

      // Create examination
      const examData = {
        offering_id: parseInt(formData.offering_id),
        exam_type: formData.exam_type,
        exam_name: formData.exam_name,
        total_marks: parseInt(formData.total_marks),
        passing_marks: parseInt(formData.passing_marks),
        duration_minutes: duration,
        syllabus_portion: formData.syllabus,
        instructions: formData.instructions,
      };

      const examResponse = await api.post("examinations/", examData);
      const newExam = examResponse.data;

      // Create exam schedule
      const scheduleData = {
        exam_id: newExam.exam_id,
        exam_date: formData.exam_date,
        start_time: formData.start_time,
        end_time: formData.end_time,
        room_id: parseInt(formData.room_id),
      };

      await api.post("exam-schedules/", scheduleData);

      setIsCreateModalOpen(false);
      setSaveStatus({ type: "success", message: "Exam created successfully" });
      await loadInitialData();
    } catch (error) {
      console.error("Error creating exam:", error);
      setSaveStatus({ type: "error", message: "Failed to create exam" });
    }
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    setSaveStatus({ type: "loading", message: "Updating exam..." });

    try {
      const duration = calculateDuration(
        formData.start_time,
        formData.end_time
      );

      // Update examination
      const examData = {
        offering_id: parseInt(formData.offering_id),
        exam_type: formData.exam_type,
        exam_name: formData.exam_name,
        total_marks: parseInt(formData.total_marks),
        passing_marks: parseInt(formData.passing_marks),
        duration_minutes: duration,
        syllabus_portion: formData.syllabus,
        instructions: formData.instructions,
      };

      await api.patch(`examinations/${selectedExam.id}/`, examData);

      // Update exam schedule if it exists
      if (selectedExam.scheduleId) {
        const scheduleData = {
          exam_date: formData.exam_date,
          start_time: formData.start_time,
          end_time: formData.end_time,
          room_id: parseInt(formData.room_id),
        };
        await api.patch(
          `exam-schedules/${selectedExam.scheduleId}/`,
          scheduleData
        );
      } else {
        // Create schedule if it doesn't exist
        const scheduleData = {
          exam_id: selectedExam.id,
          exam_date: formData.exam_date,
          start_time: formData.start_time,
          end_time: formData.end_time,
          room_id: parseInt(formData.room_id),
        };
        await api.post("exam-schedules/", scheduleData);
      }

      setIsEditModalOpen(false);
      setSaveStatus({ type: "success", message: "Exam updated successfully" });
      await loadInitialData();
    } catch (error) {
      console.error("Error updating exam:", error);
      setSaveStatus({ type: "error", message: "Failed to update exam" });
    }
  };

  const calculateDuration = (start, end) => {
    const [startHour, startMin] = start.split(":").map(Number);
    const [endHour, endMin] = end.split(":").map(Number);
    return endHour * 60 + endMin - (startHour * 60 + startMin);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "TBA";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (time) => {
    if (!time) return "TBA";
    const [hour, min] = time.split(":");
    const h = parseInt(hour);
    const ampm = h >= 12 ? "PM" : "AM";
    const displayHour = h > 12 ? h - 12 : h === 0 ? 12 : h;
    return `${displayHour}:${min} ${ampm}`;
  };

  const getExamTypeColor = (type) => {
    return examTypes.find((t) => t.value === type)?.color || "#6b7280";
  };

  const getExamTypeBadgeVariant = (type) => {
    switch (type) {
      case "final":
        return "error";
      case "midterm":
        return "primary";
      case "quiz":
        return "success";
      case "practical":
        return "warning";
      default:
        return "default";
    }
  };

  const days = getDaysInMonth(currentDate);
  const monthName = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  if (loading) {
    return (
      <div className="exam-management">
        <Skeleton variant="text" width="300px" height="40px" />
        <Skeleton
          variant="rectangular"
          height="600px"
          style={{ marginTop: "24px" }}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="exam-management">
        <Card variant="flat">
          <div style={{ padding: "2rem", textAlign: "center" }}>
            <p style={{ color: "var(--error-500)", marginBottom: "1rem" }}>
              {error}
            </p>
            <Button onClick={loadInitialData}>Retry</Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="exam-management">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="exam-management__header"
      >
        <div>
          <h1>Exam Management</h1>
          <p>Create and manage examinations</p>
        </div>
        <Button onClick={handleCreateExam} icon={Plus}>
          Create Exam
        </Button>
      </motion.div>

      {saveStatus && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: "1rem" }}
        >
          <Badge
            variant={
              saveStatus.type === "success"
                ? "success"
                : saveStatus.type === "error"
                ? "error"
                : "warning"
            }
          >
            {saveStatus.message}
          </Badge>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="exam-management__controls"
      >
        <div className="exam-management__view-toggle">
          <button
            className={`exam-management__view-btn ${
              view === "calendar" ? "exam-management__view-btn--active" : ""
            }`}
            onClick={() => setView("calendar")}
          >
            <Calendar size={18} />
            Calendar
          </button>
          <button
            className={`exam-management__view-btn ${
              view === "list" ? "exam-management__view-btn--active" : ""
            }`}
            onClick={() => setView("list")}
          >
            <FileText size={18} />
            List
          </button>
        </div>

        <div className="exam-management__filters">
          <Select
            value={filterCourse}
            onChange={(e) => setFilterCourse(e.target.value)}
          >
            <option value="all">All Courses</option>
            {courses.map((course) => (
              <option
                key={course.id}
                value={course.course?.course_id?.toString()}
              >
                {course.course?.course_code} - {course.course?.course_name}
              </option>
            ))}
          </Select>

          <Select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All Types</option>
            {examTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </Select>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {view === "calendar" ? (
          <motion.div
            key="calendar"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="exam-management__calendar">
              <div className="calendar__header">
                <button onClick={handlePrevMonth} className="calendar__nav-btn">
                  <ChevronLeft size={20} />
                </button>
                <h2>{monthName}</h2>
                <button onClick={handleNextMonth} className="calendar__nav-btn">
                  <ChevronRight size={20} />
                </button>
              </div>

              <div className="calendar__grid">
                <div className="calendar__weekdays">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (day) => (
                      <div key={day} className="calendar__weekday">
                        {day}
                      </div>
                    )
                  )}
                </div>

                <div className="calendar__days">
                  {days.map((day, index) => {
                    const examsOnDay = day
                      ? getExamsForDate(day).filter((exam) => {
                          const courseMatch =
                            filterCourse === "all" ||
                            exam.courseId?.toString() === filterCourse;
                          const typeMatch =
                            filterType === "all" || exam.type === filterType;
                          return courseMatch && typeMatch;
                        })
                      : [];
                    const isToday =
                      day && day.toDateString() === new Date().toDateString();

                    return (
                      <motion.div
                        key={index}
                        className={`calendar__day ${
                          !day ? "calendar__day--empty" : ""
                        } ${isToday ? "calendar__day--today" : ""} ${
                          examsOnDay.length > 0 ? "calendar__day--has-exam" : ""
                        }`}
                        onClick={() => day && handleDateClick(day)}
                        whileHover={day ? { scale: 1.02 } : {}}
                        transition={{ duration: 0.2 }}
                      >
                        {day && (
                          <>
                            <span className="calendar__day-number">
                              {day.getDate()}
                            </span>
                            {examsOnDay.length > 0 && (
                              <div className="calendar__day-exams">
                                {examsOnDay.map((exam) => (
                                  <div
                                    key={exam.id}
                                    className="exam-dot"
                                    style={{
                                      backgroundColor: exam.color,
                                    }}
                                    title={`${exam.courseName} - ${exam.type}`}
                                  />
                                ))}
                              </div>
                            )}
                          </>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              <div className="calendar__legend">
                <h3>Legend:</h3>
                <div className="calendar__legend-items">
                  {examTypes.map((type) => (
                    <div key={type.value} className="calendar__legend-item">
                      <div
                        className="exam-dot"
                        style={{ backgroundColor: type.color }}
                      />
                      <span>{type.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="exam-management__list"
          >
            {filteredExams.length === 0 ? (
              <Card>
                <div className="exam-management__empty">
                  <FileText size={48} />
                  <h3>No Exams Found</h3>
                  <p>Create your first exam or adjust your filters</p>
                  <Button onClick={handleCreateExam} icon={Plus}>
                    Create Exam
                  </Button>
                </div>
              </Card>
            ) : (
              filteredExams.map((exam, index) => (
                <motion.div
                  key={exam.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className="exam-card">
                    <div
                      className="exam-card__type-bar"
                      style={{ backgroundColor: exam.color }}
                    />
                    <div className="exam-card__content">
                      <div className="exam-card__header">
                        <div>
                          <h3>{exam.courseName}</h3>
                          <Badge variant={getExamTypeBadgeVariant(exam.type)}>
                            {exam.type.charAt(0).toUpperCase() +
                              exam.type.slice(1)}
                          </Badge>
                        </div>
                        <div className="exam-card__actions">
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={Edit2}
                            onClick={() => handleEditExam(exam)}
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={Trash2}
                            onClick={() => handleDeleteExam(exam.id)}
                          />
                        </div>
                      </div>

                      <div className="exam-card__details">
                        <div className="exam-card__detail">
                          <Calendar size={16} />
                          <span>{formatDate(exam.date)}</span>
                        </div>
                        <div className="exam-card__detail">
                          <Clock size={16} />
                          <span>
                            {formatTime(exam.startTime)} -{" "}
                            {formatTime(exam.endTime)}
                          </span>
                        </div>
                        <div className="exam-card__detail">
                          <MapPin size={16} />
                          <span>{exam.room}</span>
                        </div>
                        <div className="exam-card__detail">
                          <Users size={16} />
                          <span>{exam.enrolledStudents} Students</span>
                        </div>
                      </div>

                      <div className="exam-card__meta">
                        <div className="exam-card__meta-item">
                          <Award size={16} />
                          <span>{exam.totalMarks} Marks</span>
                        </div>
                        <div className="exam-card__meta-item">
                          <Book size={16} />
                          <span>{exam.weightage}% Weightage</span>
                        </div>
                      </div>

                      <div className="exam-card__footer">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedExam(exam);
                            setIsDetailsModalOpen(true);
                          }}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create/Edit Exam Modal */}
      <Modal
        isOpen={isCreateModalOpen || isEditModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setIsEditModalOpen(false);
        }}
        title={isCreateModalOpen ? "Create New Exam" : "Edit Exam"}
      >
        <form
          onSubmit={isCreateModalOpen ? handleSubmitCreate : handleSubmitEdit}
          className="exam-form"
        >
          <div className="exam-form__row">
            <Select
              label="Course"
              value={formData.offering_id}
              onChange={(e) =>
                setFormData({ ...formData, offering_id: e.target.value })
              }
              required
            >
              <option value="">Select Course</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id.toString()}>
                  {course.course?.course_code} - {course.course?.course_name}
                </option>
              ))}
            </Select>

            <Select
              label="Exam Type"
              value={formData.exam_type}
              onChange={(e) =>
                setFormData({ ...formData, exam_type: e.target.value })
              }
              required
            >
              <option value="">Select Type</option>
              {examTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </Select>
          </div>

          <div className="exam-form__group">
            <Input
              type="text"
              label="Exam Name"
              placeholder="e.g., Midterm Examination"
              value={formData.exam_name}
              onChange={(e) =>
                setFormData({ ...formData, exam_name: e.target.value })
              }
              required
            />
          </div>

          <div className="exam-form__row">
            <Input
              type="date"
              label="Date"
              value={formData.exam_date}
              onChange={(e) =>
                setFormData({ ...formData, exam_date: e.target.value })
              }
              required
            />

            <Select
              label="Room"
              value={formData.room_id}
              onChange={(e) =>
                setFormData({ ...formData, room_id: e.target.value })
              }
              required
            >
              <option value="">Select Room</option>
              {examRooms.map((room) => (
                <option key={room.room_id} value={room.room_id.toString()}>
                  {room.room_number} - {room.building} (Capacity:{" "}
                  {room.capacity})
                </option>
              ))}
            </Select>
          </div>

          <div className="exam-form__row">
            <Input
              type="time"
              label="Start Time"
              value={formData.start_time}
              onChange={(e) =>
                setFormData({ ...formData, start_time: e.target.value })
              }
              required
            />

            <Input
              type="time"
              label="End Time"
              value={formData.end_time}
              onChange={(e) =>
                setFormData({ ...formData, end_time: e.target.value })
              }
              required
            />
          </div>

          <div className="exam-form__row">
            <Input
              type="number"
              label="Total Marks"
              placeholder="e.g., 100"
              value={formData.total_marks}
              onChange={(e) =>
                setFormData({ ...formData, total_marks: e.target.value })
              }
              required
            />

            <Input
              type="number"
              label="Passing Marks"
              placeholder="e.g., 40"
              value={formData.passing_marks}
              onChange={(e) =>
                setFormData({ ...formData, passing_marks: e.target.value })
              }
              required
            />
          </div>

          <div className="exam-form__group">
            <label>Syllabus Portion</label>
            <textarea
              value={formData.syllabus}
              onChange={(e) =>
                setFormData({ ...formData, syllabus: e.target.value })
              }
              placeholder="Enter syllabus details..."
              rows="3"
              required
            />
          </div>

          <div className="exam-form__group">
            <label>Instructions</label>
            <textarea
              value={formData.instructions}
              onChange={(e) =>
                setFormData({ ...formData, instructions: e.target.value })
              }
              placeholder="Enter exam instructions..."
              rows="3"
              required
            />
          </div>

          <div className="exam-form__actions">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsCreateModalOpen(false);
                setIsEditModalOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {isCreateModalOpen ? "Create Exam" : "Save Changes"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Exam Details Modal */}
      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        title="Exam Details"
      >
        {selectedExam && (
          <div className="exam-details">
            <div className="exam-details__header">
              <h2>{selectedExam.courseName}</h2>
              <Badge variant={getExamTypeBadgeVariant(selectedExam.type)}>
                {selectedExam.type.charAt(0).toUpperCase() +
                  selectedExam.type.slice(1)}
              </Badge>
            </div>

            <div className="exam-details__section">
              <h3>Schedule</h3>
              <div className="exam-details__info-grid">
                <div className="exam-details__info-item">
                  <Calendar size={18} />
                  <div>
                    <span className="exam-details__label">Date</span>
                    <span className="exam-details__value">
                      {formatDate(selectedExam.date)}
                    </span>
                  </div>
                </div>
                <div className="exam-details__info-item">
                  <Clock size={18} />
                  <div>
                    <span className="exam-details__label">Time</span>
                    <span className="exam-details__value">
                      {formatTime(selectedExam.startTime)} -{" "}
                      {formatTime(selectedExam.endTime)}
                    </span>
                  </div>
                </div>
                <div className="exam-details__info-item">
                  <MapPin size={18} />
                  <div>
                    <span className="exam-details__label">Room</span>
                    <span className="exam-details__value">
                      {selectedExam.room}
                    </span>
                  </div>
                </div>
                <div className="exam-details__info-item">
                  <Users size={18} />
                  <div>
                    <span className="exam-details__label">Students</span>
                    <span className="exam-details__value">
                      {selectedExam.enrolledStudents}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="exam-details__section">
              <h3>Evaluation</h3>
              <div className="exam-details__info-grid">
                <div className="exam-details__info-item">
                  <Award size={18} />
                  <div>
                    <span className="exam-details__label">Total Marks</span>
                    <span className="exam-details__value">
                      {selectedExam.totalMarks}
                    </span>
                  </div>
                </div>
                <div className="exam-details__info-item">
                  <Book size={18} />
                  <div>
                    <span className="exam-details__label">Passing Marks</span>
                    <span className="exam-details__value">
                      {selectedExam.passingMarks}
                    </span>
                  </div>
                </div>
                <div className="exam-details__info-item">
                  <Clock size={18} />
                  <div>
                    <span className="exam-details__label">Duration</span>
                    <span className="exam-details__value">
                      {selectedExam.duration} minutes
                    </span>
                  </div>
                </div>
                <div className="exam-details__info-item">
                  <Book size={18} />
                  <div>
                    <span className="exam-details__label">Weightage</span>
                    <span className="exam-details__value">
                      {selectedExam.weightage}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="exam-details__section">
              <h3>Syllabus</h3>
              <p className="exam-details__text">
                {selectedExam.syllabus || "No syllabus information provided"}
              </p>
            </div>

            <div className="exam-details__section">
              <h3>Instructions</h3>
              <p className="exam-details__text">
                {selectedExam.instructions || "No instructions provided"}
              </p>
            </div>

            <div className="exam-details__section">
              <h3>Invigilator</h3>
              <p className="exam-details__text">{selectedExam.invigilator}</p>
            </div>

            <div className="exam-details__actions">
              <Button
                variant="outline"
                icon={Edit2}
                onClick={() => handleEditExam(selectedExam)}
              >
                Edit Exam
              </Button>
              <Button
                variant="error"
                icon={Trash2}
                onClick={() => handleDeleteExam(selectedExam.id)}
              >
                Delete Exam
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ExamManagement;
