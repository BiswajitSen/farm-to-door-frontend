"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppProvider, useAppContext } from './context';
import { useFetchProducts, useHandleOrderSubmit } from './hooks';
import ProductList from './components/ProductList/ProductList';
import OrderForm from './components/OrderForm/OrderForm';
import Layout from "@/app/components/Layout/layout";
import LogoutButton from "@/app/components/LogoutButton/LogoutButton";
import Loader from "@/app/components/Loader/Loader";
import LoginPromptModal from './components/LoginPromptModal/LoginPromptModal';
import styles from './components/Layout/Layout.module.css';

const HomePage = () => {
    useFetchProducts();
    const handleOrderSubmit = useHandleOrderSubmit();
    const {
        loading,
        error,
        success,
        products,
        address,
        setAddress,
        setError,
    } = useAppContext();
    const [cart, setCart] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isBlinking, setIsBlinking] = useState(false);
    const [orderPlacedSuccessfully, setOrderPlacedSuccessfully] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loadingLogin, setLoadingLogin] = useState(false);
    const [loadingLogout, setLoadingLogout] = useState(false);
    const [loadingSignup, setLoadingSignup] = useState(false);
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);
    const [userName, setUserName] = useState('');
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        const storedUserName = localStorage.getItem('userName');
        setIsLoggedIn(!!token);
        setUserName(storedUserName || '');
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

    const handleOrderSubmitWithPrompt = async (orderReq) => {
        const authToken = localStorage.getItem('authToken');
        const orderWithUser = { ...orderReq, userName, authToken };
        await handleOrderSubmit(orderWithUser);
        setOrderPlacedSuccessfully(true);
        setCart({});
        setTimeout(() => {
            setOrderPlacedSuccessfully(false);
            handleCloseModal();
        }, 3000);
    };

    const handleLogout = () => {
        setLoadingLogout(true);
        setTimeout(() => {
            localStorage.removeItem('authToken');
            localStorage.removeItem('userName');
            setIsLoggedIn(false);
            setLoadingLogout(false);
            router.push('/');
        }, 3000);
    };

    const handleLoginRedirect = () => {
        setLoadingLogin(true);
        setTimeout(() => {
            setLoadingLogin(false);
            router.push('/login');
        }, 3000);
    };

    const handleSignupRedirect = () => {
        setLoadingSignup(true);
        setTimeout(() => {
            setLoadingSignup(false);
            router.push('/signup');
        }, 3000);
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
                </div>
            </header>

            {(loadingLogin || loadingLogout || loadingSignup) && <Loader />}

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