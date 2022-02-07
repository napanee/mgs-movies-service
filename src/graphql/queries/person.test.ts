import {FindOptions} from 'sequelize';
import supertest from 'supertest';

import {MovieOutput} from '@models/Movie';
import {PersonOutput} from '@models/Person';
import app from '@src/app';

import MovieResolver from '../resolvers/Movie';
import PersonResolver from '../resolvers/Person';


const movieList = [...Array(10)].map((_, index): MovieOutput => ({
	id: `${index}`,
	imdb: `tt${index}`,
	releaseDate: '2022-01-01',
	title: `Foo${index}`,
	titleOriginal: `Foo${index}`,
	tmdb: index,
}));

const peopleList = [...Array(10)].map((_, index): PersonOutput => ({
	biography: null,
	birthday: null,
	deathday: null,
	id: `${index}`,
	image: null,
	imdb: `tt${index}`,
	name: `Foo${index}`,
	placeOfBirth: null,
	tmdb: index,
}));

describe('The person query', () => {
	const request = supertest(app);

	test('should response single person with id', async () => {
		const person = peopleList[0];
		const mockFn = jest.spyOn(PersonResolver.prototype, 'get').mockResolvedValue(person);
		const expectedResponse = {person: {name: person.name}};
		const query = `{
			person(id: 1) {
				name
			}
		}`;

		const response = await request.post('/graphql').send({query});

		expect(PersonResolver.prototype.get).toHaveBeenCalledTimes(1);
		expect(response.body.data).toEqual(expectedResponse);

		mockFn.mockRestore();
	});

	test('should response single person with name', async () => {
		const person = peopleList[0];
		const mockFn = jest.spyOn(PersonResolver.prototype, 'get').mockResolvedValue(person);
		const expectedResponse = {person: {id: person.id, name: person.name}};
		const query = `query {
			person(name: "Foo") {
				id
				name
			}
		}`;

		const response = await request.post('/graphql').send({query});

		expect(PersonResolver.prototype.get).toHaveBeenCalledTimes(1);
		expect(response.body.data).toEqual(expectedResponse);

		mockFn.mockRestore();
	});

	test('should response people list', async () => {
		const mockFn = jest.spyOn(PersonResolver.prototype, 'list').mockResolvedValue({
			edges: peopleList.map((node) => ({node})),
			pageInfo: {
				hasNextPage: () => true,
				hasPreviousPage: () => false,
			},
			totalCount: 10,
		});
		const expectedResponse = {
			people: {
				edges: peopleList.map((node) => ({node: {name: node.name}})),
			},
		};
		const query = `{
			people {
				edges {
					node {
						name
					}
				}
			}
		}`;

		const response = await request.post('/graphql').send({query});

		expect(PersonResolver.prototype.list).toHaveBeenCalledTimes(1);
		expect(response.body.data).toEqual(expectedResponse);

		mockFn.mockRestore();
	});

	test('should response movie with actors', async () => {
		type ListSpy = (args: FindOptions) => Promise<PersonOutput[]>;

		const movie = movieList[0];
		const mockFnMovieResolver = jest.spyOn(MovieResolver.prototype, 'get').mockResolvedValue(movie);
		// eslint-disable-next-line max-len
		const mockFnPersonResolver = jest.spyOn(PersonResolver.prototype, 'list') as unknown as jest.MockedFunction<ListSpy>;

		mockFnPersonResolver.mockResolvedValue(peopleList);
		const expectedResponse = {
			movie: {
				title: movie.title,
				cast: peopleList.map((person) => ({name: person.name})),
			},
		};
		const query = `{
			movie(id: 1) {
				title
				cast {
					name
				}
			}
		}`;

		const response = await request.post('/graphql').send({query});

		expect(MovieResolver.prototype.get).toHaveBeenCalledTimes(1);
		expect(PersonResolver.prototype.list).toHaveBeenCalledTimes(1);
		expect(response.body.data).toEqual(expectedResponse);

		mockFnMovieResolver.mockRestore();
		mockFnPersonResolver.mockRestore();
	});

	test('should response movie with directors', async () => {
		type ListSpy = (args: FindOptions) => Promise<PersonOutput[]>;

		const movie = movieList[0];
		const mockFnMovieResolver = jest.spyOn(MovieResolver.prototype, 'get').mockResolvedValue(movie);
		// eslint-disable-next-line max-len
		const mockFnPersonResolver = jest.spyOn(PersonResolver.prototype, 'list') as unknown as jest.MockedFunction<ListSpy>;

		mockFnPersonResolver.mockResolvedValue(peopleList);
		const expectedResponse = {
			movie: {
				title: movie.title,
				directors: peopleList.map((person) => ({name: person.name})),
			},
		};
		const query = `{
			movie(id: 1) {
				title
				directors {
					name
				}
			}
		}`;

		const response = await request.post('/graphql').send({query});

		expect(MovieResolver.prototype.get).toHaveBeenCalledTimes(1);
		expect(PersonResolver.prototype.list).toHaveBeenCalledTimes(1);
		expect(response.body.data).toEqual(expectedResponse);

		mockFnMovieResolver.mockRestore();
		mockFnPersonResolver.mockRestore();
	});
});
