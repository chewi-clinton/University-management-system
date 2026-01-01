import { motion } from 'framer-motion';

export default function NoticeManagement() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="notice-management"
    >
      <div className="notice-management__header">
        <div>
          <h1>Notice Management</h1>
          <p>Manage notices and announcements</p>
        </div>
      </div>

      <div className="notice-management__content">
        <p>Notice management functionality will be implemented here.</p>
      </div>
    </motion.div>
  );
}