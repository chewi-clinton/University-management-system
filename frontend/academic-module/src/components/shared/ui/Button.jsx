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
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  "aria-label": ariaLabel, // Recommended for icon-only buttons
  ...props
}) => {
  const hasChildren = children !== undefined && children !== null;
  const isIconOnly = !hasChildren && (LeftIcon || RightIcon);

  const buttonClasses = [
    "btn",
    `btn--${variant}`,
    `btn--${size}`,
    fullWidth && "btn--full-width",
    loading && "btn--loading",
    isIconOnly && "btn--icon-only", // Optional: add this CSS class for better icon-only styling
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <motion.button
      className={buttonClasses}
      disabled={disabled || loading}
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      transition={{ duration: 0.1 }}
      aria-label={
        ariaLabel || (typeof children === "string" ? children : undefined)
      }
      {...props}
    >
      {loading && (
        <div className="btn__spinner">
          <div className="btn__spinner-circle" />
        </div>
      )}

      <div className={`btn__content ${loading ? "btn__content--loading" : ""}`}>
        {LeftIcon && (
          <span className="btn__icon btn__icon--left">{LeftIcon}</span>
        )}
        {hasChildren && children}
        {RightIcon && (
          <span className="btn__icon btn__icon--right">{RightIcon}</span>
        )}
      </div>
    </motion.button>
  );
};

Button.propTypes = {
  children: PropTypes.node, // Removed .isRequired
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
  "aria-label": PropTypes.string,
};

export default Button;
