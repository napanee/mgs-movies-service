import request from 'supertest';

import app from './app';


describe('The Server', () => {
	test('should respond with a 200 status code at root route', async () => {
		const response = await request(app).get('/');

		expect(response.statusCode).toBe(200);
		expect(response.text).toBe('Server running...');
	});
});
