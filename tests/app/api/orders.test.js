import { POST } from '@/app/api/orders/route';
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

describe('/api/orders', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should create an order successfully', async () => {
        const mockOrderData = {
            productIds: [{ productId: '1', quantity: 2 }],
            deliveryAddress: '123 Main St',
        };
        const mockResponse = { data: { orderId: '123', status: 'created' } };
        axios.post.mockResolvedValue(mockResponse);

        const request = new Request('http://localhost:3000/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(mockOrderData),
        });

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(201);
        expect(data).toEqual(mockResponse.data);
        expect(axios.post).toHaveBeenCalledWith(
            expect.stringContaining('/orders'),
            mockOrderData,
            expect.objectContaining({
                timeout: 10000
            })
        );
    });

    it('should return 400 when validation fails', async () => {
        const request = new Request('http://localhost:3000/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                productIds: [],
                deliveryAddress: '123 Main St',
            }),
        });

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.error).toContain('Product IDs');
    });

    it('should return 500 when order creation fails', async () => {
        axios.post.mockRejectedValue(new Error('Network error'));

        const request = new Request('http://localhost:3000/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                productIds: [{ productId: '1', quantity: 2 }],
                deliveryAddress: '123 Main Street, City, State',
            }),
        });

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(500);
        expect(data.error).toBe('Failed to place the order');
    });
});

