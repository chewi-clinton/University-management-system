import { motion } from 'framer-motion';
import { ClipboardList, CheckCircle, Clock, XCircle } from 'lucide-react';

export default function EnrollmentManagement() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="enrollment-management"
    >
      <div className="enrollment-management__header">
        <div>
          <h1>Enrollment Management</h1>
          <p>Manage student enrollments and course registrations</p>
        </div>
      </div>

      <div className="enrollment-management__stats">
        <div className="stat-card">
          <div className="stat-card__icon">
            <ClipboardList size={24} />
          </div>
          <div className="stat-card__content">
            <h3>Total Enrollments</h3>
            <p>3,421</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card__icon">
            <CheckCircle size={24} />
          </div>
          <div className="stat-card__content">
            <h3>Confirmed</h3>
            <p>3,156</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card__icon">
            <Clock size={24} />
          </div>
          <div className="stat-card__content">
            <h3>Pending</h3>
            <p>265</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card__icon">
            <XCircle size={24} />
          </div>
          <div className="stat-card__content">
            <h3>Rejected</h3>
            <p>0</p>
          </div>
        </div>
      </div>

      <div className="enrollment-management__content">
        <div className="enrollment-management__table">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Enrollment #</th>
                <th>Student</th>
                <th>Semester</th>
                <th>Credits</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {[...Array(10)].map((_, i) => (
                <tr key={i}>
                  <td>ENR-2024-F-{String(i + 1).padStart(4, '0')}</td>
                  <td>Student Name {i + 1}</td>
                  <td>Fall 2024</td>
                  <td>18</td>
                  <td>
                    <span className="status-badge status-badge--confirmed">Confirmed</span>
                  </td>
                  <td>2024-08-15</td>
                  <td>
                    <button className="btn btn--sm btn--secondary">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}