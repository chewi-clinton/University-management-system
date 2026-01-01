import { motion } from 'framer-motion';

export default function AdmissionManagement() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="admission-management"
    >
      <div className="admission-management__header">
        <div>
          <h1>Admission Management</h1>
          <p>Manage admission inquiries and applications</p>
        </div>
      </div>

      <div className="admission-management__content">
        <p>Admission management functionality will be implemented here.</p>
      </div>
    </motion.div>
  );
}