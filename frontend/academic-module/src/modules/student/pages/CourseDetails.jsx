import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Download,
  Video,
  Calendar,
  BarChart2,
  Mail,
  Info,
  ChevronLeft,
  PlayCircle,
} from "lucide-react";
import AppShell from "../../../shared/components/layout/AppShell";
import Card from "../../../shared/components/display/Card";
import { Tabs } from "../../../shared/components/navigation/Tabs";
import { Badge } from "../../../shared/components/display/Badge";
import { Button } from "../../../shared/components/forms/Button";
import "./courseDetails.css";

const MOCK_DATA = {
  id: "cs301",
  title: "Data Structures & Algorithms",
  code: "CS 301",
  instructor: {
    name: "Dr. Jane Smith",
    email: "j.smith@university.edu",
    office: "Room 402",
  },
  materials: [
    {
      id: 1,
      name: "Lecture 1: Introduction to Arrays",
      type: "PDF",
      size: "2.4 MB",
    },
    { id: 2, name: "Binary Trees Visual Guide", type: "PPT", size: "5.1 MB" },
    {
      id: 3,
      name: "Complexity Analysis Worksheet",
      type: "DOC",
      size: "1.2 MB",
    },
  ],
  assessments: [
    { name: "Midterm 1", score: 85, total: 100, weight: "20%" },
    { name: "Assignment 1", score: 95, total: 100, weight: "10%" },
    { name: "Quiz: LinkedLists", score: 18, total: 20, weight: "5%" },
  ],
  virtualClasses: [
    {
      id: 101,
      title: "Live Q&A: Graph Traversal",
      date: "Tomorrow, 10:00 AM",
      platform: "Zoom",
    },
  ],
};

const CourseDetails = () => {
  const [activeTab, setActiveTab] = useState("materials");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const tabList = [
    { id: "materials", label: "Study Materials" },
    { id: "grades", label: "Grades & Assessment" },
    { id: "attendance", label: "Attendance" },
    { id: "virtual", label: "Virtual Classes" },
  ];

  return (
    <AppShell>
      <motion.div
        className="details-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Hero Section */}
        <motion.div
          className="course-hero"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="hero-overlay" />
          <div className="hero-content">
            <Button
              variant="ghost"
              className="back-btn"
              onClick={() => window.history.back()}
            >
              <ChevronLeft size={18} /> Back to Courses
            </Button>
            <Badge variant="primary">{MOCK_DATA.code}</Badge>
            <h1>{MOCK_DATA.title}</h1>
            <div className="hero-meta">
              <span className="meta-item">
                <User size={16} /> {MOCK_DATA.instructor.name}
              </span>
              <span className="meta-item">
                <Calendar size={16} /> Fall 2024
              </span>
            </div>
          </div>
        </motion.div>

        <div className="details-layout">
          <div className="details-main">
            <Tabs
              tabs={tabList}
              activeTab={activeTab}
              onChange={setActiveTab}
            />

            <div className="tab-content">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {activeTab === "materials" && (
                    <div className="materials-list">
                      {MOCK_DATA.materials.map((file) => (
                        <div key={file.id} className="file-row">
                          <div className="file-info">
                            <div
                              className={`file-icon ${file.type.toLowerCase()}`}
                            >
                              <FileText size={20} />
                            </div>
                            <div>
                              <p className="file-name">{file.name}</p>
                              <span className="file-meta">
                                {file.type} • {file.size}
                              </span>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            <Download size={16} />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === "grades" && (
                    <div className="grades-view">
                      <div className="grade-summary-card">
                        <div className="current-grade">
                          <span className="label">Current Grade</span>
                          <h2 className="value">A- (91.4%)</h2>
                        </div>
                        <BarChart2 size={48} className="chart-icon" />
                      </div>
                      <table className="assessment-table">
                        <thead>
                          <tr>
                            <th>Assessment</th>
                            <th>Weight</th>
                            <th>Score</th>
                          </tr>
                        </thead>
                        <tbody>
                          {MOCK_DATA.assessments.map((item, i) => (
                            <tr key={i}>
                              <td>{item.name}</td>
                              <td>{item.weight}</td>
                              <td className="font-bold">
                                {item.score}/{item.total}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {activeTab === "virtual" && (
                    <div className="virtual-sessions">
                      {MOCK_DATA.virtualClasses.map((session) => (
                        <Card
                          key={session.id}
                          variant="flat"
                          className="session-card"
                        >
                          <div className="session-info">
                            <PlayCircle size={32} className="text-primary" />
                            <div>
                              <h4>{session.title}</h4>
                              <p>
                                {session.date} • {session.platform}
                              </p>
                            </div>
                          </div>
                          <Button>Join Meeting</Button>
                        </Card>
                      ))}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <aside className="details-sidebar">
            <Card className="instructor-card">
              <h3>Instructor</h3>
              <div className="instructor-profile">
                <div className="avatar-placeholder">JS</div>
                <div className="instructor-details">
                  <h4>{MOCK_DATA.instructor.name}</h4>
                  <p>{MOCK_DATA.instructor.office}</p>
                </div>
              </div>
              <div className="sidebar-actions">
                <Button variant="outline" className="full-width">
                  <Mail size={16} /> Email Professor
                </Button>
                <Button variant="ghost" className="full-width">
                  <Info size={16} /> Course Syllabus
                </Button>
              </div>
            </Card>
          </aside>
        </div>
      </motion.div>
    </AppShell>
  );
};

export default CourseDetails;
