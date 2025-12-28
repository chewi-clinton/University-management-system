import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
  Shield,
  Bell,
  Lock,
  Save,
  Book,
} from "lucide-react";
import AppShell from "../../../shared/components/layout/AppShell";
import Card from "../../../shared/components/display/Card";
import { Button } from "../../../shared/components/forms/Button";
import { Input } from "../../../shared/components/forms/Input";
import { ProgressBar } from "../../../shared/components/display/ProgressBar";
import "./profile.css";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("personal");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1500);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
  };

  return (
    <AppShell>
      <motion.div
        className="profile-page"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header Profile Section */}
        <section className="profile-hero">
          <Card className="hero-card">
            <div className="hero-flex">
              <div className="avatar-section">
                <div className="avatar-wrapper">
                  <img
                    src="https://ui-avatars.com/api/?name=John+Doe&background=e87d26&color=fff&size=128"
                    alt="Profile"
                  />
                  <button className="upload-overlay" title="Update Photo">
                    <Camera size={20} />
                  </button>
                </div>
              </div>
              <div className="profile-identity">
                <h1>John Doe</h1>
                <p className="id-tag">UNI-2024-0123</p>
                <div className="program-info">
                  <Book size={16} />
                  <span>Bachelor of Science in Computer Science (Junior)</span>
                </div>
                <div className="completion-stats mt-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Profile Completion</span>
                    <span>85%</span>
                  </div>
                  <ProgressBar progress={85} color="var(--primary-500)" />
                </div>
              </div>
              <div className="hero-actions">
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving ? (
                    "Saving..."
                  ) : (
                    <>
                      <Save size={16} /> Save Changes
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </section>

        {/* Settings Navigation */}
        <div className="profile-layout">
          <aside className="profile-nav">
            <button
              className={`nav-item ${activeTab === "personal" ? "active" : ""}`}
              onClick={() => setActiveTab("personal")}
            >
              <User size={18} /> Personal Info
            </button>
            <button
              className={`nav-item ${activeTab === "academic" ? "active" : ""}`}
              onClick={() => setActiveTab("academic")}
            >
              <Book size={18} /> Academic Record
            </button>
            <button
              className={`nav-item ${activeTab === "security" ? "active" : ""}`}
              onClick={() => setActiveTab("security")}
            >
              <Shield size={18} /> Security & Privacy
            </button>
            <button
              className={`nav-item ${
                activeTab === "notifications" ? "active" : ""
              }`}
              onClick={() => setActiveTab("notifications")}
            >
              <Bell size={18} /> Notifications
            </button>
          </aside>

          {/* Form Content Area */}
          <main className="profile-content">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === "personal" && (
                  <Card title="Personal Information">
                    <div className="form-grid">
                      <Input
                        label="Full Name"
                        defaultValue="John Doe"
                        icon={<User size={16} />}
                      />
                      <Input
                        label="Email Address"
                        defaultValue="j.doe@university.edu"
                        icon={<Mail size={16} />}
                      />
                      <Input
                        label="Phone Number"
                        defaultValue="+1 (555) 000-1234"
                        icon={<Phone size={16} />}
                      />
                      <Input
                        label="Location"
                        defaultValue="New York, USA"
                        icon={<MapPin size={16} />}
                      />
                    </div>
                    <div className="mt-6">
                      <label className="text-sm font-bold block mb-2">
                        Short Bio
                      </label>
                      <textarea
                        className="bio-textarea"
                        placeholder="Tell us a bit about yourself..."
                        defaultValue="Computer Science major interested in Web Technologies and AI."
                      />
                    </div>
                  </Card>
                )}

                {activeTab === "security" && (
                  <Card title="Security Settings">
                    <div className="security-section mb-8">
                      <h4>Change Password</h4>
                      <p className="text-sm text-secondary mb-4">
                        Update your password to keep your account secure.
                      </p>
                      <div className="form-grid">
                        <Input
                          type="password"
                          label="Current Password"
                          icon={<Lock size={16} />}
                        />
                        <Input
                          type="password"
                          label="New Password"
                          icon={<Lock size={16} />}
                        />
                      </div>
                      <Button variant="outline" className="mt-4">
                        Update Password
                      </Button>
                    </div>
                    <div className="security-section pt-6 border-t border-gray-100">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4>Two-Factor Authentication</h4>
                          <p className="text-sm text-secondary">
                            Add an extra layer of security to your account.
                          </p>
                        </div>
                        <div className="toggle-switch active"></div>
                      </div>
                    </div>
                  </Card>
                )}

                {activeTab === "notifications" && (
                  <Card title="Notification Preferences">
                    <div className="notification-list">
                      {[
                        {
                          t: "Course Announcements",
                          d: "Get notified about new course updates and materials.",
                        },
                        {
                          t: "Exam Reminders",
                          d: "Receive alerts 24 hours before your scheduled exams.",
                        },
                        {
                          t: "Grade Releases",
                          d: "Notifications when new results are posted.",
                        },
                        {
                          t: "Marketing & Events",
                          d: "Updates about campus events and newsletters.",
                        },
                      ].map((item, idx) => (
                        <div key={idx} className="notif-item">
                          <div className="notif-info">
                            <p className="font-bold mb-1">{item.t}</p>
                            <p className="text-sm text-secondary">{item.d}</p>
                          </div>
                          <div
                            className={`toggle-switch ${
                              idx < 3 ? "active" : ""
                            }`}
                          ></div>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </motion.div>
    </AppShell>
  );
};

export default Profile;
