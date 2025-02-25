import React from 'react';
import PropTypes from 'prop-types';
import styles from './Layout.module.css';
import urls from "@/.env";

const ProductList = ({ products, cart, onAddOne, onRemoveOne }) => {
    const handleAddToCart = (productId) => {
        const productElement = document.getElementById(`product-${productId}`);
        productElement.classList.add(styles.moving);
        setTimeout(() => {
            productElement.classList.remove(styles.moving);
            onAddOne(productId);
        }, 1000);
    };

    return (
        <div className={styles.productList}>
            {products.map(product => (
                <div
                    key={product._id}
                    id={`product-${product._id}`}
                    className={`${styles.productItem} ${cart[product._id] ? styles.selected : ''}`}
                >
                    <img
                        src={`${urls.API_BASE_URL}/images/${product.imageUrl}`}
                        alt={product.name}
                        className={styles.productImage}
                    />
                    <div className={styles.productDetails}>
                        <div className={styles.productName}>{product.name}</div>
                        <div className={styles.productPrice}>{product.price} USD</div>
                    </div>
                    {cart[product._id] ? (
                        <div className={styles.buttonGroup}>
                            <button onClick={() => onAddOne(product._id)} className={styles.addButton}>Add 1</button>
                            <button onClick={() => onRemoveOne(product._id)} className={styles.removeButton}>Remove 1</button>
                        </div>
                    ) : (
                        <button onClick={() => handleAddToCart(product._id)} className={styles.addButton}>Add to Cart</button>
                    )}
                </div>
            ))}
        </div>
    );
};

ProductList.propTypes = {
    products: PropTypes.arrayOf(PropTypes.shape({
        _id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
        imageUrl: PropTypes.string.isRequired,
    })).isRequired,
    cart: PropTypes.object.isRequired,
    onAddOne: PropTypes.func.isRequired,
    onRemoveOne: PropTypes.func.isRequired,
};

export default ProductList;