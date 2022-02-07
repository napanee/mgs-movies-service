import supertest from 'supertest';

import app from '@src/app';

import MovieResolver from '../resolvers/Movie';


describe('The movie mutation', () => {
	const request = supertest(app);

	test('should create movie', async () => {
		jest.spyOn(MovieResolver.prototype, 'create').mockResolvedValue({
			ok: true,
			movie: expect.anything(),
		});
		const expectedResponse = {
			movieCreate: {
				ok: true,
				errors: null,
			},
		};

		const query = `mutation {
			movieCreate(tmdb: 1) {
				ok
				errors {
					field
					message
				}
			}
		}`;

		const response = await request.post('/graphql').send({query});

		expect(MovieResolver.prototype.create).toHaveBeenCalledTimes(1);
		expect(response.body.data).toEqual(expectedResponse);
	});

	test('should update movie', async () => {
		jest.spyOn(MovieResolver.prototype, 'update').mockResolvedValue({
			ok: true,
			movie: expect.anything(),
		});
		const expectedResponse = {
			movieUpdate: {
				ok: true,
				errors: null,
			},
		};

		const query = `mutation {
			movieUpdate(id: 1, input: {backdrop: "backdrop"}) {
				ok
				errors {
					field
					message
				}
			}
		}`;

		const response = await request.post('/graphql').send({query});

		expect(MovieResolver.prototype.update).toHaveBeenCalledTimes(1);
		expect(response.body.data).toEqual(expectedResponse);
	});

	test('should refetch movie', async () => {
		jest.spyOn(MovieResolver.prototype, 'refetch').mockResolvedValue({
			ok: true,
			movie: expect.anything(),
		});
		const expectedResponse = {
			movieRefetch: {
				ok: true,
				errors: null,
			},
		};

		const query = `mutation {
			movieRefetch(id: 1) {
				ok
				errors {
					field
					message
				}
			}
		}`;

		const response = await request.post('/graphql').send({query});

		expect(MovieResolver.prototype.refetch).toHaveBeenCalledTimes(1);
		expect(response.body.data).toEqual(expectedResponse);
	});

	test('should delete movie', async () => {
		jest.spyOn(MovieResolver.prototype, 'delete').mockResolvedValue({
			ok: true,
		});
		const expectedResponse = {
			movieDelete: {
				ok: true,
				errors: null,
			},
		};

		const query = `mutation {
			movieDelete(id: 1) {
				ok
				errors {
					field
					message
				}
			}
		}`;

		const response = await request.post('/graphql').send({query});

		expect(MovieResolver.prototype.delete).toHaveBeenCalledTimes(1);
		expect(response.body.data).toEqual(expectedResponse);
	});
});
