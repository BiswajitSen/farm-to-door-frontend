import React from 'react';
import PropTypes from 'prop-types';
import styles from './LogoutButton.module.css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSignOutAlt} from "@fortawesome/free-solid-svg-icons";

const LogoutButton = ({ onLogout }) => (
    <button onClick={onLogout} className={styles.button}>
        <FontAwesomeIcon icon={faSignOutAlt} />
    </button>
);

LogoutButton.propTypes = {
    onLogout: PropTypes.func.isRequired,
};

export default LogoutButton;