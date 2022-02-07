import {enableFetchMocks} from 'jest-fetch-mock';
import fetch from 'jest-fetch-mock';

import {
	fetchImages,
	fetchMovieCredits,
	fetchMovieData,
	fetchPerson,
	searchWithImdb,
	searchWithQuery,
} from './themoviedb';


jest.mock('fs');
enableFetchMocks();

describe('The image saver', () => {
	afterEach(() => {
		fetch.resetMocks();
	});

	test('should use bearer token', async () => {
		const oldEnv = process.env;

		process.env.MOVIE_DB_KEY = '12345';

		fetch.mockResponse(JSON.stringify({backdrops: [], posters: []}), {status: 200});

		await fetchImages(1);

		expect(fetch).toBeCalledWith(
			expect.anything(),
			expect.objectContaining({
				headers: expect.objectContaining({
					Authorization: `Bearer 12345`,
				}),
			})
		);

		process.env = oldEnv;
	});

	test('should throw error', async () => {
		fetch.mockResponse(JSON.stringify({}), {status: 403});

		await expect(fetchImages(1)).rejects.toThrow(/respond with status 403$/);
	});

	test('should return images for all languages', async () => {
		const responseValue = {
			backdrops: [{file_path: 'Foo', width: 100, height: 100, extra: 'data'}],
			posters: [{file_path: 'Bar', width: 100, height: 100, extra: 'data'}],
		};
		const expectedResponse = {
			backdrops: [{filePath: 'Foo', width: 100, height: 100}],
			posters: [{filePath: 'Bar', width: 100, height: 100}],
		};

		fetch.mockResponse(JSON.stringify(responseValue), {status: 200});

		const result = await fetchImages(1);

		expect(fetch).toBeCalledWith('https://api.themoviedb.org/3/movie/1/images', expect.anything());
		expect(result).toEqual(expectedResponse);
	});

	test('should return images for german languages', async () => {
		fetch.mockResponse(JSON.stringify({backdrops: [], posters: []}), {status: 200});

		await fetchImages(1, 'de-DE');

		expect(fetch).toBeCalledWith('https://api.themoviedb.org/3/movie/1/images?language=de-DE', expect.anything());
	});

	test('should return movie credits', async () => {
		const responseValue = {
			cast: [{id: 1, character: 'Foo', credit_id: 1, order: 0, extra: ''}],
			crew: [{id: 1, job: 'Director', creditId: 1, extra: ''}],
		};
		const expectedResponse = [
			{tmdb: 1, department: 'actor', character: 'Foo', creditId: 1, order: 0},
			{tmdb: 1, department: 'director', creditId: 1},
		];

		fetch.mockResponse(JSON.stringify(responseValue), {status: 200});

		const result = await fetchMovieCredits(1);

		expect(fetch).toBeCalledWith('https://api.themoviedb.org/3/movie/1/credits?language=de', expect.anything());
		expect(result).toEqual(expectedResponse);
	});

	test('should return movie data', async () => {
		const responseValue = {
			backdrop_path: 'backdrop_path',
			genres: 'genres',
			id: 'id',
			imdb_id: 'imdb_id',
			original_title: 'original_title',
			overview: 'overview',
			poster_path: 'poster_path',
			release_date: 'release_date',
			runtime: 'runtime',
			title: 'title',
			extra: '',
		};
		const expectedResponse = {
			backdrop: 'backdrop_path',
			genres: 'genres',
			tmdb: 'id',
			imdb: 'imdb_id',
			titleOriginal: 'original_title',
			overview: 'overview',
			poster: 'poster_path',
			releaseDate: 'release_date',
			runtime: 'runtime',
			title: 'title',
		};

		fetch.mockResponse(JSON.stringify(responseValue), {status: 200});

		const result = await fetchMovieData(1);

		expect(fetch).toBeCalledWith('https://api.themoviedb.org/3/movie/1?language=de', expect.anything());
		expect(result).toEqual(expectedResponse);
	});

	test('should return person data', async () => {
		const responseValue = {
			id: 'id',
			imdb_id: 'imdbId',
			profile_path: 'profilePath',
			biography: 'biography',
			birthday: 'birthday',
			deathday: 'deathday',
			name: 'name',
			place_of_birth: 'placeOfBirth',
			extra: '',
		};
		const expectedResponse = {
			tmdb: 'id',
			imdb: 'imdbId',
			image: 'profilePath',
			biography: 'biography',
			birthday: 'birthday',
			deathday: 'deathday',
			name: 'name',
			placeOfBirth: 'placeOfBirth',
		};

		fetch.mockResponse(JSON.stringify(responseValue), {status: 200});

		const result = await fetchPerson(1);

		expect(fetch).toBeCalledWith('https://api.themoviedb.org/3/person/1?language=de', expect.anything());
		expect(result).toEqual(expectedResponse);
	});

	test('should return imdb data', async () => {
		const responseValue = {
			movie_results: [
				{
					id: 'id',
					overview: 'overview',
					poster_path: 'posterPath',
					release_date: 'releaseDate',
					title: 'title',
					extra: '',
				},
			],
			tv_results: [
				{
					id: 'id',
					overview: 'overview',
					poster_path: 'posterPath',
					release_date: 'releaseDate',
					title: 'title',
					extra: '',
				},
			],
		};
		const expectedResponse = [
			{
				id: 'id',
				overview: 'overview',
				posterPath: 'posterPath',
				releaseDate: 'releaseDate',
				title: 'title',
			},
		];

		fetch.mockResponse(JSON.stringify(responseValue), {status: 200});

		const result = await searchWithImdb('tt1');

		expect(fetch).toBeCalledWith(
			'https://api.themoviedb.org/3/find/tt1?external_source=imdb_id&language=de-DE',
			expect.anything()
		);
		expect(result).toEqual(expectedResponse);
	});

	test('should return tmdb data', async () => {
		const responseValue = {
			results: [
				{
					id: 'id',
					overview: 'overview',
					poster_path: 'posterPath',
					release_date: 'releaseDate',
					title: 'title',
					extra: '',
				},
			],
			count: 42,
		};
		const expectedResponse = [
			{
				id: 'id',
				overview: 'overview',
				posterPath: 'posterPath',
				releaseDate: 'releaseDate',
				title: 'title',
			},
		];

		fetch.mockResponse(JSON.stringify(responseValue), {status: 200});

		const result = await searchWithQuery('FooBarBaz');

		expect(fetch).toBeCalledWith(
			'https://api.themoviedb.org/3/search/movie?query=FooBarBaz&language=de-DE',
			expect.anything()
		);
		expect(result).toEqual(expectedResponse);
	});
});
