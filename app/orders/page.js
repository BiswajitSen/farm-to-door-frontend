// app/orders/page.js
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import styles from './OrderPage.module.css';

export default function OrderPage({ params }) {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        axios.get(`http://localhost:8080/api/orders/${params.orderId}`)
            .then((response) => {
                setOrder(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching order:', error);
                setError('Failed to fetch order details');
                setLoading(false);
            });
    }, [params.orderId]);

    if (loading) {
        return <p>Loading order details...</p>;
    }

    if (error) {
        return <p className={styles.error}>{error}</p>;
    }

    return (
        <div className={styles.orderPage}>
            <h2>Order #{order._id}</h2>
            <p>Status: {order.status}</p>
            <p>Product: {order.productId.name}</p>
            <p>Delivery Address: {order.deliveryAddress}</p>
        </div>
    );
}

OrderPage.propTypes = {
    params: PropTypes.shape({
        orderId: PropTypes.string.isRequired,
    }).isRequired,
};