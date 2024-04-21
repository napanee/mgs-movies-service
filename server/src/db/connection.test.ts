import {Sequelize} from 'sequelize';


describe('The Connection', () => {
	let db: Sequelize;
	const originalLog = global.console.log;
	const OLD_ENV = process.env;

	beforeEach(() => {
		jest.resetModules();
		process.env = {...OLD_ENV};
	});

	beforeEach(() => {
		global.console.log = jest.fn();
	});

	afterEach(async () => {
		await db.close();
		jest.resetModules();
		global.console.log = originalLog;
	});

	test('should contain test database', async () => {
		process.env.DATABASE_NAME = 'db_test';

		const {sequelizeConnection} = await import('./connection');

		db = sequelizeConnection;

		const config = {
			database: 'db_test',
		};

		expect(sequelizeConnection.config).toEqual(expect.objectContaining(config));
	});

	test('should return development config', async () => {
		process.env.NODE_ENV = 'development';

		const {sequelizeConnection} = await import('./connection');

		db = sequelizeConnection;

		const config = {
			database: 'movies_dev',
		};

		expect(sequelizeConnection.config).toEqual(expect.objectContaining(config));
	});

	test('should not use logging, when not in debug mode', async () => {
		const {logging, sequelizeConnection} = await import('./connection');

		db = sequelizeConnection;

		expect(logging).toBeFalsy();

		await sequelizeConnection.showAllSchemas({logging});
		expect(global.console.log).toHaveBeenCalledTimes(0);
	});

	test('should use logging in debug mode', async () => {
		process.env.DEBUG = true;

		const {logging, sequelizeConnection} = await import('./connection');

		db = sequelizeConnection;

		expect(typeof logging).toBe('function');

		await sequelizeConnection.showAllSchemas({logging});
		expect(global.console.log).toHaveBeenCalled();
	});
});
