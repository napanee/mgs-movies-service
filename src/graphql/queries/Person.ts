import {GraphQLEnumType, GraphQLInt, GraphQLNonNull, GraphQLString} from 'graphql';
import {FindAndCountOptions, Includeable, WhereOptions} from 'sequelize/types';

import {Movie} from '@db/models';
import {MoviePeopleInput} from '@models/MoviePeople';
import {QueryPeopleArgs, QueryPersonArgs} from '@src/graphql-types';

import PersonResolver, {PersonType} from '../resolvers/Person';
import {personConnection, personNode} from '../types';


export const PeopleOrderByEnumType = new GraphQLEnumType({
	name: 'PeopleOrderByEnum',
	values: {
		NAME_ASC: {
			value: ['name', 'ASC'],
		},
		NAME_DESC: {
			value: ['name', 'DESC'],
		},
	},
});

class PersonQuery {
	private resolver = new PersonResolver();

	get() {
		return {
			type: personNode,
			args: {
				id: {
					type: GraphQLInt,
				},
				name: {
					type: GraphQLString,
				},
			},
			resolve: (_: unknown, args: QueryPersonArgs) => this.resolver.get(args),
		};
	}

	list(type?: PersonType) {
		return {
			type: new GraphQLNonNull(personConnection),
			args: {
				limit: {
					type: GraphQLInt,
				},
				offset: {
					type: new GraphQLNonNull(GraphQLInt),
					defaultValue: 0,
				},
				order: {
					type: new GraphQLNonNull(PeopleOrderByEnumType),
					defaultValue: PeopleOrderByEnumType.getValues()[0].value,
				},
			},
			resolve: (_: unknown, args: QueryPeopleArgs) => {
				const options: FindAndCountOptions = {
					offset: args.offset,
					order: [args.order],
				};

				if (args.limit) {
					options.limit = args.limit;
				}

				if (type) {
					const include: Includeable = {
						attributes: [],
						model: Movie,
						through: {
							where: {
								department: type,
							} as WhereOptions<MoviePeopleInput>,
						},
						required: true,
					};

					options.include = include;
					options.distinct = true;
				}

				return this.resolver.list(options);
			},
		};
	}
}

export default PersonQuery;
