import {FindOptions} from 'sequelize';
import supertest from 'supertest';

import app from '../../app';
import {GenreOutput} from '../../db/models/Genre';
import {MovieOutput} from '../../db/models/Movie';
import GenreResolver from '../resolvers/Genre';
import MovieResolver from '../resolvers/Movie';


const movieList = [...Array(10)].map((_, index): MovieOutput => ({
	id: `${index}`,
	imdb: `tt${index}`,
	releaseDate: '2022-01-01',
	title: `Foo${index}`,
	titleOriginal: `Foo${index}`,
	tmdb: index,
}));

const genreList = [...Array(10)].map((_, index): GenreOutput => ({
	id: `${index}`,
	name: `Foo${index}`,
	tmdb: index,
}));

describe('The genre query', () => {
	const request = supertest(app);

	test('should response single genre with id', async () => {
		const genre = genreList[0];
		const mockFn = jest.spyOn(GenreResolver.prototype, 'get').mockResolvedValue(genre);
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
		const mockFn = jest.spyOn(GenreResolver.prototype, 'get').mockResolvedValue(genre);
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

	test('should response genre list', async () => {
		const mockFn = jest.spyOn(GenreResolver.prototype, 'list').mockResolvedValue({
			edges: genreList.map((node) => ({node})),
			pageInfo: {
				hasNextPage: () => true,
				hasPreviousPage: () => false,
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
		expect(response.body.data).toEqual(expectedResponse);

		mockFn.mockRestore();
	});

	test('should response movie with genres', async () => {
		type ListSpy = (args: FindOptions) => Promise<GenreOutput[]>;

		const movie = movieList[0];
		const mockFnMovieResolver = jest.spyOn(MovieResolver.prototype, 'get').mockResolvedValue(movie);
		// eslint-disable-next-line max-len
		const mockFnGenreResolver = jest.spyOn(GenreResolver.prototype, 'list') as unknown as jest.MockedFunction<ListSpy>;

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

		const response = await request.post('/graphql')
			.send({query})
			.set("Accept", "application/json");

		expect(MovieResolver.prototype.get).toHaveBeenCalledTimes(1);
		expect(GenreResolver.prototype.list).toHaveBeenCalledTimes(1);
		expect(response.body.data).toEqual(expectedResponse);

		mockFnMovieResolver.mockRestore();
		mockFnGenreResolver.mockRestore();
	});
});
