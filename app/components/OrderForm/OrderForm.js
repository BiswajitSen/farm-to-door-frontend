import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './OrderForm.module.css';

const OrderForm = ({ address, setAddress, onSubmit, onClose, selectedProducts, cart, orderPlacedSuccessfully }) => {
    const [error, setError] = useState('');
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (selectedProducts.length === 0) {
            setError('At least one product must be selected');
            return;
        }

        if (!address) {
            setError('Address is required');
            return;
        }

        const orderReq = {
            address,
            products: selectedProducts.map(product => ({
                productId: product._id,
                quantity: cart[product._id]
            }))
        };

        setIsSubmitDisabled(true);
        onSubmit(orderReq);
    };

    const totalItems = selectedProducts.reduce((acc, product) => acc + cart[product._id], 0);
    const totalCost = selectedProducts.reduce((acc, product) => acc + cart[product._id] * product.price, 0);

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <h2>Order Summary</h2>
                {orderPlacedSuccessfully && (
                    <div className={styles.successMessage}>
                        Order placed successfully!
                    </div>
                )}
                <ul>
                    {selectedProducts.map(product => (
                        <li key={product._id}>
                            {product.name} - {cart[product._id]} x ${product.price} = ${cart[product._id] * product.price}
                        </li>
                    ))}
                </ul>
                <div className={styles.totalContainer}>
                    <p>Total Items: {totalItems}</p>
                    <p>Total Cost: ${totalCost.toFixed(2)}</p>
                </div>
                {error && <div className={styles.errorMessage}>{error}</div>}
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Enter your address"
                        className={`${styles.input} ${error && !address ? styles.inputError : ''}`}
                    />
                    <button type="submit" className={styles.submitButton} disabled={isSubmitDisabled}>Submit Order</button>
                </form>
                <button onClick={onClose} className={styles.closeButton}>X</button>
            </div>
        </div>
    );
};

OrderForm.propTypes = {
    address: PropTypes.string.isRequired,
    setAddress: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    selectedProducts: PropTypes.arrayOf(PropTypes.shape({
        _id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
    })).isRequired,
    cart: PropTypes.object.isRequired,
    orderPlacedSuccessfully: PropTypes.bool.isRequired,
};

export default OrderForm;