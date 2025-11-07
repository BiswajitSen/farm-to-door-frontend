import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './LoginForm.module.css';
import { useRouter } from 'next/navigation';
import Loader from '@/app/components/Loader/Loader';

const LoginForm = ({ onLogin }) => {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignupRedirect = (e) => {
        e.preventDefault();
        router.push('/signup');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onLogin({ username, password });
    };

    return (
        <form onSubmit={handleSubmit} className={styles.loginForm}>
            <div className={styles.formGroup}>
                <label htmlFor="username">Username:</label>
                <input
                    type="username"
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
            <button type="submit" className={styles.submitButton} disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
            </button>
            {loading && <Loader />}
            <button onClick={handleSignupRedirect} className={styles.signupButton}>
                Signup
            </button>
        </form>
    );
};

LoginForm.propTypes = {
    onLogin: PropTypes.func.isRequired,
};

export default LoginForm;