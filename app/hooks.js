import { useEffect } from 'react';
import axios from 'axios';
import { useAppContext } from './context';
import urls from "@/env";

export const useFetchProducts = () => {
    const { setProducts, setLoading, setError } = useAppContext();

    useEffect(() => {
        axios.get(`${urls.API_BASE_URL}/products`)
            .then(response => {
                setProducts(response.data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching products:', err);
                setError('Failed to fetch products');
                setLoading(false);
            });
    }, [setProducts, setLoading, setError]);
};

export const useHandleOrderSubmit = () => {
    const { setError } = useAppContext();

    const handleOrderSubmit = async (orderReq) => {
        if (!orderReq.address) {
            setError('Address is required');
            return;
        }

        const authToken = localStorage.getItem('authToken');
        const username = localStorage.getItem('username');

        try {
            const response = await axios.post(`${urls.API_BASE_URL}/orders`, {
                productIds: orderReq.products.map(product => ({
                    productId: product.productId,
                    productName: product.productName,
                    imageUrl: product.imageUrl,
                    quantity: product.quantity,
                    boughtFrom: product.boughtFrom
                })),
                deliveryAddress: orderReq.address,
                username: username
            }, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            if(response.status === 201) {
                return Promise.resolve(true);
            } else {
                return Promise.resolve(false);
            }
        } catch (err) {
            console.error('Error placing order:', err);
            return new Promise.resolve(false);
        }
    };

    return handleOrderSubmit;
};