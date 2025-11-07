import { GET } from '@/app/api/images/route';
import { promises as fs } from 'fs';
import path from 'path';

jest.mock('fs', () => ({
    promises: {
        readFile: jest.fn(),
    },
}));

describe('/api/images', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return image when image name is provided', async () => {
        const mockImageBuffer = Buffer.from('fake-image-data');
        fs.readFile.mockResolvedValue(mockImageBuffer);

        const request = new Request('http://localhost:3000/api/images?name=test.jpg', {
            method: 'GET',
        });

        const response = await GET(request);

        expect(response.status).toBe(200);
        expect(fs.readFile).toHaveBeenCalledWith(
            expect.stringContaining('test.jpg')
        );
    });

    it('should return 400 when image name is missing', async () => {
        const request = new Request('http://localhost:3000/api/images', {
            method: 'GET',
        });

        const response = await GET(request);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.error).toBe('Image name is required');
    });

    it('should return 404 when image is not found', async () => {
        const error = new Error('File not found');
        error.code = 'ENOENT';
        fs.readFile.mockRejectedValue(error);

        const request = new Request('http://localhost:3000/api/images?name=nonexistent.jpg', {
            method: 'GET',
        });

        const response = await GET(request);
        const data = await response.json();

        expect(response.status).toBe(404);
        expect(data.error).toBe('Image not found');
    });
});
