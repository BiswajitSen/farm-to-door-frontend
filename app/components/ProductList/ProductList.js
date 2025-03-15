import React, {useState} from 'react';
import PropTypes from 'prop-types';
import styles from '../../Layout.module.css';
import ImageModal from '../ImageModal/ImageModal';
import Modal from '../Modal/Modal';
import urls from "@/env";

const ProductList = ({products, cart, onAddOne, onRemoveOne}) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [modalMessage, setModalMessage] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleImageClick = ({imageUrl, name, description}) => {
        setSelectedImage({imageUrl, name, description});
    };

    const handleCloseModal = () => {
        setSelectedImage(null);
    };

    const handleAddToCart = (productId) => {
        const product = products.find(p => p._id === productId);
        if (!cart[productId] || cart[productId] < product.quantity) {
            const productElement = document.getElementById(`product-${productId}`);
            productElement.classList.add(styles.moving);
            setTimeout(() => {
                productElement.classList.remove(styles.moving);
                onAddOne(productId);
            }, 1000);
        } else {
            setModalMessage('Cannot add more than available quantity');
            setIsModalOpen(true);
        }
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
                        onClick={() => handleImageClick({
                            imageUrl: `${urls.API_BASE_URL}/images/${product.imageUrl}`,
                            name: product.name,
                            description: product.description,
                        })}
                    />
                    <div className={styles.productDetails}>
                        <div className={styles.productName}>{product.name}</div>
                        <div className={styles.productPrice}>{product.price} USD</div>
                    </div>
                    {product.quantity > 0 ? (
                        cart[product._id] ? (
                            <div className={styles.buttonGroup}>
                                <button onClick={() => handleAddToCart(product._id)} className={styles.addButton}>+
                                </button>
                                <div className={styles.quantityDisplay}>Selected: {cart[product._id]}</div>
                                <button onClick={() => onRemoveOne(product._id)} className={styles.removeButton}>-
                                </button>
                            </div>
                        ) : (
                            <div className={styles.buttonGroup}>
                                <button onClick={() => handleAddToCart(product._id)} className={styles.addButton}>Add to
                                    Cart
                                </button>
                                <div className={styles.quantityDisplay}>Available: {product.quantity}</div>
                            </div>
                        )
                    ) : (
                        <button disabled className={styles.soldOutButton}>Sold Out</button>
                    )}
                </div>
            ))}
            {selectedImage &&
                <ImageModal
                    imageUrl={selectedImage.imageUrl}
                    name={selectedImage.name}
                    description={selectedImage.description}
                    onClose={handleCloseModal}
                />
            }
            {isModalOpen && <Modal message={modalMessage} onClose={() => setIsModalOpen(false)}/>}
        </div>
    );
};

ProductList.propTypes = {
    products: PropTypes.arrayOf(PropTypes.shape({
        _id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
        imageUrl: PropTypes.string.isRequired,
        quantity: PropTypes.number.isRequired,
    })).isRequired,
    cart: PropTypes.object.isRequired,
    onAddOne: PropTypes.func.isRequired,
    onRemoveOne: PropTypes.func.isRequired,
};

export default ProductList;