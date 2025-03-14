import React from 'react';
import PropTypes from 'prop-types';
import styles from './DualAnswerModal.module.css';

const DualAnswerModal = ({ message, onConfirm, onCancel, buttonText}) => {
    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <p className={styles.message}>{message}</p>
                <div className={styles.buttonGroup}>
                    <button onClick={onConfirm} className={styles.confirmButton}>{buttonText.confirm || "Confirm"}</button>
                    <button onClick={onCancel} className={styles.cancelButton}>{buttonText.cancel || "Cancel"}</button>
                </div>
            </div>
        </div>
    );
};

DualAnswerModal.propTypes = {
    message: PropTypes.string.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
};

export default DualAnswerModal;