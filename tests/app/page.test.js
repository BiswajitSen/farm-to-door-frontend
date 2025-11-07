import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '@/app/page';
import { AppProvider } from '@/app/context';
import axios from 'axios';
import '@testing-library/jest-dom';

jest.mock('axios');
jest.mock('@/env', () => {
    return {
        __esModule: true,
        default: {
            API_BASE_URL: 'http://localhost:3001',
        },
    };
});

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: mockPush,
    }),
}));

describe('HomePage', () => {
    const mockProducts = [
        {
            _id: '1',
            name: 'Product 1',
            price: 10,
            imageUrl: 'image1.jpg',
            quantity: 5,
            soldBy: 'vendor1',
        },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.getItem = jest.fn((key) => {
            if (key === 'authToken') return null;
            if (key === 'username') return null;
            if (key === 'cart') return null;
            return null;
        });
        localStorage.setItem = jest.fn();
        localStorage.removeItem = jest.fn();
        axios.get.mockResolvedValue({ data: mockProducts });
        axios.post = jest.fn().mockResolvedValue({ data: {} });
    });

    it('should render home page with products', async () => {
        render(
            <AppProvider>
                <App />
            </AppProvider>
        );

        await waitFor(() => {
            expect(screen.getByText('Rural Delivery')).toBeInTheDocument();
        });

        await waitFor(() => {
            expect(screen.getByText('Available Products')).toBeInTheDocument();
        });
    });

    it('should show login and signup buttons when not logged in', async () => {
        render(
            <AppProvider>
                <App />
            </AppProvider>
        );

        await waitFor(() => {
            expect(screen.getByText('Login')).toBeInTheDocument();
            expect(screen.getByText('Signup')).toBeInTheDocument();
        });
    });

});

