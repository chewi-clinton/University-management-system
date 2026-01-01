import { motion } from 'framer-motion';

export default function MaterialsManagement() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="materials-management"
    >
      <div className="materials-management__header">
        <div>
          <h1>Materials Management</h1>
          <p>Manage study materials and educational resources</p>
        </div>
      </div>

      <div className="materials-management__content">
        <p>Materials management functionality will be implemented here.</p>
      </div>
    </motion.div>
  );
}