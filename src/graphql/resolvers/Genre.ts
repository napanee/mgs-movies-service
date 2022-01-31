import {IncludeOptions, Order, WhereOptions} from 'sequelize';

import Genre, {GenreInput, GenreOutput} from '../../db/models/Genre';
import {instanceOfIncludeOptions} from '../../utils/typecheck';


interface IOptions {
	where?: WhereOptions<GenreInput>;
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
			where: {}
		};

		if (id) {
			options.where = {id};
		}

		if (name) {
			options.where = {name};
		}

		return this.model.findOne(options);
	}

	async list(args: IncludeOptions): Promise<GenreOutput[]>;
	async list(args: IArgsList): Promise<IListResponse>;
	async list(args: IArgsList | IncludeOptions): Promise<IListResponse | GenreOutput[]> {
		if (instanceOfIncludeOptions(args)) {
			return this.model.findAll({include: args});
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
				hasPreviousPage: () => offset > 0
			},
			totalCount
		};
	}
}

export default GenreController;
