import { motion } from 'framer-motion';
import { Calendar, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

export default function AttendanceManagement() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="attendance-management"
    >
      <div className="attendance-management__header">
        <div>
          <h1>Attendance Management</h1>
          <p>Monitor and manage student attendance records</p>
        </div>
      </div>

      <div className="attendance-management__stats">
        <div className="stat-card">
          <div className="stat-card__icon">
            <CheckCircle size={24} />
          </div>
          <div className="stat-card__content">
            <h3>Present Today</h3>
            <p>1,089</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card__icon">
            <Clock size={24} />
          </div>
          <div className="stat-card__content">
            <h3>Late Today</h3>
            <p>23</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card__icon">
            <AlertTriangle size={24} />
          </div>
          <div className="stat-card__content">
            <h3>Absent Today</h3>
            <p>135</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card__icon">
            <Calendar size={24} />
          </div>
          <div className="stat-card__content">
            <h3>Attendance Rate</h3>
            <p>87.5%</p>
          </div>
        </div>
      </div>

      <div className="attendance-management__content">
        <div className="attendance-management__table">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Course</th>
                <th>Date</th>
                <th>Status</th>
                <th>Marked By</th>
                <th>Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {[...Array(10)].map((_, i) => (
                <tr key={i}>
                  <td>Student {i + 1}</td>
                  <td>CS301 - Data Structures</td>
                  <td>2025-01-01</td>
                  <td>
                    <span className="status-badge status-badge--present">Present</span>
                  </td>
                  <td>Dr. Smith</td>
                  <td>09:15 AM</td>
                  <td>
                    <button className="btn btn--sm btn--secondary">Edit</button>
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