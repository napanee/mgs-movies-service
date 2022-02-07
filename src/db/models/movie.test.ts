import {Sequelize} from 'sequelize';

import Movie from './Movie';

import {saveImage} from '../../utils/save-image';
import {sequelizeConnection} from '../connection';


jest.mock('../../utils/save-image');
const mockedSaveImage = saveImage as jest.MockedFunction<typeof saveImage>;

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
	});

	test('should save backdrop', async () => {
		const movie = await Movie.create({
			...movieDataDefault,
			backdrop: 'backdrop',
		});

		expect(mockedSaveImage).toBeCalledTimes(1);
		expect(movie.backdrop).toBe('new-backdrop');
		expect(movie.poster).toBeNull();
	});

	test('should save poster', async () => {
		const movie = await Movie.create({
			...movieDataDefault,
			poster: 'poster',
		});

		expect(mockedSaveImage).toBeCalledTimes(1);
		expect(movie.backdrop).toBeNull();
		expect(movie.poster).toBe('new-poster');
	});

	test('should save backdrop and poster', async () => {
		const movie = await Movie.create({
			...movieDataDefault,
			backdrop: 'backdrop',
			poster: 'poster',
		});

		expect(mockedSaveImage).toBeCalledTimes(2);
		expect(movie.backdrop).toBe('new-backdrop');
		expect(movie.poster).toBe('new-poster');
	});

	test('should update backdrop', async () => {
		const movie = await Movie.create(movieDataDefault);

		expect(movie.backdrop).toBeNull();

		await movie.update({backdrop: 'backdrop'});

		expect(mockedSaveImage).toBeCalledTimes(1);
		expect(movie.backdrop).toBe('new-backdrop');
	});

	test('should update poster', async () => {
		const movie = await Movie.create(movieDataDefault);

		expect(movie.poster).toBeNull();

		await movie.update({poster: 'poster'});

		expect(mockedSaveImage).toBeCalledTimes(1);
		expect(movie.poster).toBe('new-poster');
	});

	test('should update backdrop and poster', async () => {
		const movie = await Movie.create(movieDataDefault);

		expect(movie.backdrop).toBeNull();
		expect(movie.poster).toBeNull();

		await movie.update({backdrop: 'backdrop', poster: 'poster'});

		expect(mockedSaveImage).toBeCalledTimes(2);
		expect(movie.backdrop).toBe('new-backdrop');
		expect(movie.poster).toBe('new-poster');
	});
});
