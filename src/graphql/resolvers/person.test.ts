import {FindOptions, Sequelize} from 'sequelize';

import {sequelizeConnection} from '@db/connection';
import {Movie as ModelMovie, Person as ModelPerson} from '@models/index';

import PersonController from './Person';


const nullablePersonProperties = {biography: null, birthday: null, deathday: null, image: null, placeOfBirth: null};
const nullableMovieProperties = {overview: null, runtime: null, backdrop: null, poster: null};

describe('The person resolver', () => {
	const db: Sequelize = sequelizeConnection;
	const personResolver = new PersonController();

	beforeAll(async () => {
		await db.sync({alter: true, force: true});

		const people = await ModelPerson.bulkCreate([
			{...nullablePersonProperties, imdb: 'tt1', name: 'Foo', tmdb: 1},
			{...nullablePersonProperties, imdb: 'tt2', name: 'Bar', tmdb: 2},
			{...nullablePersonProperties, imdb: 'tt3', name: 'Baz', tmdb: 3},
		]);

		const movie = await ModelMovie.create({
			...nullableMovieProperties,
			tmdb: 1,
			imdb: 'tt1',
			title: 'Foo',
			releaseDate: '2022-01-01',
			titleOriginal: 'Foo',
		});

		await movie.addPerson(people[0], {through: {character: 'Foo', creditId: '1', department: 'actor'}});
	});

	afterAll(async () => {
		await db.close();
	});

	test('should throw error with multiple arguments', async () => {
		const error = 'You can only search by one attribute.';

		await expect(personResolver.get({id: 1, name: 'Foo'})).rejects.toThrow(error);
	});

	test('should throw error without any argument', async () => {
		const error = 'You must enter at least one attribute.';

		await expect(personResolver.get({})).rejects.toThrow(error);
	});

	test('should response single person with id', async () => {
		const expectedResponse = {name: 'Foo'};

		await expect(personResolver.get({id: 1})).resolves.toMatchObject(expectedResponse);
	});

	test('should response single person with name', async () => {
		const expectedResponse = {name: 'Foo'};

		await expect(personResolver.get({name: 'Foo'})).resolves.toMatchObject(expectedResponse);
	});

	test('should response person list', async () => {
		const expectedResponse = {
			edges: [
				{node: expect.objectContaining({name: 'Bar'})},
				{node: expect.objectContaining({name: 'Baz'})},
				{node: expect.objectContaining({name: 'Foo'})},
			],
		};
		const args = {first: 3, offset: 0, orderBy: 'name'};

		await expect(personResolver.list(args)).resolves
			.toMatchObject(expectedResponse);
	});

	test('should response person list with desc ordering', async () => {
		const expectedResponse = {
			edges: [
				{node: expect.objectContaining({name: 'Foo'})},
				{node: expect.objectContaining({name: 'Baz'})},
				{node: expect.objectContaining({name: 'Bar'})},
			],
		};
		const args = {first: 3, offset: 0, orderBy: '-name'};

		await expect(personResolver.list(args)).resolves
			.toMatchObject(expectedResponse);
	});

	test('should response person list with next pages', async () => {
		const args = {first: 1, offset: 0, orderBy: 'name'};
		const response = await personResolver.list(args);

		expect(response.pageInfo.hasNextPage()).toBeTruthy();
		expect(response.pageInfo.hasPreviousPage()).toBeFalsy();
	});

	test('should response person list with previous pages', async () => {
		const args = {first: 1, offset: 2, orderBy: 'name'};
		const response = await personResolver.list(args);

		expect(response.pageInfo.hasNextPage()).toBeFalsy();
		expect(response.pageInfo.hasPreviousPage()).toBeTruthy();
	});

	test('should response plain person list', async () => {
		const expectedResponse = [
			expect.objectContaining({name: 'Foo'}),
			expect.objectContaining({name: 'Bar'}),
			expect.objectContaining({name: 'Baz'}),
		];

		const args: FindOptions = {
			include: [],
		};

		await expect(personResolver.list(args)).resolves
			.toMatchObject(expectedResponse);
	});
});
