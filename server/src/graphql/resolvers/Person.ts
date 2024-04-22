import {FindAndCountOptions, FindOptions} from 'sequelize';

import Person, {PersonAttributes} from '@models/Person';
import {PersonConnection, PersonNode, QueryPersonArgs} from '@src/graphql-types';


export type PersonType = 'actor' | 'director';
export type ListProps = {
	plain?: boolean;
	type?: PersonType;
};

class PersonController {
	private model = Person;

	async get({id, name}: QueryPersonArgs) {
		if (id && name) {
			throw new Error('You can only search by one attribute.');
		}

		if (!id && !name) {
			throw new Error('You must enter at least one attribute.');
		}

		const options: FindOptions<PersonAttributes> = {
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

	async list(options: FindAndCountOptions<PersonAttributes>): Promise<PersonConnection>;
	async list(options: FindAndCountOptions<PersonAttributes>, plain: boolean): Promise<PersonNode[]>;
	// eslint-disable-next-line max-len
	async list(options: FindAndCountOptions<PersonAttributes>, plain = false): Promise<PersonConnection | PersonNode[]> {
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

export default PersonController;
