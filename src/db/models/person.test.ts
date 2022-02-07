import cryptoJs from 'crypto-js';
import {Sequelize} from 'sequelize';

import {saveImage} from '@utils/index';

import Person from './Person';

import {sequelizeConnection} from '../connection';


jest.mock('dayjs');
jest.mock('@utils/save-image');
const mockedSaveImage = saveImage as jest.MockedFunction<typeof saveImage>;
const mockedMD5 = cryptoJs.MD5 as jest.MockedFunction<typeof cryptoJs.MD5>;

describe('The person model', () => {
	const db: Sequelize = sequelizeConnection;

	beforeAll(async () => {
		await db.sync({alter: true, force: true});
	});

	afterAll(async () => {
		await db.close();
	});

	afterEach(() => {
		mockedSaveImage.mockClear();
		mockedMD5.mockClear();
	});

	test('should save image with birthday data', async () => {
		const person = await Person.create({
			imdb: 'tt1',
			name: 'Foo',
			tmdb: 1,
			image: 'image',
			biography: null,
			birthday: '2022-01-01',
			deathday: null,
			placeOfBirth: null,
		});

		expect(mockedSaveImage).toBeCalledTimes(1);
		expect(person.image).toBe('pe/20222/new-image');
	});

	test('should save image without birthday data', async () => {
		const person = await Person.create({
			imdb: 'tt1',
			name: 'Foo',
			tmdb: 1,
			image: 'image',
			biography: null,
			birthday: null,
			deathday: null,
			placeOfBirth: null,
		});

		expect(mockedSaveImage).toBeCalledTimes(1);
		expect(person.image).toBe('pe/19841/new-image');
	});

	test('should update image', async () => {
		const person = await Person.create({
			imdb: 'tt1',
			name: 'Foo',
			tmdb: 1,
			image: null,
			biography: null,
			birthday: null,
			deathday: null,
			placeOfBirth: null,
		});

		expect(person.image).toBeNull();

		await person.update({image: 'image'});

		expect(mockedSaveImage).toBeCalledTimes(1);
		expect(person.image).toBe('pe/19841/new-image');
	});
});
