// OrderDetailsModal.js
import React from 'react';
import PropTypes from 'prop-types';
import styles from './OrderDetailsModal.module.css';
import urls from '@/env';
import { useAppContext } from "@/app/context";

const OrderDetailsModal = ({ orderDetails, onClose }) => {
    const { products } = useAppContext();

    if (!orderDetails || orderDetails.length === 0) {
        return (
            <div className={styles.modalOverlay}>
                <div className={styles.modal}>
                    <h2>Order Details</h2>
                    <button onClick={onClose} className={styles.closeButton} aria-label="Close">X</button>
                    <p>No orders found.</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <h2>Order Details</h2>
                <button 
                    onClick={onClose} 
                    className={styles.closeButton}
                    aria-label="Close modal"
                >
                    X
                </button>
                <div className={styles.orderList}>
                    {orderDetails.map((order, index) => {
                        const orderDate = order.orderDate 
                            ? new Date(order.orderDate).toLocaleDateString() 
                            : 'Date not available';
                        
                        return (
                            <div key={order._id || index} className={styles.orderCard}>
                                <p><strong>Delivery Address:</strong> {order.deliveryAddress || 'Not specified'}</p>
                                <p><strong>Order Date:</strong> {orderDate}</p>
                                <p><strong>Product Count:</strong> {order.productCount || 0}</p>
                                <p><strong>Status:</strong> {order.status || 'Unknown'}</p>
                                {order.productIds && order.productIds.length > 0 ? (
                                    <>
                                        <p><strong>Products:</strong></p>
                                        <ul>
                                            {order.productIds.map((product, idx) => {
                                                const productDetail = products.find(p => p._id === product.productId);
                                                return (
                                                    <li key={product.productId || idx}>
                                                        {productDetail ? (
                                                            <div>
                                                                {productDetail.imageUrl && (
                                                                    <img
                                                                        src={`${urls.API_BASE_URL}/images/${productDetail.imageUrl}`}
                                                                        alt={productDetail.name || 'Product'}
                                                                        className={styles.productImage}
                                                                        onError={(e) => {
                                                                            e.target.style.display = 'none';
                                                                        }}
                                                                    />
                                                                )}
                                                                <p>Product Name: {productDetail.name || 'Unknown Product'}</p>
                                                                <p>Quantity: {product.quantity || 0}</p>
                                                            </div>
                                                        ) : (
                                                            <p>Product information not available</p>
                                                        )}
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </>
                                ) : (
                                    <p>No products in this order.</p>
                                )}
                            </div>
                        );
                    })}
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