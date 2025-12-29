import React from "react";
import { motion } from "framer-motion";
import Card from "../../components/shared/layout/Card";
import "../../styles/pages/ExamManagement.css";

const ExamManagement = () => {
  return (
    <div className="exam-management">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1>Exam Management</h1>
        <p>Create and manage examinations</p>
      </motion.div>
      <Card>
        <h2>Examination System</h2>
        <p>Exam management functionality will be implemented here.</p>
      </Card>
    </div>
  );
};

export default ExamManagement;
