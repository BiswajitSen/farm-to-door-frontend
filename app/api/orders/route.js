import axios from 'axios';
import urls from "@/env";

export async function POST(request) {
    const { productIds, deliveryAddress } = await request.json();

    try {
        const response = await axios.post(`${urls.API_BASE_URL}/orders`, {
            productIds,
            deliveryAddress,
        });

        return new Response(JSON.stringify(response.data), { status: 201 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to place the order' }), { status: 500 });
    }
}
