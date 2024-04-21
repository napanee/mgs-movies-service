import {GraphQLNonNull, GraphQLObjectType, GraphQLString} from 'graphql';

import {ErrorNode} from '@src/graphql-types';


export const errorNode: GraphQLObjectType<ErrorNode> = new GraphQLObjectType<ErrorNode>({
	name: 'errorNode',
	fields: () => ({
		field: {
			type: new GraphQLNonNull(GraphQLString),
		},
		message: {
			type: new GraphQLNonNull(GraphQLString),
		},
	}),
});
