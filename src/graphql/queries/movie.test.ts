import {FindAndCountOptions} from 'sequelize/types';
import supertest from 'supertest';

import {Genre, Movie, Person} from '@db/models';
import app from '@src/app';
import {GenreNode, MovieConnection, MovieNode, PersonNode} from '@src/graphql-types';

import GenreResolver from '../resolvers/Genre';
import MovieResolver from '../resolvers/Movie';
import PersonResolver from '../resolvers/Person';


const genreList = [...Array(10)].map((_, index): GenreNode => ({
	id: index,
	name: `Foo${index}`,
	movies: [],
}));

const peopleList = [...Array(10)].map((_, index): PersonNode => ({
	biography: null,
	birthday: null,
	deathday: null,
	id: index,
	name: `Foo${index}`,
	placeOfBirth: null,
	filmography: [],
	imageUrl: null,
}));

const movieList = [...Array(10)].map((_, index): MovieNode => ({
	id: index,
	releaseDate: '2022-01-01',
	title: `Foo${index}`,
	titleOriginal: `Foo${index}`,
	backdrop: null,
	overview: null,
	poster: null,
	runtime: null,
	cast: [],
	directors: [],
	genres: [],
}));

describe('The movie query', () => {
	const request = supertest(app);

	test('should response single movie with id', async () => {
		const movie = movieList[0];
		const mockFn = jest.spyOn(MovieResolver.prototype, 'get').mockResolvedValue(movie as unknown as Movie);
		const expectedResponse = {movie: {title: movie.title}};
		const query = `{
			movie(id: 1) {
				title
			}
		}`;

		const response = await request.post('/graphql').send({query});

		expect(MovieResolver.prototype.get).toHaveBeenCalledTimes(1);
		expect(response.body.data).toEqual(expectedResponse);

		mockFn.mockRestore();
	});

	test('should response single movie with title', async () => {
		const movie = movieList[0];
		const mockFn = jest.spyOn(MovieResolver.prototype, 'get').mockResolvedValue(movie as unknown as Movie);
		const expectedResponse = {movie: {title: movie.title}};
		const query = `{
			movie(title: "${movie.title}") {
				title
			}
		}`;

		const response = await request.post('/graphql').send({query});

		expect(MovieResolver.prototype.get).toHaveBeenCalledTimes(1);
		expect(response.body.data).toEqual(expectedResponse);

		mockFn.mockRestore();
	});

	test('should response movie list with default args', async () => {
		type ListSpy = (args: FindAndCountOptions) => Promise<MovieConnection>;

		const mockFn = jest.spyOn(MovieResolver.prototype, 'list') as unknown as jest.MockedFunction<ListSpy>;

		mockFn.mockResolvedValue({
			edges: movieList.map((node) => ({node})),
			pageInfo: {
				hasNextPage: true,
				hasPreviousPage: false,
			},
			totalCount: 10,
		});
		const expectedResponse = {
			movies: {
				edges: movieList.map((node) => ({node: {title: node.title}})),
			},
		};
		const query = `{
			movies {
				edges {
					node {
						title
					}
				}
			}
		}`;

		const response = await request.post('/graphql').send({query});

		expect(MovieResolver.prototype.list).toHaveBeenCalledTimes(1);
		expect(mockFn).toBeCalledWith({limit: 10, offset: 0, order: [['title', 'ASC']]});
		expect(response.body.data).toEqual(expectedResponse);

		mockFn.mockRestore();
	});

	test('should response movie list with args', async () => {
		type ListSpy = (args: FindAndCountOptions) => Promise<MovieConnection>;

		const limit = 5;
		const offset = 1;
		const mockFn = jest.spyOn(MovieResolver.prototype, 'list') as unknown as jest.MockedFunction<ListSpy>;

		const query = `{
			movies(limit: ${limit}, offset: ${offset}, order: RUNTIME_DESC) {
				edges {
					node {
						title
					}
				}
			}
		}`;

		await request.post('/graphql').send({query});

		expect(MovieResolver.prototype.list).toHaveBeenCalledTimes(1);
		expect(mockFn).toBeCalledWith({limit, offset, order: [['runtime', 'DESC']]});

		mockFn.mockRestore();
	});

	test('should response genre with movies', async () => {
		type ListSpy = (args: FindAndCountOptions, plain: boolean) => Promise<MovieNode[]>;

		const genre = genreList[0];
		const mockFnMovieResolver = jest
			.spyOn(MovieResolver.prototype, 'list') as unknown as jest.MockedFunction<ListSpy>;
		const mockFnGenreResolver = jest
			.spyOn(GenreResolver.prototype, 'get')
			.mockResolvedValue(genre as unknown as Genre);

		mockFnMovieResolver.mockResolvedValue(movieList);
		const expectedResponse = {
			genre: {
				name: genre.name,
				movies: movieList.map((movie) => ({title: movie.title})),
			},
		};
		const query = `{
			genre(id: 1) {
				name
				movies {
					title
				}
			}
		}`;

		const response = await request.post('/graphql').send({query});

		expect(MovieResolver.prototype.list).toHaveBeenCalledTimes(1);
		expect(GenreResolver.prototype.get).toHaveBeenCalledTimes(1);
		expect(response.body.data).toEqual(expectedResponse);

		mockFnGenreResolver.mockRestore();
		mockFnMovieResolver.mockRestore();
	});

	test('should response actors with movies', async () => {
		type ListSpy = (args: FindAndCountOptions, plain: boolean) => Promise<MovieNode[]>;

		const person = peopleList[0];
		// eslint-disable-next-line max-len
		const mockFnMovieResolver = jest
			.spyOn(MovieResolver.prototype, 'list') as unknown as jest.MockedFunction<ListSpy>;
		const mockFnPersonResolver = jest
			.spyOn(PersonResolver.prototype, 'get').mockResolvedValue(person as unknown as Person);

		mockFnMovieResolver.mockResolvedValue(movieList.map((movie) => ({
			...movie,
			character: 'character',
		})));
		const expectedResponse = {
			person: {
				name: person.name,
				filmography: movieList.map((movie) => ({
					character: 'character',
					title: movie.title,
				})),
			},
		};
		const query = `{
			person(id: 1) {
				name
				filmography {
					... on filmographyActorNode {
						character
						title
					}
				}
			}
		}`;

		const response = await request.post('/graphql').send({query});

		expect(MovieResolver.prototype.list).toHaveBeenCalledTimes(1);
		expect(PersonResolver.prototype.get).toHaveBeenCalledTimes(1);
		expect(response.body.data).toEqual(expectedResponse);

		mockFnPersonResolver.mockRestore();
		mockFnMovieResolver.mockRestore();
	});

	test('should response directors with movies', async () => {
		type ListSpy = (args: FindAndCountOptions, plain: boolean) => Promise<MovieNode[]>;

		const person = peopleList[0];
		const mockFnMovieResolver = jest
			.spyOn(MovieResolver.prototype, 'list') as unknown as jest.MockedFunction<ListSpy>;
		const mockFnPersonResolver = jest
			.spyOn(PersonResolver.prototype, 'get')
			.mockResolvedValue(person as unknown as Person);

		mockFnMovieResolver.mockResolvedValue(movieList.map((movie) => movie));
		const expectedResponse = {
			person: {
				name: person.name,
				filmography: movieList.map((movie) => ({title: movie.title})),
			},
		};
		const query = `{
			person(id: 1) {
				name
				filmography {
					... on filmographyDirectorNode {
						title
					}
				}
			}
		}`;

		const response = await request.post('/graphql').send({query});

		expect(MovieResolver.prototype.list).toHaveBeenCalledTimes(1);
		expect(PersonResolver.prototype.get).toHaveBeenCalledTimes(1);
		expect(response.body.data).toEqual(expectedResponse);

		mockFnPersonResolver.mockRestore();
		mockFnMovieResolver.mockRestore();
	});
});
