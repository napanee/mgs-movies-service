import {
	GraphQLBoolean,
	GraphQLID,
	GraphQLInputObjectType,
	GraphQLInt,
	GraphQLList,
	GraphQLObjectType,
	GraphQLString,
} from 'graphql';
import {FindOptions} from 'sequelize';

import {GenreResolver, PersonResolver} from '../resolvers';
import Movie, {MovieOutput} from '../../db/models/Movie';
import MoviePeople from '../../db/models/MoviePeople';

import {errorNode} from './error';
import {pageInfo} from './base';
import {genreNode} from './genre';
import {personNode} from './person';


const genreResolver = new GenreResolver();
const personResolver = new PersonResolver();

export const movieConnection = new GraphQLObjectType({
	name: 'movieConnection',
	fields: () => ({
		edges: {
			type: new GraphQLList(movieEdge),
		},
		pageInfo: {
			type: pageInfo,
		},
		totalCount: {
			type: GraphQLInt
		}
	}),
});

export const movieEdge = new GraphQLObjectType({
	name: 'movieEdge',
	fields: () => ({
		node: {
			type: movieNode,
		},
	}),
});

export const movieNode = new GraphQLObjectType({
	name: 'movieNode',
	fields: () => ({
		id: {
			type: GraphQLID,
		},
		title: {
			type: GraphQLString,
		},
		titleOriginal: {
			type: GraphQLString,
		},
		runtime: {
			type: GraphQLInt,
		},
		releaseDate: {
			type: GraphQLString,
		},
		overview: {
			type: GraphQLString,
		},
		backdrop: {
			type: GraphQLString,
		},
		poster: {
			type: GraphQLString,
		},
		character: {
			type: GraphQLString,
		},
		cast: {
			type: new GraphQLList(personNode),
			resolve: (parent: MovieOutput) => {
				const args: FindOptions = {
					include: {
						model: Movie,
						where: {id: parent.id},
						through: {
							attributes: ['character'],
							where: {
								department: 'actor',
							},
						},
					},
					order: [
						[Movie, MoviePeople, 'order', 'asc' ]
					]
				};

				return personResolver.list(args);
			}
		},
		directors: {
			type: new GraphQLList(personNode),
			resolve: (parent: MovieOutput) => {
				const args: FindOptions = {
					include: {
						model: Movie,
						where: {id: parent.id},
						through: {
							attributes: ['character'],
							where: {
								department: 'director',
							},
						},
					},
				};

				return personResolver.list(args);
			}
		},
		genres: {
			type: new GraphQLList(genreNode),
			resolve: (parent: MovieOutput) => {
				const args: FindOptions = {
					include: {
						model: Movie,
						where: {id: parent.id},
					},
				};

				return genreResolver.list(args);
			}
		},
	}),
});

const payload = {
	movie: {
		type: movieNode
	},
	ok: {
		type: GraphQLBoolean
	},
	errors: {
		type: new GraphQLList(errorNode)
	}
};

export const movieCreatePayload = new GraphQLObjectType({
	name: 'movieCreatePayload',
	fields: () => payload
});

export const movieUpdatePayload = new GraphQLObjectType({
	name: 'movieUpdatePayload',
	fields: () => payload
});

export const movieRefetchPayload = new GraphQLObjectType({
	name: 'movieRefetchPayload',
	fields: () => payload
});

export const movieUpdateInput = new GraphQLInputObjectType({
	name: 'movieUpdateInput',
	fields: () => ({
		backdrop: {
			type: GraphQLString,
		},
		poster: {
			type: GraphQLString,
		},
	})
});

export const movieRefetchInput = new GraphQLInputObjectType({
	name: 'movieRefetchInput',
	fields: () => ({
		withImages: {
			type: GraphQLBoolean,
			defaultValue: false,
		},
	})
});

export const movieDeletePayload = new GraphQLObjectType({
	name: 'movieDeletePayload',
	fields: () => ({
		ok: {
			type: GraphQLBoolean
		},
		errors: {
			type: new GraphQLList(errorNode)
		}
	})
});
