import React from 'react';
import PropTypes from 'prop-types';
import styles from './LogoutButton.module.css';

const LogoutButton = ({ onLogout }) => {
    return (
        <button onClick={onLogout} className={styles.logoutButton}>
            Logout
        </button>
    );
};

LogoutButton.propTypes = {
    onLogout: PropTypes.func.isRequired,
};

export default LogoutButton;