import React from 'react';
import PropTypes from 'prop-types';
import styles from './Modal.module.css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faExclamationCircle} from "@fortawesome/free-solid-svg-icons";

const Modal = ({ message, onClose }) => {
    return (
        <div className={styles.modalOverlay}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <i className="fas fa-exclamation-circle" style={{ color: 'red', fontSize: '2rem' }}></i>
                </div>
                <div className={styles.info}>
                    <p className={styles.title}>ALERT !!!</p>
                    <p>{' ' + message.toUpperCase() + ' !!!'}</p>

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