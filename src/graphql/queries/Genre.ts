import {GraphQLID, GraphQLInt, GraphQLString} from 'graphql';

import GenreResolver, {IArgsGet, IArgsList} from '../resolvers/Genre';
import {genreConnection, genreNode} from '../types';


class GenreQuery {
	private resolver = new GenreResolver();

	get() {
		return {
			type: genreNode,
			args: {
				id: {
					type: GraphQLID,
				},
				name: {
					type: GraphQLString,
				},
			},
			resolve: (_: unknown, args: IArgsGet) => this.resolver.get(args),
		};
	}

	list() {
		return {
			type: genreConnection,
			args: {
				first: {
					type: GraphQLInt,
					defaultValue: 10,
				},
				offset: {
					type: GraphQLInt,
					defaultValue: 0,
				},
				orderBy: {
					type: GraphQLString,
					defaultValue: 'name',
				},
			},
			resolve: (_: unknown, args: IArgsList) => this.resolver.list(args),
		};
	}
}

export default GenreQuery;
