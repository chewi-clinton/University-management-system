import React from 'react';
import PropTypes from 'prop-types';

const Container = ({ 
  children, 
  size = 'default', 
  className = '', 
  ...props 
}) => {
  const containerClasses = [
    'container',
    `container--${size}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses} {...props}>
      {children}
    </div>
  );
};

Container.propTypes = {
  children: PropTypes.node.isRequired,
  size: PropTypes.oneOf(['narrow', 'default', 'wide']),
  className: PropTypes.string
};

export default Container;