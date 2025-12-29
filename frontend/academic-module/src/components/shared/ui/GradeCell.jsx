import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import '../../../styles/components/GradeCell.css';

const GradeCell = ({ value, maxValue, onChange, editable = true }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const percentage = maxValue && value !== undefined && value !== null 
    ? (value / maxValue) * 100 
    : 0;

  const getGradeClass = () => {
    if (percentage >= 90) return 'grade-cell--excellent';
    if (percentage >= 70) return 'grade-cell--good';
    if (percentage >= 50) return 'grade-cell--average';
    return 'grade-cell--poor';
  };

  const handleClick = () => {
    if (editable) {
      setIsEditing(true);
      setEditValue(value?.toString() || '');
    }
  };

  const handleSave = () => {
    const newValue = parseFloat(editValue);
    if (!isNaN(newValue) && onChange) {
      onChange(newValue);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
    }
  };

  const renderDisplay = () => {
    if (value === undefined || value === null) {
      return <span className="grade-cell__empty">-</span>;
    }

    if (maxValue) {
      return (
        <span className="grade-cell__display">
          <span className="grade-cell__score">{value}</span>
          <span className="grade-cell__max">/{maxValue}</span>
          <span className="grade-cell__percent">({Math.round(percentage)}%)</span>
        </span>
      );
    }

    return <span className="grade-cell__display">{value}</span>;
  };

  return (
    <div
      className={`grade-cell ${getGradeClass()} ${editable ? 'grade-cell--editable' : ''}`}
      onClick={handleClick}
    >
      {isEditing ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grade-cell__input-wrapper"
        >
          <input
            ref={inputRef}
            type="number"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className="grade-cell__input"
            min="0"
            max={maxValue || undefined}
            step="0.1"
          />
          {maxValue && (
            <span className="grade-cell__input-max">/{maxValue}</span>
          )}
        </motion.div>
      ) : (
        renderDisplay()
      )}
    </div>
  );
};

export default GradeCell;