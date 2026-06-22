import { memo } from 'react';
import { getAvailableColumns } from '../../utils/data-transformers';
import styles from './column-modal.module.css';

type ColumnModalProps = {
  isOpen: boolean;
  selectedColumns: string[];
  onToggle: (column: string) => void;
  onClose: () => void;
};

export const ColumnModal = memo(
  ({ isOpen, selectedColumns, onToggle, onClose }: ColumnModalProps) => {
    if (!isOpen) {
      return null;
    }

    const availableColumns = getAvailableColumns();

    return (
      <div className={styles.overlay}>
        <div className={styles.modal}>
          <h2 className={styles.title}>Select columns to display</h2>
          <div className={styles.columnList}>
            {availableColumns.map((column) => (
              <div key={column} className={styles.columnItem}>
                <label>
                  <input
                    type="checkbox"
                    checked={selectedColumns.includes(column)}
                    onChange={() => onToggle(column)}
                    className={styles.checkbox}
                  />
                  {column}
                </label>
              </div>
            ))}
          </div>
          <div className={styles.buttonContainer}>
            <button onClick={onClose} className={styles.closeButton}>
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }
);

ColumnModal.displayName = 'ColumnModal';
