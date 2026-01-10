import React, { useState, useEffect } from "react";
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
  Repeat,
} from "lucide-react";
import Card from "../../components/shared/layout/Card";
import Button from "../../components/shared/ui/Button";
import Input from "../../components/shared/ui/Input";
import Select from "../../components/shared/ui/Select";
import Modal from "../../components/shared/feedback/Modal";
import Badge from "../../components/shared/ui/Badge";
import Skeleton from "../../components/shared/feedback/Skeleton";
import facultyService from "../../services/api/facultyService";
import api from "../../services/api/api";
import "../../styles/pages/VirtualClassSetup.css";

const VirtualClassSetup = () => {
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [error, setError] = useState(null);
  const [saveStatus, setSaveStatus] = useState(null);

  const [formData, setFormData] = useState({
    offering_id: "",
    topic: "",
    schedule_date: "",
    start_time: "",
    duration_minutes: "60",
    platform: "zoom",
    description: "",
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [coursesResponse, classesResponse] = await Promise.all([
        facultyService.getCourses({ is_visible: true }),
        api.get("zoom-classes/"),
      ]);

      const coursesData = coursesResponse.results || coursesResponse;
      // Filter out courses without valid IDs
      const validCourses = coursesData.filter((course) => course?.id != null);
      setCourses(validCourses);

      const classesData = classesResponse.data.results || classesResponse.data;

      // Enrich classes data
      const enrichedClasses = classesData.map((cls) => ({
        id: cls.class_id,
        offeringId: cls.offering?.id,
        courseName: cls.offering?.course?.course_code
          ? `${cls.offering.course.course_code} - ${cls.offering.course.course_name}`
          : "N/A",
        topic: cls.topic,
        date: cls.schedule_date,
        startTime: cls.start_time,
        duration: cls.duration_minutes,
        platform: cls.platform || "zoom",
        meetingLink: cls.join_link,
        meetingId: cls.meeting_id,
        startUrl: cls.start_url,
        passcode: cls.passcode,
        status: determineStatus(
          cls.schedule_date,
          cls.start_time,
          cls.duration_minutes
        ),
        isActive: cls.is_active,
        enrolledStudents: cls.offering?.current_enrollment || 0,
        description: cls.description || "",
      }));

      setClasses(enrichedClasses);
    } catch (error) {
      console.error("Error loading data:", error);
      setError("Failed to load virtual classes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const determineStatus = (date, time, duration) => {
    if (!date || !time) return "upcoming";

    const classDateTime = new Date(`${date}T${time}`);
    const now = new Date();
    const endTime = new Date(classDateTime.getTime() + duration * 60000);

    if (now >= classDateTime && now <= endTime) {
      return "live";
    } else if (now > endTime) {
      return "recorded";
    } else {
      return "upcoming";
    }
  };

  const handleCreateClass = () => {
    setFormData({
      offering_id: "",
      topic: "",
      schedule_date: "",
      start_time: "",
      duration_minutes: "60",
      platform: "zoom",
      description: "",
    });
    setIsCreateModalOpen(true);
  };

  const handleEditClass = (classItem) => {
    setSelectedClass(classItem);
    setFormData({
      offering_id: classItem.offeringId?.toString() || "",
      topic: classItem.topic,
      schedule_date: classItem.date,
      start_time: classItem.startTime,
      duration_minutes: classItem.duration?.toString() || "60",
      platform: classItem.platform,
      description: classItem.description || "",
    });
    setIsEditModalOpen(true);
  };

  const handleSubmitCreate = async (e) => {
    e.preventDefault();
    setSaveStatus({ type: "loading", message: "Creating virtual class..." });

    try {
      const classData = {
        offering_id: parseInt(formData.offering_id),
        topic: formData.topic,
        schedule_date: formData.schedule_date,
        start_time: formData.start_time,
        duration_minutes: parseInt(formData.duration_minutes),
        platform: formData.platform,
        description: formData.description,
      };

      const response = await facultyService.createZoomClass(classData);

      setIsCreateModalOpen(false);
      setSaveStatus({
        type: "success",
        message: "Virtual class created successfully!",
      });
      await loadInitialData();
    } catch (error) {
      console.error("Error creating virtual class:", error);
      setSaveStatus({
        type: "error",
        message: "Failed to create virtual class",
      });
    }
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    setSaveStatus({ type: "loading", message: "Updating virtual class..." });

    try {
      const classData = {
        offering_id: parseInt(formData.offering_id),
        topic: formData.topic,
        schedule_date: formData.schedule_date,
        start_time: formData.start_time,
        duration_minutes: parseInt(formData.duration_minutes),
        platform: formData.platform,
        description: formData.description,
      };

      await api.patch(`zoom-classes/${selectedClass.id}/`, classData);

      setIsEditModalOpen(false);
      setSaveStatus({
        type: "success",
        message: "Virtual class updated successfully!",
      });
      await loadInitialData();
    } catch (error) {
      console.error("Error updating virtual class:", error);
      setSaveStatus({
        type: "error",
        message: "Failed to update virtual class",
      });
    }
  };

  const handleDeleteClass = async (classId) => {
    if (window.confirm("Are you sure you want to delete this virtual class?")) {
      try {
        await api.delete(`zoom-classes/${classId}/`);
        setSaveStatus({ type: "success", message: "Virtual class deleted" });
        await loadInitialData();
      } catch (error) {
        console.error("Error deleting class:", error);
        setSaveStatus({
          type: "error",
          message: "Failed to delete virtual class",
        });
      }
    }
  };

  const handleStartMeeting = async (classItem) => {
    try {
      if (classItem.status === "live" || classItem.startUrl) {
        // Use start URL for host
        const response = await facultyService.startZoomMeeting(classItem.id);
        window.open(response.start_url || classItem.startUrl, "_blank");
      } else {
        // Use join link for future meetings
        window.open(classItem.meetingLink, "_blank");
      }
    } catch (error) {
      console.error("Error starting meeting:", error);
      // Fallback to direct link
      window.open(classItem.meetingLink || classItem.startUrl, "_blank");
    }
  };

  const handleCopyLink = (link) => {
    navigator.clipboard.writeText(link);
    setSaveStatus({
      type: "success",
      message: "Meeting link copied to clipboard!",
    });
    setTimeout(() => setSaveStatus(null), 2000);
  };

  const handleSendReminder = async (classItem) => {
    try {
      await facultyService.sendClassReminder(classItem.id);
      setSaveStatus({
        type: "success",
        message: `Reminder sent to ${classItem.enrolledStudents} students`,
      });
    } catch (error) {
      console.error("Error sending reminder:", error);
      setSaveStatus({ type: "error", message: "Failed to send reminder" });
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";

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
    if (!time) return "N/A";

    const [hour, min] = time.split(":");
    const h = parseInt(hour);
    const ampm = h >= 12 ? "PM" : "AM";
    const displayHour = h > 12 ? h - 12 : h === 0 ? 12 : h;
    return `${displayHour}:${min} ${ampm}`;
  };

  const calculateEndTime = (startTime, duration) => {
    if (!startTime || !duration) return "N/A";

    const [hours, minutes] = startTime.split(":").map(Number);
    const totalMinutes = hours * 60 + minutes + parseInt(duration);
    const endHours = Math.floor(totalMinutes / 60) % 24;
    const endMinutes = totalMinutes % 60;
    return `${String(endHours).padStart(2, "0")}:${String(endMinutes).padStart(
      2,
      "0"
    )}`;
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
    (c) => (c.status === "upcoming" || c.status === "live") && c.isActive
  );
  const pastClasses = classes.filter((c) => c.status === "recorded");

  if (loading) {
    return (
      <div className="virtual-class-setup">
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
      <div className="virtual-class-setup">
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

      {/* Quick Create Form */}
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
                value={formData.offering_id}
                onChange={(e) =>
                  setFormData({ ...formData, offering_id: e.target.value })
                }
                required
              >
                <option value="">Select Course</option>
                {courses
                  .filter((course) => course?.id != null)
                  .map((course) => (
                    <option key={course.id} value={course.id.toString()}>
                      {course.course?.course_code} -{" "}
                      {course.course?.course_name}
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
                value={formData.schedule_date}
                onChange={(e) =>
                  setFormData({ ...formData, schedule_date: e.target.value })
                }
                required
              />

              <Input
                type="time"
                label="Start Time"
                value={formData.start_time}
                onChange={(e) =>
                  setFormData({ ...formData, start_time: e.target.value })
                }
                required
              />

              <Select
                label="Duration"
                value={formData.duration_minutes}
                onChange={(e) =>
                  setFormData({ ...formData, duration_minutes: e.target.value })
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
                      formData.platform === "google_meet"
                        ? "platform-option--active"
                        : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="platform"
                      value="google_meet"
                      checked={formData.platform === "google_meet"}
                      onChange={(e) =>
                        setFormData({ ...formData, platform: e.target.value })
                      }
                    />
                    <Video size={20} />
                    <span>Google Meet</span>
                  </label>
                </div>
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
                const endTime = calculateEndTime(
                  classItem.startTime,
                  classItem.duration
                );

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
                              {formatTime(endTime)}
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
                              {classItem.platform.replace("_", " ")}
                            </span>
                          </div>
                          <div className="session-card__detail">
                            <Users size={16} />
                            <span>{classItem.enrolledStudents} Students</span>
                          </div>
                        </div>

                        {classItem.meetingLink && (
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
                                {classItem.passcode && (
                                  <span>
                                    Passcode:{" "}
                                    <strong>{classItem.passcode}</strong>
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        )}

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
                          <span>Duration: {classItem.duration} min</span>
                        </div>
                        <div className="session-card__detail">
                          <Video size={16} />
                          <span
                            style={{
                              color: getPlatformColor(classItem.platform),
                              textTransform: "capitalize",
                            }}
                          >
                            {classItem.platform.replace("_", " ")}
                          </span>
                        </div>
                      </div>

                      <div className="session-card__actions">
                        {classItem.meetingLink && (
                          <Button
                            variant="primary"
                            icon={ExternalLink}
                            onClick={() =>
                              window.open(classItem.meetingLink, "_blank")
                            }
                          >
                            View Recording
                          </Button>
                        )}
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
            value={formData.offering_id}
            onChange={(e) =>
              setFormData({ ...formData, offering_id: e.target.value })
            }
            required
          >
            <option value="">Select Course</option>
            {courses
              .filter((course) => course?.id != null)
              .map((course) => (
                <option key={course.id} value={course.id.toString()}>
                  {course.course?.course_code} - {course.course?.course_name}
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
              value={formData.schedule_date}
              onChange={(e) =>
                setFormData({ ...formData, schedule_date: e.target.value })
              }
              required
            />

            <Input
              type="time"
              label="Start Time"
              value={formData.start_time}
              onChange={(e) =>
                setFormData({ ...formData, start_time: e.target.value })
              }
              required
            />
          </div>

          <Select
            label="Duration"
            value={formData.duration_minutes}
            onChange={(e) =>
              setFormData({ ...formData, duration_minutes: e.target.value })
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
                  formData.platform === "google_meet"
                    ? "platform-option--active"
                    : ""
                }`}
              >
                <input
                  type="radio"
                  name="platform"
                  value="google_meet"
                  checked={formData.platform === "google_meet"}
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
