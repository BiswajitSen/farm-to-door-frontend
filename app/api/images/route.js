import { promises as fs } from 'fs';
import path from 'path';

// Allowed image extensions for security
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const imageName = searchParams.get('name');

        if (!imageName) {
            return new Response(
                JSON.stringify({ error: 'Image name is required' }), 
                { 
                    status: 400,
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );
        }

        // Security: Validate file extension
        const fileExtension = path.extname(imageName).toLowerCase();
        if (!ALLOWED_EXTENSIONS.includes(fileExtension)) {
            return new Response(
                JSON.stringify({ error: 'Invalid image file type' }), 
                { 
                    status: 400,
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );
        }

        // Security: Prevent directory traversal
        if (imageName.includes('..') || imageName.includes('/') || imageName.includes('\\')) {
            return new Response(
                JSON.stringify({ error: 'Invalid image name' }), 
                { 
                    status: 400,
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );
        }

        const imagePath = path.join(process.cwd(), 'public', 'images', imageName);

        try {
            const image = await fs.readFile(imagePath);
            
            // Determine content type based on extension
            const contentTypeMap = {
                '.jpg': 'image/jpeg',
                '.jpeg': 'image/jpeg',
                '.png': 'image/png',
                '.gif': 'image/gif',
                '.webp': 'image/webp',
            };
            const contentType = contentTypeMap[fileExtension] || 'image/jpeg';

            return new Response(image, {
                status: 200,
                headers: {
                    'Content-Type': contentType,
                    'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
                },
            });
        } catch (error) {
            if (error.code === 'ENOENT') {
                return new Response(
                    JSON.stringify({ error: 'Image not found' }), 
                    { 
                        status: 404,
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    }
                );
            }
            throw error;
        }
    } catch (error) {
        console.error('Error in images API route:', error);
        return new Response(
            JSON.stringify({ error: 'Internal server error' }), 
            { 
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        );
    }
}