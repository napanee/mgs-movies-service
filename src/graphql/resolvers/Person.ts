import {FindAndCountOptions, Includeable, Order, WhereOptions} from 'sequelize';

import Movie from '@models/Movie';
import Person, {PersonInput, PersonOutput} from '@models/Person';


interface IOptions {
	where?: WhereOptions<PersonInput>;
}

export interface IArgsGet {
	id?: number;
	name?: string;
}

export type PersonType = 'actor' | 'director';

export interface IArgsList extends FindAndCountOptions<PersonInput> {
	orderBy?: string;
	type?: PersonType;
}

export interface IListResponse {
	edges: {
		node: PersonOutput;
	}[];
	pageInfo: {
		hasNextPage: () => boolean;
		hasPreviousPage: () => boolean;
	};
	totalCount: number;
}

class PersonController {
	private model = Person;

	async get({id, name}: IArgsGet): Promise<PersonOutput | null> {
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
	async list(args: IArgsList, plain: boolean): Promise<PersonOutput[]>;
	async list({orderBy, type, ...options}: IArgsList, plain = false): Promise<IListResponse | PersonOutput[]> {
		if (type) {
			const include: Includeable = {
				attributes: [],
				model: Movie,
				as: 'movies',
				through: {
					where: {department: type},
				},
			};

			options.include = include;
			options.distinct = true;
		}

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

export default PersonController;
