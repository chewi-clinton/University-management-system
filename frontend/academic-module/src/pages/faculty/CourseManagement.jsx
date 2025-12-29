import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import Card from "../../components/shared/layout/Card";
import Tabs from "../../components/shared/navigation/Tabs";
import "../../styles/pages/CourseManagement.css";

const CourseManagement = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("students");

  const tabs = [
    { id: "students", label: "Students" },
    { id: "attendance", label: "Attendance" },
    { id: "grades", label: "Grades" },
    { id: "materials", label: "Materials" },
    { id: "virtual-classes", label: "Virtual Classes" },
    { id: "syllabus", label: "Syllabus" },
  ];

  return (
    <div className="course-management">
      <motion.div
        className="course-management__hero"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1>CS301 - Data Structures (Section A)</h1>
        <p>Mon, Wed, Fri 9:00-10:30 | Room: A-101</p>
        <p>45 students enrolled</p>
      </motion.div>

      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        className="course-management__tabs"
      />

      <Card className="course-management__content">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === "students" && (
            <div className="students-tab">
              <h2>Students Management</h2>
              <p>Course content for {id}</p>
            </div>
          )}
          {activeTab === "attendance" && (
            <div className="attendance-tab">
              <h2>Attendance Records</h2>
              <p>Course attendance for {id}</p>
            </div>
          )}
          {activeTab === "grades" && (
            <div className="grades-tab">
              <h2>Grade Management</h2>
              <p>Student grades for {id}</p>
            </div>
          )}
          {activeTab === "materials" && (
            <div className="materials-tab">
              <h2>Course Materials</h2>
              <p>Study materials for {id}</p>
            </div>
          )}
          {activeTab === "virtual-classes" && (
            <div className="virtual-tab">
              <h2>Virtual Classes</h2>
              <p>Online sessions for {id}</p>
            </div>
          )}
          {activeTab === "syllabus" && (
            <div className="syllabus-tab">
              <h2>Course Syllabus</h2>
              <p>Syllabus content for {id}</p>
            </div>
          )}
        </motion.div>
      </Card>
    </div>
  );
};

export default CourseManagement;
