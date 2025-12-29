import React from "react";
import { motion } from "framer-motion";
import Card from "../../components/shared/layout/Card";
import "../../styles/pages/Grading.css";

const Grading = () => {
  return (
    <div className="grading">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1>Grading</h1>
        <p>Enter and manage student grades</p>
      </motion.div>
      <Card>
        <h2>Grade Management System</h2>
        <p>Grading functionality will be implemented here.</p>
      </Card>
    </div>
  );
};

export default Grading;
