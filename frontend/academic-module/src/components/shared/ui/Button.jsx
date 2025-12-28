// src/components/shared/ui/Button.jsx
import React from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import "../../../styles/components/Button.css";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  fullWidth = false,
  className = "",
  leftIcon,
  rightIcon,
  ...props
}) => {
  const buttonClasses = [
    "btn",
    `btn--${variant}`,
    `btn--${size}`,
    fullWidth && "btn--full-width",
    loading && "btn--loading",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const Icon = ({ icon, className }) => {
    if (!icon) return null;
    return <span className={className}>{icon}</span>;
  };

  return (
    <motion.button
      className={buttonClasses}
      disabled={disabled || loading}
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      transition={{ duration: 0.1 }}
      {...props}
    >
      {loading && (
        <div className="btn__spinner">
          <div className="btn__spinner-circle" />
        </div>
      )}

      <div className={`btn__content ${loading ? "btn__content--loading" : ""}`}>
        <Icon icon={leftIcon} className="btn__icon btn__icon--left" />
        {children}
        <Icon icon={rightIcon} className="btn__icon btn__icon--right" />
      </div>
    </motion.button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf([
    "primary",
    "secondary",
    "outline",
    "ghost",
    "elevated",
    "danger",
    "success",
  ]),
  size: PropTypes.oneOf(["xs", "sm", "md", "lg", "xl"]),
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  fullWidth: PropTypes.bool,
  className: PropTypes.string,
  leftIcon: PropTypes.node,
  rightIcon: PropTypes.node,
};

export default Button;
