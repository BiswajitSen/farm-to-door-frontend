import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './OrderForm.module.css';

const OrderForm = ({ address, setAddress, onSubmit, onClose, selectedProducts, cart, orderPlacedSuccessfully }) => {
    const [error, setError] = useState('');
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (selectedProducts.length === 0) {
            setError('At least one product must be selected');
            return;
        }

        const trimmedAddress = address?.trim();
        if (!trimmedAddress || trimmedAddress.length < 10) {
            setError('Please enter a valid address (at least 10 characters)');
            return;
        }

        // Validate that all products have valid quantities
        const invalidProducts = selectedProducts.filter(product => {
            const quantity = cart[product._id];
            return !quantity || quantity <= 0;
        });

        if (invalidProducts.length > 0) {
            setError('All products must have a valid quantity');
            return;
        }

        const orderReq = {
            address: trimmedAddress,
            products: selectedProducts.map(product => ({
                productId: product._id,
                name: product.productName || product.name,
                imageUrl: product.imageUrl,
                quantity: cart[product._id],
                boughtFrom: product.soldBy
            }))
        };

        setIsSubmitDisabled(true);
        try {
            await onSubmit(orderReq);
        } catch (error) {
            setError(error.message || 'Failed to submit order');
            setIsSubmitDisabled(false);
        }
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
                    <label htmlFor="delivery-address" className={styles.label}>
                        Delivery Address:
                    </label>
                    <input
                        id="delivery-address"
                        type="text"
                        value={address}
                        onChange={(e) => {
                            setAddress(e.target.value);
                            setError(''); // Clear error when user starts typing
                        }}
                        placeholder="Enter your delivery address (minimum 10 characters)"
                        className={`${styles.input} ${error && !address?.trim() ? styles.inputError : ''}`}
                        required
                        minLength={10}
                        aria-invalid={error && !address?.trim()}
                        aria-describedby={error && !address?.trim() ? 'address-error' : undefined}
                    />
                    {error && !address?.trim() && (
                        <span id="address-error" className={styles.errorText} role="alert">
                            {error}
                        </span>
                    )}
                    <button 
                        type="submit" 
                        className={styles.submitButton} 
                        disabled={isSubmitDisabled || !address?.trim() || address.trim().length < 10}
                    >
                        {isSubmitDisabled ? 'Submitting...' : 'Submit Order'}
                    </button>
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