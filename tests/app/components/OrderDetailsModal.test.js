import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AppProvider } from '@/app/context';
import OrderDetailsModal from '@/app/components/OrderDetailsModal/OrderDetailsModal';
import '@testing-library/jest-dom';

jest.mock('@/env', () => {
    return {
        __esModule: true,
        default: {
            API_BASE_URL: 'http://localhost:3001',
        },
    };
});

describe('OrderDetailsModal', () => {
    const mockOnClose = jest.fn();
    const mockOrderDetails = [
        {
            _id: 'order1',
            deliveryAddress: '123 Main St',
            orderDate: '2024-01-01T00:00:00.000Z',
            productCount: 2,
            status: 'pending',
            productIds: [
                {
                    productId: '1',
                    quantity: 2,
                },
            ],
        },
    ];

    const mockProducts = [
        {
            _id: '1',
            name: 'Product 1',
            imageUrl: 'image1.jpg',
        },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render order details modal', () => {
        render(
            <AppProvider>
                <OrderDetailsModal orderDetails={mockOrderDetails} onClose={mockOnClose} />
            </AppProvider>
        );

        expect(screen.getByText('Order Details')).toBeInTheDocument();
        expect(screen.getByText(/Delivery Address:/)).toBeInTheDocument();
        expect(screen.getByText(/Order Date:/)).toBeInTheDocument();
    });

    it('should call onClose when close button is clicked', async () => {
        const user = userEvent.setup();
        render(
            <AppProvider>
                <OrderDetailsModal orderDetails={mockOrderDetails} onClose={mockOnClose} />
            </AppProvider>
        );

        const closeButton = screen.getByText('X');
        await user.click(closeButton);

        expect(mockOnClose).toHaveBeenCalled();
    });

    it('should display order information', () => {
        render(
            <AppProvider>
                <OrderDetailsModal orderDetails={mockOrderDetails} onClose={mockOnClose} />
            </AppProvider>
        );

        expect(screen.getByText(/123 Main St/)).toBeInTheDocument();
        expect(screen.getByText(/Product Count:/)).toBeInTheDocument();
        expect(screen.getByText(/Status:/)).toBeInTheDocument();
    });

    it('should display multiple orders', () => {
        const multipleOrders = [
            ...mockOrderDetails,
            {
                _id: 'order2',
                deliveryAddress: '456 Oak Ave',
                orderDate: '2024-01-02T00:00:00.000Z',
                productCount: 1,
                status: 'completed',
                productIds: [
                    {
                        productId: '2',
                        quantity: 1,
                    },
                ],
            },
        ];

        render(
            <AppProvider>
                <OrderDetailsModal orderDetails={multipleOrders} onClose={mockOnClose} />
            </AppProvider>
        );

        expect(screen.getByText(/123 Main St/)).toBeInTheDocument();
        expect(screen.getByText(/456 Oak Ave/)).toBeInTheDocument();
    });

    it('should display formatted order date', () => {
        render(
            <AppProvider>
                <OrderDetailsModal orderDetails={mockOrderDetails} onClose={mockOnClose} />
            </AppProvider>
        );

        const dateText = screen.getByText(/Order Date:/);
        expect(dateText).toBeInTheDocument();
    });

    it('should handle orders with no products', () => {
        const emptyOrder = [
            {
                ...mockOrderDetails[0],
                productIds: [],
            },
        ];

        render(
            <AppProvider>
                <OrderDetailsModal orderDetails={emptyOrder} onClose={mockOnClose} />
            </AppProvider>
        );

        expect(screen.getByText('Order Details')).toBeInTheDocument();
    });
});

