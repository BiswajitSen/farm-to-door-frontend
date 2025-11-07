"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import styles from './VendorManagement.module.css';
import Layout from "@/app/components/Layout/layout.js";
import urls from "@/env";
import LoginPromptModal from "@/app/components/LoginPromptModal/LoginPromptModal.js";
import OrderSuccessModal from "@/app/components/OrderSuccessModal/OrderSuccessModal.js";

const Page = () => {
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [newProduct, setNewProduct] = useState({ name: '', description: '', price: 0, quantity: 0, image: null });
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);
    const [showOrderSuccess, setShowOrderSuccess] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        setIsLoggedIn(!!token);
        if (token) {
            fetchVendorData();
        }
    }, []);

    const fetchVendorData = async () => {
        const username = localStorage.getItem('username');
        const authToken = localStorage.getItem('authToken');

        if (!username || !authToken) {
            console.error('Missing authentication credentials');
            return;
        }

        try {
            const [productsResponse, ordersResponse] = await Promise.all([
                axios.get(`${urls.API_BASE_URL}/vendor/products?username=${username}`, {
                    headers: {
                        'Authorization': `Bearer ${authToken}`
                    }
                }),
                axios.get(`${urls.API_BASE_URL}/vendor/orders?username=${username}`, {
                    headers: {
                        'Authorization': `Bearer ${authToken}`
                    }
                })
            ]);

            setProducts(productsResponse.data || []);
            setOrders(ordersResponse.data || []);
        } catch (error) {
            console.error('Error fetching vendor data:', error);
            // Set empty arrays on error to prevent undefined errors
            setProducts([]);
            setOrders([]);
        }
    };

    const handleAddProduct = async () => {
        if (!isLoggedIn) {
            try {
                localStorage.setItem('redirectAfterLogin', window.location.pathname);
            } catch (error) {
                console.error('Error saving redirect path:', error);
            }
            setShowLoginPrompt(true);
            return;
        }

        // Validation
        if (!newProduct.name?.trim()) {
            alert('Product name is required');
            return;
        }

        if (newProduct.price <= 0) {
            alert('Price must be greater than 0');
            return;
        }

        if (newProduct.quantity < 0) {
            alert('Quantity cannot be negative');
            return;
        }

        const username = localStorage.getItem('username');
        const authToken = localStorage.getItem('authToken');

        if (!username || !authToken) {
            alert('Authentication required. Please login again.');
            return;
        }

        const formData = new FormData();
        formData.append('name', newProduct.name.trim());
        formData.append('description', newProduct.description?.trim() || '');
        formData.append('price', newProduct.price);
        formData.append('quantity', newProduct.quantity);
        if (newProduct.image) {
            formData.append('image', newProduct.image);
        }

        try {
            const response = await axios.post(`${urls.API_BASE_URL}/vendor/addProducts?username=${username}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${authToken}`
                },
            });
            
            if (response.data) {
                setProducts([...products, response.data]);
                setNewProduct({ name: '', description: '', price: 0, quantity: 0, image: null });
                setShowOrderSuccess(true);
            }
        } catch (error) {
            console.error('Error adding product:', error);
            const errorMessage = error.response?.data?.message || 'Failed to add product';
            alert(errorMessage);
        }
    };

    const handleHomeNavigation = () => {
        router.push('/');
    };

    return (
        <div className={styles.container}>
            <h1>Vendor Management</h1>
            <button onClick={handleHomeNavigation}>Home</button>
            <section className={styles.addProductSection}>
                <h2>Add New Product</h2>
                <input
                    type="text"
                    placeholder="Product Name"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                />
                <textarea
                    placeholder="Product Description"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                />
                <input
                    type="number"
                    placeholder="Price"
                    value={newProduct.price || ''}
                    onChange={(e) => {
                        const value = parseFloat(e.target.value);
                        setNewProduct({ ...newProduct, price: isNaN(value) ? 0 : value });
                    }}
                    min="0"
                    step="0.01"
                />
                <input
                    type="number"
                    placeholder="Quantity"
                    value={newProduct.quantity || ''}
                    onChange={(e) => {
                        const value = parseInt(e.target.value);
                        setNewProduct({ ...newProduct, quantity: isNaN(value) ? 0 : Math.max(0, value) });
                    }}
                    min="0"
                />
                <input
                    type="file"
                    onChange={(e) => setNewProduct({ ...newProduct, image: e.target.files[0] })}
                />
                <button onClick={handleAddProduct}>Add Product</button>
            </section>
            {isLoggedIn && (
                <>
                    <section className={styles.listedProductsSection}>
                        <h2>Listed Products</h2>
                        <ul className={styles.productList}>
                            {products.map((product) => (
                                <li key={product._id} className={styles.productItem}>
                                    {product.name} - Quantity: {product.quantity}
                                </li>
                            ))}
                        </ul>
                    </section>
                    <section className={styles.ordersSection}>
                        <h2>Received Orders</h2>
                        <ul className={styles.orderList}>
                            {orders.map((order) => (
                                <li key={order._id} className={styles.orderCard}>
                                    {order.imageUrl && (
                                        <img 
                                            src={`${urls.API_BASE_URL}/images/${order.imageUrl}`} 
                                            alt={order.productName || 'Product'} 
                                            className={styles.productImage} 
                                        />
                                    )}
                                    <div>
                                        <h3>{order.productName || 'Unknown Product'}</h3>
                                        <p>Order ID: {order._id}</p>
                                        <p>Quantity: {order.quantity || 0}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </section>
                </>
            )}
            {showLoginPrompt && (
                <LoginPromptModal
                    onClose={() => setShowLoginPrompt(false)}
                    onLogin={() => router.push('/login')}
                />
            )}
            {showOrderSuccess && (
                <OrderSuccessModal onClose={() => setShowOrderSuccess(false)} />
            )}
        </div>
    );
};

export default function App() {
    return (
        <Layout>
            <Page />
        </Layout>
    );
}