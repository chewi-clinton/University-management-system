import React from 'react';
import PropTypes from 'prop-types';

const Spinner = ({ 
  size = 'md', 
  color = 'primary',
  center = false,
  className = '',
  ...props 
}) => {
  const spinnerClasses = [
    'spinner',
    `spinner--${size}`,
    `spinner--${color}`,
    center && 'spinner--center',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={spinnerClasses} {...props}>
      <div className="spinner__circle" />
    </div>
  );
};

Spinner.propTypes = {
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  color: PropTypes.oneOf(['primary', 'secondary', 'neutral', 'white']),
  center: PropTypes.bool,
  className: PropTypes.string
};

export default Spinner;