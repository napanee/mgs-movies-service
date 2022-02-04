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

import Person, {PersonOutput} from '../../db/models/Person';
import {MovieResolver} from '../resolvers';


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
		image: {
			type: GraphQLString,
		},
		character: {
			type: GraphQLString,
		},
		movies: {
			type: new GraphQLList(movieNode),
			resolve: (parent: PersonOutput) => {
				const args: FindOptions = {
					include: {
						model: Person,
						where: {id: parent.id},
						through: {
							attributes: ['character'],
							where: {
								department: 'actor',
							},
						},
					},
				};

				return movieResolver.list(args);
			},
		},
	}),
});
