import {GraphQLEnumType, GraphQLInt, GraphQLNonNull, GraphQLString} from 'graphql';
import {Op} from 'sequelize';
import type {FindAndCountOptions, WhereOptions} from 'sequelize/types';

import {MovieAttributes} from '@models/Movie';
import {QueryMovieArgs, QueryMoviesArgs, MoviesFilterEnum} from '@src/graphql-types';

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

export const MoviesFilterEnumType = new GraphQLEnumType({
	name: 'MoviesFilterEnum',
	values: {
		STAGEABLE: {
			value: 'stageable',
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
					defaultValue: MoviesOrderEnumType.getValue('TITLE_ASC')?.value,
				},
				filter: {
					type: MoviesFilterEnumType,
				},
			},
			resolve: (_: unknown, args: QueryMoviesArgs) => {
				const options: FindAndCountOptions<MovieAttributes> = {
					limit: args.limit,
					offset: args.offset,
					order: [args.order],
				};

				if (args.filter === MoviesFilterEnumType.getValue('STAGEABLE')?.value) {
					options.where = {
						backdrop: {[Op.not]: null},
						logo: {[Op.not]: null},
					} as WhereOptions<MovieAttributes>;
				}


				return this.resolver.list(options);
			},
		};
	}
}

export default MovieQuery;
