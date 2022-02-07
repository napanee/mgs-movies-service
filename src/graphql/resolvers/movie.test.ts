import {FindOptions, Sequelize} from 'sequelize';

import MovieController from './Movie';

import {sequelizeConnection} from '../../db/connection';
import {Movie as ModelMovie, Person as ModelPerson} from '../../db/models';
import {fetchMovieCredits, fetchMovieData, fetchPerson} from '../../utils/themoviedb';


jest.mock('../../utils/themoviedb');
jest.mock('../../utils/save-image');

const nullablePersonProperties = {biography: null, birthday: null, deathday: null, image: null, placeOfBirth: null};
const nullableMovieProperties = {overview: null, runtime: null, backdrop: null, poster: null};
const movieDataDefault = {
	...nullableMovieProperties,
	backdrop: null,
	genres: [
		{id: 1, name: 'foo'},
		{id: 2, name: 'bar'},
	],
	titleOriginal: 'titleOriginal',
	overview: null,
	poster: null,
	releaseDate: '2022-01-01',
	runtime: 1,
	title: 'title',
};
const personDataDefault = {
	...nullablePersonProperties,
	name: 'Foo',
};

const mockedFetchMovieCredits = fetchMovieCredits as jest.MockedFunction<typeof fetchMovieCredits>;
const mockedFetchMovieData = fetchMovieData as jest.MockedFunction<typeof fetchMovieData>;
const mockedFetchPerson = fetchPerson as jest.MockedFunction<typeof fetchPerson>;

describe('The movie resolver', () => {
	const db: Sequelize = sequelizeConnection;
	const movieResolver = new MovieController();

	beforeAll(async () => {
		await db.sync({alter: true, force: true});

		const person = await ModelPerson.create({...personDataDefault, imdb: 'tt1', name: 'Foo', tmdb: 1});
		const movies = await ModelMovie.bulkCreate([
			{...movieDataDefault, imdb: 'tt1', tmdb: 1, title: 'Foo', titleOriginal: 'Foo'},
			{...movieDataDefault, imdb: 'tt2', tmdb: 2, title: 'Bar', titleOriginal: 'Bar'},
			{...movieDataDefault, imdb: 'tt3', tmdb: 3, title: 'Baz', titleOriginal: 'Baz'},
		]);

		await person.addMovie(movies[0], {through: {character: 'Foo', creditId: '1', department: 'actor'}});
	});

	afterAll(async () => {
		await db.close();
	});

	describe('get function', () => {
		test('should throw error with multiple arguments', async () => {
			const error = 'You can only search by one attribute.';

			await expect(movieResolver.get({id: 1, title: 'Foo'})).rejects.toThrow(error);
		});

		test('should throw error without any argument', async () => {
			const error = 'You must enter at least one attribute.';

			await expect(movieResolver.get({})).rejects.toThrow(error);
		});

		test('should response single movie with id', async () => {
			const expectedResponse = {title: 'Foo'};

			await expect(movieResolver.get({id: 1})).resolves.toMatchObject(expectedResponse);
		});

		test('should response single movie with title', async () => {
			const expectedResponse = {title: 'Foo'};

			await expect(movieResolver.get({title: 'Foo'})).resolves.toMatchObject(expectedResponse);
		});
	});

	describe('list function', () => {
		test('should response plain movie list', async () => {
			const expectedResponse = [
				expect.objectContaining({title: 'Foo'}),
				expect.objectContaining({title: 'Bar'}),
				expect.objectContaining({title: 'Baz'}),
			];

			const args: FindOptions = {
				include: [],
			};

			await expect(movieResolver.list(args)).resolves
				.toMatchObject(expectedResponse);
		});

		test('should response movie list', async () => {
			const expectedResponse = {
				edges: [
					{node: expect.objectContaining({title: 'Bar'})},
					{node: expect.objectContaining({title: 'Baz'})},
					{node: expect.objectContaining({title: 'Foo'})},
				],
			};
			const args = {first: 3, offset: 0, orderBy: 'title'};

			await expect(movieResolver.list(args)).resolves
				.toMatchObject(expectedResponse);
		});

		test('should response movie list with desc ordering', async () => {
			const expectedResponse = {
				edges: [
					{node: expect.objectContaining({title: 'Foo'})},
					{node: expect.objectContaining({title: 'Baz'})},
					{node: expect.objectContaining({title: 'Bar'})},
				],
			};
			const args = {first: 3, offset: 0, orderBy: '-title'};

			await expect(movieResolver.list(args)).resolves
				.toMatchObject(expectedResponse);
		});

		test('should response movie list with next pages', async () => {
			const args = {first: 1, offset: 0, orderBy: 'title'};
			const result = await movieResolver.list(args);

			expect(result.pageInfo.hasNextPage()).toBeTruthy();
			expect(result.pageInfo.hasPreviousPage()).toBeFalsy();
		});

		test('should response movie list with previous pages', async () => {
			const args = {first: 1, offset: 2, orderBy: 'title'};
			const result = await movieResolver.list(args);

			expect(result.pageInfo.hasNextPage()).toBeFalsy();
			expect(result.pageInfo.hasPreviousPage()).toBeTruthy();
		});
	});

	describe('create function', () => {
		afterEach(() => {
			mockedFetchMovieData.mockReset();
			mockedFetchMovieCredits.mockReset();
			mockedFetchPerson.mockReset();
		});

		test('should fail, because movie already exists', async () => {
			mockedFetchMovieData.mockResolvedValue({
				...movieDataDefault,
				tmdb: 1,
				imdb: 'tt1',
			});

			const expectedResponse = {
				ok: false,
				movie: expect.anything(),
				errors: [{
					field: 'id',
					message: 'This Movie already exists.',
				}],
			};

			const result = await movieResolver.create({tmdb: 1});

			expect(mockedFetchMovieData).toHaveBeenCalledTimes(1);
			expect(result).toEqual(expectedResponse);
		});

		test('should create movie', async () => {
			mockedFetchMovieData.mockResolvedValue({
				...movieDataDefault,
				tmdb: 4,
				imdb: 'tt4',
			});
			mockedFetchMovieCredits.mockResolvedValue([
				{creditId: '1', department: 'Foo', tmdb: 1},
			]);
			mockedFetchPerson.mockResolvedValue({
				...personDataDefault,
				imdb: 'tt1',
				tmdb: 1,
			});

			const expectedResponse = {
				ok: true,
				movie: expect.anything(),
			};

			await expect(ModelMovie.count()).resolves.toBe(3);

			const result = await movieResolver.create({tmdb: 4});

			await expect(ModelMovie.count()).resolves.toBe(4);
			expect(mockedFetchMovieData).toHaveBeenCalledTimes(1);
			expect(mockedFetchMovieCredits).toHaveBeenCalledTimes(1);
			expect(mockedFetchPerson).toHaveBeenCalledTimes(1);
			expect(result).toEqual(expectedResponse);
			await expect(result.movie.countPeople()).resolves.toBe(1);
		});
	});

	describe('update function', () => {
		test('should fail, because movie doesn\'t exist', async () => {
			const expectedResponse = {
				ok: false,
				errors: [{
					field: 'id',
					message: 'Movie not found.',
				}],
			};
			const result = await movieResolver.update({id: 999, input: {backdrop: 'backdrop'}});

			expect(result).toEqual(expectedResponse);
		});

		test('should update backdrop', async () => {
			const expectedResponse = {
				ok: true,
				movie: expect.anything(),
			};
			const result = await movieResolver.update({id: 1, input: {backdrop: 'backdrop'}});

			expect(result).toEqual(expectedResponse);
			expect(result.movie?.backdrop).toBe('mo/20222/new-backdrop');
		});

		test('should update poster', async () => {
			const expectedResponse = {
				ok: true,
				movie: expect.anything(),
			};
			const result = await movieResolver.update({id: 1, input: {poster: 'poster'}});

			expect(result).toEqual(expectedResponse);
			expect(result.movie?.poster).toBe('mo/20222/new-poster');
		});
	});

	describe('refetch function', () => {
		afterEach(() => {
			mockedFetchMovieData.mockReset();
			mockedFetchMovieCredits.mockReset();
			mockedFetchPerson.mockReset();
		});

		test('should fail, because movie doesn\'t exist', async () => {
			const expectedResponse = {
				ok: false,
				errors: [{
					field: 'id',
					message: 'Movie not found.',
				}],
			};
			const result = await movieResolver.refetch({id: 999});

			expect(result).toEqual(expectedResponse);
		});

		test('should create movie', async () => {
			mockedFetchMovieData.mockResolvedValue({
				...movieDataDefault,
				tmdb: 4,
				imdb: 'tt4',
			});
			mockedFetchMovieCredits.mockResolvedValue([
				{creditId: '1', department: 'Foo', tmdb: 1},
			]);
			mockedFetchPerson.mockResolvedValue({
				...personDataDefault,
				imdb: 'tt1',
				tmdb: 1,
			});

			const expectedResponse = {
				ok: true,
				movie: expect.anything(),
			};

			const result = await movieResolver.refetch({id: 1});

			expect(mockedFetchMovieData).toHaveBeenCalledTimes(1);
			expect(mockedFetchMovieCredits).toHaveBeenCalledTimes(1);
			expect(mockedFetchPerson).toHaveBeenCalledTimes(1);
			expect(result).toEqual(expectedResponse);
		});
	});

	describe('delete function', () => {
		test('should fail, because movie doesn\'t exist', async () => {
			const expectedResponse = {
				ok: false,
				errors: [{
					field: 'id',
					message: 'Error during movie delete.',
				}],
			};

			const result = await movieResolver.delete({id: 0});

			expect(result).toEqual(expectedResponse);
		});

		test('should destroy movie model', async () => {
			const expectedResponse = {
				ok: true,
			};

			const result = await movieResolver.delete({id: 1});

			expect(result).toEqual(expectedResponse);
		});
	});
});
