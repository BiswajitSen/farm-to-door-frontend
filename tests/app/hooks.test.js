import { renderHook, waitFor } from '@testing-library/react';
import { AppProvider } from '@/app/context';
import { useFetchProducts, useHandleOrderSubmit } from '@/app/hooks';
import axios from 'axios';

jest.mock('axios');
jest.mock('@/env', () => {
    return {
        __esModule: true,
        default: {
            API_BASE_URL: 'http://localhost:3001',
        },
    };
});

const wrapper = ({ children }) => <AppProvider>{children}</AppProvider>;

describe('useFetchProducts', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should fetch products successfully', async () => {
        const mockProducts = [
            { _id: '1', name: 'Product 1', price: 10, quantity: 5 },
            { _id: '2', name: 'Product 2', price: 20, quantity: 3 },
        ];
        axios.get.mockResolvedValue({ data: mockProducts });

        const { result } = renderHook(() => useFetchProducts(), { wrapper });

        await waitFor(() => {
            expect(axios.get).toHaveBeenCalledWith('http://localhost:3001/products');
        });
    });

    it('should handle fetch error', async () => {
        axios.get.mockRejectedValue(new Error('Network error'));

        const { result } = renderHook(() => useFetchProducts(), { wrapper });

        await waitFor(() => {
            expect(axios.get).toHaveBeenCalled();
        });
    });
});

describe('useHandleOrderSubmit', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Mock localStorage properly
        Object.defineProperty(window, 'localStorage', {
            value: {
                getItem: jest.fn((key) => {
                    if (key === 'authToken') return 'mock-token';
                    if (key === 'username') return 'testuser';
                    return null;
                }),
                setItem: jest.fn(),
                removeItem: jest.fn(),
            },
            writable: true,
        });
    });

    it('should submit order successfully', async () => {
        const mockResponse = { data: { orderId: '123' } };
        axios.post.mockResolvedValue(mockResponse);

        const { result } = renderHook(() => useHandleOrderSubmit(), { wrapper });

        const orderReq = {
            address: '123 Main Street, City, State', // Ensure it's long enough (>= 10 chars)
            products: [
                {
                    productId: '1',
                    productName: 'Product 1',
                    imageUrl: 'image1.jpg',
                    quantity: 2,
                    boughtFrom: 'vendor1',
                },
            ],
        };

        // Call the function directly
        await result.current(orderReq);

        // Check axios was called
        expect(axios.post).toHaveBeenCalledWith(
            'http://localhost:3001/orders',
            expect.objectContaining({
                productIds: expect.arrayContaining([
                    expect.objectContaining({
                        productId: '1',
                        productName: 'Product 1',
                        imageUrl: 'image1.jpg',
                        quantity: 2,
                        boughtFrom: 'vendor1',
                    }),
                ]),
                deliveryAddress: '123 Main Street, City, State',
            }),
            expect.objectContaining({
                headers: expect.objectContaining({
                    Authorization: expect.stringContaining('Bearer'),
                }),
            })
        );
    });

    it('should return error when address is missing', async () => {
        const { result } = renderHook(() => useHandleOrderSubmit(), { wrapper });

        const orderReq = {
            address: '',
            products: [],
        };

        await result.current(orderReq);

        expect(axios.post).not.toHaveBeenCalled();
    });

    it('should handle order submission error', async () => {
        const errorResponse = {
            response: {
                data: { message: 'Order failed' },
                status: 500
            }
        };
        axios.post.mockRejectedValue(errorResponse);

        const { result } = renderHook(() => useHandleOrderSubmit(), { wrapper });

        const orderReq = {
            address: '123 Main Street, City, State', // Ensure it's long enough (>= 10 chars)
            products: [
                {
                    productId: '1',
                    productName: 'Product 1',
                    imageUrl: 'image1.jpg',
                    quantity: 2,
                    boughtFrom: 'vendor1',
                },
            ],
        };

        // Call the function - it should throw
        try {
            await result.current(orderReq);
        } catch (error) {
            // Expected to throw
        }

        // Check axios was called
        expect(axios.post).toHaveBeenCalled();
    });
});

