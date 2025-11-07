import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OrderForm from '@/app/components/OrderForm/OrderForm';
import '@testing-library/jest-dom';

describe('OrderForm', () => {
    const mockSelectedProducts = [
        {
            _id: '1',
            name: 'Product 1',
            productName: 'Product 1',
            price: 10,
            soldBy: 'vendor1',
        },
        {
            _id: '2',
            name: 'Product 2',
            productName: 'Product 2',
            price: 20,
            soldBy: 'vendor2',
        },
    ];

    const mockCart = { '1': 2, '2': 1 };
    const mockAddress = '123 Main St';
    const mockSetAddress = jest.fn();
    const mockOnSubmit = jest.fn();
    const mockOnClose = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render order form with products', () => {
        render(
            <OrderForm
                address={mockAddress}
                setAddress={mockSetAddress}
                onSubmit={mockOnSubmit}
                onClose={mockOnClose}
                selectedProducts={mockSelectedProducts}
                cart={mockCart}
                orderPlacedSuccessfully={false}
            />
        );

        expect(screen.getByText('Order Summary')).toBeInTheDocument();
        expect(screen.getByText(/Product 1/)).toBeInTheDocument();
        expect(screen.getByText(/Product 2/)).toBeInTheDocument();
    });

    it('should calculate and display total items and cost', () => {
        render(
            <OrderForm
                address={mockAddress}
                setAddress={mockSetAddress}
                onSubmit={mockOnSubmit}
                onClose={mockOnClose}
                selectedProducts={mockSelectedProducts}
                cart={mockCart}
                orderPlacedSuccessfully={false}
            />
        );

        expect(screen.getByText(/Total Items: 3/)).toBeInTheDocument();
        expect(screen.getByText(/Total Cost: \$40.00/)).toBeInTheDocument();
    });

    it('should show success message when order is placed successfully', () => {
        render(
            <OrderForm
                address={mockAddress}
                setAddress={mockSetAddress}
                onSubmit={mockOnSubmit}
                onClose={mockOnClose}
                selectedProducts={mockSelectedProducts}
                cart={mockCart}
                orderPlacedSuccessfully={true}
            />
        );

        expect(screen.getByText('Order placed successfully!')).toBeInTheDocument();
    });

    it('should call onSubmit with correct data when form is submitted', async () => {
        const user = userEvent.setup();
        render(
            <OrderForm
                address={mockAddress}
                setAddress={mockSetAddress}
                onSubmit={mockOnSubmit}
                onClose={mockOnClose}
                selectedProducts={mockSelectedProducts}
                cart={mockCart}
                orderPlacedSuccessfully={false}
            />
        );

        const submitButton = screen.getByText('Submit Order');
        await user.click(submitButton);

        await waitFor(() => {
            expect(mockOnSubmit).toHaveBeenCalledWith({
                address: mockAddress,
                products: [
                    {
                        productId: '1',
                        name: 'Product 1',
                        imageUrl: undefined,
                        quantity: 2,
                        boughtFrom: 'vendor1',
                    },
                    {
                        productId: '2',
                        name: 'Product 2',
                        imageUrl: undefined,
                        quantity: 1,
                        boughtFrom: 'vendor2',
                    },
                ],
            });
        }, { timeout: 3000 });
    });

    it('should show error when no products are selected', async () => {
        const user = userEvent.setup();
        render(
            <OrderForm
                address={mockAddress}
                setAddress={mockSetAddress}
                onSubmit={mockOnSubmit}
                onClose={mockOnClose}
                selectedProducts={[]}
                cart={{}}
                orderPlacedSuccessfully={false}
            />
        );

        const submitButton = screen.getByText('Submit Order');
        await user.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText('At least one product must be selected')).toBeInTheDocument();
        });

        expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('should show error when address is invalid', async () => {
        const user = userEvent.setup();
        const mockSetAddressWithState = jest.fn((value) => {
            // Simulate state update
        });
        
        const { rerender } = render(
            <OrderForm
                address="short"
                setAddress={mockSetAddressWithState}
                onSubmit={mockOnSubmit}
                onClose={mockOnClose}
                selectedProducts={mockSelectedProducts}
                cart={mockCart}
                orderPlacedSuccessfully={false}
            />
        );

        const addressInput = screen.getByPlaceholderText('Enter your delivery address (minimum 10 characters)');
        const submitButton = screen.getByText('Submit Order');
        
        // Button should be disabled for short address
        expect(submitButton).toBeDisabled();
        
        // Update address to valid length via rerender
        rerender(
            <OrderForm
                address="1234567890" // Valid length (10 chars)
                setAddress={mockSetAddressWithState}
                onSubmit={mockOnSubmit}
                onClose={mockOnClose}
                selectedProducts={mockSelectedProducts}
                cart={mockCart}
                orderPlacedSuccessfully={false}
            />
        );
        
        const enabledButton = screen.getByText('Submit Order');
        expect(enabledButton).not.toBeDisabled();
        
        // Now test with invalid address again
        rerender(
            <OrderForm
                address="short"
                setAddress={mockSetAddressWithState}
                onSubmit={mockOnSubmit}
                onClose={mockOnClose}
                selectedProducts={mockSelectedProducts}
                cart={mockCart}
                orderPlacedSuccessfully={false}
            />
        );
        
        // For invalid address, button should be disabled
        const disabledButton = screen.getByText('Submit Order');
        expect(disabledButton).toBeDisabled();
    });

    it('should call onClose when close button is clicked', () => {
        render(
            <OrderForm
                address={mockAddress}
                setAddress={mockSetAddress}
                onSubmit={mockOnSubmit}
                onClose={mockOnClose}
                selectedProducts={mockSelectedProducts}
                cart={mockCart}
                orderPlacedSuccessfully={false}
            />
        );

        const closeButton = screen.getByText('X');
        fireEvent.click(closeButton);

        expect(mockOnClose).toHaveBeenCalled();
    });

    it('should update address when input changes', async () => {
        const user = userEvent.setup();
        render(
            <OrderForm
                address={mockAddress}
                setAddress={mockSetAddress}
                onSubmit={mockOnSubmit}
                onClose={mockOnClose}
                selectedProducts={mockSelectedProducts}
                cart={mockCart}
                orderPlacedSuccessfully={false}
            />
        );

        const addressInput = screen.getByPlaceholderText('Enter your delivery address (minimum 10 characters)');
        await user.clear(addressInput);
        await user.type(addressInput, '456 New St');

        expect(mockSetAddress).toHaveBeenCalled();
    });
});

