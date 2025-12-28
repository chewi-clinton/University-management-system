import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';
import Container from '../components/shared/layout/Container.jsx';
import Card from '../components/shared/layout/Card.jsx';
import Avatar from '../components/shared/ui/Avatar.jsx';
import Button from '../components/shared/ui/Button.jsx';
import ProgressBar from '../components/shared/ui/ProgressBar.jsx';
import Tabs from '../components/shared/navigation/Tabs.jsx';
import { User, Lock, Bell, Camera } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('personal');

  const containerVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.5 } }
  };

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'academic', label: 'Academic', icon: null },
    { id: 'settings', label: 'Settings', icon: Lock }
  ];

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
                src={user?.avatar}
                alt={user?.name}
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
              <h1 className="profile__name">{user?.name}</h1>
              <p className="profile__reg">{user?.regNumber}</p>
              <p className="profile__email">{user?.email}</p>
            </div>
          </div>
          
          <div className="profile__completion">
            <h3 className="completion__title">Profile Completion</h3>
            <ProgressBar value={85} showLabel={true} />
            <p className="completion__subtitle">85% Complete</p>
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
            {activeTab === 'personal' && (
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
                          <span className="detail__label">Full Name</span>
                          <span className="detail__value">{user?.name}</span>
                        </div>
                        <div className="detail__item">
                          <span className="detail__label">Date of Birth</span>
                          <span className="detail__value">{user?.dateOfBirth}</span>
                        </div>
                        <div className="detail__item">
                          <span className="detail__label">Email</span>
                          <span className="detail__value">{user?.email}</span>
                        </div>
                        <div className="detail__item">
                          <span className="detail__label">Phone</span>
                          <span className="detail__value">{user?.phone}</span>
                        </div>
                      </div>
                    </div>

                    <div className="detail__section">
                      <h3 className="section__title">Contact Information</h3>
                      <div className="details__grid">
                        <div className="detail__item">
                          <span className="detail__label">Address</span>
                          <span className="detail__value">{user?.address}</span>
                        </div>
                        <div className="detail__item">
                          <span className="detail__label">Nationality</span>
                          <span className="detail__value">{user?.nationality}</span>
                        </div>
                        <div className="detail__item">
                          <span className="detail__label">Blood Group</span>
                          <span className="detail__value">{user?.bloodGroup}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            )}

            {/* Academic Tab */}
            {activeTab === 'academic' && (
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
                          <span className="detail__label">Program</span>
                          <span className="detail__value">{user?.program}</span>
                        </div>
                        <div className="detail__item">
                          <span className="detail__label">Current Semester</span>
                          <span className="detail__value">{user?.semester}</span>
                        </div>
                        <div className="detail__item">
                          <span className="detail__label">GPA</span>
                          <span className="detail__value">{user?.gpa}</span>
                        </div>
                        <div className="detail__item">
                          <span className="detail__label">Enrollment Year</span>
                          <span className="detail__value">{user?.enrollmentYear}</span>
                        </div>
                      </div>
                    </div>

                    <div className="detail__section">
                      <h3 className="section__title">Guardian Information</h3>
                      <div className="details__grid">
                        <div className="detail__item">
                          <span className="detail__label">Guardian Name</span>
                          <span className="detail__value">{user?.guardianName}</span>
                        </div>
                        <div className="detail__item">
                          <span className="detail__label">Guardian Phone</span>
                          <span className="detail__value">{user?.guardianPhone}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
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
                          <span className="setting__label">Email Notifications</span>
                          <span className="setting__description">
                            Receive updates via email
                          </span>
                        </div>
                        <div className="setting__toggle">
                          <input type="checkbox" defaultChecked className="toggle" />
                        </div>
                      </div>
                      <div className="setting__item">
                        <div className="setting__info">
                          <span className="setting__label">Push Notifications</span>
                          <span className="setting__description">
                            Get notified about important updates
                          </span>
                        </div>
                        <div className="setting__toggle">
                          <input type="checkbox" defaultChecked className="toggle" />
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