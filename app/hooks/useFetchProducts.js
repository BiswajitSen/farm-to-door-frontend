// app/hooks/useFetchProducts.js
import { useEffect, useState } from 'react';
import axios from 'axios';

export const useFetchProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        axios.get('http://localhost:8080/api/products')
            .then((response) => {
                setProducts(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching products:", error);
                setError('Failed to fetch products');
                setLoading(false);
            });
    }, []);

    return { products, loading, error };
};