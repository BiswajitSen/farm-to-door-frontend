"use client";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faUserPlus, faSignInAlt, faShoppingCart, faClipboardList } from '@fortawesome/free-solid-svg-icons';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppProvider, useAppContext } from './context';
import { useFetchProducts, useHandleOrderSubmit } from './hooks';
import ProductList from './components/ProductList/ProductList';
import OrderForm from './components/OrderForm/OrderForm';
import OrderDetailsModal from './components/OrderDetailsModal/OrderDetailsModal';
import Layout from "@/app/layout.js";
import LogoutButton from "@/app/components/LogoutButton/LogoutButton";
import Loader from "@/app/components/Loader/Loader";
import styles from './Layout.module.css';
import axios from 'axios';
import urls from "@/env";
import DualAnswerModal from "@/app/components/DualAnsModal/DualAnswerModal.js";

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
    const [loadingState, setLoadingState] = useState({
        login: false,
        logout: false,
        signup: false,
        order: false,
        vendor: false
    });
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);
    const [orderDetails, setOrderDetails] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        const storedUserName = localStorage.getItem('username');
        setIsLoggedIn(!!token);
        if (token) {
            const savedCart = JSON.parse(localStorage.getItem('cart')) || {};
            setCart(savedCart);
        }
    }, []);

    const handleAddOne = (productId) => {
        setCart(prevCart => ({
            ...prevCart,
            [productId]: (prevCart[productId] || 0) + 1
        }));
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
            localStorage.setItem('cart', JSON.stringify(cart));
            setShowLoginPrompt(true);
        } else {
            setIsModalOpen(true);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleOrderSubmitWithPrompt = async (orderReq, setError) => {
        const authToken = localStorage.getItem('authToken');
        const updatedOrderReq = {
            ...orderReq,
            products: orderReq.products.map(product => {
                const productDetails = products.find(p => p._id === product.productId);
                return {
                    ...product,
                    imageUrl: productDetails.imageUrl,
                    productName: productDetails.name
                };
            })
        };
        if(await handleOrderSubmit(updatedOrderReq)) {
            setOrderPlacedSuccessfully(true);
            setCart({});
        } else {
            setError('Failed to place order');
        }
        setTimeout(() => {
            setOrderPlacedSuccessfully(false);
            handleCloseModal();
        }, 2500);

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
    };

    const handleLogout = () => {
        setLoadingState(prevState => ({ ...prevState, logout: true }));
        setTimeout(() => {
            localStorage.removeItem('authToken');
            localStorage.removeItem('username');
            localStorage.removeItem('cart');
            setIsLoggedIn(false);
            setLoadingState(prevState => ({ ...prevState, logout: false }));
            router.push('/');
        }, 3000);
    };

    const handleLoginRedirect = () => {
        setLoadingState(prevState => ({ ...prevState, login: true }));
        setTimeout(() => {
            setLoadingState(prevState => ({ ...prevState, login: false }));
            router.push('/login');
        }, 3000);
    };

    const handleSignupRedirect = () => {
        setLoadingState(prevState => ({ ...prevState, signup: true }));
        setTimeout(() => {
            setLoadingState(prevState => ({ ...prevState, signup: false }));
            router.push('/signup');
        }, 3000);
    };

    const handleVendorRedirect = () => {
        setLoadingState(prevState => ({ ...prevState, vendor: true }));
        setTimeout(() => {
            setLoadingState(prevState => ({ ...prevState, vendor: false }));
            router.push('/vendor');
        }, 2000);
    };

    const handleFetchOrderDetails = async () => {
        if (!isLoggedIn) {
            localStorage.setItem('cart', JSON.stringify(cart));
            setShowLoginPrompt(true);
            return;
        }

        setLoadingState(prevState => ({ ...prevState, order: true }));
        const authToken = localStorage.getItem('authToken');
        const username = localStorage.getItem('username');

        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            const response = await axios.get(`${urls.API_BASE_URL}/orders`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                },
                params: {
                    username: username
                }
            });
            setOrderDetails(response.data);
        } catch (error) {
            console.error('Error fetching order details:', error);
            setError('Failed to fetch order details');
        } finally {
            setLoadingState(prevState => ({ ...prevState, order: false }));
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
                            <button onClick={handleSignupRedirect} className={styles.button}>
                                <FontAwesomeIcon icon={faUserPlus} />
                            </button>
                            <button onClick={handleLoginRedirect} className={styles.button}>
                                <FontAwesomeIcon icon={faSignInAlt} />
                            </button>
                        </>
                    )}
                    <button
                        className={`${styles.button} ${isBlinking ? styles.blink : ''}`}
                        onClick={handleOpenModal}
                    >
                        <FontAwesomeIcon icon={faShoppingCart} />
                    </button>
                    <button
                        className={styles.button}
                        onClick={handleFetchOrderDetails}
                        disabled={loadingState.order}
                    >
                        <FontAwesomeIcon icon={faClipboardList} />
                    </button>
                </div>
            </header>

            {(loadingState.login || loadingState.logout || loadingState.signup || loadingState.vendor) && <Loader />}

            {showLoginPrompt && (
                <DualAnswerModal
                    message={"Please login to place an order."}
                    onCancel={() => setShowLoginPrompt(false)}
                    onConfirm={() => {
                        setShowLoginPrompt(false);
                        handleLoginRedirect();
                    }}
                    buttonText={{confirm: "Login"}}
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
                    setAddress={setAddress}
                    onSubmit={handleOrderSubmitWithPrompt}
                    onClose={handleCloseModal}
                    selectedProducts={products.filter(product => cart[product._id])}
                    cart={cart}
                    orderPlacedSuccessfully={orderPlacedSuccessfully}
                    setError={setError}
                />
            )}
            {loadingState.order && <Loader />} {/* Show Loader when loading order */}
            {orderDetails && (
                <OrderDetailsModal
                    orderDetails={orderDetails}
                    onClose={handleCloseOrderDetails}
                />
            )}

            <section className={styles.vendorSection}>
                <h2>Become a Vendor and Showcase Your Products!</h2>
                <p>Join our platform to reach a wider audience and grow your business.</p>
                <button
                    className={styles.vendorButton}
                    onClick={handleVendorRedirect}
                >
                    <FontAwesomeIcon icon={faArrowRight} />
                </button>
            </section>

            <footer className={styles.footer}>
                <p>&copy; 2024 Rural Delivery</p>
            </footer>
        </div>
    );
};

const App = () => (
    <AppProvider>
        <Layout>
            <HomePage />
        </Layout>
    </AppProvider>
);

export default App;