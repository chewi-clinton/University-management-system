import React from "react";
import "./Forms.css";

export const Input = ({ label, error, ...props }) => (
  <div className="input-group">
    <div className="input-wrapper">
      <input {...props} className="floating-input" placeholder=" " />
      <label className="floating-label">{label}</label>
    </div>
    {error && <span className="input-error animate-fade-in">{error}</span>}
  </div>
);

export const Button = ({
  children,
  variant = "primary",
  size = "md",
  ...props
}) => (
  <button
    className={`btn btn-${variant} btn-${size}`}
    {...props}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    {children}
  </button>
);
