import { useEffect, useState } from 'react';
import axios from 'axios';
import urls from "@/.env";

export const useFetchProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        axios.get(urls.API_BASE_URL + '/products')
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