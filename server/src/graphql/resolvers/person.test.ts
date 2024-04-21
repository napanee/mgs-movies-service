import {Sequelize} from 'sequelize';

import {sequelizeConnection} from '@db/connection';
import {Movie as ModelMovie, Person as ModelPerson} from '@db/models';

import PersonController from './Person';

import {PeopleOrderByEnumType} from '../queries/Person';


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

		await Promise.all(
			people.map(async (person, index) => {
				await movie.addPerson(person, {
					through: {
						character: index === 0 ? null : `character_${index}`,
						creditId: `credit${index}`,
						department: index === 0 ? 'director' : 'actor',
					},
				});
			})
		);
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
		const expectedResponse = {name: 'Bar'};

		await expect(personResolver.get({id: 2})).resolves.toMatchObject(expectedResponse);
	});

	test('should response single person with name', async () => {
		const expectedResponse = {id: 2};

		await expect(personResolver.get({name: 'Bar'})).resolves.toMatchObject(expectedResponse);
	});

	test('should response person list', async () => {
		const expectedResponse = {
			edges: [
				{node: expect.objectContaining({name: 'Bar'})},
				{node: expect.objectContaining({name: 'Baz'})},
				{node: expect.objectContaining({name: 'Foo'})},
			],
		};
		const args = {limit: 3, offset: 0, order: [PeopleOrderByEnumType.getValue('NAME_ASC')?.value]};

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
		const args = {limit: 3, offset: 0, order: [PeopleOrderByEnumType.getValue('NAME_DESC')?.value]};

		await expect(personResolver.list(args)).resolves
			.toMatchObject(expectedResponse);
	});

	test('should response person list with next pages', async () => {
		const args = {limit: 1, offset: 0, order: [PeopleOrderByEnumType.getValue('NAME_ASC')?.value]};
		const response = await personResolver.list(args);

		expect(response.pageInfo.hasNextPage).toBeTruthy();
		expect(response.pageInfo.hasPreviousPage).toBeFalsy();
	});

	test('should response person list with previous pages', async () => {
		const args = {limit: 1, offset: 2, order: [PeopleOrderByEnumType.getValue('NAME_ASC')?.value]};
		const response = await personResolver.list(args);

		expect(response.pageInfo.hasNextPage).toBeFalsy();
		expect(response.pageInfo.hasPreviousPage).toBeTruthy();
	});

	test('should response plain person list', async () => {
		const expectedResponse = [
			expect.objectContaining({name: 'Foo'}),
			expect.objectContaining({name: 'Bar'}),
			expect.objectContaining({name: 'Baz'}),
		];

		const args = {};

		await expect(personResolver.list(args, true)).resolves
			.toMatchObject(expectedResponse);
	});
});
