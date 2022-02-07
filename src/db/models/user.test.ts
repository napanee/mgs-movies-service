import bcrypt from 'bcrypt';
import {Sequelize} from 'sequelize';

import User from './User';

import {sequelizeConnection} from '../connection';


const mockedBcryptGenSaltSync = bcrypt.genSaltSync as jest.MockedFunction<typeof bcrypt.genSaltSync>;
const mockedBcryptHashSync = bcrypt.hashSync as jest.MockedFunction<typeof bcrypt.hashSync>;

describe('The user model', () => {
	const db: Sequelize = sequelizeConnection;

	beforeAll(async () => {
		await db.sync({alter: true, force: true});
	});

	afterAll(async () => {
		await db.close();
	});

	afterEach(() => {
		mockedBcryptGenSaltSync.mockClear();
		mockedBcryptHashSync.mockClear();
	});

	test('should hash password before create', async () => {
		const user = await User.create({
			email: 'foo@bar.de',
			firstName: 'Foo',
			lastName: 'Bar',
			password: 'password',
		});

		expect(bcrypt.genSaltSync).toBeCalledTimes(1);
		expect(bcrypt.hashSync).toBeCalledTimes(1);
		expect(user.password).toBe('hash');
	});

	test('should don\'t hash password', async () => {
		const user = await User.create({
			email: 'foo@bar.de',
			firstName: 'Foo',
			lastName: 'Bar',
			password: 'password',
		});

		await user.update({firstName: 'Foo2'});

		expect(bcrypt.genSaltSync).toBeCalledTimes(1);
		expect(bcrypt.hashSync).toBeCalledTimes(1);
		expect(user.firstName).toBe('Foo2');
	});

	test('should update password', async () => {
		const user = await User.create({
			email: 'foo@bar.de',
			firstName: 'Foo',
			lastName: 'Bar',
			password: 'password',
		});

		await user.update({password: 'password2'});

		expect(bcrypt.genSaltSync).toBeCalledTimes(2);
		expect(bcrypt.hashSync).toBeCalledTimes(2);
	});
});
