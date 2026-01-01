import { motion } from "framer-motion";
import { BookOpen, Users, Clock, Award } from "lucide-react";

export default function AdminCourseManagement() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="course-management"
    >
      <div className="course-management__header">
        <div>
          <h1>Course Management</h1>
          <p>Manage courses, curriculum, and academic programs</p>
        </div>
      </div>

      <div className="course-management__stats">
        <div className="stat-card">
          <div className="stat-card__icon">
            <BookOpen size={24} />
          </div>
          <div className="stat-card__content">
            <h3>Total Courses</h3>
            <p>156</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card__icon">
            <Users size={24} />
          </div>
          <div className="stat-card__content">
            <h3>Active Courses</h3>
            <p>142</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card__icon">
            <Clock size={24} />
          </div>
          <div className="stat-card__content">
            <h3>Total Credits</h3>
            <p>3,124</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card__icon">
            <Award size={24} />
          </div>
          <div className="stat-card__content">
            <h3>Avg. Rating</h3>
            <p>4.2/5.0</p>
          </div>
        </div>
      </div>

      <div className="course-management__content">
        <div className="course-management__table">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Course Code</th>
                <th>Course Name</th>
                <th>Department</th>
                <th>Credits</th>
                <th>Instructor</th>
                <th>Enrolled</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {[...Array(10)].map((_, i) => (
                <tr key={i}>
                  <td>CS30{i + 1}</td>
                  <td>Course Name {i + 1}</td>
                  <td>Computer Science</td>
                  <td>3</td>
                  <td>Dr. Smith</td>
                  <td>45</td>
                  <td>
                    <span className="status-badge status-badge--active">
                      Active
                    </span>
                  </td>
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
