import {GraphQLNonNull, GraphQLObjectType, GraphQLString, GraphQLUnionType} from 'graphql';

import {FilmographyNode} from '@src/graphql-types';


export const filmographyActorNode: GraphQLObjectType = new GraphQLObjectType({
	name: 'filmographyActorNode',
	fields: () => ({
		character: {
			type: new GraphQLNonNull(GraphQLString),
		},
		title: {
			type: new GraphQLNonNull(GraphQLString),
		},
	}),
});

export const filmographyDirectorNode: GraphQLObjectType = new GraphQLObjectType({
	name: 'filmographyDirectorNode',
	fields: () => ({
		title: {
			type: new GraphQLNonNull(GraphQLString),
		},
	}),
});

export const filmographyNode: GraphQLUnionType = new GraphQLUnionType({
	name: 'filmographyNode',
	types: [filmographyActorNode, filmographyDirectorNode],
	resolveType: (value: FilmographyNode) => {
		return 'character' in value ? 'filmographyActorNode' : 'filmographyDirectorNode';
	},
});
