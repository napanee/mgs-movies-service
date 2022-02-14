import {GraphQLID, GraphQLObjectType, GraphQLString} from 'graphql';


export const actorNode: GraphQLObjectType = new GraphQLObjectType({
	name: 'actorNode',
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
		character: {
			type: GraphQLString,
		},
	}),
});
