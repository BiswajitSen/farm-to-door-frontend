// app/components/OrderSuccessModal/OrderSuccessModal.js
import React from 'react';
import PropTypes from 'prop-types';
import styles from './OrderSuccessModal.module.css';

const OrderSuccessModal = ({ onClose }) => {
    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <p>Order successful!</p>
                <button onClick={onClose} className={styles.closeButton}>
                    Close
                </button>
            </div>
        </div>
    );
};

OrderSuccessModal.propTypes = {
    onClose: PropTypes.func.isRequired,
};

export default OrderSuccessModal;