import React from "react";
import { Check, X, Clock, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import "../../../styles/components/AttendanceToggle.css";

const AttendanceToggle = ({ value, onChange, disabled = false }) => {
  const options = [
    { value: "present", label: "Present", icon: Check, color: "green" },
    { value: "absent", label: "Absent", icon: X, color: "red" },
    { value: "late", label: "Late", icon: Clock, color: "yellow" },
    { value: "excused", label: "Excused", icon: CheckCircle, color: "blue" },
  ];

  const handleToggle = (newValue) => {
    if (!disabled && onChange) {
      onChange(newValue);
    }
  };

  return (
    <div className="attendance-toggle">
      {options.map((option) => {
        const Icon = option.icon;
        const isActive = value === option.value;

        return (
          <motion.button
            key={option.value}
            type="button"
            className={`attendance-toggle__button attendance-toggle__button--${
              option.value
            } ${isActive ? "attendance-toggle__button--active" : ""}`}
            onClick={() => handleToggle(option.value)}
            disabled={disabled}
            whileHover={{ scale: disabled ? 1 : 1.05 }}
            whileTap={{ scale: disabled ? 1 : 0.95 }}
            animate={{
              scale: isActive ? 1.1 : 1,
              transition: { type: "spring", stiffness: 300 },
            }}
          >
            <Icon size={16} />
            <span>{option.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
};

export default AttendanceToggle;
