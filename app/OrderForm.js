import React from 'react';
import PropTypes from 'prop-types';
import styles from './OrderForm.module.css';

const OrderForm = ({ address, setAddress, onSubmit }) => {
    return (
        <div className={styles.orderForm}>
            <h3>Enter Delivery Address</h3>
            <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your delivery address"
                className={styles.input}
            />
            <button onClick={onSubmit} className={styles.button}>Place Order</button>
        </div>
    );
};

OrderForm.propTypes = {
    address: PropTypes.string.isRequired,
    setAddress: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
};

export default OrderForm;