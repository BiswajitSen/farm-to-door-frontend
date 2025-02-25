import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './SignupForm.module.css';

const SignupForm = ({ onSignup }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSignup({ username, password });
    };

    return (
        <form onSubmit={handleSubmit} className={styles.signupForm}>
            <div className={styles.formGroup}>
                <label htmlFor="username">Username:</label>
                <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className={styles.inputField}
                />
            </div>
            <div className={styles.formGroup}>
                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className={styles.inputField}
                />
            </div>
            <button type="submit" className={styles.submitButton}>Signup</button>
        </form>
    );
};

SignupForm.propTypes = {
    onSignup: PropTypes.func.isRequired,
};

export default SignupForm;