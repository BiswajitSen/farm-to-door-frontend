"use client";

import React from 'react';
import PropTypes from 'prop-types';
import styles from './LoginPromptModal.module.css';
import { useRouter } from 'next/navigation';

const LoginPromptModal = ({ onClose }) => {
    const router = useRouter();

    const handleLogin = () => {
        try {
            const redirectAfterLogin = window.location.pathname;
            localStorage.setItem('redirectAfterLogin', redirectAfterLogin);
            router.push('/login');
        } catch (error) {
            console.error('Error saving redirect path:', error);
            // Still navigate to login even if localStorage fails
            router.push('/login');
        }
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <h2>Login Required</h2>
                <p>Please login to proceed with this action.</p>
                <div className={styles.buttonGroup}>
                    <button 
                        onClick={handleLogin} 
                        className={styles.loginButton}
                        aria-label="Navigate to login page"
                    >
                        Login
                    </button>
                    <button 
                        onClick={onClose} 
                        className={styles.closeButton}
                        aria-label="Close modal"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

LoginPromptModal.propTypes = {
    onClose: PropTypes.func.isRequired,
};

export default LoginPromptModal;