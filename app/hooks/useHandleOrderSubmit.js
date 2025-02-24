import { useState } from 'react';
import { useAppContext } from '../context';

export const useHandleOrderSubmit = () => {
    const { selectedProducts, address, setSuccess, setError } = useAppContext();
    const [loading, setLoading] = useState(false);

    const handleOrderSubmit = async () => {
        if (!address) {
            setError('Address is required');
            return;
        }

        if (selectedProducts.length === 0 && typeof selectedProducts !== 'string') {
            setError('At least one product must be selected');
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ productIds: selectedProducts, address }),
            });

            if (!response.ok) {
                throw new Error('Failed to place order');
            }

            setSuccess('Order placed successfully');
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return { handleOrderSubmit, loading };
};