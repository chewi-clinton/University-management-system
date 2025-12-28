import React from 'react';
import { NavLink as RouterNavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

const NavLink = ({ 
  children, 
  to, 
  icon,
  variant = 'default',
  active = false,
  className = '',
  ...props 
}) => {
  const navLinkClasses = [
    'nav-link',
    `nav-link--${variant}`,
    className
  ].filter(Boolean).join(' ');

  const renderContent = ({ isActive }) => (
    <>
      {icon && (
        <motion.span 
          className="nav-link__icon"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {icon}
        </motion.span>
      )}
      
      <span className="nav-link__text">{children}</span>
      
      {(isActive || active) && (
        <motion.div
          className="nav-link__indicator"
          layoutId="nav-indicator"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        />
      )}
    </>
  );

  if (to) {
    return (
      <RouterNavLink
        to={to}
        className={({ isActive }) => 
          `${navLinkClasses} ${isActive ? 'nav-link--active' : ''}`
        }
        {...props}
      >
        {renderContent}
      </RouterNavLink>
    );
  }

  return (
    <button className={`${navLinkClasses} ${active ? 'nav-link--active' : ''}`} {...props}>
      {renderContent({ isActive: active })}
    </button>
  );
};

NavLink.propTypes = {
  children: PropTypes.node.isRequired,
  to: PropTypes.string,
  icon: PropTypes.node,
  variant: PropTypes.oneOf(['default', 'pill', 'underline']),
  active: PropTypes.bool,
  className: PropTypes.string
};

export default NavLink;