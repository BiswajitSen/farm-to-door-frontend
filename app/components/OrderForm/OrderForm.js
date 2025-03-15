import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './OrderForm.module.css';

const OrderForm = ({ setAddress, onSubmit, onClose, selectedProducts, cart, orderPlacedSuccessfully }) => {
    const [error, setError] = useState('');
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
    const [addressLineOne, setAddressLineOne] = useState('');
    const [addressLineTwo, setAddressLineTwo] = useState('');
    const [addressLineThree, setAddressLineThree] = useState('');
    const [state, setState] = useState('');
    const [pincode, setPincode] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        if (selectedProducts.length === 0) {
            setError('At least one product must be selected');
            return;
        }

        if (!addressLineOne || !state || !pincode) {
            setError('Address Line One, State, and Pincode are required');
            return;
        }

        const fullAddress = `${addressLineOne}, ${addressLineTwo}, ${addressLineThree}, ${state}, ${pincode}`;
        setAddress(fullAddress);

        const orderReq = {
            address: fullAddress,
            products: selectedProducts.map(product => {
                return {
                    productId: product._id,
                    name: product.productName,
                    imageUrl: product.imageUrl,
                    quantity: cart[product._id],
                    boughtFrom: product.soldBy
                }
            })
        };

        setIsSubmitDisabled(true);
        onSubmit(orderReq, setError);
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
                        value={addressLineOne}
                        onChange={(e) => setAddressLineOne(e.target.value)}
                        placeholder="Address Line One"
                        className={`${styles.input} ${error && !addressLineOne ? styles.inputError : ''}`}
                    />
                    <input
                        type="text"
                        value={addressLineTwo}
                        onChange={(e) => setAddressLineTwo(e.target.value)}
                        placeholder="Address Line Two"
                        className={styles.input}
                    />
                    <input
                        type="text"
                        value={addressLineThree}
                        onChange={(e) => setAddressLineThree(e.target.value)}
                        placeholder="Address Line Three (optional)"
                        className={styles.input}
                    />
                    <input
                        type="text"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        placeholder="State"
                        className={`${styles.input} ${error && !state ? styles.inputError : ''}`}
                    />
                    <input
                        type="text"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        placeholder="Pincode"
                        className={`${styles.input} ${error && !pincode ? styles.inputError : ''}`}
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