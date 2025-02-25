import React from 'react';
import PropTypes from 'prop-types';
import styles from './OrderForm.module.css';

const OrderForm = ({ address, setAddress, onSubmit, onClose, selectedProducts, cart, orderPlacedSuccessfully }) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        const orderReq = {
            address,
            products: selectedProducts.map(product => ({
                productId: product._id,
                quantity: cart[product._id]
            }))
        };
        onSubmit(orderReq);
    };

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
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Enter your address"
                        className={styles.input}
                    />
                    <button type="submit" className={styles.submitButton}>Submit Order</button>
                </form>
                <button onClick={onClose} className={styles.closeButton}>Close</button>
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