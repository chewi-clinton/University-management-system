import React from "react";
import { ChevronDown } from "lucide-react";
import "../../../styles/components/Select.css";

const Select = ({
  value,
  onChange,
  options = [],
  placeholder = "Select an option",
  className = "",
  disabled = false,
  error = null,
  label = null,
}) => {
  return (
    <div className={`select ${className} ${error ? "select--error" : ""}`}>
      {label && <label className="select__label">{label}</label>}
      <div className="select__wrapper">
        <select
          className="select__field"
          value={value}
          onChange={onChange}
          disabled={disabled}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="select__icon" size={20} />
      </div>
      {error && <span className="select__error">{error}</span>}
    </div>
  );
};

export default Select;
