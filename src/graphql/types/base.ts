import {GraphQLBoolean, GraphQLNonNull, GraphQLObjectType} from 'graphql';

import {PageInfo} from '@src/graphql-types';


export const pageInfo: GraphQLObjectType<PageInfo> = new GraphQLObjectType<PageInfo>({
	name: 'pageInfo',
	fields: () => ({
		hasNextPage: {
			type: new GraphQLNonNull(GraphQLBoolean),
		},
		hasPreviousPage: {
			type: new GraphQLNonNull(GraphQLBoolean),
		},
	}),
});
