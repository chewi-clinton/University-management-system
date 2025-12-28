import React from 'react';
import PropTypes from 'prop-types';

const Badge = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  dot = false,
  className = '',
  ...props 
}) => {
  const badgeClasses = [
    'badge',
    `badge--${variant}`,
    `badge--${size}`,
    dot && 'badge--dot',
    className
  ].filter(Boolean).join(' ');

  if (dot) {
    return (
      <span className={badgeClasses} {...props}>
        <span className="badge__dot" />
        {children && <span className="badge__content">{children}</span>}
      </span>
    );
  }

  return (
    <span className={badgeClasses} {...props}>
      {children}
    </span>
  );
};

Badge.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.oneOf(['primary', 'secondary', 'success', 'warning', 'error', 'info', 'neutral']),
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg']),
  dot: PropTypes.bool,
  className: PropTypes.string
};

export default Badge;