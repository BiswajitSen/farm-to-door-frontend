"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import styles from './VendorManagement.module.css';
import { AppProvider } from "@/app/context.js";
import Layout from "@/app/components/Layout/layout.js";
import urls from "@/.env";
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

        try {
            const productsResponse = await axios.get(`${urls.API_BASE_URL}/vendor/products?username=${username}`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            const ordersResponse = await axios.get(`${urls.API_BASE_URL}/vendor/orders?username=${username}`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });

            // Include productName and imageUrl in orders
            const updatedOrders = ordersResponse.data.map(order => {
                const productDetails = productsResponse.data.find(p => p._id === order.productId);
                return {
                    ...order,
                    productName: productDetails.name,
                    imageUrl: productDetails.imageUrl
                };
            });

            setProducts(productsResponse.data);
            setOrders(updatedOrders);
        } catch (error) {
            console.error('Error fetching vendor data:', error);
        }
    };

    const handleAddProduct = async () => {
        if (!isLoggedIn) {
            localStorage.setItem('redirectAfterLogin', window.location.pathname);
            setShowLoginPrompt(true);
            return;
        }

        const username = localStorage.getItem('username');
        const authToken = localStorage.getItem('authToken');
        const formData = new FormData();
        formData.append('name', newProduct.name);
        formData.append('description', newProduct.description);
        formData.append('price', newProduct.price);
        formData.append('quantity', newProduct.quantity);
        formData.append('image', newProduct.image);

        try {
            const response = await axios.post(`${urls.API_BASE_URL}/vendor/addProducts?username=${username}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${authToken}`
                },
            });
            setProducts([...products, response.data]);
            setNewProduct({ name: '', description: '', price: 0, quantity: 0, image: null });
            setShowOrderSuccess(true);
        } catch (error) {
            console.error('Error adding product:', error);
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
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
                />
                <input
                    type="number"
                    placeholder="Quantity"
                    value={newProduct.quantity}
                    onChange={(e) => setNewProduct({ ...newProduct, quantity: parseInt(e.target.value) })}
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
                        <ul >
                            <ul className={styles.orderList}>
                                {orders.map((order) => (
                                    <li key={order._id} className={styles.orderCard}>
                                        <img src={`${urls.API_BASE_URL}/images/${order.imageUrl}`} alt={order.productName} className={styles.productImage} />
                                        <div>
                                            <h3>{order.productName}</h3>
                                            <p>Order ID: {order._id}</p>
                                            <p>Quantity: {order.quantity}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
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

const App = () => (
    <AppProvider>
        <Layout>
            <Page />
        </Layout>
    </AppProvider>
);

export default App;