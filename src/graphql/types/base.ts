import {GraphQLBoolean, GraphQLObjectType} from 'graphql';


export const pageInfo = new GraphQLObjectType({
	name: 'pageInfo',
	fields: () => ({
		hasNextPage: {
			type: GraphQLBoolean,
		},
		hasPreviousPage: {
			type: GraphQLBoolean,
		},
	}),
});
