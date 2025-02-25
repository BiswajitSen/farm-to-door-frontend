"use client";

import React from 'react';
import PropTypes from 'prop-types';
import styles from './LoginPromptModal.module.css';

const LoginPromptModal = ({ onClose, onLogin }) => {
    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <p>Please login to proceed</p>
                <button onClick={onLogin} className={styles.loginButton}>
                    Login
                </button>
                <button onClick={onClose} className={styles.closeButton}>
                    Close
                </button>
            </div>
        </div>
    );
};

LoginPromptModal.propTypes = {
    onClose: PropTypes.func.isRequired,
    onLogin: PropTypes.func.isRequired,
};

export default LoginPromptModal;