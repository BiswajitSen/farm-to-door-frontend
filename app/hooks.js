import { useEffect } from 'react';
import axios from 'axios';
import { useAppContext } from './context';

export const useFetchProducts = () => {
    const { setProducts, setLoading, setError } = useAppContext();

    useEffect(() => {
        axios.get('http://localhost:8080/api/products')
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
            const response = await axios.post('http://localhost:8080/api/orders', {
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