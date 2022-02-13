import {
	GraphQLID,
	GraphQLInt,
	GraphQLList,
	GraphQLObjectType,
	GraphQLString,
} from 'graphql';

import Genre, {GenreOutput} from '@models/Genre';

import {pageInfo} from './base';
import {movieNode} from './movie';

import MovieResolver, {IArgsList as IArgsListMovie} from '../resolvers/Movie';


const movieResolver = new MovieResolver();

export const genreConnection = new GraphQLObjectType({
	name: 'genreConnection',
	fields: () => ({
		edges: {
			type: new GraphQLList(genreEdge),
		},
		pageInfo: {
			type: pageInfo,
		},
		totalCount: {
			type: GraphQLInt,
		},
	}),
});

export const genreEdge = new GraphQLObjectType({
	name: 'genreEdge',
	fields: () => ({
		node: {
			type: genreNode,
		},
		cursor: {
			type: GraphQLString,
		},
	}),
});

export const genreNode: GraphQLObjectType = new GraphQLObjectType({
	name: 'genreNode',
	fields: () => ({
		id: {
			type: GraphQLID,
		},
		name: {
			type: GraphQLString,
		},
		movies: {
			type: new GraphQLList(movieNode),
			resolve: (parent: GenreOutput) => {
				const args: IArgsListMovie = {
					include: {
						model: Genre,
						where: {id: parent.id},
					},
				};

				return movieResolver.list(args, true);
			},
		},
	}),
});
