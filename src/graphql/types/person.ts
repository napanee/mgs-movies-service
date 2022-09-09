import {GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString} from 'graphql';
import {FindAndCountOptions, WhereOptions} from 'sequelize/types';

import MoviePeople, {MoviePeopleInput} from '@models/MoviePeople';

import {pageInfo} from './base';
import {filmographyNode} from './filmography';

import MovieResolver from '../resolvers/Movie';


const movieResolver = new MovieResolver();

export const personConnection: GraphQLObjectType = new GraphQLObjectType({
	name: 'personConnection',
	fields: () => ({
		edges: {
			type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(personEdge))),
		},
		pageInfo: {
			type: new GraphQLNonNull(pageInfo),
		},
		totalCount: {
			type: new GraphQLNonNull(GraphQLInt),
		},
	}),
});

export const personEdge: GraphQLObjectType = new GraphQLObjectType({
	name: 'personEdge',
	fields: () => ({
		node: {
			type: new GraphQLNonNull(personNode),
		},
	}),
});

export const personNode: GraphQLObjectType = new GraphQLObjectType({
	name: 'personNode',
	fields: () => ({
		id: {
			type: new GraphQLNonNull(GraphQLInt),
		},
		name: {
			type: new GraphQLNonNull(GraphQLString),
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
			type: new GraphQLNonNull(new GraphQLList(filmographyNode)),
			resolve: (person) => {
				const options: FindAndCountOptions = {
					attributes: ['title'],
					include: {
						model: MoviePeople,
						as: 'filmography',
						attributes: ['character'],
						where: {
							personId: person.id,
						} as WhereOptions<MoviePeopleInput>,
					},
				};

				return movieResolver.list(options, true);
			},
		},
	}),
});
