import { motion } from 'framer-motion';

export default function ProgramManagement() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="program-management"
    >
      <div className="program-management__header">
        <div>
          <h1>Program Management</h1>
          <p>Manage academic programs and degree offerings</p>
        </div>
      </div>

      <div className="program-management__content">
        <p>Program management functionality will be implemented here.</p>
      </div>
    </motion.div>
  );
}