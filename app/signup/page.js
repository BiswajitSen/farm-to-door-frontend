"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/app/components/Layout/layout';
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
        if (!username?.trim() || !password?.trim()) {
            setError('Username and password are required');
            return;
        }

        if (password.trim().length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        setLoading(true);
        setError('');
        setShowRedirectMessage(false);
        
        try {
            const response = await fetch(`${urls.API_BASE_URL}/signup`, {
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
                setShowRedirectMessage(true);
                // Redirect after a short delay to show success message
                setTimeout(() => {
                    router.push('/login');
                }, 1500);
            } else {
                let errorMessage = 'Signup failed';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorMessage;
                } catch (parseError) {
                    console.error('Error parsing error response:', parseError);
                }
                setError(errorMessage);
            }
        } catch (error) {
            console.error('Signup error:', error);
            setError('Network error. Please check your connection and try again.');
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

export default function App() {
    return (
        <Layout>
            <SignupPage />
        </Layout>
    );
}