import axios from 'axios';
import urls from "@/env";

export async function POST(request) {
    try {
        const body = await request.json();
        const { productIds, deliveryAddress } = body;

        // Input validation
        if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
            return new Response(
                JSON.stringify({ error: 'Product IDs are required and must be a non-empty array' }), 
                { status: 400 }
            );
        }

        if (!deliveryAddress || typeof deliveryAddress !== 'string' || deliveryAddress.trim().length < 10) {
            return new Response(
                JSON.stringify({ error: 'Valid delivery address is required (minimum 10 characters)' }), 
                { status: 400 }
            );
        }

        const response = await axios.post(`${urls.API_BASE_URL}/orders`, {
            productIds,
            deliveryAddress: deliveryAddress.trim(),
        }, {
            timeout: 10000, // 10 second timeout
        });

        return new Response(JSON.stringify(response.data), { 
            status: 201,
            headers: {
                'Content-Type': 'application/json',
            }
        });
    } catch (error) {
        console.error('Error in orders API route:', error);
        
        if (error.response) {
            // Server responded with error
            return new Response(
                JSON.stringify({ 
                    error: error.response.data?.message || 'Failed to place the order' 
                }), 
                { 
                    status: error.response.status || 500,
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );
        } else if (error.request) {
            // Request made but no response
            return new Response(
                JSON.stringify({ error: 'No response from server. Please try again.' }), 
                { status: 503 }
            );
        } else {
            // Error setting up request
            return new Response(
                JSON.stringify({ error: 'Failed to place the order' }), 
                { status: 500 }
            );
        }
    }
}
