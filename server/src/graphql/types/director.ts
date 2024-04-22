import {GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString} from 'graphql';

import {DirectorNode} from '@src/graphql-types';


export const directorNode: GraphQLObjectType<DirectorNode> = new GraphQLObjectType<DirectorNode>({
	name: 'directorNode',
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
	}),
});
