import {FindAndCountOptions, FindOptions} from 'sequelize';

import Genre from '@models/Genre';
import {GenreConnection, GenreNode, QueryGenreArgs} from '@src/graphql-types';


class GenreController {
	private model = Genre;

	async get({id, name}: QueryGenreArgs) {
		if (id && name) {
			throw new Error('You can only search by one attribute.');
		}

		if (!id && !name) {
			throw new Error('You must enter at least one attribute.');
		}

		const options: FindOptions = {
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

	async list(options: FindAndCountOptions): Promise<GenreConnection>;
	async list(options: FindAndCountOptions, plain?: boolean): Promise<GenreNode[]>;
	async list(options: FindAndCountOptions, plain = false): Promise<GenreConnection | GenreNode[]> {
		const {rows, count} = await this.model.findAndCountAll(options);

		if (plain) {
			return rows;
		}

		return {
			edges: rows.map((node) => ({
				node,
			})),
			pageInfo: {
				hasNextPage: count > (options.offset || 0) + rows.length,
				hasPreviousPage: !!options.offset && options.offset > 0,
			},
			totalCount: count,
		};
	}
}

export default GenreController;
