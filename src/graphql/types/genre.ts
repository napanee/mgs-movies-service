import {
	GraphQLID,
	GraphQLInt,
	GraphQLList,
	GraphQLObjectType,
	GraphQLString,
} from 'graphql';
import {FindOptions} from 'sequelize';

import {pageInfo} from './base';
import {movieNode} from './movie';

import Genre, {GenreOutput} from '../../db/models/Genre';
import {MovieResolver} from '../resolvers';


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
				const args: FindOptions = {
					include: {
						model: Genre,
						where: {id: parent.id},
					},
				};

				return movieResolver.list(args);
			},
		},
	}),
});
