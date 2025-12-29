import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Clock, QrCode, CheckSquare, Smartphone } from 'lucide-react';
import Card from '../../components/shared/ui/Card';
import Button from '../../components/shared/ui/Button';
import Select from '../../components/shared/ui/Select';
import DatePicker from '../../components/shared/ui/DatePicker';
import Badge from '../../components/shared/ui/Badge';
import AttendanceToggle from '../../components/ui/AttendanceToggle';
import QRCodeDisplay from '../../components/ui/QRCodeDisplay';
import Modal from '../../components/shared/ui/Modal';
import Toast from '../../components/shared/ui/Toast';
import '../../../styles/pages/AttendanceMarking.css';

// Mock data
const mockFacultyCourses = [
  { 
    id: 1, 
    code: 'CS301', 
    name: 'Data Structures', 
    section: 'A', 
    enrolled: 45, 
    schedule: 'Mon, Wed, Fri 9:00-10:30 AM',
    color: '#3b82f6'
  },
  { 
    id: 2, 
    code: 'CS201', 
    name: 'Programming Fundamentals', 
    section: 'B', 
    enrolled: 38, 
    schedule: 'Tue, Thu 2:00-3:30 PM',
    color: '#8b5cf6'
  },
  { 
    id: 3, 
    code: 'CS401', 
    name: 'Advanced Algorithms', 
    section: 'A', 
    enrolled: 32, 
    schedule: 'Mon, Wed 11:00-12:30 PM',
    color: '#10b981'
  }
];

const mockStudents = [
  { 
    id: 1, 
    name: 'John Doe', 
    regNumber: 'UNI-2024-0123',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    attendance: 'present'
  },
  { 
    id: 2, 
    name: 'Jane Smith', 
    regNumber: 'UNI-2024-0124',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=JaneS',
    attendance: 'present'
  },
  { 
    id: 3, 
    name: 'Mike Chen', 
    regNumber: 'UNI-2024-0125',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
    attendance: 'absent'
  },
  { 
    id: 4, 
    name: 'Sarah Johnson', 
    regNumber: 'UNI-2024-0126',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    attendance: 'late'
  },
  { 
    id: 5, 
    name: 'David Lee', 
    regNumber: 'UNI-2024-0127',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
    attendance: 'present'
  }
];

const AttendanceMarking = () => {
  const [mode, setMode] = useState('manual'); // 'manual' or 'qr'
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [attendance, setAttendance] = useState({});
  const [showQRModal, setShowQRModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    // Initialize attendance data
    const initialAttendance = {};
    mockStudents.forEach(student => {
      initialAttendance[student.id] = student.attendance;
    });
    setAttendance(initialAttendance);
  }, []);

  useEffect(() => {
    if (mockFacultyCourses.length > 0 && !selectedCourse) {
      setSelectedCourse(mockFacultyCourses[0].id.toString());
    }
  }, [selectedCourse]);

  const handleAttendanceChange = (studentId, status) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: status
    }));
    
    // Show toast notification
    const student = mockStudents.find(s => s.id === studentId);
    setToastMessage(`Attendance marked for ${student?.name}: ${status}`);
    setShowToast(true);
  };

  const markAllPresent = () => {
    const allPresent = {};
    mockStudents.forEach(student => {
      allPresent[student.id] = 'present';
    });
    setAttendance(allPresent);
    setToastMessage('All students marked as present');
    setShowToast(true);
  };

  const generateQRCode = () => {
    const qrData = {
      courseId: selectedCourse,
      date: selectedDate.toISOString().split('T')[0],
      timestamp: Date.now()
    };
    return JSON.stringify(qrData);
  };

  const getMarkedCount = () => {
    return Object.values(attendance).filter(status => status !== 'absent').length;
  };

  const getProgressPercentage = () => {
    const marked = getMarkedCount();
    return Math.round((marked / mockStudents.length) * 100);
  };

  const course = mockFacultyCourses.find(c => c.id.toString() === selectedCourse);

  return (
    <div className="attendance-marking">
      <div className="attendance-marking__header">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Attendance Marking
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          Mark attendance for your classes
        </motion.p>
      </div>

      <motion.div
        className="attendance-marking__mode-toggle"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <button
          className={`attendance-marking__mode-btn ${mode === 'manual' ? 'active' : ''}`}
          onClick={() => setMode('manual')}
        >
          <CheckSquare size={20} />
          Manual Mode
        </button>
        <button
          className={`attendance-marking__mode-btn ${mode === 'qr' ? 'active' : ''}`}
          onClick={() => setMode('qr')}
        >
          <QrCode size={20} />
          QR Code Mode
        </button>
      </motion.div>

      <motion.div
        className="attendance-marking__controls"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <Select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          options={mockFacultyCourses.map(course => ({
            value: course.id.toString(),
            label: `${course.code} - ${course.name} (${course.section})`
          }))}
          className="attendance-marking__course-select"
        />
        <DatePicker
          selected={selectedDate}
          onChange={setSelectedDate}
          className="attendance-marking__date-picker"
        />
        {mode === 'manual' && (
          <Button
            onClick={markAllPresent}
            variant="secondary"
            icon={<Users size={16} />}
          >
            Mark All Present
          </Button>
        )}
        {mode === 'qr' && (
          <Button
            onClick={() => setShowQRModal(true)}
            variant="primary"
            icon={<QrCode size={16} />}
          >
            Generate QR Code
          </Button>
        )}
      </motion.div>

      {mode === 'manual' && (
        <motion.div
          className="attendance-marking__manual-mode"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="attendance-marking__progress">
            <div className="attendance-marking__progress-info">
              <Users size={20} />
              <span>Progress: {getMarkedCount()}/{mockStudents.length} students marked</span>
              <Badge variant="primary">{getProgressPercentage()}%</Badge>
            </div>
            <div className="attendance-marking__progress-bar">
              <div 
                className="attendance-marking__progress-fill"
                style={{ width: `${getProgressPercentage()}%` }}
              />
            </div>
          </div>

          <div className="attendance-marking__student-list">
            {mockStudents.map((student, index) => (
              <motion.div
                key={student.id}
                className="student-attendance-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.05 }}
              >
                <div className="student-attendance-item__info">
                  <img 
                    src={student.avatar} 
                    alt={student.name}
                    className="student-attendance-item__avatar"
                  />
                  <div>
                    <h4>{student.name}</h4>
                    <p>{student.regNumber}</p>
                  </div>
                </div>
                <AttendanceToggle
                  value={attendance[student.id] || 'absent'}
                  onChange={(status) => handleAttendanceChange(student.id, status)}
                />
              </motion.div>
            ))}
          </div>

          <div className="attendance-marking__actions">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={() => {
                setToastMessage('Attendance saved successfully!');
                setShowToast(true);
              }}
            >
              Save Attendance
            </Button>
          </div>
        </motion.div>
      )}

      {mode === 'qr' && (
        <motion.div
          className="attendance-marking__qr-mode"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="qr-mode__card">
            <div className="qr-mode__header">
              <QrCode size={32} />
              <div>
                <h3>QR Code Attendance</h3>
                <p>{course?.name} ({course?.section})</p>
              </div>
            </div>
            
            <div className="qr-mode__display">
              <div className="qr-mode__phone-mockup">
                <div className="qr-mode__phone-screen">
                  <Smartphone size={64} />
                  <p>Scan QR Code with your phone</p>
                </div>
              </div>
              
              <div className="qr-mode__stats">
                <div className="qr-mode__stat">
                  <Users size={24} />
                  <div>
                    <span className="qr-mode__stat-value">{getMarkedCount()}/{mockStudents.length}</span>
                    <span className="qr-mode__stat-label">Students Marked</span>
                  </div>
                </div>
                
                <div className="qr-mode__progress-bar">
                  <div 
                    className="qr-mode__progress-fill"
                    style={{ width: `${getProgressPercentage()}%` }}
                  />
                </div>
                
                <div className="qr-mode__live-feed">
                  <h4>Recent Check-ins</h4>
                  <div className="qr-mode__feed-item">
                    <span>Jane Smith</span>
                    <Badge variant="success">Just now</Badge>
                  </div>
                  <div className="qr-mode__feed-item">
                    <span>John Doe</span>
                    <Badge variant="secondary">5s ago</Badge>
                  </div>
                  <div className="qr-mode__feed-item">
                    <span>Mike Chen</span>
                    <Badge variant="secondary">12s ago</Badge>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="qr-mode__actions">
              <Button
                variant="secondary"
                onClick={() => setShowQRModal(true)}
              >
                Regenerate QR
              </Button>
              <Button
                variant="error"
                onClick={() => setMode('manual')}
              >
                Close Session
              </Button>
            </div>
          </Card>
        </motion.div>
      )}

      <AnimatePresence>
        {showQRModal && (
          <Modal
            isOpen={showQRModal}
            onClose={() => setShowQRModal(false)}
            title="QR Code for Attendance"
            size="lg"
          >
            <QRCodeDisplay
              qrData={generateQRCode()}
              expiresIn={300} // 5 minutes
              onRegenerate={() => {
                setToastMessage('QR Code regenerated');
                setShowToast(true);
              }}
            />
          </Modal>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showToast && (
          <Toast
            message={toastMessage}
            type="success"
            onClose={() => setShowToast(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AttendanceMarking;