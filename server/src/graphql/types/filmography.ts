import {GraphQLNonNull, GraphQLObjectType, GraphQLString, GraphQLUnionType} from 'graphql';

import Movie from '@models/Movie';

import {movieNode} from './movie';


const movieNodeConfig = movieNode.toConfig();

export const filmographyActorNode: GraphQLObjectType = new GraphQLObjectType({
	name: 'filmographyActorNode',
	fields: () => ({
		...movieNodeConfig.fields,
		character: {
			type: new GraphQLNonNull(GraphQLString),
		},
	}),
});

export const filmographyDirectorNode: GraphQLObjectType = new GraphQLObjectType({
	name: 'filmographyDirectorNode',
	fields: () => ({
		...movieNodeConfig.fields,
	}),
});

export const filmographyNode: GraphQLUnionType = new GraphQLUnionType({
	name: 'filmographyNode',
	types: [filmographyActorNode, filmographyDirectorNode],
	resolveType: (value: Movie) => {
		return !!value.character ? 'filmographyActorNode' : 'filmographyDirectorNode';
	},
});
