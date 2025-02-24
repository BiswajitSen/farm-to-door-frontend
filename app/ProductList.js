import React from 'react';
import PropTypes from 'prop-types';
import styles from './ProductList.module.css';

const ProductList = ({ products, selectedProducts, onSelectProduct }) => (
    <ul className={styles.productList}>
        {products.map(product => (
            <li key={product._id} className={styles.productItem}>
                {product.name} - {product.price} USD
                <button
                    onClick={() => onSelectProduct(product._id)}
                    style={{ backgroundColor: selectedProducts.includes(product._id) ? 'lightgreen' : 'white' }}
                >
                    {selectedProducts.includes(product._id) ? 'Deselect' : 'Select'}
                </button>
            </li>
        ))}
    </ul>
);

ProductList.propTypes = {
    products: PropTypes.arrayOf(PropTypes.shape({
        _id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
    })).isRequired,
    selectedProducts: PropTypes.arrayOf(PropTypes.string).isRequired,
    onSelectProduct: PropTypes.func.isRequired,
};

export default ProductList;