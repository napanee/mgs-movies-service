import {FindAndCountOptions} from 'sequelize/types';
import supertest from 'supertest';

import {Genre, Movie} from '@db/models';
import app from '@src/app';
import {GenreConnection, GenreNode, MovieNode} from '@src/graphql-types';

import GenreResolver from '../resolvers/Genre';
import MovieResolver from '../resolvers/Movie';


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

const genreList = [...Array(10)].map((_, index): GenreNode => ({
	id: index,
	name: `Foo${index}`,
	movies: [],
}));

describe('The genre query', () => {
	const request = supertest(app);

	test('should response single genre with id', async () => {
		const genre = genreList[0];
		const mockFn = jest.spyOn(GenreResolver.prototype, 'get').mockResolvedValue(genre as unknown as Genre);
		const expectedResponse = {genre: {name: genre.name}};
		const query = `query {
			genre(id: 1) {
				name
			}
		}`;

		const response = await request.post('/graphql').send({query});

		expect(GenreResolver.prototype.get).toHaveBeenCalledTimes(1);
		expect(response.body.data).toEqual(expectedResponse);

		mockFn.mockRestore();
	});

	test('should response single genre with name', async () => {
		const genre = genreList[0];
		const mockFn = jest.spyOn(GenreResolver.prototype, 'get').mockResolvedValue(genre as unknown as Genre);
		const expectedResponse = {genre: {id: genre.id, name: genre.name}};
		const query = `query {
			genre(name: "Foo") {
				id
				name
			}
		}`;

		const response = await request.post('/graphql').send({query});

		expect(GenreResolver.prototype.get).toHaveBeenCalledTimes(1);
		expect(response.body.data).toEqual(expectedResponse);

		mockFn.mockRestore();
	});

	test('should response genre list with default args', async () => {
		type ListSpy = (args: FindAndCountOptions) => Promise<GenreConnection>;

		const mockFn = jest.spyOn(GenreResolver.prototype, 'list') as unknown as jest.MockedFunction<ListSpy>;

		mockFn.mockResolvedValue({
			edges: genreList.map((node) => ({node})),
			pageInfo: {
				hasNextPage: true,
				hasPreviousPage: false,
			},
			totalCount: 10,
		});
		const expectedResponse = {
			genres: {
				edges: genreList.map((node) => ({node: {name: node.name}})),
			},
		};
		const query = `{
			genres {
				edges {
					node {
						name
					}
				}
			}
		}`;

		const response = await request.post('/graphql').send({query});

		expect(GenreResolver.prototype.list).toHaveBeenCalledTimes(1);
		expect(mockFn).toBeCalledWith({offset: 0, order: [['name', 'ASC']]});
		expect(response.body.data).toEqual(expectedResponse);

		mockFn.mockRestore();
	});

	test('should response genre list with args', async () => {
		type ListSpy = (args: FindAndCountOptions) => Promise<GenreConnection>;

		const limit = 5;
		const offset = 1;
		const mockFn = jest.spyOn(GenreResolver.prototype, 'list') as unknown as jest.MockedFunction<ListSpy>;

		const query = `{
			genres(limit: ${limit}, offset: ${offset}, order: NAME_DESC) {
				edges {
					node {
						name
					}
				}
			}
		}`;

		await request.post('/graphql').send({query});

		expect(GenreResolver.prototype.list).toHaveBeenCalledTimes(1);
		expect(mockFn).toBeCalledWith({limit, offset, order: [['name', 'DESC']]});

		mockFn.mockRestore();
	});

	test('should response movie with genres', async () => {
		type ListSpy = (args: FindAndCountOptions, plain: boolean) => Promise<GenreNode[]>;

		const movie = movieList[0];
		const mockFnMovieResolver = jest
			.spyOn(MovieResolver.prototype, 'get')
			.mockResolvedValue(movie as unknown as Movie);
		const mockFnGenreResolver = jest
			.spyOn(GenreResolver.prototype, 'list') as unknown as jest.MockedFunction<ListSpy>;

		mockFnGenreResolver.mockResolvedValue(genreList);
		const expectedResponse = {
			movie: {
				title: movie.title,
				genres: genreList.map((genre) => ({name: genre.name})),
			},
		};
		const query = `{
			movie(id: 1) {
				title
				genres {
					name
				}
			}
		}`;

		const response = await request.post('/graphql').send({query});

		expect(MovieResolver.prototype.get).toHaveBeenCalledTimes(1);
		expect(GenreResolver.prototype.list).toHaveBeenCalledTimes(1);
		expect(response.body.data).toEqual(expectedResponse);

		mockFnMovieResolver.mockRestore();
		mockFnGenreResolver.mockRestore();
	});
});
