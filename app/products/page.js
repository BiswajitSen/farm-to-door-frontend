import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useFetchProducts } from '../hooks/useFetchProducts';
import { useHandleOrderSubmit } from '../hooks/useHandleOrderSubmit';
import styles from './ProductsPage.module.css';

export default function ProductsPage() {
    const { products, loading, error } = useFetchProducts();
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [address, setAddress] = useState('');
    const { handleOrderSubmit, success, orderError } = useHandleOrderSubmit(selectedProduct, address);

    const handleSelectProduct = (productId) => {
        setSelectedProducts(prevSelected =>
            prevSelected.includes(productId)
                ? prevSelected.filter(id => id !== productId)
                : [...prevSelected, productId]
        );
    };

    return (
        <div className={styles.productsPage}>
            <div>
                <h2>Available Products</h2>
                {loading ? (
                    <p>Loading products...</p>
                ) : error ? (
                    <p className={styles.error}>{error}</p>
                ) : (
                    <ul className={styles.productList}>
                        {products.map((product) => (
                            <li key={product._id} className={styles.productItem}>
                                {product.name} - ${product.price}
                                <button onClick={() => handleSelectProduct(product._id)}>Select</button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {selectedProduct && (
                <div className={styles.orderForm}>
                    <h3>Enter Delivery Address</h3>
                    <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Enter your delivery address"
                        className={styles.input}
                    />
                    <button onClick={handleOrderSubmit} className={styles.button}>Place Order</button>
                    {orderError && <p className={styles.error}>{orderError}</p>}
                    {success && <p className={styles.success}>{success}</p>}
                </div>
            )}
        </div>
    );
}

ProductsPage.propTypes = {
    params: PropTypes.shape({
        orderId: PropTypes.string,
    }),
};