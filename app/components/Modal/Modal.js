import React from 'react';
import PropTypes from 'prop-types';
import styles from './Modal.module.css';

const Modal = ({ message, onClose }) => {
    return (
        <div className={styles.modalOverlay}>
        <div className={styles.card}>
            <div className={styles.header}></div>
            <div className={styles.info}>
                <p className={styles.title}>Alert!!!</p>
                <p>{message + ' !!!'}</p>
            </div>
            <div className={styles.footer}>
                <p className={styles.tag}>#alert #msg </p>
                <button type="button" className={styles.action} onClick={onClose}>Close</button>
            </div>
        </div>
        </div>
    );
};

Modal.propTypes = {
    message: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default Modal;