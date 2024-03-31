import {GraphQLEnumType, GraphQLInt, GraphQLNonNull, GraphQLString} from 'graphql';
import {FindAndCountOptions} from 'sequelize';

import {QueryGenreArgs, QueryGenresArgs} from '@src/graphql-types';

import GenreResolver from '../resolvers/Genre';
import {genreConnection, genreNode} from '../types';


export const GenresOrderByEnumType = new GraphQLEnumType({
	name: 'GenresOrderByEnum',
	values: {
		NAME_ASC: {
			value: ['name', 'ASC'],
		},
		NAME_DESC: {
			value: ['name', 'DESC'],
		},
	},
});

class GenreQuery {
	private resolver = new GenreResolver();

	get() {
		return {
			type: genreNode,
			args: {
				id: {
					type: GraphQLInt,
				},
				name: {
					type: GraphQLString,
				},
			},
			resolve: (_: unknown, args: QueryGenreArgs) => this.resolver.get(args),
		};
	}

	list() {
		return {
			type: new GraphQLNonNull(genreConnection),
			args: {
				limit: {
					type: GraphQLInt,
				},
				offset: {
					type: new GraphQLNonNull(GraphQLInt),
					defaultValue: 0,
				},
				order: {
					type: new GraphQLNonNull(GenresOrderByEnumType),
					defaultValue: GenresOrderByEnumType.getValues()[0].value,
				},
			},
			resolve: (_: unknown, args: QueryGenresArgs) => {
				const options: FindAndCountOptions = {
					offset: args.offset,
					order: [args.order],
				};

				if (args.limit) {
					options.limit = args.limit;
				}

				return this.resolver.list(options);
			},
		};
	}
}

export default GenreQuery;
