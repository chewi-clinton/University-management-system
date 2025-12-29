import React from "react";
import { motion } from "framer-motion";
import Card from "../../components/shared/layout/Card";
import "../../styles/pages/StudentDirectory.css";

const StudentDirectory = () => {
  return (
    <div className="student-directory">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1>Student Directory</h1>
        <p>View and manage student information</p>
      </motion.div>
      <Card>
        <h2>Student Information</h2>
        <p>Student directory functionality will be implemented here.</p>
      </Card>
    </div>
  );
};

export default StudentDirectory;
