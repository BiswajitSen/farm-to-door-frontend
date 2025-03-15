import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './AuthForm.module.css';
import { useRouter } from 'next/navigation';
import Loader from '@/app/components/Loader/Loader';

const LoginForm = ({ onLogin }) => {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleHomeRedirect = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            router.push('/');
        }, 2000);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onLogin({ username, password });
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <a className={styles.login}>Login</a>
                <div className={styles.inputBox}>
                    <input
                        type="text"
                        required="required"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <span>Username</span>
                </div>

                <div className={styles.inputBox}>
                    <input
                        type="password"
                        required="required"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <span>Password</span>
                </div>

                <div className={styles.buttonContainer}>
                    <button className={styles.enter} onClick={handleSubmit}>
                        Login
                    </button>
                    <button className={styles.home} onClick={handleHomeRedirect}>
                        Home
                    </button>
                </div>
                {loading && <Loader />}
            </div>
        </div>
    );
};

LoginForm.propTypes = {
    onSignup: PropTypes.func.isRequired,
};

export default LoginForm;