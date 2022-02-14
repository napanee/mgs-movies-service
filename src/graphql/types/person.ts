import {GraphQLID, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString} from 'graphql';

import MoviePeople from '@models/MoviePeople';
import {PersonOutput} from '@models/Person';

import {pageInfo} from './base';
import {filmographyNode} from './filmography';

import MovieResolver, {IArgsList as IArgsListMovie} from '../resolvers/Movie';


const movieResolver = new MovieResolver();

export const personConnection = new GraphQLObjectType({
	name: 'personConnection',
	fields: () => ({
		edges: {
			type: new GraphQLList(personEdge),
		},
		pageInfo: {
			type: pageInfo,
		},
		totalCount: {
			type: GraphQLInt,
		},
	}),
});

export const personEdge = new GraphQLObjectType({
	name: 'personEdge',
	fields: () => ({
		node: {
			type: personNode,
		},
		cursor: {
			type: GraphQLString,
		},
	}),
});

export const personNode: GraphQLObjectType = new GraphQLObjectType({
	name: 'personNode',
	fields: () => ({
		id: {
			type: GraphQLID,
		},
		name: {
			type: GraphQLString,
		},
		biography: {
			type: GraphQLString,
		},
		birthday: {
			type: GraphQLString,
		},
		deathday: {
			type: GraphQLString,
		},
		placeOfBirth: {
			type: GraphQLString,
		},
		imageUrl: {
			type: GraphQLString,
		},
		filmography: {
			type: new GraphQLList(filmographyNode),
			resolve: (parent: PersonOutput) => {
				const args: IArgsListMovie = {
					attributes: ['title'],
					include: {
						model: MoviePeople,
						as: 'filmography',
						attributes: ['character'],
						where: {
							personId: parent.id,
						},
					},
				};

				return movieResolver.list(args, true);
			},
		},
	}),
});
