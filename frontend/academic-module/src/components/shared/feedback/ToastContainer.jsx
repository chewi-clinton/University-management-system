import React, { useState, useCallback, useContext, createContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Toast from "./Toast.jsx";

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastContainer");
  }
  return context;
};

const ToastContainer = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, options = {}) => {
    const id = Date.now() + Math.random();
    const newToast = {
      id,
      message,
      type: options.type || "info",
      duration: options.duration !== undefined ? options.duration : 5000,
      position: options.position || "top-right",
    };

    setToasts((prev) => [...prev, newToast]);
    return id;
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const toastAPI = {
    show: showToast,
    success: (message, options) =>
      showToast(message, { ...options, type: "success" }),
    error: (message, options) =>
      showToast(message, { ...options, type: "error" }),
    warning: (message, options) =>
      showToast(message, { ...options, type: "warning" }),
    info: (message, options) =>
      showToast(message, { ...options, type: "info" }),
    dismiss: dismissToast,
  };

  const toastsByPosition = toasts.reduce((acc, toast) => {
    if (!acc[toast.position]) {
      acc[toast.position] = [];
    }
    acc[toast.position].push(toast);
    return acc;
  }, {});

  return (
    <ToastContext.Provider value={toastAPI}>
      {children}
      {Object.entries(toastsByPosition).map(([position, positionToasts]) => (
        <div
          key={position}
          className={`toast-container toast-container--${position}`}
        >
          <AnimatePresence>
            {positionToasts.map((toast) => (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: 50, scale: 0.3 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
              >
                <Toast {...toast} onDismiss={dismissToast} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ))}
    </ToastContext.Provider>
  );
};

export default ToastContainer;
