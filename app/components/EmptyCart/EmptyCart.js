import React from "react";
import styles from "./EmptyCart.module.css";

const EmptyCart = () => (
    <div className={styles.card}>
        <p>Your cart is empty!</p>
    </div>
);

export default EmptyCart;