import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import "./Feedback.css";

export const Modal = ({ isOpen, onClose, title, children }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="modal-overlay">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="modal-content"
        >
          <div className="modal-header">
            <h3>{title}</h3>
            <button onClick={onClose}>
              <X size={20} />
            </button>
          </div>
          <div className="modal-body">{children}</div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

export const Skeleton = ({ width, height, variant = "rect" }) => (
  <div
    className={`skeleton animate-shimmer ${variant}`}
    style={{ width, height }}
  />
);
