import React from 'react';
import PropTypes from 'prop-types';
import styles from './DeleteConfirmModal.module.css';

const DeleteConfirmModal = ({ message, onConfirm, onCancel }) => {
    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <p>{message}</p>
                <div className={styles.buttonGroup}>
                    <button onClick={onConfirm} className={styles.confirmButton}>Confirm</button>
                    <button onClick={onCancel} className={styles.cancelButton}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

DeleteConfirmModal.propTypes = {
    message: PropTypes.string.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
};

export default DeleteConfirmModal;