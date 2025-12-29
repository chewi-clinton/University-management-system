import React, { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import "../../../styles/components/SearchInput.css";

const SearchInput = ({
  value,
  onChange,
  placeholder = "Search...",
  debounce = 300,
  className = "",
  onClear,
}) => {
  const [internalValue, setInternalValue] = useState(value || "");

  useEffect(() => {
    setInternalValue(value || "");
  }, [value]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (onChange) {
        onChange({ target: { value: internalValue } });
      }
    }, debounce);

    return () => clearTimeout(timer);
  }, [internalValue, debounce]);

  const handleClear = () => {
    setInternalValue("");
    if (onClear) {
      onClear();
    }
    if (onChange) {
      onChange({ target: { value: "" } });
    }
  };

  return (
    <div className={`search-input ${className}`}>
      <div className="search-input__wrapper">
        <Search className="search-input__icon" size={20} />
        <input
          type="text"
          className="search-input__field"
          placeholder={placeholder}
          value={internalValue}
          onChange={(e) => setInternalValue(e.target.value)}
        />
        {internalValue && (
          <button
            type="button"
            className="search-input__clear"
            onClick={handleClear}
            aria-label="Clear search"
          >
            <X size={18} />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchInput;
