import axios from 'axios';

export async function POST(request) {
    const { productIds, deliveryAddress } = await request.json();

    try {
        const response = await axios.post('http://localhost:8080/api/orders', {
            productIds,
            deliveryAddress,
        });

        return new Response(JSON.stringify(response.data), { status: 201 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to place the order' }), { status: 500 });
    }
}
