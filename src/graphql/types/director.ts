import {GraphQLID, GraphQLObjectType, GraphQLString} from 'graphql';


export const directorNode: GraphQLObjectType = new GraphQLObjectType({
	name: 'directorNode',
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
	}),
});
