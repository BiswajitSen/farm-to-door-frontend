"use client";

import React, { useState, useEffect } from 'react';
import { AppProvider, useAppContext } from './context';
import { useFetchProducts, useHandleOrderSubmit } from './hooks';
import ProductList from './components/ProductList/ProductList';
import OrderForm from './components/OrderForm/OrderForm';
import Layout from "@/app/components/Layout/layout";
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
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleOrderSubmitWithPrompt = async (orderReq) => {
        await handleOrderSubmit(orderReq);
        setOrderPlacedSuccessfully(true);
        setCart({});
        setTimeout(() => {
            setOrderPlacedSuccessfully(false);
            handleCloseModal();
        }, 3000); // Show the message for 3 seconds before closing the cart
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>Rural Delivery</h1>
                <button
                    className={`${styles.cartButton} ${isBlinking ? styles.blink : ''}`}
                    onClick={handleOpenModal}
                >
                    Cart ({Object.values(cart).reduce((a, b) => a + b, 0)})
                </button>
            </header>

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