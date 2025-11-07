import React, { createContext, useContext, useState, useMemo } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [address, setAddress] = useState('');

    const contextValue = useMemo(() => ({
        products,
        setProducts,
        loading,
        setLoading,
        error,
        setError,
        success,
        setSuccess,
        selectedProducts,
        setSelectedProducts,
        address,
        setAddress
    }), [products, loading, error, success, selectedProducts, address]);

    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};