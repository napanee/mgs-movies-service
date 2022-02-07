import {FindOptions, Order, WhereOptions} from 'sequelize';

import Person, {PersonInput, PersonOutput} from '@models/Person';
import {instanceOfFindOptions} from '@utils/index';


interface IOptions {
	where?: WhereOptions<PersonInput>;
}

export interface IArgsGet {
	id?: number;
	name?: string;
}

export interface IArgsList {
	first: number;
	offset: number;
	orderBy: string;
}

interface IListResponse {
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

	async list(args: FindOptions): Promise<PersonOutput[]>;
	async list(args: IArgsList): Promise<IListResponse>;
	async list(args: IArgsList | FindOptions): Promise<IListResponse | PersonOutput[]> {
		if (instanceOfFindOptions(args)) {
			return this.model.findAll(args);
		}

		const limit = args.first;
		const offset = args.offset;
		const orderDirection = args.orderBy.startsWith('-') ? 'DESC' : 'ASC';
		const order: Order = [[args.orderBy.replace('-', ''), orderDirection]];
		const genres = await this.model.findAll({limit, offset, order});
		const totalCount = await this.model.count();

		return {
			edges: genres.map((node) => ({
				node,
			})),
			pageInfo: {
				hasNextPage: () => totalCount > limit + offset,
				hasPreviousPage: () => offset > 0,
			},
			totalCount,
		};
	}
}

export default PersonController;
