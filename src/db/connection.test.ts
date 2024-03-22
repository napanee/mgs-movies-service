import {Sequelize} from 'sequelize';


describe('The Connection', () => {
	let db: Sequelize;
	const originalLog = global.console.log;

	beforeEach(() => {
		global.console.log = jest.fn();
	});

	afterEach(async () => {
		await db.close();
		jest.resetModules();
		global.console.log = originalLog;
	});

	test('should contain test database', async () => {
		const {sequelizeConnection} = await import('./connection');

		db = sequelizeConnection;

		const config = {
			database: 'movies_test',
		};

		expect(sequelizeConnection.config).toEqual(expect.objectContaining(config));
	});

	test('should return development config', async () => {
		const oldEnv = process.env;

		process.env.NODE_ENV = 'development';

		const {sequelizeConnection} = await import('./connection');

		db = sequelizeConnection;

		const config = {
			database: 'movies_dev',
		};

		expect(sequelizeConnection.config).toEqual(expect.objectContaining(config));

		process.env = oldEnv;
	});

	test('should not use logging in production mode', async () => {
		const oldEnv = process.env;

		process.env.NODE_ENV = 'production';
		process.env.DATABASE_USER = 'postgres';
		process.env.DATABASE_PASS = 'postgres';
		process.env.DATABASE_NAME = 'movies_test';
		process.env.DATABASE_HOST = '127.0.0.1';
		process.env.DATABASE_DIALECT = 'postgres';

		const {logging, sequelizeConnection} = await import('./connection');

		db = sequelizeConnection;

		expect(logging).toBeFalsy();

		await sequelizeConnection.showAllSchemas({logging});
		expect(global.console.log).toHaveBeenCalledTimes(0);

		process.env = oldEnv;
	});

	test('should use logging in development mode', async () => {
		const oldEnv = process.env;

		process.env.NODE_ENV = 'development';
		process.env.DEBUG = true;

		const {logging, sequelizeConnection} = await import('./connection');

		db = sequelizeConnection;

		expect(typeof logging).toBe('function');

		await sequelizeConnection.showAllSchemas({logging});
		expect(global.console.log).toHaveBeenCalled();

		process.env = oldEnv;
	});
});
