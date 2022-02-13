import cryptoJs from 'crypto-js';
import {Sequelize} from 'sequelize';

import {saveImage} from '@utils/index';

import Movie from './Movie';
import MoviePeople from './MoviePeople';
import Person from './Person';

import {sequelizeConnection} from '../connection';


jest.mock('@utils/save-image');
const mockedSaveImage = saveImage as jest.MockedFunction<typeof saveImage>;
const mockedMD5 = cryptoJs.MD5 as jest.MockedFunction<typeof cryptoJs.MD5>;

const nullableMovieProperties = {overview: null, runtime: null, backdrop: null, poster: null};
const movieDataDefault = {
	...nullableMovieProperties,
	tmdb: 1,
	imdb: 'tt1',
	genres: [
		{id: 1, name: 'foo'},
		{id: 2, name: 'bar'},
	],
	titleOriginal: 'titleOriginal',
	releaseDate: '2022-01-01',
	runtime: 1,
	title: 'title',
};

describe('The movie model', () => {
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

	test('should save backdrop', async () => {
		const movie = await Movie.create({
			...movieDataDefault,
			backdrop: 'backdrop',
		});

		expect(mockedSaveImage).toBeCalledTimes(1);
		expect(movie.backdrop).toBe('mo/20222/new-backdrop');
		expect(movie.poster).toBeNull();
	});

	test('should save poster', async () => {
		const movie = await Movie.create({
			...movieDataDefault,
			poster: 'poster',
		});

		expect(mockedSaveImage).toBeCalledTimes(1);
		expect(movie.backdrop).toBeNull();
		expect(movie.poster).toBe('mo/20222/new-poster');
	});

	test('should save backdrop and poster', async () => {
		const movie = await Movie.create({
			...movieDataDefault,
			backdrop: 'backdrop',
			poster: 'poster',
		});

		expect(mockedSaveImage).toBeCalledTimes(2);
		expect(movie.backdrop).toBe('mo/20222/new-backdrop');
		expect(movie.poster).toBe('mo/20222/new-poster');
	});

	test('should update backdrop', async () => {
		const movie = await Movie.create(movieDataDefault);

		expect(movie.backdrop).toBeNull();

		await movie.update({backdrop: 'backdrop'});

		expect(mockedSaveImage).toBeCalledTimes(1);
		expect(movie.backdrop).toBe('mo/20222/new-backdrop');
	});

	test('should update poster', async () => {
		const movie = await Movie.create(movieDataDefault);

		expect(movie.poster).toBeNull();

		await movie.update({poster: 'poster'});

		expect(mockedSaveImage).toBeCalledTimes(1);
		expect(movie.poster).toBe('mo/20222/new-poster');
	});

	test('should update backdrop and poster', async () => {
		const movie = await Movie.create(movieDataDefault);

		expect(movie.backdrop).toBeNull();
		expect(movie.poster).toBeNull();

		await movie.update({backdrop: 'backdrop', poster: 'poster'});

		expect(mockedSaveImage).toBeCalledTimes(2);
		expect(movie.backdrop).toBe('mo/20222/new-backdrop');
		expect(movie.poster).toBe('mo/20222/new-poster');
	});

	test('should get character name from person', async () => {
		const movie = await Movie.create({
			...movieDataDefault,
			title: 'FooWithCharacter',
		});

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

		await person.addMovie(movie, {through: {character: 'Foo', creditId: '1', department: 'actor'}});

		const result = await Movie.findOne({
			where: {title: 'FooWithCharacter'},
			include: {
				model: MoviePeople,
				as: 'filmography',
				where: {
					personId: person.id,
				},
			},
		});

		expect(result?.character).toBe('Foo');
	});

	test('should throw error, if character would set directly', async () => {
		const error = 'Do not try to set the `character` with Foo!';
		const movieCreate = Movie.create({
			...movieDataDefault,
			title: 'FooWithCharacter',
			character: 'Foo',
		});

		await expect(movieCreate).rejects.toThrow(error);
	});
});
