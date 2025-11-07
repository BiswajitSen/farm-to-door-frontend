import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import VendorPage from '@/app/vendor/page';
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

describe('VendorPage', () => {
    const mockProducts = [
        { _id: '1', name: 'Product 1', quantity: 5 },
        { _id: '2', name: 'Product 2', quantity: 3 },
    ];

    const mockOrders = [
        {
            _id: 'order1',
            productName: 'Product 1',
            quantity: 2,
            imageUrl: 'image1.jpg',
        },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.getItem = jest.fn((key) => {
            if (key === 'authToken') return 'mock-token';
            if (key === 'username') return 'testuser';
            return null;
        });
        axios.get.mockResolvedValue({ data: [] });
    });

    it('should render vendor page', () => {
        render(<VendorPage />);

        expect(screen.getByText('Vendor Management')).toBeInTheDocument();
        expect(screen.getByText('Add New Product')).toBeInTheDocument();
    });

});

