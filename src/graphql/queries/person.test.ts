import {FindAndCountOptions} from 'sequelize/types';
import supertest from 'supertest';

import {Movie, Person} from '@db/models';
import app from '@src/app';
import {MovieNode, PersonConnection, PersonNode} from '@src/graphql-types';

import MovieResolver from '../resolvers/Movie';
import PersonResolver from '../resolvers/Person';


const movieList = [...Array(10)].map((_, index): MovieNode => ({
	id: index,
	releaseDate: '2022-01-01',
	title: `Foo${index}`,
	titleOriginal: `Foo${index}`,
	backdrop: null,
	overview: null,
	poster: null,
	runtime: null,
	cast: null,
	directors: null,
	genres: [],
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

describe('The person query', () => {
	const request = supertest(app);

	test('should response single person with id', async () => {
		const person = peopleList[0];
		const mockFn = jest.spyOn(PersonResolver.prototype, 'get').mockResolvedValue(person as unknown as Person);
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
		const mockFn = jest.spyOn(PersonResolver.prototype, 'get').mockResolvedValue(person as unknown as Person);
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

	test('should response people list with default args', async () => {
		type ListSpy = (args: FindAndCountOptions) => Promise<PersonConnection>;

		const mockFn = jest.spyOn(PersonResolver.prototype, 'list') as unknown as jest.MockedFunction<ListSpy>;

		mockFn.mockResolvedValue({
			edges: peopleList.map((node) => ({node})),
			pageInfo: {
				hasNextPage: false,
				hasPreviousPage: false,
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
		expect(mockFn).toBeCalledWith({offset: 0, order: [['name', 'ASC']]});

		mockFn.mockRestore();
	});

	test('should response people list with args', async () => {
		type ListSpy = (args: FindAndCountOptions) => Promise<PersonConnection>;

		const limit = 5;
		const offset = 1;
		const mockFn = jest.spyOn(PersonResolver.prototype, 'list') as unknown as jest.MockedFunction<ListSpy>;

		const query = `{
			people(limit: ${limit}, offset: ${offset}, order: NAME_DESC) {
				edges {
					node {
						name
					}
				}
			}
		}`;

		await request.post('/graphql').send({query});

		expect(PersonResolver.prototype.list).toHaveBeenCalledTimes(1);
		expect(mockFn).toBeCalledWith({limit, offset, order: [['name', 'DESC']]});

		mockFn.mockRestore();
	});

	test('should response actor list', async () => {
		type ListSpy = (args: FindAndCountOptions) => Promise<PersonConnection>;

		const mockFn = jest.spyOn(PersonResolver.prototype, 'list') as unknown as jest.MockedFunction<ListSpy>;

		mockFn.mockResolvedValue({
			edges: peopleList.map((node) => ({node})),
			pageInfo: {
				hasNextPage: false,
				hasPreviousPage: false,
			},
			totalCount: 10,
		});
		const expectedResponse = {
			actors: {
				edges: peopleList.map((node) => ({node: {name: node.name}})),
			},
		};
		const query = `{
			actors {
				edges {
					node {
						name
					}
				}
			}
		}`;

		const response = await request.post('/graphql').send({query});

		expect(PersonResolver.prototype.list).toHaveBeenCalledTimes(1);
		expect(mockFn).toBeCalledWith({
			distinct: true,
			include: {
				as: 'movies',
				attributes: expect.arrayContaining([]),
				model: expect.any(Function),
				through: {
					where: {
						department: 'actor',
					},
				},
			},
			offset: 0,
			order: [['name', 'ASC']],
		});
		expect(response.body.data).toEqual(expectedResponse);

		mockFn.mockRestore();
	});

	test('should response movie with actors', async () => {
		type ListSpy = (args: FindAndCountOptions, plain: boolean) => Promise<PersonNode[]>;

		const movie = movieList[0];
		const mockFnMovieResolver = jest
			.spyOn(MovieResolver.prototype, 'get').mockResolvedValue(movie as unknown as Movie);
		const mockFnPersonResolver = jest
			.spyOn(PersonResolver.prototype, 'list') as unknown as jest.MockedFunction<ListSpy>;

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
		type ListSpy = (args: FindAndCountOptions, plain: boolean) => Promise<PersonNode[]>;

		const movie = movieList[0];
		const mockFnMovieResolver = jest
			.spyOn(MovieResolver.prototype, 'get').mockResolvedValue(movie as unknown as Movie);
		const mockFnPersonResolver = jest
			.spyOn(PersonResolver.prototype, 'list') as unknown as jest.MockedFunction<ListSpy>;

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
