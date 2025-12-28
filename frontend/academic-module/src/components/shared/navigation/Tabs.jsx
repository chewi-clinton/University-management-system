import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

const Tabs = ({ 
  tabs, 
  activeTab, 
  onTabChange, 
  variant = 'default',
  className = '' 
}) => {
  const activeIndex = tabs.findIndex(tab => tab.id === activeTab);

  const tabsClasses = [
    'tabs',
    `tabs--${variant}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={tabsClasses}>
      <div className="tabs__list">
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            className={`tabs__tab ${activeTab === tab.id ? 'tabs__tab--active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.icon && (
              <span className="tabs__icon">
                <tab.icon size={16} />
              </span>
            )}
            <span className="tabs__label">{tab.label}</span>
          </button>
        ))}
        
        {variant === 'underline' && activeIndex !== -1 && (
          <motion.div
            className="tabs__indicator"
            layoutId="tab-indicator"
            initial={false}
            animate={{
              x: `${activeIndex * 100}%`,
              width: `${100 / tabs.length}%`
            }}
            transition={{
              type: 'spring',
              stiffness: 500,
              damping: 30
            }}
          />
        )}
      </div>
    </div>
  );
};

Tabs.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      icon: PropTypes.elementType
    })
  ).isRequired,
  activeTab: PropTypes.string.isRequired,
  onTabChange: PropTypes.func.isRequired,
  variant: PropTypes.oneOf(['default', 'pill', 'underline']),
  className: PropTypes.string
};

export default Tabs;