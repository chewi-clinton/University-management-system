import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext.jsx";
import Container from "../components/shared/layout/Container.jsx";
import Card from "../components/shared/layout/Card.jsx";
import Avatar from "../components/shared/ui/Avatar.jsx";
import Button from "../components/shared/ui/Button.jsx";
import ProgressBar from "../components/shared/ui/ProgressBar.jsx";
import Tabs from "../components/shared/navigation/Tabs.jsx";
import Skeleton from "../components/shared/feedback/Skeleton.jsx";
import Modal from "../components/shared/feedback/Modal.jsx";
import {
  User,
  Lock,
  Bell,
  Camera,
  BookOpen,
  AlertCircle,
  Eye,
  EyeOff,
  CheckCircle,
} from "lucide-react";
import { studentService } from "../services/api/studentService.js";
import authService from "../services/api/authService.js";
import "../styles/pages/profile.css";
const Profile = () => {
  const { user: authUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [studentProfile, setStudentProfile] = useState(null);
  const [activeTab, setActiveTab] = useState("personal");

  // Password change modal state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  useEffect(() => {
    fetchStudentProfile();
  }, []);

  const fetchStudentProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const profileResponse = await studentService.getMyProfile();
      console.log("Student profile:", profileResponse);

      if (!profileResponse.success) {
        throw new Error(profileResponse.error || "Failed to load profile");
      }

      setStudentProfile(profileResponse.data);
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError(err.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    // Validation
    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      setPasswordError("All fields are required");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters long");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      setPasswordError("New password must be different from current password");
      return;
    }

    setPasswordLoading(true);

    try {
      const result = await authService.changePassword({
        old_password: passwordData.currentPassword,
        new_password: passwordData.newPassword,
        new_password_confirm: passwordData.confirmPassword,
      });

      if (result.success) {
        setPasswordSuccess("Password changed successfully!");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });

        // Close modal after 2 seconds
        setTimeout(() => {
          setShowPasswordModal(false);
          setPasswordSuccess("");
        }, 2000);
      } else {
        setPasswordError(result.error || "Failed to change password");
      }
    } catch (err) {
      setPasswordError(
        err.message || "An error occurred while changing password"
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const calculateProfileCompletion = () => {
    if (!studentProfile) return 0;

    const fields = [
      studentProfile.first_name,
      studentProfile.last_name,
      studentProfile.email,
      studentProfile.phone,
      studentProfile.date_of_birth,
      studentProfile.address,
      studentProfile.nationality,
      studentProfile.blood_group,
      studentProfile.program,
    ];

    const filledFields = fields.filter((field) => field && field !== "").length;
    return Math.round((filledFields / fields.length) * 100);
  };

  const containerVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.5 } },
  };

  const tabs = [
    { id: "personal", label: "Personal Info" },
    { id: "academic", label: "Academic" },
    { id: "settings", label: "Settings" },
  ];

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <Container>
        <div className="profile">
          <div className="profile__header">
            <div className="profile__avatar-section">
              <Skeleton variant="circle" width="120px" height="120px" />
              <div style={{ marginLeft: "24px", flex: 1 }}>
                <Skeleton variant="text" width="200px" height="32px" />
                <Skeleton
                  variant="text"
                  width="150px"
                  height="20px"
                  style={{ marginTop: "8px" }}
                />
                <Skeleton
                  variant="text"
                  width="180px"
                  height="20px"
                  style={{ marginTop: "4px" }}
                />
              </div>
            </div>
          </div>
          <Skeleton
            variant="rectangular"
            height="400px"
            style={{ marginTop: "24px" }}
          />
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Card variant="flat" className="profile__error">
          <AlertCircle
            size={48}
            style={{ color: "#ef4444", marginBottom: "16px" }}
          />
          <h3
            style={{ fontSize: "20px", fontWeight: "600", marginBottom: "8px" }}
          >
            Failed to Load Profile
          </h3>
          <p style={{ color: "#6b7280", marginBottom: "24px" }}>{error}</p>
          <Button variant="primary" onClick={fetchStudentProfile}>
            Retry
          </Button>
        </Card>
      </Container>
    );
  }

  if (!studentProfile) {
    return (
      <Container>
        <Card variant="flat">
          <p>No profile data available</p>
        </Card>
      </Container>
    );
  }

  const profileCompletion = calculateProfileCompletion();
  const fullName = `${studentProfile.first_name || ""} ${
    studentProfile.last_name || ""
  }`.trim();

  return (
    <Container>
      <motion.div
        className="profile"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        {/* Profile Header */}
        <div className="profile__header">
          <div className="profile__avatar-section">
            <div className="avatar__wrapper">
              <Avatar
                src={studentProfile.profile_picture || authUser?.avatar}
                alt={fullName}
                size="xl"
                className="profile__avatar"
              />
              <Button
                variant="ghost"
                size="sm"
                className="avatar__edit"
                leftIcon={<Camera size={16} />}
              >
                Edit
              </Button>
            </div>
            <div className="profile__info">
              <h1 className="profile__name">{fullName || "Student"}</h1>
              <p className="profile__reg">
                {studentProfile.university_reg_number || "N/A"}
              </p>
              <p className="profile__email">
                {studentProfile.email || studentProfile.user?.email || "N/A"}
              </p>
            </div>
          </div>

          <div className="profile__completion">
            <h3 className="completion__title">Profile Completion</h3>
            <ProgressBar value={profileCompletion} showLabel={true} />
            <p className="completion__subtitle">
              {profileCompletion}% Complete
            </p>
          </div>
        </div>

        {/* Profile Content */}
        <div className="profile__content">
          <Tabs
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            variant="underline"
          />

          <div className="profile__tabs-content">
            {/* Personal Info Tab */}
            {activeTab === "personal" && (
              <Card className="profile__tab-card">
                <Card.Header>
                  <h2 className="card__title">Personal Information</h2>
                  <Button variant="outline" size="sm">
                    Edit Profile
                  </Button>
                </Card.Header>
                <Card.Body>
                  <div className="profile__details">
                    <div className="detail__section">
                      <h3 className="section__title">Basic Information</h3>
                      <div className="details__grid">
                        <div className="detail__item">
                          <span className="detail__label">First Name</span>
                          <span className="detail__value">
                            {studentProfile.first_name || "N/A"}
                          </span>
                        </div>
                        <div className="detail__item">
                          <span className="detail__label">Last Name</span>
                          <span className="detail__value">
                            {studentProfile.last_name || "N/A"}
                          </span>
                        </div>
                        <div className="detail__item">
                          <span className="detail__label">Date of Birth</span>
                          <span className="detail__value">
                            {formatDate(studentProfile.date_of_birth)}
                          </span>
                        </div>
                        <div className="detail__item">
                          <span className="detail__label">Gender</span>
                          <span className="detail__value">
                            {studentProfile.gender || "N/A"}
                          </span>
                        </div>
                        <div className="detail__item">
                          <span className="detail__label">Email</span>
                          <span className="detail__value">
                            {studentProfile.email || "N/A"}
                          </span>
                        </div>
                        <div className="detail__item">
                          <span className="detail__label">Phone</span>
                          <span className="detail__value">
                            {studentProfile.phone || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="detail__section">
                      <h3 className="section__title">Contact Information</h3>
                      <div className="details__grid">
                        <div className="detail__item">
                          <span className="detail__label">Address</span>
                          <span className="detail__value">
                            {studentProfile.address || "N/A"}
                          </span>
                        </div>
                        <div className="detail__item">
                          <span className="detail__label">City</span>
                          <span className="detail__value">
                            {studentProfile.city || "N/A"}
                          </span>
                        </div>
                        <div className="detail__item">
                          <span className="detail__label">Country</span>
                          <span className="detail__value">
                            {studentProfile.country || "N/A"}
                          </span>
                        </div>
                        <div className="detail__item">
                          <span className="detail__label">Nationality</span>
                          <span className="detail__value">
                            {studentProfile.nationality || "N/A"}
                          </span>
                        </div>
                        <div className="detail__item">
                          <span className="detail__label">Blood Group</span>
                          <span className="detail__value">
                            {studentProfile.blood_group || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            )}

            {/* Academic Tab */}
            {activeTab === "academic" && (
              <Card className="profile__tab-card">
                <Card.Header>
                  <h2 className="card__title">Academic Information</h2>
                </Card.Header>
                <Card.Body>
                  <div className="academic__details">
                    <div className="detail__section">
                      <h3 className="section__title">Program Details</h3>
                      <div className="details__grid">
                        <div className="detail__item">
                          <span className="detail__label">
                            Registration Number
                          </span>
                          <span className="detail__value">
                            {studentProfile.university_reg_number || "N/A"}
                          </span>
                        </div>
                        <div className="detail__item">
                          <span className="detail__label">Program</span>
                          <span className="detail__value">
                            {studentProfile.program?.program_name || "N/A"}
                          </span>
                        </div>
                        <div className="detail__item">
                          <span className="detail__label">Department</span>
                          <span className="detail__value">
                            {studentProfile.program?.department
                              ?.department_name || "N/A"}
                          </span>
                        </div>
                        <div className="detail__item">
                          <span className="detail__label">Current Status</span>
                          <span className="detail__value">
                            {studentProfile.current_status || "N/A"}
                          </span>
                        </div>
                        <div className="detail__item">
                          <span className="detail__label">Current GPA</span>
                          <span className="detail__value">
                            {studentProfile.current_gpa
                              ? parseFloat(studentProfile.current_gpa).toFixed(
                                  2
                                )
                              : "N/A"}
                          </span>
                        </div>
                        <div className="detail__item">
                          <span className="detail__label">Credits Earned</span>
                          <span className="detail__value">
                            {studentProfile.credits_earned || "0"}
                          </span>
                        </div>
                        <div className="detail__item">
                          <span className="detail__label">Enrollment Date</span>
                          <span className="detail__value">
                            {formatDate(studentProfile.enrollment_date)}
                          </span>
                        </div>
                        <div className="detail__item">
                          <span className="detail__label">
                            Expected Graduation
                          </span>
                          <span className="detail__value">
                            {formatDate(
                              studentProfile.expected_graduation_date
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="detail__section">
                      <h3 className="section__title">Guardian Information</h3>
                      <div className="details__grid">
                        <div className="detail__item">
                          <span className="detail__label">Guardian Name</span>
                          <span className="detail__value">
                            {studentProfile.guardian_name || "N/A"}
                          </span>
                        </div>
                        <div className="detail__item">
                          <span className="detail__label">Guardian Phone</span>
                          <span className="detail__value">
                            {studentProfile.guardian_phone || "N/A"}
                          </span>
                        </div>
                        <div className="detail__item">
                          <span className="detail__label">Guardian Email</span>
                          <span className="detail__value">
                            {studentProfile.guardian_email || "N/A"}
                          </span>
                        </div>
                        <div className="detail__item">
                          <span className="detail__label">
                            Guardian Relation
                          </span>
                          <span className="detail__value">
                            {studentProfile.guardian_relation || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {studentProfile.emergency_contact_name && (
                      <div className="detail__section">
                        <h3 className="section__title">Emergency Contact</h3>
                        <div className="details__grid">
                          <div className="detail__item">
                            <span className="detail__label">Contact Name</span>
                            <span className="detail__value">
                              {studentProfile.emergency_contact_name}
                            </span>
                          </div>
                          <div className="detail__item">
                            <span className="detail__label">Contact Phone</span>
                            <span className="detail__value">
                              {studentProfile.emergency_contact_phone || "N/A"}
                            </span>
                          </div>
                          <div className="detail__item">
                            <span className="detail__label">Relationship</span>
                            <span className="detail__value">
                              {studentProfile.emergency_contact_relation ||
                                "N/A"}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </Card.Body>
              </Card>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <Card className="profile__tab-card">
                <Card.Header>
                  <h2 className="card__title">Account Settings</h2>
                </Card.Header>
                <Card.Body>
                  <div className="settings__section">
                    <h3 className="section__title">Notifications</h3>
                    <div className="settings__list">
                      <div className="setting__item">
                        <div className="setting__info">
                          <span className="setting__label">
                            Email Notifications
                          </span>
                          <span className="setting__description">
                            Receive updates via email
                          </span>
                        </div>
                        <div className="setting__toggle">
                          <input
                            type="checkbox"
                            defaultChecked
                            className="toggle"
                          />
                        </div>
                      </div>
                      <div className="setting__item">
                        <div className="setting__info">
                          <span className="setting__label">
                            Push Notifications
                          </span>
                          <span className="setting__description">
                            Get notified about important updates
                          </span>
                        </div>
                        <div className="setting__toggle">
                          <input
                            type="checkbox"
                            defaultChecked
                            className="toggle"
                          />
                        </div>
                      </div>
                      <div className="setting__item">
                        <div className="setting__info">
                          <span className="setting__label">
                            Grade Notifications
                          </span>
                          <span className="setting__description">
                            Notify when grades are posted
                          </span>
                        </div>
                        <div className="setting__toggle">
                          <input
                            type="checkbox"
                            defaultChecked
                            className="toggle"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="settings__section">
                    <h3 className="section__title">Security</h3>
                    <div className="settings__actions">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowPasswordModal(true)}
                      >
                        <Lock size={16} />
                        Change Password
                      </Button>
                      <Button variant="outline" size="sm">
                        Two-Factor Authentication
                      </Button>
                    </div>
                  </div>

                  <div className="settings__section">
                    <h3 className="section__title">Account Status</h3>
                    <div className="details__grid">
                      <div className="detail__item">
                        <span className="detail__label">Account Status</span>
                        <span className="detail__value">
                          {studentProfile.user?.is_active
                            ? "Active"
                            : "Inactive"}
                        </span>
                      </div>
                      <div className="detail__item">
                        <span className="detail__label">Account Created</span>
                        <span className="detail__value">
                          {formatDate(studentProfile.user?.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            )}
          </div>
        </div>

        {/* Password Change Modal */}
        <Modal
          isOpen={showPasswordModal}
          onClose={() => {
            setShowPasswordModal(false);
            setPasswordData({
              currentPassword: "",
              newPassword: "",
              confirmPassword: "",
            });
            setPasswordError("");
            setPasswordSuccess("");
          }}
          title="Change Password"
          size="md"
        >
          <form onSubmit={handlePasswordChange}>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "20px" }}
            >
              {/* Current Password */}
              <div
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                <label
                  style={{
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#374151",
                  }}
                >
                  Current Password
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPasswords.current ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        currentPassword: e.target.value,
                      })
                    }
                    placeholder="Enter current password"
                    style={{
                      width: "100%",
                      padding: "10px 40px 10px 12px",
                      border: "1px solid #d1d5db",
                      borderRadius: "8px",
                      fontSize: "14px",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("current")}
                    style={{
                      position: "absolute",
                      right: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#6b7280",
                    }}
                  >
                    {showPasswords.current ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                <label
                  style={{
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#374151",
                  }}
                >
                  New Password
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPasswords.new ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        newPassword: e.target.value,
                      })
                    }
                    placeholder="Enter new password (min 8 characters)"
                    style={{
                      width: "100%",
                      padding: "10px 40px 10px 12px",
                      border: "1px solid #d1d5db",
                      borderRadius: "8px",
                      fontSize: "14px",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("new")}
                    style={{
                      position: "absolute",
                      right: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#6b7280",
                    }}
                  >
                    {showPasswords.new ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                <label
                  style={{
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#374151",
                  }}
                >
                  Confirm New Password
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPasswords.confirm ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        confirmPassword: e.target.value,
                      })
                    }
                    placeholder="Re-enter new password"
                    style={{
                      width: "100%",
                      padding: "10px 40px 10px 12px",
                      border: "1px solid #d1d5db",
                      borderRadius: "8px",
                      fontSize: "14px",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("confirm")}
                    style={{
                      position: "absolute",
                      right: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#6b7280",
                    }}
                  >
                    {showPasswords.confirm ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {passwordError && (
                <div
                  style={{
                    padding: "12px",
                    backgroundColor: "#fef2f2",
                    border: "1px solid #fecaca",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    color: "#dc2626",
                  }}
                >
                  <AlertCircle size={18} />
                  <span style={{ fontSize: "14px" }}>{passwordError}</span>
                </div>
              )}

              {/* Success Message */}
              {passwordSuccess && (
                <div
                  style={{
                    padding: "12px",
                    backgroundColor: "#f0fdf4",
                    border: "1px solid #bbf7d0",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    color: "#16a34a",
                  }}
                >
                  <CheckCircle size={18} />
                  <span style={{ fontSize: "14px" }}>{passwordSuccess}</span>
                </div>
              )}

              {/* Buttons */}
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  justifyContent: "flex-end",
                  marginTop: "8px",
                }}
              >
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPasswordData({
                      currentPassword: "",
                      newPassword: "",
                      confirmPassword: "",
                    });
                    setPasswordError("");
                    setPasswordSuccess("");
                  }}
                  disabled={passwordLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={passwordLoading}
                >
                  {passwordLoading ? "Changing..." : "Change Password"}
                </Button>
              </div>
            </div>
          </form>
        </Modal>
      </motion.div>
    </Container>
  );
};

export default Profile;
