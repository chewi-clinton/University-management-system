import React from "react";
import "../../../styles/components/CircularProgress.css";

const CircularProgress = ({
  value = 0,
  size = 120,
  strokeWidth = 8,
  color = "var(--primary-500)",
  showPercentage = true,
  className = "",
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div
      className={`circular-progress ${className}`}
      style={{ width: size, height: size }}
    >
      <svg className="circular-progress__svg" width={size} height={size}>
        {/* Background circle */}
        <circle
          className="circular-progress__circle-bg"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          className="circular-progress__circle"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ stroke: color }}
        />
      </svg>
      {showPercentage && (
        <div className="circular-progress__text">
          <span className="circular-progress__value">{value}</span>
          <span className="circular-progress__unit">%</span>
        </div>
      )}
    </div>
  );
};

export default CircularProgress;
