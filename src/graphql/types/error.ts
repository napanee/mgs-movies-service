import {GraphQLObjectType, GraphQLString} from 'graphql';


export const errorNode = new GraphQLObjectType({
	name: 'errorNode',
	fields: () => ({
		field: {
			type: GraphQLString,
		},
		message: {
			type: GraphQLString,
		},
	}),
});
