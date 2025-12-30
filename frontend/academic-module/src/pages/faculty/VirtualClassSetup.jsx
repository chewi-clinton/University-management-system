import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Video,
  Plus,
  Edit2,
  Trash2,
  Play,
  Copy,
  Mail,
  Calendar,
  Clock,
  Users,
  Link as LinkIcon,
  Download,
  Eye,
  ExternalLink,
  CheckCircle,
  XCircle,
  AlertCircle,
  Repeat,
} from "lucide-react";
import Card from "../../components/shared/layout/Card";
import Button from "../../components/shared/ui/Button";
import Input from "../../components/shared/ui/Input";
import Select from "../../components/shared/ui/Select";
import Modal from "../../components/shared/feedback/Modal";
import Badge from "../../components/shared/ui/Badge";
import "../../styles/pages/VirtualClassSetup.css";

// Mock data
const mockCourses = [
  { id: 1, code: "CS301", name: "Data Structures", color: "#3b82f6" },
  { id: 2, code: "CS201", name: "Programming Fundamentals", color: "#8b5cf6" },
  { id: 3, code: "CS401", name: "Advanced Algorithms", color: "#10b981" },
];

const mockVirtualClasses = [
  {
    id: 1,
    courseId: 1,
    courseName: "CS301 - Data Structures",
    topic: "Lecture 12 - Advanced Trees",
    date: "2024-01-22",
    startTime: "09:00",
    endTime: "10:30",
    duration: 90,
    platform: "zoom",
    meetingLink: "https://zoom.us/j/123456789",
    meetingId: "123-456-789",
    passcode: "abc123",
    status: "upcoming",
    recurring: false,
    enrolledStudents: 45,
  },
  {
    id: 2,
    courseId: 1,
    courseName: "CS301 - Data Structures",
    topic: "Lecture 11 - Binary Search Trees",
    date: "2024-01-20",
    startTime: "09:00",
    endTime: "10:30",
    duration: 90,
    platform: "zoom",
    recordingUrl: "https://zoom.us/rec/123",
    status: "recorded",
    actualDuration: "1:25:32",
    views: 42,
    enrolledStudents: 45,
  },
  {
    id: 3,
    courseId: 2,
    courseName: "CS201 - Programming Fundamentals",
    topic: "Tutorial 5 - Loops and Functions",
    date: "2024-01-23",
    startTime: "14:00",
    endTime: "15:30",
    duration: 90,
    platform: "meet",
    meetingLink: "https://meet.google.com/xyz-abcd-efg",
    status: "upcoming",
    recurring: false,
    enrolledStudents: 38,
  },
  {
    id: 4,
    courseId: 3,
    courseName: "CS401 - Advanced Algorithms",
    topic: "Lecture 8 - Graph Algorithms",
    date: "2024-01-21",
    startTime: "11:00",
    endTime: "12:30",
    duration: 90,
    platform: "zoom",
    meetingLink: "https://zoom.us/j/987654321",
    meetingId: "987-654-321",
    passcode: "xyz789",
    status: "live",
    enrolledStudents: 32,
  },
];

const VirtualClassSetup = () => {
  const [classes, setClasses] = useState(mockVirtualClasses);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [activeTab, setActiveTab] = useState("upcoming"); // 'upcoming' | 'past'

  // Form state
  const [formData, setFormData] = useState({
    courseId: "",
    topic: "",
    date: "",
    startTime: "",
    duration: "60",
    platform: "zoom",
    recurring: false,
    recurringPattern: "weekly",
  });

  const handleCreateClass = () => {
    setFormData({
      courseId: "",
      topic: "",
      date: "",
      startTime: "",
      duration: "60",
      platform: "zoom",
      recurring: false,
      recurringPattern: "weekly",
    });
    setIsCreateModalOpen(true);
  };

  const handleEditClass = (classItem) => {
    setSelectedClass(classItem);
    setFormData({
      courseId: classItem.courseId.toString(),
      topic: classItem.topic,
      date: classItem.date,
      startTime: classItem.startTime,
      duration: classItem.duration.toString(),
      platform: classItem.platform,
      recurring: classItem.recurring || false,
      recurringPattern: "weekly",
    });
    setIsEditModalOpen(true);
  };

  const handleSubmitCreate = (e) => {
    e.preventDefault();
    const course = mockCourses.find(
      (c) => c.id.toString() === formData.courseId
    );
    const endTime = calculateEndTime(
      formData.startTime,
      parseInt(formData.duration)
    );

    const newClass = {
      id: Math.max(...classes.map((c) => c.id)) + 1,
      courseId: parseInt(formData.courseId),
      courseName: `${course.code} - ${course.name}`,
      topic: formData.topic,
      date: formData.date,
      startTime: formData.startTime,
      endTime,
      duration: parseInt(formData.duration),
      platform: formData.platform,
      meetingLink:
        formData.platform === "zoom"
          ? `https://zoom.us/j/${Math.floor(Math.random() * 1000000000)}`
          : `https://meet.google.com/${generateMeetCode()}`,
      meetingId:
        formData.platform === "zoom"
          ? `${Math.floor(100 + Math.random() * 900)}-${Math.floor(
              100 + Math.random() * 900
            )}-${Math.floor(100 + Math.random() * 900)}`
          : undefined,
      passcode: formData.platform === "zoom" ? generatePasscode() : undefined,
      status: "upcoming",
      recurring: formData.recurring,
      enrolledStudents: course.id === 1 ? 45 : course.id === 2 ? 38 : 32,
    };

    setClasses([...classes, newClass]);
    setIsCreateModalOpen(false);
  };

  const handleSubmitEdit = (e) => {
    e.preventDefault();
    const course = mockCourses.find(
      (c) => c.id.toString() === formData.courseId
    );
    const endTime = calculateEndTime(
      formData.startTime,
      parseInt(formData.duration)
    );

    setClasses(
      classes.map((c) =>
        c.id === selectedClass.id
          ? {
              ...c,
              courseId: parseInt(formData.courseId),
              courseName: `${course.code} - ${course.name}`,
              topic: formData.topic,
              date: formData.date,
              startTime: formData.startTime,
              endTime,
              duration: parseInt(formData.duration),
              platform: formData.platform,
              recurring: formData.recurring,
            }
          : c
      )
    );
    setIsEditModalOpen(false);
  };

  const handleDeleteClass = (classId) => {
    if (window.confirm("Are you sure you want to cancel this virtual class?")) {
      setClasses(classes.filter((c) => c.id !== classId));
    }
  };

  const handleStartMeeting = (classItem) => {
    window.open(classItem.meetingLink, "_blank");
  };

  const handleCopyLink = (link) => {
    navigator.clipboard.writeText(link);
    alert("Meeting link copied to clipboard!");
  };

  const handleSendReminder = (classItem) => {
    alert(
      `Reminder sent to ${classItem.enrolledStudents} students for "${classItem.topic}"`
    );
  };

  const calculateEndTime = (startTime, duration) => {
    const [hours, minutes] = startTime.split(":").map(Number);
    const totalMinutes = hours * 60 + minutes + duration;
    const endHours = Math.floor(totalMinutes / 60) % 24;
    const endMinutes = totalMinutes % 60;
    return `${String(endHours).padStart(2, "0")}:${String(endMinutes).padStart(
      2,
      "0"
    )}`;
  };

  const generatePasscode = () => {
    return Math.random().toString(36).substring(2, 8);
  };

  const generateMeetCode = () => {
    return `${Math.random().toString(36).substring(2, 5)}-${Math.random()
      .toString(36)
      .substring(2, 6)}-${Math.random().toString(36).substring(2, 5)}`;
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    }
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

  const getPlatformColor = (platform) => {
    return platform === "zoom" ? "#2D8CFF" : "#00897B";
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      upcoming: { variant: "primary", icon: Clock },
      live: { variant: "success", icon: Video },
      recorded: { variant: "neutral", icon: CheckCircle },
      cancelled: { variant: "error", icon: XCircle },
    };
    return statusConfig[status] || statusConfig.upcoming;
  };

  const upcomingClasses = classes.filter(
    (c) => c.status === "upcoming" || c.status === "live"
  );
  const pastClasses = classes.filter((c) => c.status === "recorded");

  return (
    <div className="virtual-class-setup">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="virtual-class-setup__header"
      >
        <div>
          <h1>Virtual Class Setup</h1>
          <p>Schedule and manage online classes</p>
        </div>
        <Button onClick={handleCreateClass} icon={Plus}>
          Create Virtual Class
        </Button>
      </motion.div>

      {/* Create Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="virtual-class-setup__quick-create">
          <h2>Quick Create</h2>
          <form onSubmit={handleSubmitCreate} className="quick-create-form">
            <div className="quick-create-form__row">
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

              <Input
                type="text"
                label="Topic"
                placeholder="e.g., Lecture 12 - Trees"
                value={formData.topic}
                onChange={(e) =>
                  setFormData({ ...formData, topic: e.target.value })
                }
                required
              />
            </div>

            <div className="quick-create-form__row">
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
                type="time"
                label="Start Time"
                value={formData.startTime}
                onChange={(e) =>
                  setFormData({ ...formData, startTime: e.target.value })
                }
                required
              />

              <Select
                label="Duration"
                value={formData.duration}
                onChange={(e) =>
                  setFormData({ ...formData, duration: e.target.value })
                }
                required
              >
                <option value="30">30 minutes</option>
                <option value="60">60 minutes</option>
                <option value="90">90 minutes</option>
                <option value="120">120 minutes</option>
              </Select>
            </div>

            <div className="quick-create-form__row">
              <div className="quick-create-form__platform">
                <label>Platform</label>
                <div className="platform-options">
                  <label
                    className={`platform-option ${
                      formData.platform === "zoom"
                        ? "platform-option--active"
                        : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="platform"
                      value="zoom"
                      checked={formData.platform === "zoom"}
                      onChange={(e) =>
                        setFormData({ ...formData, platform: e.target.value })
                      }
                    />
                    <Video size={20} />
                    <span>Zoom</span>
                  </label>
                  <label
                    className={`platform-option ${
                      formData.platform === "meet"
                        ? "platform-option--active"
                        : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="platform"
                      value="meet"
                      checked={formData.platform === "meet"}
                      onChange={(e) =>
                        setFormData({ ...formData, platform: e.target.value })
                      }
                    />
                    <Video size={20} />
                    <span>Google Meet</span>
                  </label>
                </div>
              </div>

              <div className="quick-create-form__recurring">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.recurring}
                    onChange={(e) =>
                      setFormData({ ...formData, recurring: e.target.checked })
                    }
                  />
                  <Repeat size={16} />
                  <span>Recurring (Weekly)</span>
                </label>
              </div>
            </div>

            <Button type="submit" variant="primary" icon={Plus}>
              Create Meeting
            </Button>
          </form>
        </Card>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="virtual-class-setup__tabs"
      >
        <button
          className={`virtual-class-setup__tab ${
            activeTab === "upcoming" ? "virtual-class-setup__tab--active" : ""
          }`}
          onClick={() => setActiveTab("upcoming")}
        >
          Upcoming Sessions ({upcomingClasses.length})
        </button>
        <button
          className={`virtual-class-setup__tab ${
            activeTab === "past" ? "virtual-class-setup__tab--active" : ""
          }`}
          onClick={() => setActiveTab("past")}
        >
          Past Sessions ({pastClasses.length})
        </button>
      </motion.div>

      {/* Upcoming Sessions */}
      <AnimatePresence mode="wait">
        {activeTab === "upcoming" && (
          <motion.div
            key="upcoming"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="virtual-class-setup__sessions"
          >
            {upcomingClasses.length === 0 ? (
              <Card>
                <div className="virtual-class-setup__empty">
                  <Video size={48} />
                  <h3>No Upcoming Sessions</h3>
                  <p>Create your first virtual class to get started</p>
                  <Button onClick={handleCreateClass} icon={Plus}>
                    Create Virtual Class
                  </Button>
                </div>
              </Card>
            ) : (
              upcomingClasses.map((classItem, index) => {
                const statusConfig = getStatusBadge(classItem.status);
                const StatusIcon = statusConfig.icon;

                return (
                  <motion.div
                    key={classItem.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Card className="session-card">
                      <div
                        className="session-card__platform-bar"
                        style={{
                          backgroundColor: getPlatformColor(classItem.platform),
                        }}
                      />
                      <div className="session-card__content">
                        <div className="session-card__header">
                          <div>
                            <h3>{classItem.topic}</h3>
                            <p className="session-card__course">
                              {classItem.courseName}
                            </p>
                          </div>
                          <Badge variant={statusConfig.variant}>
                            <StatusIcon size={14} />
                            {classItem.status === "live"
                              ? "Live Now"
                              : "Upcoming"}
                          </Badge>
                        </div>

                        <div className="session-card__details">
                          <div className="session-card__detail">
                            <Calendar size={16} />
                            <span>{formatDate(classItem.date)}</span>
                          </div>
                          <div className="session-card__detail">
                            <Clock size={16} />
                            <span>
                              {formatTime(classItem.startTime)} -{" "}
                              {formatTime(classItem.endTime)}
                            </span>
                          </div>
                          <div className="session-card__detail">
                            <Video size={16} />
                            <span
                              style={{
                                color: getPlatformColor(classItem.platform),
                                textTransform: "capitalize",
                              }}
                            >
                              {classItem.platform}
                            </span>
                          </div>
                          <div className="session-card__detail">
                            <Users size={16} />
                            <span>{classItem.enrolledStudents} Students</span>
                          </div>
                        </div>

                        <div className="session-card__meeting-info">
                          <div className="session-card__link">
                            <LinkIcon size={16} />
                            <input
                              type="text"
                              value={classItem.meetingLink}
                              readOnly
                              onClick={(e) => e.target.select()}
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              icon={Copy}
                              onClick={() =>
                                handleCopyLink(classItem.meetingLink)
                              }
                            />
                          </div>

                          {classItem.meetingId && (
                            <div className="session-card__credentials">
                              <span>
                                Meeting ID:{" "}
                                <strong>{classItem.meetingId}</strong>
                              </span>
                              <span>
                                Passcode: <strong>{classItem.passcode}</strong>
                              </span>
                            </div>
                          )}

                          {classItem.recurring && (
                            <div className="session-card__recurring">
                              <Repeat size={14} />
                              <span>
                                Recurring weekly on{" "}
                                {new Date(classItem.date).toLocaleDateString(
                                  "en-US",
                                  { weekday: "long" }
                                )}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="session-card__actions">
                          {classItem.status === "live" ? (
                            <Button
                              variant="success"
                              icon={Video}
                              onClick={() => handleStartMeeting(classItem)}
                            >
                              Join Meeting
                            </Button>
                          ) : (
                            <Button
                              variant="primary"
                              icon={Play}
                              onClick={() => handleStartMeeting(classItem)}
                            >
                              Start Meeting
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            icon={Mail}
                            onClick={() => handleSendReminder(classItem)}
                          >
                            Send Reminder
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={Edit2}
                            onClick={() => handleEditClass(classItem)}
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={Trash2}
                            onClick={() => handleDeleteClass(classItem.id)}
                          />
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })
            )}
          </motion.div>
        )}

        {/* Past Sessions */}
        {activeTab === "past" && (
          <motion.div
            key="past"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="virtual-class-setup__sessions"
          >
            {pastClasses.length === 0 ? (
              <Card>
                <div className="virtual-class-setup__empty">
                  <CheckCircle size={48} />
                  <h3>No Past Sessions</h3>
                  <p>Your recorded sessions will appear here</p>
                </div>
              </Card>
            ) : (
              pastClasses.map((classItem, index) => (
                <motion.div
                  key={classItem.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className="session-card session-card--past">
                    <div
                      className="session-card__platform-bar"
                      style={{
                        backgroundColor: getPlatformColor(classItem.platform),
                      }}
                    />
                    <div className="session-card__content">
                      <div className="session-card__header">
                        <div>
                          <h3>{classItem.topic}</h3>
                          <p className="session-card__course">
                            {classItem.courseName}
                          </p>
                        </div>
                        <Badge variant="neutral">
                          <CheckCircle size={14} />
                          Recorded
                        </Badge>
                      </div>

                      <div className="session-card__details">
                        <div className="session-card__detail">
                          <Calendar size={16} />
                          <span>{formatDate(classItem.date)}</span>
                        </div>
                        <div className="session-card__detail">
                          <Clock size={16} />
                          <span>Duration: {classItem.actualDuration}</span>
                        </div>
                        <div className="session-card__detail">
                          <Video size={16} />
                          <span
                            style={{
                              color: getPlatformColor(classItem.platform),
                              textTransform: "capitalize",
                            }}
                          >
                            {classItem.platform}
                          </span>
                        </div>
                        <div className="session-card__detail">
                          <Eye size={16} />
                          <span>{classItem.views} Views</span>
                        </div>
                      </div>

                      <div className="session-card__actions">
                        <Button
                          variant="primary"
                          icon={ExternalLink}
                          onClick={() =>
                            window.open(classItem.recordingUrl, "_blank")
                          }
                        >
                          View Recording
                        </Button>
                        <Button variant="outline" size="sm" icon={Download}>
                          Download
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={Trash2}
                          onClick={() => handleDeleteClass(classItem.id)}
                        >
                          Delete
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

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Virtual Class"
      >
        <form onSubmit={handleSubmitEdit} className="virtual-class-form">
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

          <Input
            type="text"
            label="Topic"
            placeholder="e.g., Lecture 12 - Trees"
            value={formData.topic}
            onChange={(e) =>
              setFormData({ ...formData, topic: e.target.value })
            }
            required
          />

          <div className="virtual-class-form__row">
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
              type="time"
              label="Start Time"
              value={formData.startTime}
              onChange={(e) =>
                setFormData({ ...formData, startTime: e.target.value })
              }
              required
            />
          </div>

          <Select
            label="Duration"
            value={formData.duration}
            onChange={(e) =>
              setFormData({ ...formData, duration: e.target.value })
            }
            required
          >
            <option value="30">30 minutes</option>
            <option value="60">60 minutes</option>
            <option value="90">90 minutes</option>
            <option value="120">120 minutes</option>
          </Select>

          <div className="virtual-class-form__platform">
            <label>Platform</label>
            <div className="platform-options">
              <label
                className={`platform-option ${
                  formData.platform === "zoom" ? "platform-option--active" : ""
                }`}
              >
                <input
                  type="radio"
                  name="platform"
                  value="zoom"
                  checked={formData.platform === "zoom"}
                  onChange={(e) =>
                    setFormData({ ...formData, platform: e.target.value })
                  }
                />
                <Video size={20} />
                <span>Zoom</span>
              </label>
              <label
                className={`platform-option ${
                  formData.platform === "meet" ? "platform-option--active" : ""
                }`}
              >
                <input
                  type="radio"
                  name="platform"
                  value="meet"
                  checked={formData.platform === "meet"}
                  onChange={(e) =>
                    setFormData({ ...formData, platform: e.target.value })
                  }
                />
                <Video size={20} />
                <span>Google Meet</span>
              </label>
            </div>
          </div>

          <div className="virtual-class-form__actions">
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
    </div>
  );
};

export default VirtualClassSetup;
