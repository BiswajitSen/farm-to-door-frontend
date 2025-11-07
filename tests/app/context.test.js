import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AppProvider, useAppContext } from '@/app/context';
import '@testing-library/jest-dom';

const TestComponent = () => {
    const {
        products,
        setProducts,
        loading,
        setLoading,
        error,
        setError,
        address,
        setAddress,
    } = useAppContext();

    return (
        <div>
            <div data-testid="products">{JSON.stringify(products)}</div>
            <div data-testid="loading">{loading.toString()}</div>
            <div data-testid="error">{error || 'no-error'}</div>
            <div data-testid="address">{address}</div>
            <button
                onClick={() => setProducts([{ id: 1, name: 'Test Product' }])}
                data-testid="set-products"
            >
                Set Products
            </button>
            <button onClick={() => setLoading(false)} data-testid="set-loading">
                Set Loading
            </button>
            <button onClick={() => setError('Test error')} data-testid="set-error">
                Set Error
            </button>
            <button onClick={() => setAddress('123 Main St')} data-testid="set-address">
                Set Address
            </button>
        </div>
    );
};

describe('AppContext', () => {
    it('should provide default values', () => {
        render(
            <AppProvider>
                <TestComponent />
            </AppProvider>
        );

        expect(screen.getByTestId('products')).toHaveTextContent('[]');
        expect(screen.getByTestId('loading')).toHaveTextContent('true');
        expect(screen.getByTestId('error')).toHaveTextContent('no-error');
        expect(screen.getByTestId('address')).toHaveTextContent('');
    });

    it('should update products when setProducts is called', async () => {
        const user = userEvent.setup();
        render(
            <AppProvider>
                <TestComponent />
            </AppProvider>
        );

        const setProductsButton = screen.getByTestId('set-products');
        await user.click(setProductsButton);

        await waitFor(() => {
            expect(screen.getByTestId('products')).toHaveTextContent(
                JSON.stringify([{ id: 1, name: 'Test Product' }])
            );
        });
    });

    it('should update loading state', async () => {
        const user = userEvent.setup();
        render(
            <AppProvider>
                <TestComponent />
            </AppProvider>
        );

        const setLoadingButton = screen.getByTestId('set-loading');
        await user.click(setLoadingButton);

        await waitFor(() => {
            expect(screen.getByTestId('loading')).toHaveTextContent('false');
        });
    });

    it('should update error state', async () => {
        const user = userEvent.setup();
        render(
            <AppProvider>
                <TestComponent />
            </AppProvider>
        );

        const setErrorButton = screen.getByTestId('set-error');
        await user.click(setErrorButton);

        await waitFor(() => {
            expect(screen.getByTestId('error')).toHaveTextContent('Test error');
        });
    });

    it('should update address', async () => {
        const user = userEvent.setup();
        render(
            <AppProvider>
                <TestComponent />
            </AppProvider>
        );

        const setAddressButton = screen.getByTestId('set-address');
        await user.click(setAddressButton);

        await waitFor(() => {
            expect(screen.getByTestId('address')).toHaveTextContent('123 Main St');
        });
    });
});

