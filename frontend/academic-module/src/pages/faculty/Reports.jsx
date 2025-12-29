import React from 'react';
import { motion } from 'framer-motion';
import Card from '../../components/shared/ui/Card';
import '../../../styles/pages/Reports.css';

const Reports = () => {
  return (
    <div className="reports">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1>Reports</h1>
        <p>Generate and view academic reports</p>
      </motion.div>
      <Card>
        <h2>Reporting System</h2>
        <p>Reports functionality will be implemented here.</p>
      </Card>
    </div>
  );
};

export default Reports;