import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import '../../../styles/components/SpreadsheetGrid.css';

const SpreadsheetGrid = ({ columns, data, onCellEdit, editable = true }) => {
  const [editingCell, setEditingCell] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const inputRef = useRef(null);

  useEffect(() => {
    if (editingCell && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingCell]);

  const handleCellClick = (rowIndex, colKey) => {
    if (!editable) return;
    
    setEditingCell({ row: rowIndex, col: colKey });
    const currentValue = data[rowIndex][colKey] || '';
    setEditValue(currentValue.toString());
  };

  const handleCellEdit = () => {
    if (editingCell && onCellEdit) {
      const { row, col } = editingCell;
      onCellEdit(row, col, editValue);
    }
    setEditingCell(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleCellEdit();
    } else if (e.key === 'Escape') {
      setEditingCell(null);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const { row, col } = editingCell;
      const currentColIndex = columns.findIndex(c => c.key === col);
      const nextColIndex = e.shiftKey ? currentColIndex - 1 : currentColIndex + 1;
      
      if (nextColIndex >= 0 && nextColIndex < columns.length) {
        handleCellEdit();
        setTimeout(() => {
          setEditingCell({ row, col: columns[nextColIndex].key });
          setEditValue(data[row][columns[nextColIndex].key]?.toString() || '');
        }, 50);
      }
    }
  };

  const handleSort = (colKey) => {
    let direction = 'asc';
    if (sortConfig.key === colKey && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key: colKey, direction });
  };

  const sortedData = React.useMemo(() => {
    if (!sortConfig.key) return data;
    
    return [...data].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
      }
      
      const aStr = String(aVal).toLowerCase();
      const bStr = String(bVal).toLowerCase();
      
      if (sortConfig.direction === 'asc') {
        return aStr.localeCompare(bStr);
      }
      return bStr.localeCompare(aStr);
    });
  }, [data, sortConfig]);

  const renderCell = (value, rowIndex, colKey, col) => {
    const isEditing = editingCell?.row === rowIndex && editingCell?.col === colKey;
    
    if (isEditing) {
      return (
        <input
          ref={inputRef}
          type={col.type === 'number' ? 'number' : 'text'}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleCellEdit}
          onKeyDown={handleKeyDown}
          className="spreadsheet-grid__input"
        />
      );
    }
    
    return (
      <span className="spreadsheet-grid__cell-value">
        {col.render ? col.render(value, sortedData[rowIndex]) : value}
      </span>
    );
  };

  return (
    <div className="spreadsheet-grid">
      <div className="spreadsheet-grid__wrapper">
        <table className="spreadsheet-grid__table">
          <thead className="spreadsheet-grid__header">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`spreadsheet-grid__header-cell ${
                    col.sortable ? 'spreadsheet-grid__header-cell--sortable' : ''
                  } ${col.fixed ? 'spreadsheet-grid__cell--fixed' : ''}`}
                  onClick={() => col.sortable && handleSort(col.key)}
                  style={{ width: col.width || 'auto' }}
                >
                  <div className="spreadsheet-grid__header-content">
                    {col.label}
                    {col.sortable && sortConfig.key === col.key && (
                      <span className="spreadsheet-grid__sort-indicator">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="spreadsheet-grid__body">
            {sortedData.map((row, rowIndex) => (
              <motion.tr
                key={row.id || rowIndex}
                className="spreadsheet-grid__row"
                whileHover={{ backgroundColor: 'var(--bg-secondary)' }}
                transition={{ duration: 0.1 }}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`spreadsheet-grid__cell ${
                      editable ? 'spreadsheet-grid__cell--editable' : ''
                    } ${col.fixed ? 'spreadsheet-grid__cell--fixed' : ''} ${
                      editingCell?.row === rowIndex && editingCell?.col === col.key
                        ? 'spreadsheet-grid__cell--editing'
                        : ''
                    }`}
                    onClick={() => handleCellClick(rowIndex, col.key)}
                    style={{ width: col.width || 'auto' }}
                  >
                    {renderCell(row[col.key], rowIndex, col.key, col)}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SpreadsheetGrid;