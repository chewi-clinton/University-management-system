import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, Loader } from "lucide-react";
import "../../../styles/admin-pages/AdminModal.css";
export default function AdminModal({
  isOpen,
  onClose,
  title,
  children,
  onSave,
  loading = false,
  size = "md", // sm, md, lg, xl
  showFooter = true,
}) {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    if (!loading) {
      setIsClosing(true);
      setTimeout(() => {
        onClose();
        setIsClosing(false);
      }, 200);
    }
  };

  const handleSave = () => {
    if (onSave && !loading) {
      onSave();
    }
  };

  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "admin-modal--sm",
    md: "admin-modal--md",
    lg: "admin-modal--lg",
    xl: "admin-modal--xl",
  };

  return (
    <AnimatePresence>
      <div className="admin-modal__overlay" onClick={handleClose}>
        <motion.div
          className={`admin-modal ${sizeClasses[size]}`}
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          animate={{
            opacity: isClosing ? 0 : 1,
            scale: isClosing ? 0.9 : 1,
            y: isClosing ? 50 : 0,
          }}
          exit={{ opacity: 0, scale: 0.9, y: 50 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="admin-modal__header">
            <h3 className="admin-modal__title">{title}</h3>
            <button
              className="admin-modal__close-btn"
              onClick={handleClose}
              disabled={loading}
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="admin-modal__body">{children}</div>

          {/* Footer */}
          {showFooter && (
            <div className="admin-modal__footer">
              <div className="admin-modal__footer-actions">
                <button
                  className="admin-modal__btn admin-modal__btn--secondary"
                  onClick={handleClose}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  className="admin-modal__btn admin-modal__btn--primary"
                  onClick={handleSave}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader size={16} className="admin-modal__btn-spinner" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      Save
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
