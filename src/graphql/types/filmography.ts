import {GraphQLObjectType, GraphQLString, GraphQLUnionType} from 'graphql';

import {MovieOutput} from '@models/Movie';


export const filmographyActorNode = new GraphQLObjectType({
	name: 'filmographyActorNode',
	fields: () => ({
		character: {
			type: GraphQLString,
		},
		title: {
			type: GraphQLString,
		},
	}),
});

export const filmographyDirectorNode = new GraphQLObjectType({
	name: 'filmographyDirectorNode',
	fields: () => ({
		title: {
			type: GraphQLString,
		},
	}),
});

export const filmographyNode = new GraphQLUnionType({
	name: 'filmographyNode',
	types: [filmographyActorNode, filmographyDirectorNode],
	resolveType: (value: MovieOutput) => {
		return value.character ? 'filmographyActorNode' : 'filmographyDirectorNode';
	},
});
