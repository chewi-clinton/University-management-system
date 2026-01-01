import { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, MoreVertical, Download, Trash2, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminDataTable({
  columns,
  data,
  onRowClick,
  onBulkAction,
  selectable = true,
  actions = [],
  loading = false,
  emptyMessage = 'No data found'
}) {
  const [selectedRows, setSelectedRows] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];

      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(data.map((row) => row.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const handleBulkAction = (actionType) => {
    if (onBulkAction) {
      onBulkAction(actionType, selectedRows);
    }
  };

  if (loading) {
    return (
      <div className="admin-data-table admin-data-table--loading">
        <div className="admin-data-table__skeleton">
          <div className="admin-data-table__skeleton-header"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="admin-data-table__skeleton-row"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="admin-data-table">
      {selectedRows.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="admin-data-table__bulk-bar"
        >
          <span>{selectedRows.length} selected</span>
          <div className="admin-data-table__bulk-actions">
            {actions.map((action) => (
              <button
                key={action.type}
                onClick={() => handleBulkAction(action.type)}
                className={`admin-data-table__bulk-btn admin-data-table__bulk-btn--${action.type}`}
              >
                {action.icon}
                {action.label}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      <div className="admin-data-table__wrapper">
        <table className="admin-data-table__table">
          <thead>
            <tr>
              {selectable && (
                <th className="admin-data-table__checkbox-col">
                  <input
                    type="checkbox"
                    checked={selectedRows.length === data.length && data.length > 0}
                    onChange={handleSelectAll}
                    disabled={data.length === 0}
                  />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && handleSort(col.key)}
                  className={`${col.sortable ? 'admin-data-table__sortable' : ''} ${col.className || ''}`}
                  style={{ width: col.width || 'auto' }}
                >
                  <div className="admin-data-table__header">
                    {col.label}
                    {col.sortable && sortConfig.key === col.key && (
                      sortConfig.direction === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                    )}
                  </div>
                </th>
              ))}
              {actions.length > 0 && <th className="admin-data-table__actions-col">Actions</th>}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {paginatedData.length > 0 ? (
                paginatedData.map((row, index) => (
                  <motion.tr
                    key={row.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className={`${selectedRows.includes(row.id) ? 'admin-data-table__row--selected' : ''} ${onRowClick ? 'admin-data-table__row--clickable' : ''}`}
                    onClick={() => onRowClick && onRowClick(row)}
                  >
                    {selectable && (
                      <td onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selectedRows.includes(row.id)}
                          onChange={() => handleSelectRow(row.id)}
                        />
                      </td>
                    )}
                    {columns.map((col) => (
                      <td key={col.key} className={col.className || ''}>
                        {col.render ? col.render(row[col.key], row) : row[col.key]}
                      </td>
                    ))}
                    {actions.length > 0 && (
                      <td onClick={(e) => e.stopPropagation()}>
                        <div className="admin-data-table__actions">
                          {actions.map((action, idx) => (
                            <button
                              key={idx}
                              onClick={() => action.onClick(row)}
                              className={`admin-data-table__action-btn admin-data-table__action-btn--${action.type}`}
                              title={action.label}
                            >
                              {action.icon}
                            </button>
                          ))}
                        </div>
                      </td>
                    )}
                  </motion.tr>
                ))
              ) : (
                <tr className="admin-data-table__empty-row">
                  <td colSpan={columns.length + (selectable ? 1 : 0) + (actions.length > 0 ? 1 : 0)}>
                    <div className="admin-data-table__empty-message">
                      {emptyMessage}
                    </div>
                  </td>
                </tr>
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="admin-data-table__pagination">
          <div className="admin-data-table__pagination-info">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, sortedData.length)} of {sortedData.length} entries
          </div>
          <div className="admin-data-table__pagination-controls">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="admin-data-table__pagination-btn"
            >
              Previous
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`admin-data-table__pagination-btn ${currentPage === i + 1 ? 'admin-data-table__pagination-btn--active' : ''}`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="admin-data-table__pagination-btn"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}