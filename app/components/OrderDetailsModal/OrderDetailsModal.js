// OrderDetailsModal.js
import React, {useContext, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import styles from './OrderDetailsModal.module.css';
import urls from '@/.env';
import {useAppContext} from "@/app/context";

const OrderDetailsModal = ({ orderDetails, onClose }) => {
    const {products} = useAppContext();

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <h2>Order Details</h2>
                <button onClick={onClose} className={styles.closeButton}>X</button>
                <div className={styles.orderList}>
                    {orderDetails.map((order, index) => (
                        <div key={index} className={styles.orderCard}>
                            <p><strong>Delivery Address:</strong> {order.deliveryAddress}</p>
                            <p><strong>Order Date:</strong> {new Date(order.orderDate).toLocaleDateString()}</p>
                            <p><strong>Product Count:</strong> {order.productCount}</p>
                            <p><strong>Status:</strong> {order.status}</p>
                            <p><strong>Products:</strong></p>
                            <ul>
                                {order.productIds.map((product, idx) => {
                                    console.log({product});
                                    const productDetail = products.filter(p => {
                                        console.log(p._id === product.productId);
                                        return p._id === product.productId;
                                    })[0];
                                    console.log({productDetail});
                                    return (
                                        <li key={idx}>
                                            {productDetail ? (
                                                <div>
                                                    <img
                                                        src={`${urls.API_BASE_URL}/images/${productDetail.imageUrl}`}
                                                        alt={product.name}
                                                        className={styles.productImage}
                                                    />
                                                    <p>Product Name: {productDetail.name}</p>
                                                    <p>Quantity: {product.quantity}</p>
                                                </div>
                                            ) : (
                                                <p>Loading...</p>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

OrderDetailsModal.propTypes = {
    orderDetails: PropTypes.arrayOf(PropTypes.shape({
        deliveryAddress: PropTypes.string.isRequired,
        orderDate: PropTypes.string.isRequired,
        productCount: PropTypes.number.isRequired,
        productIds: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.string.isRequired,
            quantity: PropTypes.number.isRequired
        })).isRequired,
        status: PropTypes.string.isRequired,
    })).isRequired,
    onClose: PropTypes.func.isRequired,
};

export default OrderDetailsModal;