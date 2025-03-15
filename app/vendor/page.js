"use client";
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {useRouter} from 'next/navigation';
import styles from './VendorManagement.module.css';
import {AppProvider} from "@/app/context.js";
import Layout from "@/app/layout.js";
import urls from "@/env";
import DualAnswerModal from "@/app/components/DualAnsModal/DualAnswerModal.js";
import Modal from "@/app/components/Modal/Modal.js";

const Page = () => {
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [newProduct, setNewProduct] = useState({name: '', description: '', price: null, quantity: null, image: null});
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);
    const [showOrderSuccess, setShowOrderSuccess] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const [orderStatus, setOrderStatus] = useState({});
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        setIsLoggedIn(!!token);
        if (token) {
            fetchVendorData().then();
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

            setProducts(productsResponse.data);
            setOrders(ordersResponse.data);
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

        setIsButtonDisabled(true);
        setTimeout(() => setIsButtonDisabled(false), 5000); // Disable button for 5 seconds

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
            setNewProduct({name: '', description: '', price: 0, quantity: 0, image: null});
            setShowOrderSuccess(true);
        } catch (error) {
            console.error('Error adding product:', error);
        }
    };

    const handleDeleteClick = (productId) => {
        setProductToDelete(productId);
        setShowDeleteConfirm(true);
    };

    const handleDeleteConfirm = async () => {
        const username = localStorage.getItem('username');
        const authToken = localStorage.getItem('authToken');

        try {
            await axios.delete(`${urls.API_BASE_URL}/vendor/products/${productToDelete}?username=${username}`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            setProducts(products.filter(product => product._id !== productToDelete));
            setShowDeleteConfirm(false);
            setProductToDelete(null);
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    const handleDeleteCancel = () => {
        setShowDeleteConfirm(false);
        setProductToDelete(null);
    };

    const handleHomeNavigation = () => {
        router.push('/');
    };

    const handleStatusChange = (orderId, newStatus) => {
        setOrderStatus(prevStatus => ({
            ...prevStatus,
            [orderId]: newStatus
        }));
    };

    const updateOrderStatus = async (orderId) => {
        const authToken = localStorage.getItem('authToken');
        const newStatus = orderStatus[orderId];

        try {
            const username = localStorage.getItem('username');
            await axios.put(`${urls.API_BASE_URL}/vendor/orders/${orderId}/status`,
                {
                    status: newStatus,
                    username: username
                },
                {
                    headers: {
                        'Authorization': `Bearer ${authToken}`
                    }
                }
            );
            await fetchVendorData();
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };

    return (
        <div className={styles.container}>
            <div>
                <h1>Vendor Management</h1>
                <button className={styles.homeButton} onClick={handleHomeNavigation}>Home</button>
            </div>
            <section className={styles.addProductSection}>
                <h2>Add New Product</h2>
                <input
                    type="text"
                    placeholder="Product Name"
                    value={newProduct.name || ''}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                />
                <textarea
                    placeholder="Product Description"
                    value={newProduct.description || ''}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                />
                <input
                    type="number"
                    placeholder="Price"
                    value={newProduct.price || ''}
                    onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
                />
                <input
                    type="number"
                    placeholder="Quantity"
                    value={newProduct.quantity || ''}
                    onChange={(e) => setNewProduct({ ...newProduct, quantity: parseInt(e.target.value) })}
                />
                <input
                    type="file"
                    onChange={(e) => setNewProduct({ ...newProduct, image: e.target.files[0] })}
                />
                <button onClick={handleAddProduct} disabled={isButtonDisabled}>Add Product</button>
            </section>
            {isLoggedIn && (
                <>
                    <section className={styles.listedProductsSection}>
                        <h2>Listed Products</h2>
                        <ul className={styles.productList}>
                            {products.map((product) => (
                                <li key={product._id} className={styles.productItem}>
                                    {product.name} - Quantity: {product.quantity}
                                    <button onClick={() => handleDeleteClick(product._id)}>Delete</button>
                                </li>
                            ))}
                        </ul>
                    </section>
                    <section className={styles.ordersSection}>
                        <h2>Received Orders</h2>
                        <ul className={styles.orderList}>
                            {orders.map((order) => (
                                <li key={order._id} className={styles.orderCard}>
                                    <img src={`${urls.API_BASE_URL}/images/${order.imageUrl}`} alt={order.productName}
                                         className={styles.productImage}/>
                                    <div>
                                        <h3>{order.productName}</h3>
                                        <p>Order ID: {order._id}</p>
                                        <p>Quantity: {order.quantity}</p>
                                        <select
                                            value={orderStatus[order._id] || order.status}
                                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Processing">Processing</option>
                                            <option value="Shipped">Shipped</option>
                                            <option value="Delivered">Delivered</option>
                                        </select>
                                        <button onClick={() => updateOrderStatus(order._id)}>Update Status</button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </section>
                </>
            )}
            {showLoginPrompt && (
                <DualAnswerModal
                    message={"Please login to place an order."}
                    onCancel={() => setShowLoginPrompt(false)}
                    onConfirm={() => {
                        setShowLoginPrompt(false);
                        router.push('/login');
                    }}
                    buttonText={{confirm: "Login"}}
                />
            )}
            {showOrderSuccess && (
                <Modal
                    message={"Order placed successfully!"}
                    onClose={() => setShowOrderSuccess(false)}/>
            )}
            {showDeleteConfirm && (
                <DualAnswerModal
                    message="Are you sure you want to delete this product?"
                    onConfirm={handleDeleteConfirm}
                    onCancel={handleDeleteCancel}
                />
            )}
        </div>
    );
};

const App = () => (
    <AppProvider>
        <Layout>
            <Page/>
        </Layout>
    </AppProvider>
);

export default App;