import {FindOptions, Order, WhereOptions} from 'sequelize';

import Genre, {GenreInput, GenreOutput} from '@models/Genre';


interface IOptions {
	where?: WhereOptions<GenreInput>;
}

export interface IArgsGet {
	id?: number;
	name?: string;
}

export interface IArgsList extends FindOptions<GenreInput> {
	orderBy?: string;
}

export interface IListResponse {
	edges: {
		node: GenreOutput;
	}[];
	pageInfo: {
		hasNextPage: () => boolean;
		hasPreviousPage: () => boolean;
	};
	totalCount: number;
}

class GenreController {
	private model = Genre;

	async get({id, name}: IArgsGet): Promise<GenreOutput | null> {
		if (id && name) {
			throw new Error('You can only search by one attribute.');
		}

		if (!id && !name) {
			throw new Error('You must enter at least one attribute.');
		}

		const options: IOptions = {
			where: {},
		};

		if (id) {
			options.where = {id};
		}

		if (name) {
			options.where = {name};
		}

		return this.model.findOne(options);
	}

	async list(args: IArgsList): Promise<IListResponse>;
	async list(args: IArgsList, plain?: boolean): Promise<GenreOutput[]>;
	async list({orderBy, ...options}: IArgsList, plain = false): Promise<IListResponse | GenreOutput[]> {
		if (orderBy) {
			const orderDirection = orderBy.startsWith('-') ? 'DESC' : 'ASC';
			const order: Order = [[orderBy.replace('-', ''), orderDirection]];

			options.order = order;
		}

		const {rows, count} = await this.model.findAndCountAll(options);

		if (plain) {
			return rows;
		}

		return {
			edges: rows.map((node) => ({
				node,
			})),
			pageInfo: {
				hasNextPage: () => count > (options.offset || 0) + rows.length,
				hasPreviousPage: () => !!options.offset && options.offset > 0,
			},
			totalCount: count,
		};
	}
}

export default GenreController;
