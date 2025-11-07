import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './SignupForm.module.css';

const SignupForm = ({ onSignup }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        // Client-side validation
        if (!username.trim()) {
            setError('Username is required');
            return;
        }

        if (!password.trim()) {
            setError('Password is required');
            return;
        }

        if (password.trim().length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        onSignup({ username, password });
    };

    return (
        <form onSubmit={handleSubmit} className={styles.signupForm}>
            {error && <div className={styles.errorMessage} role="alert">{error}</div>}
            <div className={styles.formGroup}>
                <label htmlFor="username">Username:</label>
                <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => {
                        setUsername(e.target.value);
                        setError(''); // Clear error when user starts typing
                    }}
                    required
                    className={styles.inputField}
                    aria-invalid={error && !username.trim()}
                />
            </div>
            <div className={styles.formGroup}>
                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value);
                        setError(''); // Clear error when user starts typing
                    }}
                    required
                    minLength={6}
                    className={styles.inputField}
                    aria-invalid={error && (!password.trim() || password.trim().length < 6)}
                    aria-describedby={error ? 'password-error' : undefined}
                />
                {password && password.length < 6 && (
                    <span id="password-error" className={styles.helpText}>
                        Password must be at least 6 characters
                    </span>
                )}
            </div>
            <button type="submit" className={styles.submitButton}>Signup</button>
        </form>
    );
};

SignupForm.propTypes = {
    onSignup: PropTypes.func.isRequired,
};

export default SignupForm;