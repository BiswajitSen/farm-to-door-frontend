import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [address, setAddress] = useState('');

    return (
        <AppContext.Provider value={{
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
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);