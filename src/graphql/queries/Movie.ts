import {GraphQLEnumType, GraphQLInt, GraphQLNonNull, GraphQLString} from 'graphql';
import {FindAndCountOptions} from 'sequelize/types';

import {QueryMovieArgs, QueryMoviesArgs} from '@src/graphql-types';

import MovieResolver from '../resolvers/Movie';
import {movieConnection, movieNode} from '../types';


export const MoviesOrderEnumType = new GraphQLEnumType({
	name: 'MoviesOrderEnum',
	values: {
		TITLE_ASC: {
			value: ['title', 'ASC'],
		},
		TITLE_DESC: {
			value: ['title', 'DESC'],
		},
		RUNTIME_ASC: {
			value: ['runtime', 'ASC'],
		},
		RUNTIME_DESC: {
			value: ['runtime', 'DESC'],
		},
		RELEASE_DATE_ASC: {
			value: ['releaseDate', 'ASC'],
		},
		RELEASE_DATE_DESC: {
			value: ['releaseDate', 'DESC'],
		},
	},
});

class MovieQuery {
	private resolver = new MovieResolver();

	get() {
		return {
			type: movieNode,
			args: {
				id: {
					type: GraphQLInt,
				},
				title: {
					type: GraphQLString,
				},
			},
			resolve: (_: unknown, args: QueryMovieArgs) => this.resolver.get(args),
		};
	}

	list() {
		return {
			type: new GraphQLNonNull(movieConnection),
			args: {
				limit: {
					type: new GraphQLNonNull(GraphQLInt),
					defaultValue: 10,
				},
				offset: {
					type: new GraphQLNonNull(GraphQLInt),
					defaultValue: 0,
				},
				order: {
					type: new GraphQLNonNull(MoviesOrderEnumType),
					defaultValue: MoviesOrderEnumType.getValues()[0].value,
				},
			},
			resolve: (_: unknown, args: QueryMoviesArgs) => {
				const options: FindAndCountOptions = {
					limit: args.limit,
					offset: args.offset,
					order: [args.order],
				};

				return this.resolver.list(options);
			},
		};
	}
}

export default MovieQuery;
