"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppProvider } from '@/app/context';
import Layout from '@/app/components/Layout/layout';
import styles from './LoginPage.module.css';
import urls from '@/env';
import LoginForm from "@/app/components/LoginForm/LoginForm";
import Modal from "@/app/components/Modal/Modal";
import Loader from "@/app/components/Loader/Loader";

const LoginPage = () => {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async ({ username, password }) => {
        if (!username?.trim() || !password?.trim()) {
            setError('Username and password are required');
            return;
        }

        setLoading(true);
        setError('');
        
        try {
            const response = await fetch(`${urls.API_BASE_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    username: username.trim(), 
                    password: password.trim() 
                }),
            });

            if (response.ok) {
                const data = await response.json();
                
                if (!data.token) {
                    setError('Invalid response from server');
                    return;
                }

                try {
                    localStorage.setItem('authToken', data.token);
                    localStorage.setItem('username', username.trim());
                } catch (storageError) {
                    console.error('Error saving to localStorage:', storageError);
                    setError('Failed to save authentication data');
                    return;
                }

                const redirectAfterLogin = localStorage.getItem('redirectAfterLogin');
                if (redirectAfterLogin) {
                    localStorage.removeItem('redirectAfterLogin');
                    router.push(redirectAfterLogin);
                } else {
                    router.push('/');
                }
            } else {
                let errorMessage = 'Invalid credentials';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorMessage;
                } catch (parseError) {
                    console.error('Error parsing error response:', parseError);
                }
                setError(errorMessage);
            }
        } catch (error) {
            console.error('Login error:', error);
            setError('Network error. Please check your connection and try again.');
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

export default function App() {
    return (
        <Layout>
            <LoginPage />
        </Layout>
    );
}