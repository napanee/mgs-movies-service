import {GraphQLID, GraphQLInt, GraphQLString} from 'graphql';

import {movieConnection, movieNode} from '../types';
import MovieResolver, {IArgsGet, IArgsList} from '../resolvers/Movie';


class MovieQuery {
	private resolver = new MovieResolver();

	get() {
		return {
			type: movieNode,
			args: {
				id: {
					type: GraphQLID
				}
			},
			resolve: (_: any, args: IArgsGet) => this.resolver.get(args),
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
					defaultValue: 'title'
				},
			},
			resolve: (_: any, args: IArgsList) => this.resolver.list(args),
		};
	}
}

export default MovieQuery;
