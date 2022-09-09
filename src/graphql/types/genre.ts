import {GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString} from 'graphql';
import {FindAndCountOptions, WhereOptions} from 'sequelize/types';

import Genre, {GenreInput} from '@models/Genre';

import {pageInfo} from './base';
import {movieNode} from './movie';

import MovieResolver from '../resolvers/Movie';


const movieResolver = new MovieResolver();

export const genreConnection: GraphQLObjectType = new GraphQLObjectType({
	name: 'genreConnection',
	fields: () => ({
		edges: {
			type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(genreEdge))),
		},
		pageInfo: {
			type: new GraphQLNonNull(pageInfo),
		},
		totalCount: {
			type: new GraphQLNonNull(GraphQLInt),
		},
	}),
});

export const genreEdge: GraphQLObjectType = new GraphQLObjectType({
	name: 'genreEdge',
	fields: () => ({
		node: {
			type: new GraphQLNonNull(genreNode),
		},
	}),
});

export const genreNode: GraphQLObjectType = new GraphQLObjectType({
	name: 'genreNode',
	fields: () => ({
		id: {
			type: new GraphQLNonNull(GraphQLInt),
		},
		name: {
			type: new GraphQLNonNull(GraphQLString),
		},
		movies: {
			type: new GraphQLNonNull(new GraphQLList(movieNode)),
			resolve: (genre) => {
				const args: FindAndCountOptions = {
					include: {
						model: Genre,
						where: {id: genre.id} as WhereOptions<GenreInput>,
					},
				};

				return movieResolver.list(args, true);
			},
		},
	}),
});
