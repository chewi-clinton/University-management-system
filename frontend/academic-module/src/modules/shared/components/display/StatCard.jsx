import React from 'react';
import { motion } from 'framer-motion';
import './Display.css';

export const StatCard = ({ label, value, icon: Icon, trend, color = 'var(--primary-500)' }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="stat-card"
  >
    <div className="stat-icon" style={{ backgroundColor: `${color}15`, color }}>
      <Icon size={24} />
    </div>
    <div className="stat-content">
      <span className="stat-label">{label}</span>
      <h3 className="stat-value">{value}</h3>
      {trend && <span className={`stat-trend ${trend > 0 ? 'up' : 'down'}`}>
        {trend > 0 ? '+' : ''}{trend}%
      </span>}
    </div>
  </motion.div>
);

export const CircularProgress = ({ value, size = 60, strokeWidth = 6, color = 'var(--primary-500)' }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="circular-progress" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle className="bg" stroke="var(--gray-100)" strokeWidth={strokeWidth} fill="transparent" r={radius} cx={size/2} cy={size/2} />
        <motion.circle 
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
          stroke={color} strokeWidth={strokeWidth} strokeDasharray={circumference} fill="transparent" r={radius} cx={size/2} cy={size/2} strokeLinecap="round"
        />
      </svg>
      <span className="progress-text">{value}%</span>
    </div>
  );
};