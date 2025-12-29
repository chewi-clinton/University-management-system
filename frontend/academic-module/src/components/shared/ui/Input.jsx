import React, { useState, forwardRef } from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";

const Input = forwardRef(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      actionIcon,
      disabled = false,
      required = false,
      className = "",
      floatingLabel = true,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(
      props.value ? props.value.length > 0 : false
    );

    const handleFocus = (e) => {
      setIsFocused(true);
      props.onFocus?.(e);
    };

    const handleBlur = (e) => {
      setIsFocused(false);
      props.onBlur?.(e);
    };

    const handleChange = (e) => {
      setHasValue(e.target.value.length > 0);
      props.onChange?.(e);
    };

    const inputClasses = [
      "input",
      `input--${floatingLabel ? "floating" : "fixed"}`,
      leftIcon && "input--has-left-icon",
      rightIcon && "input--has-right-icon",
      actionIcon && "input--has-action-icon",
      isFocused && "input--focused",
      hasValue && "input--has-value",
      error && "input--error",
      disabled && "input--disabled",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div className={inputClasses}>
        <div className="input__wrapper">
          {leftIcon && (
            <div className="input__icon input__icon--left">{leftIcon}</div>
          )}

          <div className="input__field-wrapper">
            <input
              ref={ref}
              className="input__field"
              disabled={disabled}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onChange={handleChange}
              required={required}
              {...props}
            />

            {floatingLabel && label && (
              <motion.label
                className="input__label"
                initial={{ y: 0, scale: 1 }}
                animate={{
                  y: isFocused || hasValue ? -20 : 0,
                  scale: isFocused || hasValue ? 0.8 : 1,
                }}
                transition={{ duration: 0.2 }}
              >
                {label}
                {required && <span className="input__required">*</span>}
              </motion.label>
            )}
          </div>

          {rightIcon && (
            <div className="input__icon input__icon--right">{rightIcon}</div>
          )}

          {actionIcon && (
            <div className="input__icon input__icon--action">{actionIcon}</div>
          )}
        </div>

        {(error || helperText) && (
          <div className="input__message">
            {error ? (
              <span className="input__error">{error}</span>
            ) : (
              <span className="input__helper">{helperText}</span>
            )}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

Input.propTypes = {
  label: PropTypes.string,
  error: PropTypes.string,
  helperText: PropTypes.string,
  leftIcon: PropTypes.node,
  rightIcon: PropTypes.node,
  actionIcon: PropTypes.node,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  className: PropTypes.string,
  floatingLabel: PropTypes.bool,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
};

export default Input;
