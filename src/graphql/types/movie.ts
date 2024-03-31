import {
	GraphQLBoolean,
	GraphQLInputObjectType,
	GraphQLInt,
	GraphQLList,
	GraphQLNonNull,
	GraphQLObjectType,
	GraphQLString,
} from 'graphql';
import {FindAndCountOptions, WhereOptions} from 'sequelize';

import MovieGenres, {MovieGenresInput} from '@models/MovieGenres';
import MoviePeople, {MoviePeopleInput} from '@models/MoviePeople';

import {actorNode} from './actor';
import {pageInfo} from './base';
import {directorNode} from './director';
import {errorNode} from './error';
import {genreNode} from './genre';

import GenreResolver from '../resolvers/Genre';
import PersonResolver from '../resolvers/Person';


const genreResolver = new GenreResolver();
const personResolver = new PersonResolver();

// eslint-disable-next-line max-len
export const movieConnection: GraphQLObjectType = new GraphQLObjectType({
	name: 'movieConnection',
	fields: () => ({
		edges: {
			type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(movieEdge))),
		},
		pageInfo: {
			type: new GraphQLNonNull(pageInfo),
		},
		totalCount: {
			type: new GraphQLNonNull(GraphQLInt),
		},
	}),
});

export const movieEdge: GraphQLObjectType = new GraphQLObjectType({
	name: 'movieEdge',
	fields: () => ({
		node: {
			type: new GraphQLNonNull(movieNode),
		},
	}),
});

export const movieNode: GraphQLObjectType = new GraphQLObjectType({
	name: 'movieNode',
	fields: () => ({
		id: {
			type: new GraphQLNonNull(GraphQLInt),
		},
		title: {
			type: new GraphQLNonNull(GraphQLString),
		},
		titleOriginal: {
			type: new GraphQLNonNull(GraphQLString),
		},
		runtime: {
			type: GraphQLInt,
		},
		releaseDate: {
			type: new GraphQLNonNull(GraphQLString),
		},
		overview: {
			type: GraphQLString,
		},
		backdrop: {
			type: GraphQLString,
		},
		logo: {
			type: GraphQLString,
		},
		poster: {
			type: GraphQLString,
		},
		cast: {
			type: new GraphQLList(actorNode),
			resolve: (movie) => {
				const options: FindAndCountOptions = {
					include: {
						model: MoviePeople,
						attributes: ['character'],
						where: {
							department: 'actor',
							movieId: movie.id,
						} as WhereOptions<MoviePeopleInput>,
					},
					order: [['movieData', 'order', 'asc']],
				};

				return personResolver.list(options, true);
			},
		},
		directors: {
			type: new GraphQLList(directorNode),
			resolve: (movie) => {
				const options: FindAndCountOptions = {
					include: {
						model: MoviePeople,
						attributes: [],
						where: {
							department: 'director',
							movieId: movie.id,
						} as WhereOptions<MoviePeopleInput>,
					},
				};

				return personResolver.list(options, true);
			},
		},
		genres: {
			type: new GraphQLList(genreNode),
			resolve: (movie) => {
				const options: FindAndCountOptions = {
					attributes: ['name'],
					include: {
						model: MovieGenres,
						attributes: [],
						where: {
							movieId: movie.id,
						} as WhereOptions<MovieGenresInput>,
					},
				};

				return genreResolver.list(options, true);
			},
		},
	}),
});

export const movieCreatePayload: GraphQLObjectType = new GraphQLObjectType({
	name: 'movieCreatePayload',
	fields: () => ({
		movie: {
			type: new GraphQLNonNull(movieNode),
		},
		ok: {
			type: new GraphQLNonNull(GraphQLBoolean),
		},
		errors: {
			type: new GraphQLList(new GraphQLNonNull(errorNode)),
		},
	}),
});

export const movieUpdatePayload: GraphQLObjectType = new GraphQLObjectType({
	name: 'movieUpdatePayload',
	fields: () => ({
		movie: {
			type: movieNode,
		},
		ok: {
			type: new GraphQLNonNull(GraphQLBoolean),
		},
		errors: {
			type: new GraphQLList(new GraphQLNonNull(errorNode)),
		},
	}),
});

export const movieRefetchPayload: GraphQLObjectType = new GraphQLObjectType({
	name: 'movieRefetchPayload',
	fields: () => ({
		movie: {
			type: movieNode,
		},
		ok: {
			type: new GraphQLNonNull(GraphQLBoolean),
		},
		errors: {
			type: new GraphQLList(new GraphQLNonNull(errorNode)),
		},
	}),
});

export const movieUpdateInput: GraphQLInputObjectType = new GraphQLInputObjectType({
	name: 'movieUpdateInput',
	fields: () => ({
		backdrop: {
			type: GraphQLString,
		},
		logo: {
			type: GraphQLString,
		},
		poster: {
			type: GraphQLString,
		},
	}),
});

export const movieRefetchInput: GraphQLInputObjectType = new GraphQLInputObjectType({
	name: 'movieRefetchInput',
	fields: () => ({
		withImages: {
			type: GraphQLBoolean,
			defaultValue: false,
		},
	}),
});

export const movieDeletePayload: GraphQLObjectType = new GraphQLObjectType({
	name: 'movieDeletePayload',
	fields: () => ({
		ok: {
			type: new GraphQLNonNull(GraphQLBoolean),
		},
		errors: {
			type: new GraphQLList(new GraphQLNonNull(errorNode)),
		},
	}),
});
