import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

const ProgressBar = ({ 
  value = 0, 
  max = 100,
  color = 'primary',
  size = 'md',
  showLabel = true,
  labelPosition = 'right',
  animated = true,
  className = '',
  ...props 
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  
  const progressBarClasses = [
    'progress-bar',
    `progress-bar--${size}`,
    `progress-bar--color-${color}`,
    className
  ].filter(Boolean).join(' ');

  const progressVariants = {
    initial: { width: 0 },
    animate: { 
      width: `${percentage}%`,
      transition: {
        duration: animated ? 0.8 : 0,
        ease: 'easeOut'
      }
    }
  };

  const labelContent = (
    <span className="progress-bar__label">
      {Math.round(percentage)}%
    </span>
  );

  return (
    <div className={progressBarClasses} {...props}>
      {labelPosition === 'top' && showLabel && labelContent}
      
      <div className="progress-bar__track">
        <motion.div
          className="progress-bar__fill"
          variants={progressVariants}
          initial="initial"
          animate="animate"
        />
      </div>
      
      {labelPosition === 'right' && showLabel && (
        <div className="progress-bar__label-wrapper">
          {labelContent}
        </div>
      )}
      
      {labelPosition === 'bottom' && showLabel && (
        <div className="progress-bar__label-wrapper">
          {labelContent}
        </div>
      )}
    </div>
  );
};

ProgressBar.propTypes = {
  value: PropTypes.number,
  max: PropTypes.number,
  color: PropTypes.oneOf(['primary', 'secondary', 'success', 'warning', 'error', 'info']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  showLabel: PropTypes.bool,
  labelPosition: PropTypes.oneOf(['top', 'right', 'bottom', 'none']),
  animated: PropTypes.bool,
  className: PropTypes.string
};

export default ProgressBar;