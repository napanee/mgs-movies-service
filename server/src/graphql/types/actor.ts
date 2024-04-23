import {GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString} from 'graphql';

import {ActorNodeResolvers} from '@src/graphql-types';


export const actorNode: GraphQLObjectType<ActorNodeResolvers> = new GraphQLObjectType<ActorNodeResolvers>({
	name: 'actorNode',
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
		character: {
			type: new GraphQLNonNull(GraphQLString),
		},
	}),
});
