import { motion } from 'framer-motion';
import { Users, Shield, UserCheck, UserX } from 'lucide-react';
import QuickStats from '../components/shared/admin/QuickStats';
import { mockAdmins } from '../mock-data/adminMockData';

export default function UserManagement() {
  const adminStats = [
    {
      title: 'Total Admins',
      value: mockAdmins.length.toString(),
      icon: <Users size={24} />,
      color: 'blue'
    },
    {
      title: 'Super Admins',
      value: mockAdmins.filter(a => a.role === 'super_admin').length.toString(),
      icon: <Shield size={24} />,
      color: 'red'
    },
    {
      title: 'Active Admins',
      value: mockAdmins.filter(a => a.isActive).length.toString(),
      icon: <UserCheck size={24} />,
      color: 'green'
    },
    {
      title: 'Inactive Admins',
      value: mockAdmins.filter(a => !a.isActive).length.toString(),
      icon: <UserX size={24} />,
      color: 'gray'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="user-management"
    >
      <div className="user-management__header">
        <div>
          <h1>User Management</h1>
          <p>Manage admin users and their permissions</p>
        </div>
      </div>

      <QuickStats stats={adminStats} />

      <div className="user-management__content">
        <div className="user-management__table">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Department</th>
                <th>Status</th>
                <th>Last Login</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockAdmins.map((admin) => (
                <tr key={admin.id}>
                  <td>
                    <div className="user-cell">
                      <img src={admin.avatar} alt={admin.firstName} className="user-cell__avatar" />
                      <div>
                        <div className="user-cell__name">{admin.firstName} {admin.lastName}</div>
                      </div>
                    </div>
                  </td>
                  <td>{admin.email}</td>
                  <td>
                    <span className={`role-badge role-badge--${admin.role}`}>
                      {admin.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td>{admin.department || 'All Departments'}</td>
                  <td>
                    <span className={`status-badge status-badge--${admin.isActive ? 'active' : 'inactive'}`}>
                      {admin.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>{new Date(admin.lastLogin).toLocaleString()}</td>
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