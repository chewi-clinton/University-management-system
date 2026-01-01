import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, ChevronDown, Search } from 'lucide-react';

export default function FilterPanel({
  filters = {},
  onFilterChange,
  children,
  showSearch = true,
  searchPlaceholder = 'Search...',
  className = ''
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState(0);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    
    // Count active filters (excluding empty values)
    const activeCount = Object.values(newFilters).filter(
      v => v !== '' && v !== 'all' && v !== null && v !== undefined
    ).length;
    
    setActiveFilters(activeCount);
    
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  const clearAllFilters = () => {
    const clearedFilters = {};
    Object.keys(filters).forEach(key => {
      clearedFilters[key] = '';
    });
    
    setActiveFilters(0);
    setSearchQuery('');
    
    if (onFilterChange) {
      onFilterChange(clearedFilters);
    }
  };

  const hasActiveFilters = activeFilters > 0;

  return (
    <div className={`filter-panel ${className}`}>
      {/* Toggle Button */}
      <button
        className={`filter-panel__toggle ${hasActiveFilters ? 'filter-panel__toggle--active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Filter size={18} />
        <span>Filters</span>
        {hasActiveFilters && (
          <span className="filter-panel__badge">{activeFilters}</span>
        )}
        <ChevronDown size={16} className={`filter-panel__chevron ${isOpen ? 'filter-panel__chevron--open' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="filter-panel__content"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* Search Bar */}
            {showSearch && (
              <div className="filter-panel__search">
                <Search size={16} />
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    handleFilterChange('search', e.target.value);
                  }}
                  className="filter-panel__search-input"
                />
              </div>
            )}

            {/* Filter Controls */}
            <div className="filter-panel__controls">
              {children}
            </div>

            {/* Filter Actions */}
            <div className="filter-panel__actions">
              <button
                className="filter-panel__clear"
                onClick={clearAllFilters}
                disabled={!hasActiveFilters}
              >
                <X size={14} />
                Clear All
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Pre-built filter components for common use cases
export const DateRangeFilter = ({ startDate, endDate, onChange }) => (
  <div className="filter-panel__date-range">
    <input
      type="date"
      value={startDate || ''}
      onChange={(e) => onChange('startDate', e.target.value)}
      className="filter-panel__date-input"
    />
    <span className="filter-panel__date-separator">to</span>
    <input
      type="date"
      value={endDate || ''}
      onChange={(e) => onChange('endDate', e.target.value)}
      className="filter-panel__date-input"
    />
  </div>
);

export const SelectFilter = ({ value, onChange, options, placeholder = 'Select...' }) => (
  <select
    value={value || ''}
    onChange={(e) => onChange(e.target.value)}
    className="filter-panel__select"
  >
    <option value="">{placeholder}</option>
    {options.map((option) => (
      <option key={option.value || option} value={option.value || option}>
        {option.label || option}
      </option>
    ))}
  </select>
);

export const MultiSelectFilter = ({ selected = [], onChange, options, placeholder = 'Select options...' }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOption = (option) => {
    const newSelected = selected.includes(option.value || option)
      ? selected.filter(s => s !== (option.value || option))
      : [...selected, option.value || option];
    
    onChange(newSelected);
  };

  return (
    <div className="filter-panel__multi-select">
      <button
        className="filter-panel__multi-select-trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selected.length > 0 ? `${selected.length} selected` : placeholder}
        <ChevronDown size={14} />
      </button>
      
      {isOpen && (
        <div className="filter-panel__multi-select-dropdown">
          {options.map((option) => (
            <label key={option.value || option} className="filter-panel__multi-select-option">
              <input
                type="checkbox"
                checked={selected.includes(option.value || option)}
                onChange={() => toggleOption(option)}
              />
              <span>{option.label || option}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};