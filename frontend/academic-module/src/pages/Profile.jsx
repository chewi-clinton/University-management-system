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
import { User, Lock, Bell, Camera, BookOpen, AlertCircle } from "lucide-react";
import { studentService } from "../services/api/studentService.js";

const Profile = () => {
  const { user: authUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [studentProfile, setStudentProfile] = useState(null);
  const [activeTab, setActiveTab] = useState("personal");

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
                      <Button variant="outline" size="sm">
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
      </motion.div>
    </Container>
  );
};

export default Profile;
