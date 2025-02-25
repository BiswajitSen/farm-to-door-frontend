import React from 'react';
import PropTypes from 'prop-types';
import styles from './ImageModal.module.css';

const ImageModal = ({ imageUrl, onClose }) => {
    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent}>
                <div>
                <img src={imageUrl} alt="Product" className={styles.fullScreenImage} />
                </div>
            </div>
        </div>
    );
};

ImageModal.propTypes = {
    imageUrl: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default ImageModal;