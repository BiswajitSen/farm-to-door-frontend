"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppProvider } from '@/app/context';
import Layout from '@/app/components/Layout/layout';
import styles from './LoginPage.module.css';
import urls from '@/.env';
import LoginForm from "@/app/components/LoginForm/LoginForm";
import Modal from "@/app/components/Modal/Modal";
import Loader from "@/app/components/Loader/Loader";

const LoginPage = () => {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async ({ username, password }) => {
        setLoading(true);
        const minLoadingTime = new Promise(resolve => setTimeout(resolve, 2000));
        try {
            const response = await fetch(`${urls.API_BASE_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('authToken', data.token);
                localStorage.setItem('username', username);
                await minLoadingTime;
                router.push('/');
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Invalid credentials');
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const closeModal = () => {
        setError('');
    };

    const handleSignupRedirect = () => {
        router.push('/signup');
    };

    return (
        <div className={styles.loginPage}>
            <h1 className={styles.h1}>Login</h1>
            {error && <Modal message={error} onClose={closeModal} />}
            {loading && <Loader />}
            <LoginForm onLogin={handleLogin} />
        </div>
    );
};

const App = () => (
    <AppProvider>
        <Layout>
            <LoginPage />
        </Layout>
    </AppProvider>
);

export default App;