"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppProvider, useAppContext } from './context';
import { useFetchProducts, useHandleOrderSubmit } from './hooks';
import ProductList from './components/ProductList/ProductList';
import OrderForm from './components/OrderForm/OrderForm';
import OrderDetailsModal from './components/OrderDetailsModal/OrderDetailsModal';
import Layout from "@/app/components/Layout/layout";
import LogoutButton from "@/app/components/LogoutButton/LogoutButton";
import Loader from "@/app/components/Loader/Loader";
import LoginPromptModal from './components/LoginPromptModal/LoginPromptModal';
import styles from './components/Layout/Layout.module.css';
import axios from 'axios';
import urls from "@/env";

const HomePage = () => {
    useFetchProducts();
    const handleOrderSubmit = useHandleOrderSubmit();
    const {
        loading,
        error,
        products,
        setProducts,
        address,
        setAddress,
        setError,
    } = useAppContext();
    const [cart, setCart] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isBlinking, setIsBlinking] = useState(false);
    const [orderPlacedSuccessfully, setOrderPlacedSuccessfully] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);
    const [loadingOrder, setLoadingOrder] = useState(false);
    const [orderDetails, setOrderDetails] = useState(null);
    const router = useRouter();

    useEffect(() => {
        try {
            const token = localStorage.getItem('authToken');
            setIsLoggedIn(!!token);
            if (token) {
                const savedCartStr = localStorage.getItem('cart');
                if (savedCartStr) {
                    try {
                        const savedCart = JSON.parse(savedCartStr);
                        setCart(savedCart);
                    } catch (parseError) {
                        console.error('Error parsing saved cart:', parseError);
                        localStorage.removeItem('cart');
                    }
                }
            }
        } catch (error) {
            console.error('Error accessing localStorage:', error);
        }
    }, []);

    const handleAddOne = (productId) => {
        setCart(prevCart => {
            const newCart = {
                ...prevCart,
                [productId]: (prevCart[productId] || 0) + 1
            };
            // Persist cart to localStorage if logged in
            if (isLoggedIn) {
                try {
                    localStorage.setItem('cart', JSON.stringify(newCart));
                } catch (error) {
                    console.error('Error saving cart to localStorage:', error);
                }
            }
            return newCart;
        });
        setIsBlinking(true);
    };

    const handleRemoveOne = (productId) => {
        setCart(prevCart => {
            const newCart = { ...prevCart };
            if (newCart[productId] > 1) {
                newCart[productId] -= 1;
            } else {
                delete newCart[productId];
            }
            // Persist cart to localStorage if logged in
            if (isLoggedIn) {
                try {
                    localStorage.setItem('cart', JSON.stringify(newCart));
                } catch (error) {
                    console.error('Error saving cart to localStorage:', error);
                }
            }
            return newCart;
        });
    };

    useEffect(() => {
        if (isBlinking) {
            const timer = setTimeout(() => setIsBlinking(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [isBlinking]);

    const handleOpenModal = () => {
        if (!isLoggedIn) {
            try {
                localStorage.setItem('cart', JSON.stringify(cart));
            } catch (error) {
                console.error('Error saving cart to localStorage:', error);
            }
            setShowLoginPrompt(true);
        } else {
            setIsModalOpen(true);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleOrderSubmitWithPrompt = async (orderReq) => {
        try {
            const authToken = localStorage.getItem('authToken');
            const updatedOrderReq = {
                ...orderReq,
                products: orderReq.products.map(product => {
                    const productDetails = products.find(p => p._id === product.productId);
                    if (!productDetails) {
                        throw new Error(`Product ${product.productId} not found`);
                    }
                    return {
                        ...product,
                        imageUrl: productDetails.imageUrl,
                        productName: productDetails.name
                    };
                })
            };
            
            await handleOrderSubmit(updatedOrderReq);
            setOrderPlacedSuccessfully(true);
            setCart({});
            
            // Clear cart from localStorage
            try {
                localStorage.removeItem('cart');
            } catch (error) {
                console.error('Error clearing cart from localStorage:', error);
            }

            // Fetch updated product data
            try {
                const response = await axios.get(`${urls.API_BASE_URL}/products`, {
                    headers: {
                        'Authorization': `Bearer ${authToken}`
                    }
                });
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching updated product data:', error);
            }

            // Auto-close modal after showing success message
            setTimeout(() => {
                setOrderPlacedSuccessfully(false);
                handleCloseModal();
            }, 3000);
        } catch (error) {
            console.error('Error submitting order:', error);
            setError(error.message || 'Failed to submit order');
        }
    };

    const handleLogout = () => {
        try {
            localStorage.removeItem('authToken');
            localStorage.removeItem('username');
            localStorage.removeItem('cart');
            setIsLoggedIn(false);
            setCart({});
            router.push('/');
        } catch (error) {
            console.error('Error during logout:', error);
            // Still proceed with logout even if localStorage fails
            setIsLoggedIn(false);
            setCart({});
            router.push('/');
        }
    };

    const handleLoginRedirect = () => {
        router.push('/login');
    };

    const handleSignupRedirect = () => {
        router.push('/signup');
    };

    const handleVendorRedirect = () => {
        router.push('/vendor');
    };

    const handleFetchOrderDetails = async () => {
        if (!isLoggedIn) {
            try {
                localStorage.setItem('cart', JSON.stringify(cart));
            } catch (error) {
                console.error('Error saving cart to localStorage:', error);
            }
            setShowLoginPrompt(true);
            return;
        }

        setLoadingOrder(true);
        const authToken = localStorage.getItem('authToken');
        const username = localStorage.getItem('username');

        if (!authToken || !username) {
            setError('Authentication required. Please login again.');
            setLoadingOrder(false);
            return;
        }

        try {
            const response = await axios.get(`${urls.API_BASE_URL}/orders`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                },
                params: {
                    username: username
                }
            });
            setOrderDetails(response.data);
            setError(null);
        } catch (error) {
            console.error('Error fetching order details:', error);
            const errorMessage = error.response?.data?.message || 'Failed to fetch order details';
            setError(errorMessage);
            setOrderDetails(null);
        } finally {
            setLoadingOrder(false);
        }
    };

    const handleCloseOrderDetails = () => {
        setOrderDetails(null);
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>Rural Delivery</h1>
                <div className={styles.headerButtons}>
                    {isLoggedIn ? (
                        <LogoutButton onLogout={handleLogout} />
                    ) : (
                        <>
                            <button onClick={handleSignupRedirect} className={styles.signupButton}>
                                Signup
                            </button>
                            <button onClick={handleLoginRedirect} className={styles.loginButton}>
                                Login
                            </button>
                        </>
                    )}
                    <button
                        className={`${styles.cartButton} ${isBlinking ? styles.blink : ''}`}
                        onClick={handleOpenModal}
                    >
                        Cart ({Object.values(cart).reduce((a, b) => a + b, 0)})
                    </button>
                    <button
                        className={styles.orderButton}
                        onClick={handleFetchOrderDetails}
                        disabled={loadingOrder}
                    >
                        Fetch Order Details
                    </button>
                </div>
            </header>


            {showLoginPrompt && (
                <LoginPromptModal
                    onClose={() => setShowLoginPrompt(false)}
                    onLogin={handleLoginRedirect}
                />
            )}

            <div>
                {loading ? (
                    <p>Loading products...</p>
                ) : error ? (
                    <p style={{ color: 'red' }}>{error}</p>
                ) : (
                    <>
                        <h2>Available Products</h2>
                        <ProductList
                            products={products}
                            cart={cart}
                            onAddOne={handleAddOne}
                            onRemoveOne={handleRemoveOne}
                        />
                    </>
                )}
            </div>
            {isModalOpen && (
                <OrderForm
                    address={address}
                    setAddress={setAddress}
                    onSubmit={handleOrderSubmitWithPrompt}
                    onClose={handleCloseModal}
                    selectedProducts={products.filter(product => cart[product._id])}
                    cart={cart}
                    orderPlacedSuccessfully={orderPlacedSuccessfully}
                    setError={setError}
                />
            )}
            {loadingOrder && <Loader />} {/* Show Loader when loading order */}
            {orderDetails && (
                <OrderDetailsModal
                    orderDetails={orderDetails}
                    onClose={handleCloseOrderDetails}
                />
            )}

            <section className={styles.vendorSection}>
                <h2>Want to host your products?</h2>
                <button
                    className={styles.vendorButton}
                    onClick={handleVendorRedirect}
                >
                    Click here
                </button>
            </section>

            <footer className={styles.footer}>
                <p>&copy; 2024 Rural Delivery</p>
            </footer>
        </div>
    );
};

export default function App() {
    return (
        <Layout>
            <HomePage />
        </Layout>
    );
}