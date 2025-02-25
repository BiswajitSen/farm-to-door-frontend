import { promises as fs } from 'fs';
import path from 'path';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const imageName = searchParams.get('name');

    if (!imageName) {
        return new Response('Image name is required', { status: 400 });
    }

    const imagePath = path.join(process.cwd(), 'public', 'images', imageName);

    try {
        const image = await fs.readFile(imagePath);
        return new Response(image, {
            status: 200,
            headers: {
                'Content-Type': 'image/avrf',
            },
        });
    } catch (error) {
        return new Response('Image not found', { status: 404 });
    }
}