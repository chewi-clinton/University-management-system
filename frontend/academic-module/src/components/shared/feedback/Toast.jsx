import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  AlertCircle, 
  XCircle, 
  Info,
  X 
} from 'lucide-react';

const Toast = ({ 
  id,
  message, 
  type = 'info', 
  duration = 5000,
  onDismiss,
  position = 'top-right',
  ...props 
}) => {
  const icons = {
    success: <CheckCircle size={20} />,
    error: <XCircle size={20} />,
    warning: <AlertCircle size={20} />,
    info: <Info size={20} />
  };

  const colors = {
    success: 'var(--success-500)',
    error: 'var(--error-500)',
    warning: 'var(--warning-500)',
    info: 'var(--info-500)'
  };

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onDismiss(id);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [id, duration, onDismiss]);

  const toastVariants = {
    initial: {
      opacity: 0,
      x: position.includes('right') ? 100 : position.includes('left') ? -100 : 0,
      y: position.includes('top') ? -100 : position.includes('bottom') ? 100 : 0
    },
    animate: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 500,
        damping: 25
      }
    },
    exit: {
      opacity: 0,
      x: position.includes('right') ? 100 : position.includes('left') ? -100 : 0,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <motion.div
      className={`toast toast--${type}`}
      variants={toastVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{ borderLeftColor: colors[type] }}
      {...props}
    >
      <div className="toast__icon" style={{ color: colors[type] }}>
        {icons[type]}
      </div>
      
      <div className="toast__content">
        <p className="toast__message">{message}</p>
      </div>
      
      <button
        className="toast__close"
        onClick={() => onDismiss(id)}
        aria-label="Close toast"
      >
        <X size={16} />
      </button>
      
      {duration > 0 && (
        <motion.div
          className="toast__progress"
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{
            duration: duration / 1000,
            ease: 'linear'
          }}
          style={{ backgroundColor: colors[type] }}
        />
      )}
    </motion.div>
  );
};

Toast.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['success', 'error', 'warning', 'info']),
  duration: PropTypes.number,
  onDismiss: PropTypes.func.isRequired,
  position: PropTypes.oneOf([
    'top-left', 'top-center', 'top-right',
    'bottom-left', 'bottom-center', 'bottom-right'
  ])
};

export default Toast;