import { motion } from "framer-motion";

export default function AdminExamManagement() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="exam-management"
    >
      <div className="exam-management__header">
        <div>
          <h1>Exam Management</h1>
          <p>Manage examinations, schedules, and results</p>
        </div>
      </div>

      <div className="exam-management__content">
        <p>Exam management functionality will be implemented here.</p>
      </div>
    </motion.div>
  );
}
