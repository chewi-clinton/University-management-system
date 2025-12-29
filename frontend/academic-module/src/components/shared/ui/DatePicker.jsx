import React from "react";
import { Calendar } from "lucide-react";
import "../../../styles/components/DatePicker.css";

const DatePicker = ({
  value,
  onChange,
  label = null,
  placeholder = "Select date",
  minDate = null,
  maxDate = null,
  disabled = false,
  error = null,
  className = "",
}) => {
  return (
    <div
      className={`date-picker ${className} ${
        error ? "date-picker--error" : ""
      }`}
    >
      {label && <label className="date-picker__label">{label}</label>}
      <div className="date-picker__wrapper">
        <input
          type="date"
          className="date-picker__input"
          value={value}
          onChange={onChange}
          min={minDate}
          max={maxDate}
          disabled={disabled}
          placeholder={placeholder}
        />
        <Calendar className="date-picker__icon" size={20} />
      </div>
      {error && <span className="date-picker__error">{error}</span>}
    </div>
  );
};

export default DatePicker;
