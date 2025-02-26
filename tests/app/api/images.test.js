import request from 'supertest';
import app from '../../app';

// describe('Images API', () => {
//     it('should return a list of images', async () => {
//         const response = await request(app).get('/images');
//         expect(response.status).toBe(200);
//         expect(response.body).toEqual(['image1.jpg', 'image2.jpg', 'image3.jpg']);
//     });
// });