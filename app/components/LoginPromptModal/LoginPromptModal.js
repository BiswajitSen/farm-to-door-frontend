"use client";

import React from 'react';
import PropTypes from 'prop-types';
import styles from './LoginPromptModal.module.css';
import { useRouter } from 'next/navigation';

const LoginPromptModal = ({ onClose }) => {
    const router = useRouter();

    const handleLogin = () => {
        const redirectAfterLogin = window.location.pathname;
        localStorage.setItem('redirectAfterLogin', redirectAfterLogin);
        router.push('/login');
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <p>Please login to proceed</p>
                <button onClick={handleLogin} className={styles.loginButton}>
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
};

export default LoginPromptModal;