import { useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAppContext } from './context';
import urls from "@/env";

export const useFetchProducts = () => {
    const { setProducts, setLoading, setError } = useAppContext();

    useEffect(() => {
        let isMounted = true;

        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${urls.API_BASE_URL}/products`);
                
                if (isMounted) {
                    setProducts(response.data);
                    setLoading(false);
                    setError(null);
                }
            } catch (err) {
                console.error('Error fetching products:', err);
                if (isMounted) {
                    setError(err.response?.data?.message || 'Failed to fetch products');
                    setLoading(false);
                }
            }
        };

        fetchProducts();

        return () => {
            isMounted = false;
        };
    }, [setProducts, setLoading, setError]);
};

export const useHandleOrderSubmit = () => {
    const { setError, setSuccess } = useAppContext();

    const handleOrderSubmit = useCallback(async (orderReq) => {
        if (!orderReq?.address?.trim()) {
            setError('Address is required');
            return;
        }

        if (!orderReq?.products || orderReq.products.length === 0) {
            setError('At least one product must be selected');
            return;
        }

        const authToken = localStorage.getItem('authToken');
        const username = localStorage.getItem('username');

        if (!authToken || !username) {
            setError('Authentication required. Please login again.');
            return;
        }

        try {
            const response = await axios.post(`${urls.API_BASE_URL}/orders`, {
                productIds: orderReq.products.map(product => ({
                    productId: product.productId,
                    productName: product.productName,
                    imageUrl: product.imageUrl,
                    quantity: product.quantity,
                    boughtFrom: product.boughtFrom
                })),
                deliveryAddress: orderReq.address.trim(),
                username: username
            }, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            
            setSuccess('Order placed successfully');
            setError(null);
            return response.data;
        } catch (err) {
            console.error('Error placing order:', err);
            const errorMessage = err.response?.data?.message || 'Failed to place order';
            setError(errorMessage);
            setSuccess(null);
            throw err;
        }
    }, [setError, setSuccess]);

    return handleOrderSubmit;
};