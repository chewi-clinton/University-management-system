import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { motion, useAnimation } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({ 
  title, 
  value, 
  icon: Icon,
  color = 'primary',
  trend,
  decimal = 0,
  suffix = '',
  prefix = '',
  className = '',
  animated = true,
  ...props 
}) => {
  const controls = useAnimation();
  const ref = useRef(null);
  const [displayValue, setDisplayValue] = React.useState(0);

  useEffect(() => {
    const animateValue = async () => {
      if (!animated) {
        setDisplayValue(value);
        return;
      }

      const startValue = 0;
      const endValue = value;
      const duration = 1000; // 1 second
      const startTime = Date.now();

      const animate = () => {
        const now = Date.now();
        const progress = Math.min((now - startTime) / duration, 1);
        
        // Easing function (ease-out)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentValue = startValue + (endValue - startValue) * easeOut;
        
        setDisplayValue(currentValue);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    };

    animateValue();
  }, [value, animated]);

  const statCardClasses = [
    'stat-card',
    `stat-card--${color}`,
    className
  ].filter(Boolean).join(' ');

  const colorMap = {
    primary: 'var(--primary-500)',
    secondary: 'var(--neutral-600)',
    success: 'var(--success-500)',
    warning: 'var(--warning-500)',
    error: 'var(--error-500)',
    info: 'var(--info-500)'
  };

  const formatValue = (val) => {
    const formatted = decimal > 0 
      ? val.toFixed(decimal) 
      : Math.round(val).toString();
    return `${prefix}${formatted}${suffix}`;
  };

  return (
    <motion.div
      className={statCardClasses}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      ref={ref}
      {...props}
    >
      <div className="stat-card__header">
        <div className="stat-card__icon" style={{ color: colorMap[color] }}>
          <Icon size={24} />
        </div>
        {trend && (
          <div className={`stat-card__trend stat-card__trend--${trend.direction}`}>
            {trend.direction === 'up' ? (
              <TrendingUp size={16} />
            ) : (
              <TrendingDown size={16} />
            )}
            <span>{trend.value > 0 ? '+' : ''}{trend.value}{suffix}</span>
          </div>
        )}
      </div>

      <div className="stat-card__content">
        <h3 className="stat-card__title">{title}</h3>
        <div className="stat-card__value">
          {formatValue(displayValue)}
        </div>
      </div>

      <div className="stat-card__indicator">
        <div 
          className="indicator__bar"
          style={{ backgroundColor: colorMap[color] }}
        />
      </div>
    </motion.div>
  );
};

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  icon: PropTypes.elementType.isRequired,
  color: PropTypes.oneOf(['primary', 'secondary', 'success', 'warning', 'error', 'info']),
  trend: PropTypes.shape({
    value: PropTypes.number,
    direction: PropTypes.oneOf(['up', 'down'])
  }),
  decimal: PropTypes.number,
  suffix: PropTypes.string,
  prefix: PropTypes.string,
  className: PropTypes.string,
  animated: PropTypes.bool
};

export default StatCard;