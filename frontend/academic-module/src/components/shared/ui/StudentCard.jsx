import React from 'react';
import { motion } from 'framer-motion';
import { Mail, User, TrendingUp } from 'lucide-react';
import Avatar from '../shared/ui/Avatar';
import Badge from '../shared/ui/Badge';
import Button from '../shared/ui/Button';
import '../../../styles/components/StudentCard.css';

const StudentCard = ({ student, onEmail, onViewProfile, onViewPerformance }) => {
  const getGradeColor = (grade) => {
    if (grade === 'A' || grade === 'A+') return 'success';
    if (grade === 'B' || grade === 'B+') return 'info';
    if (grade === 'C' || grade === 'C+') return 'warning';
    return 'error';
  };

  return (
    <motion.div
      className="student-card"
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="student-card__header">
        <Avatar
          src={student.avatar}
          name={student.name}
          size="lg"
          className="student-card__avatar"
        />
        <div className="student-card__info">
          <h3 className="student-card__name">{student.name}</h3>
          <p className="student-card__reg">{student.regNumber}</p>
        </div>
      </div>

      <div className="student-card__stats">
        <div className="student-card__stat-item">
          <span className="label">GPA:</span>
          <span className="value">{student.gpa}</span>
        </div>
        <div className="student-card__stat-item">
          <span className="label">Attendance:</span>
          <span className="value">{student.attendance}%</span>
        </div>
        <div className="student-card__stat-item">
          <span className="label">Grade:</span>
          <Badge variant={getGradeColor(student.currentGrade)}>
            {student.currentGrade}
          </Badge>
        </div>
      </div>

      <div className="student-card__actions">
        <Button
          onClick={() => onEmail?.(student)}
          variant="secondary"
          size="sm"
          icon={<Mail size={16} />}
          fullWidth
        >
          Email
        </Button>
        <Button
          onClick={() => onViewProfile?.(student)}
          variant="secondary"
          size="sm"
          icon={<User size={16} />}
          fullWidth
        >
          Profile
        </Button>
        <Button
          onClick={() => onViewPerformance?.(student)}
          variant="secondary"
          size="sm"
          icon={<TrendingUp size={16} />}
          fullWidth
        >
          Performance
        </Button>
      </div>
    </motion.div>
  );
};

export default StudentCard;