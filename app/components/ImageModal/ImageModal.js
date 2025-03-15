import React from 'react';
import PropTypes from 'prop-types';
import styles from './ImageModal.module.css';

const ImageModal = ({ name, description, imageUrl, onClose }) => {
    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent}>
                <div className={styles.cardContainer}>
                    <div className={styles.card}>
                        <div className={styles.imgContent}>
                            <img src={imageUrl} className={styles.fullScreenImage}/>
                        </div>
                        <div className={styles.content}>
                            <p className={styles.heading}>{name}</p>
                            <p>
                                {description}
                            </p>
                        </div>
                    </div>
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