"use client";

import React, { useState } from 'react';
import { AppProvider, useAppContext } from './context';
import { useFetchProducts, useHandleOrderSubmit } from './hooks';
import ProductList from './ProductList';
import OrderForm from './OrderForm';
import Layout from "@/app/layout";
import styles from './Layout.module.css';

const HomePage = () => {
    useFetchProducts();
    const handleOrderSubmit = useHandleOrderSubmit();
    const {
        loading,
        error,
        success,
        products,
        selectedProducts,
        setSelectedProducts,
        address,
        setAddress
    } = useAppContext();

    const handleSelectProduct = (productId) => {
        setSelectedProducts(prevSelected =>
            prevSelected.includes(productId)
                ? prevSelected.filter(id => id !== productId)
                : [...prevSelected, productId]
        );
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>Rural Delivery</h1>
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
                            selectedProducts={selectedProducts}
                            onSelectProduct={handleSelectProduct}
                        />
                        {selectedProducts.length > 0 && (
                            <OrderForm
                                address={address}
                                setAddress={setAddress}
                                onSubmit={handleOrderSubmit}
                            />
                        )}
                        {success && <p style={{ color: 'green' }}>{success}</p>}
                    </>
                )}
            </div>
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