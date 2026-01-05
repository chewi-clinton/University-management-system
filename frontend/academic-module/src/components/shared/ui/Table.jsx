import React, { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import "../../../styles/components/Table.css";

const Table = ({
  columns = [],
  data = [],
  onSort = null,
  sortable = true,
  className = "",
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const normalizedColumns = React.useMemo(() => {
    return columns.map((col, index) => {
      if (typeof col === "string") {
        return {
          key: `col-${index}`,
          label: col,
          sortable: sortable,
        };
      }
      return {
        ...col,
        key: col.key ?? `col-${index}`,
        sortable: col.sortable !== false && sortable,
      };
    });
  }, [columns, sortable]);

  const handleSort = (key) => {
    if (!sortable) return;

    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    setSortConfig({ key, direction });
    if (onSort) onSort(key, direction);
  };

  const sortedData = React.useMemo(() => {
    if (!sortConfig.key || !data.length) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig]);

  return (
    <div className={`table ${className}`}>
      <div className="table__wrapper">
        <table className="table__element">
          <thead className="table__header">
            <tr className="table__row">
              {normalizedColumns.map((column) => (
                <th
                  key={column.key}
                  className={`table__cell table__cell--header ${
                    column.sortable ? "table__cell--sortable" : ""
                  }`}
                  onClick={() => column.sortable && handleSort(column.key)}
                  style={{ width: column.width }}
                >
                  <div className="table__cell-content">
                    {column.label}
                    {column.sortable && (
                      <div className="table__sort-icon">
                        {sortConfig.key === column.key ? (
                          sortConfig.direction === "asc" ? (
                            <ChevronUp size={16} />
                          ) : (
                            <ChevronDown size={16} />
                          )
                        ) : (
                          <ChevronDown
                            size={16}
                            className="table__sort-icon--inactive"
                          />
                        )}
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="table__body">
            {sortedData.length === 0 ? (
              <tr className="table__row">
                <td
                  colSpan={normalizedColumns.length}
                  className="table__cell table__cell--empty"
                >
                  No data available
                </td>
              </tr>
            ) : (
              sortedData.map((row, rowIndex) => (
                <tr
                  key={row.id || rowIndex}
                  className="table__row table__row--body"
                >
                  {normalizedColumns.map((column, colIndex) => (
                    <td
                      key={`${rowIndex}-${column.key}`}
                      className="table__cell"
                    >
                      {column.render
                        ? column.render(row[column.key], row, rowIndex)
                        : row[column.key] ?? row[colIndex]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
