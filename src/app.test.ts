import {Sequelize} from 'sequelize';
import request from 'supertest';

import app from './app';
import {sequelizeConnection} from './db/connection';


describe('The Server', () => {
	const db: Sequelize = sequelizeConnection;

	beforeAll(async () => {
		await db.sync({force: true});
	});

	afterAll(async () => {
		await db.close();
	});

	test('should respond with a 200 status code at root route', async () => {
		const response = await request(app).get('/');

		expect(response.statusCode).toBe(200);
		expect(response.text).toBe('Server running...');
	});
});
