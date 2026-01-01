import { motion, AnimatePresence } from 'framer-motion';
import { Download, Trash2, Mail, UserCheck, UserX, FileText } from 'lucide-react';

export default function BulkActionBar({
  selectedCount,
  onAction,
  actions = [],
  show = true
}) {
  const defaultActions = [
    {
      type: 'export',
      label: 'Export',
      icon: <Download size={16} />,
      color: 'primary',
      onClick: () => onAction('export')
    },
    {
      type: 'email',
      label: 'Send Email',
      icon: <Mail size={16} />,
      color: 'secondary',
      onClick: () => onAction('email')
    },
    {
      type: 'activate',
      label: 'Activate',
      icon: <UserCheck size={16} />,
      color: 'success',
      onClick: () => onAction('activate')
    },
    {
      type: 'deactivate',
      label: 'Deactivate',
      icon: <UserX size={16} />,
      color: 'warning',
      onClick: () => onAction('deactivate')
    },
    {
      type: 'delete',
      label: 'Delete',
      icon: <Trash2 size={16} />,
      color: 'danger',
      onClick: () => onAction('delete')
    }
  ];

  const mergedActions = actions.length > 0 ? actions : defaultActions;

  return (
    <AnimatePresence>
      {show && selectedCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="bulk-action-bar"
        >
          <div className="bulk-action-bar__content">
            <div className="bulk-action-bar__info">
              <FileText size={20} />
              <span>
                {selectedCount} item{selectedCount !== 1 ? 's' : ''} selected
              </span>
            </div>

            <div className="bulk-action-bar__actions">
              {mergedActions.map((action) => (
                <button
                  key={action.type}
                  onClick={action.onClick}
                  className={`bulk-action-bar__btn bulk-action-bar__btn--${action.color || 'primary'}`}
                  title={action.label}
                >
                  {action.icon}
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}