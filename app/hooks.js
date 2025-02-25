import { useEffect } from 'react';
import axios from 'axios';
import { useAppContext } from './context';
import urls from "@/.env";

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
    const { selectedProducts, address, setError, setSuccess } = useAppContext();

    const handleOrderSubmit = async () => {
        if (!address) {
            setError('Address is required');
            return;
        }

        try {
            console.log("DEBUG:" + selectedProducts);
            const response = await axios.post(`${urls.API_BASE_URL}/orders`, {
                productIds: selectedProducts,
                deliveryAddress: address,
            });
            console.log('Order placed:', response.data);
            setSuccess('Order placed successfully');
            setError('');
        } catch (err) {
            console.error('Error placing order:', err);
            setError('Failed to place order');
            setSuccess('');
        }
    };

    return handleOrderSubmit;
};