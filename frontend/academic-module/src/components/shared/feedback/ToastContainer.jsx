import React, { useState, useCallback, useContext, createContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Toast from './Toast.jsx';

// Create Toast Context
const ToastContext = createContext();

// Custom hook to use toast
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, options = {}) => {
    const id = Date.now() + Math.random();
    const newToast = {
      id,
      message,
      type: options.type || 'info',
      duration: options.duration !== undefined ? options.duration : 5000,
      position: options.position || 'top-right'
    };

    setToasts(prev => [...prev, newToast]);
    return id;
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const toastAPI = {
    show: showToast,
    success: (message, options) => showToast(message, { ...options, type: 'success' }),
    error: (message, options) => showToast(message, { ...options, type: 'error' }),
    warning: (message, options) => showToast(message, { ...options, type: 'warning' }),
    info: (message, options) => showToast(message, { ...options, type: 'info' }),
    dismiss: dismissToast
  };

  // Group toasts by position
  const toastsByPosition = toasts.reduce((acc, toast) => {
    if (!acc[toast.position]) {
      acc[toast.position] = [];
    }
    acc[toast.position].push(toast);
    return acc;
  }, {});

  const containerVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  };

  return (
    <ToastContext.Provider value={toastAPI}>
      {Object.entries(toastsByPosition).map(([position, positionToasts]) => (
        <AnimatePresence key={position}>
          <motion.div
            className={`toast-container toast-container--${position}`}
            variants={containerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {positionToasts.map(toast => (
              <Toast
                key={toast.id}
                {...toast}
                onDismiss={dismissToast}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      ))}
    </ToastContext.Provider>
  );
};

export default ToastContainer;