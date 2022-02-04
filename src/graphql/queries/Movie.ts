import {GraphQLID, GraphQLInt, GraphQLString} from 'graphql';

import MovieResolver, {IArgsGet, IArgsList} from '../resolvers/Movie';
import {movieConnection, movieNode} from '../types';


class MovieQuery {
	private resolver = new MovieResolver();

	get() {
		return {
			type: movieNode,
			args: {
				id: {
					type: GraphQLID,
				},
			},
			resolve: (_: unknown, args: IArgsGet) => this.resolver.get(args),
		};
	}

	list() {
		return {
			type: movieConnection,
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
					defaultValue: 'title',
				},
			},
			resolve: (_: unknown, args: IArgsList) => this.resolver.list(args),
		};
	}
}

export default MovieQuery;
