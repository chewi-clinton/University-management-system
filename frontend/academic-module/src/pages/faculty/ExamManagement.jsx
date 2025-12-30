import React, { useState, useMemo } from "react";
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
  AlertCircle,
  Download,
  Grid3x3,
  ChevronLeft,
  ChevronRight,
  Book,
  Award,
  Filter,
} from "lucide-react";
import Card from "../../components/shared/layout/Card";
import Button from "../../components/shared/ui/Button";
import Modal from "../../components/shared/feedback/Modal";
import Input from "../../components/shared/ui/Input";
import Select from "../../components/shared/ui/Select";
import Badge from "../../components/shared/ui/Badge";
import "../../styles/pages/ExamManagement.css";

// Mock data
const mockExams = [
  {
    id: 1,
    courseId: 1,
    courseName: "CS301 - Data Structures",
    type: "Midterm",
    date: "2024-02-25",
    startTime: "09:00",
    endTime: "12:00",
    duration: 180,
    room: "A-101",
    totalMarks: 40,
    weightage: 30,
    syllabus: "Chapters 1-5, Arrays, Linked Lists, Trees",
    instructions: "Closed book exam. No electronic devices allowed.",
    invigilator: "Prof. Jane Smith",
    enrolledStudents: 45,
    color: "#3b82f6",
  },
  {
    id: 2,
    courseId: 1,
    courseName: "CS301 - Data Structures",
    type: "Final",
    date: "2024-04-15",
    startTime: "14:00",
    endTime: "17:00",
    duration: 180,
    room: "A-101",
    totalMarks: 100,
    weightage: 30,
    syllabus: "Complete course material",
    instructions: "Comprehensive exam. Bring admit card and ID.",
    invigilator: "Prof. Jane Smith",
    enrolledStudents: 45,
    color: "#3b82f6",
  },
  {
    id: 3,
    courseId: 2,
    courseName: "CS201 - Programming Fundamentals",
    type: "Quiz",
    date: "2024-02-10",
    startTime: "14:00",
    endTime: "15:00",
    duration: 60,
    room: "B-205",
    totalMarks: 20,
    weightage: 10,
    syllabus: "Chapters 1-3",
    instructions: "Open book. 1 hour duration.",
    invigilator: "Prof. Jane Smith",
    enrolledStudents: 38,
    color: "#8b5cf6",
  },
  {
    id: 4,
    courseId: 3,
    courseName: "CS401 - Advanced Algorithms",
    type: "Practical",
    date: "2024-03-05",
    startTime: "10:00",
    endTime: "13:00",
    duration: 180,
    room: "Lab-A",
    totalMarks: 50,
    weightage: 25,
    syllabus: "Implementation of sorting and graph algorithms",
    instructions: "Practical coding exam. Bring laptop.",
    invigilator: "Prof. Jane Smith",
    enrolledStudents: 32,
    color: "#10b981",
  },
];

const mockCourses = [
  { id: 1, code: "CS301", name: "Data Structures", color: "#3b82f6" },
  { id: 2, code: "CS201", name: "Programming Fundamentals", color: "#8b5cf6" },
  { id: 3, code: "CS401", name: "Advanced Algorithms", color: "#10b981" },
];

const examTypes = [
  { value: "Midterm", label: "Midterm", color: "#3b82f6" },
  { value: "Final", label: "Final", color: "#ef4444" },
  { value: "Quiz", label: "Quiz", color: "#10b981" },
  { value: "Practical", label: "Practical", color: "#8b5cf6" },
];

const ExamManagement = () => {
  const [exams, setExams] = useState(mockExams);
  const [view, setView] = useState("calendar"); // 'calendar' | 'list'
  const [currentDate, setCurrentDate] = useState(new Date(2024, 1, 1)); // February 2024
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedExam, setSelectedExam] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [filterCourse, setFilterCourse] = useState("all");
  const [filterType, setFilterType] = useState("all");

  // Form state
  const [formData, setFormData] = useState({
    courseId: "",
    type: "",
    date: "",
    startTime: "",
    endTime: "",
    room: "",
    totalMarks: "",
    weightage: "",
    syllabus: "",
    instructions: "",
    invigilator: "Prof. Jane Smith",
  });

  // Calendar logic
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days of the month
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
        filterCourse === "all" || exam.courseId.toString() === filterCourse;
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
      courseId: "",
      type: "",
      date: "",
      startTime: "",
      endTime: "",
      room: "",
      totalMarks: "",
      weightage: "",
      syllabus: "",
      instructions: "",
      invigilator: "Prof. Jane Smith",
    });
    setIsCreateModalOpen(true);
  };

  const handleEditExam = (exam) => {
    setSelectedExam(exam);
    setFormData({
      courseId: exam.courseId.toString(),
      type: exam.type,
      date: exam.date,
      startTime: exam.startTime,
      endTime: exam.endTime,
      room: exam.room,
      totalMarks: exam.totalMarks.toString(),
      weightage: exam.weightage.toString(),
      syllabus: exam.syllabus,
      instructions: exam.instructions,
      invigilator: exam.invigilator,
    });
    setIsDetailsModalOpen(false);
    setIsEditModalOpen(true);
  };

  const handleDeleteExam = (examId) => {
    if (window.confirm("Are you sure you want to delete this exam?")) {
      setExams(exams.filter((e) => e.id !== examId));
      setIsDetailsModalOpen(false);
    }
  };

  const handleSubmitCreate = (e) => {
    e.preventDefault();
    const course = mockCourses.find(
      (c) => c.id.toString() === formData.courseId
    );
    const duration = calculateDuration(formData.startTime, formData.endTime);

    const newExam = {
      id: Math.max(...exams.map((e) => e.id)) + 1,
      courseId: parseInt(formData.courseId),
      courseName: `${course.code} - ${course.name}`,
      type: formData.type,
      date: formData.date,
      startTime: formData.startTime,
      endTime: formData.endTime,
      duration,
      room: formData.room,
      totalMarks: parseInt(formData.totalMarks),
      weightage: parseInt(formData.weightage),
      syllabus: formData.syllabus,
      instructions: formData.instructions,
      invigilator: formData.invigilator,
      enrolledStudents: course.id === 1 ? 45 : course.id === 2 ? 38 : 32,
      color: course.color,
    };

    setExams([...exams, newExam]);
    setIsCreateModalOpen(false);
  };

  const handleSubmitEdit = (e) => {
    e.preventDefault();
    const course = mockCourses.find(
      (c) => c.id.toString() === formData.courseId
    );
    const duration = calculateDuration(formData.startTime, formData.endTime);

    setExams(
      exams.map((exam) =>
        exam.id === selectedExam.id
          ? {
              ...exam,
              courseId: parseInt(formData.courseId),
              courseName: `${course.code} - ${course.name}`,
              type: formData.type,
              date: formData.date,
              startTime: formData.startTime,
              endTime: formData.endTime,
              duration,
              room: formData.room,
              totalMarks: parseInt(formData.totalMarks),
              weightage: parseInt(formData.weightage),
              syllabus: formData.syllabus,
              instructions: formData.instructions,
              invigilator: formData.invigilator,
              color: course.color,
            }
          : exam
      )
    );
    setIsEditModalOpen(false);
  };

  const calculateDuration = (start, end) => {
    const [startHour, startMin] = start.split(":").map(Number);
    const [endHour, endMin] = end.split(":").map(Number);
    return endHour * 60 + endMin - (startHour * 60 + startMin);
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (time) => {
    const [hour, min] = time.split(":");
    const h = parseInt(hour);
    const ampm = h >= 12 ? "PM" : "AM";
    const displayHour = h > 12 ? h - 12 : h === 0 ? 12 : h;
    return `${displayHour}:${min} ${ampm}`;
  };

  const getExamTypeColor = (type) => {
    return examTypes.find((t) => t.value === type)?.color || "#6b7280";
  };

  const days = getDaysInMonth(currentDate);
  const monthName = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

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
            {mockCourses.map((course) => (
              <option key={course.id} value={course.id.toString()}>
                {course.code} - {course.name}
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
                            exam.courseId.toString() === filterCourse;
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
                                      backgroundColor: getExamTypeColor(
                                        exam.type
                                      ),
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
                      style={{ backgroundColor: getExamTypeColor(exam.type) }}
                    />
                    <div className="exam-card__content">
                      <div className="exam-card__header">
                        <div>
                          <h3>{exam.courseName}</h3>
                          <Badge
                            variant={
                              exam.type === "Final"
                                ? "error"
                                : exam.type === "Midterm"
                                ? "primary"
                                : exam.type === "Quiz"
                                ? "success"
                                : "warning"
                            }
                          >
                            {exam.type}
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
                        <Button variant="primary" size="sm" icon={Download}>
                          Generate Admit Cards
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

      {/* Create Exam Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Exam"
      >
        <form onSubmit={handleSubmitCreate} className="exam-form">
          <div className="exam-form__row">
            <Select
              label="Course"
              value={formData.courseId}
              onChange={(e) =>
                setFormData({ ...formData, courseId: e.target.value })
              }
              required
            >
              <option value="">Select Course</option>
              {mockCourses.map((course) => (
                <option key={course.id} value={course.id.toString()}>
                  {course.code} - {course.name}
                </option>
              ))}
            </Select>

            <Select
              label="Exam Type"
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
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

          <div className="exam-form__row">
            <Input
              type="date"
              label="Date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              required
            />

            <Input
              type="text"
              label="Room"
              placeholder="e.g., A-101"
              value={formData.room}
              onChange={(e) =>
                setFormData({ ...formData, room: e.target.value })
              }
              required
            />
          </div>

          <div className="exam-form__row">
            <Input
              type="time"
              label="Start Time"
              value={formData.startTime}
              onChange={(e) =>
                setFormData({ ...formData, startTime: e.target.value })
              }
              required
            />

            <Input
              type="time"
              label="End Time"
              value={formData.endTime}
              onChange={(e) =>
                setFormData({ ...formData, endTime: e.target.value })
              }
              required
            />
          </div>

          <div className="exam-form__row">
            <Input
              type="number"
              label="Total Marks"
              placeholder="e.g., 100"
              value={formData.totalMarks}
              onChange={(e) =>
                setFormData({ ...formData, totalMarks: e.target.value })
              }
              required
            />

            <Input
              type="number"
              label="Weightage (%)"
              placeholder="e.g., 30"
              value={formData.weightage}
              onChange={(e) =>
                setFormData({ ...formData, weightage: e.target.value })
              }
              required
              min="0"
              max="100"
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
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Create Exam
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Exam Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Exam"
      >
        <form onSubmit={handleSubmitEdit} className="exam-form">
          <div className="exam-form__row">
            <Select
              label="Course"
              value={formData.courseId}
              onChange={(e) =>
                setFormData({ ...formData, courseId: e.target.value })
              }
              required
            >
              <option value="">Select Course</option>
              {mockCourses.map((course) => (
                <option key={course.id} value={course.id.toString()}>
                  {course.code} - {course.name}
                </option>
              ))}
            </Select>

            <Select
              label="Exam Type"
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
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

          <div className="exam-form__row">
            <Input
              type="date"
              label="Date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              required
            />

            <Input
              type="text"
              label="Room"
              placeholder="e.g., A-101"
              value={formData.room}
              onChange={(e) =>
                setFormData({ ...formData, room: e.target.value })
              }
              required
            />
          </div>

          <div className="exam-form__row">
            <Input
              type="time"
              label="Start Time"
              value={formData.startTime}
              onChange={(e) =>
                setFormData({ ...formData, startTime: e.target.value })
              }
              required
            />

            <Input
              type="time"
              label="End Time"
              value={formData.endTime}
              onChange={(e) =>
                setFormData({ ...formData, endTime: e.target.value })
              }
              required
            />
          </div>

          <div className="exam-form__row">
            <Input
              type="number"
              label="Total Marks"
              placeholder="e.g., 100"
              value={formData.totalMarks}
              onChange={(e) =>
                setFormData({ ...formData, totalMarks: e.target.value })
              }
              required
            />

            <Input
              type="number"
              label="Weightage (%)"
              placeholder="e.g., 30"
              value={formData.weightage}
              onChange={(e) =>
                setFormData({ ...formData, weightage: e.target.value })
              }
              required
              min="0"
              max="100"
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
              onClick={() => setIsEditModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Changes
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
              <Badge
                variant={
                  selectedExam.type === "Final"
                    ? "error"
                    : selectedExam.type === "Midterm"
                    ? "primary"
                    : selectedExam.type === "Quiz"
                    ? "success"
                    : "warning"
                }
              >
                {selectedExam.type}
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
                    <span className="exam-details__label">Weightage</span>
                    <span className="exam-details__value">
                      {selectedExam.weightage}%
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
              </div>
            </div>

            <div className="exam-details__section">
              <h3>Syllabus</h3>
              <p className="exam-details__text">{selectedExam.syllabus}</p>
            </div>

            <div className="exam-details__section">
              <h3>Instructions</h3>
              <p className="exam-details__text">{selectedExam.instructions}</p>
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
              <Button variant="primary" icon={Download}>
                Generate Admit Cards
              </Button>
              <Button variant="outline" icon={Grid3x3}>
                Set Seating Plan
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ExamManagement;
