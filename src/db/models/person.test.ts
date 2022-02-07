import {Sequelize} from 'sequelize';

import Person from './Person';

import {saveImage} from '../../utils/save-image';
import {sequelizeConnection} from '../connection';


jest.mock('../../utils/save-image');
const mockedSaveImage = saveImage as jest.MockedFunction<typeof saveImage>;

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
	});

	test('should save image', async () => {
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
		expect(person.image).toBe('new-image');
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
		expect(person.image).toBe('new-image');
	});
});
