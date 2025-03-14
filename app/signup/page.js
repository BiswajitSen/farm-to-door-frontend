"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppProvider } from '@/app/context';
import Layout from '@/app/layout.js';
import styles from './SignupPage.module.css';
import urls from '@/env';
import SignupForm from "@/app/components/SignupForm/SignupForm";
import Modal from "@/app/components/Modal/Modal";
import Loader from "@/app/components/Loader/Loader";

const SignupPage = () => {
    const [error, setError] = useState('');
    const [showRedirectMessage, setShowRedirectMessage] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSignup = async ({ username, password }) => {
        setLoading(true);
        const minLoadingTime = new Promise(resolve => setTimeout(resolve, 2000));
        try {
            const response = await fetch(`${urls.API_BASE_URL}/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                setShowRedirectMessage(true);
                await minLoadingTime;
                router.push('/login');
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Signup failed');
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

    return (
        <div className={styles.loginPage}>
            <h1 className={styles.h1}>Signup</h1>
            {error && <Modal message={error} onClose={closeModal} />}
            {showRedirectMessage && <Modal message="Signup successful! Redirecting to login page..." onClose={() => setShowRedirectMessage(false)} />}
            {loading && <Loader />}
            <SignupForm onSignup={handleSignup} />
        </div>
    );
};

const App = () => (
    <AppProvider>
        <Layout>
            <SignupPage />
        </Layout>
    </AppProvider>
);

export default App;