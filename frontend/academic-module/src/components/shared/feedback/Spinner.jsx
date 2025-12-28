import React from "react";
import "./Spinner.css";

const Spinner = ({ size = "md", color = "primary", className = "" }) => {
  return (
    <div
      className={`spinner spinner--${size} spinner--${color} ${className}`}
      role="status"
      aria-label="Loading"
    >
      <div className="spinner__circle"></div>
      <span className="spinner__sr-only">Loading...</span>
    </div>
  );
};

export default Spinner;
