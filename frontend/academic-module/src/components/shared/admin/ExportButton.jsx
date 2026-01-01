import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, FileText, FileSpreadsheet, Printer, X } from 'lucide-react';

export default function ExportButton({
  onExport,
  formats = ['csv', 'excel', 'pdf'],
  disabled = false,
  loading = false,
  tooltip = 'Export data'
}) {
  const [showMenu, setShowMenu] = useState(false);

  const formatOptions = {
    csv: {
      label: 'CSV',
      icon: <FileText size={16} />,
      color: 'green'
    },
    excel: {
      label: 'Excel',
      icon: <FileSpreadsheet size={16} />,
      color: 'blue'
    },
    pdf: {
      label: 'PDF',
      icon: <Printer size={16} />,
      color: 'red'
    }
  };

  const handleExport = (format) => {
    if (onExport) {
      onExport(format);
    }
    setShowMenu(false);
  };

  return (
    <div className="export-button">
      <div className="export-button__wrapper">
        <button
          className="export-button__main-btn"
          onClick={() => formats.length === 1 ? handleExport(formats[0]) : setShowMenu(!showMenu)}
          disabled={disabled || loading}
          title={tooltip}
        >
          {loading ? (
            <>
              <div className="export-button__spinner"></div>
              Exporting...
            </>
          ) : (
            <>
              <Download size={16} />
              Export
              {formats.length > 1 && <X size={12} className={`export-button__chevron ${showMenu ? 'export-button__chevron--open' : ''}`} />}
            </>
          )}
        </button>

        <AnimatePresence>
          {showMenu && formats.length > 1 && (
            <motion.div
              className="export-button__menu"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
            >
              {formats.map((format) => {
                const option = formatOptions[format];
                return (
                  <button
                    key={format}
                    className={`export-button__menu-item export-button__menu-item--${option.color}`}
                    onClick={() => handleExport(format)}
                    disabled={disabled}
                  >
                    {option.icon}
                    {option.label}
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}