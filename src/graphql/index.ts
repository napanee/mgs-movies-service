import {GraphQLObjectType, GraphQLSchema} from 'graphql';

import {MovieMutation} from './mutations';
import {MovieQuery} from './queries';


const movieQuery = new MovieQuery();
const movieMutation = new MovieMutation();
const query = new GraphQLObjectType({
	name: 'Query',
	fields: {
		// Movie
		movie: movieQuery.get(),
		movies: movieQuery.list(),
	}
});
const mutation = new GraphQLObjectType({
	name: 'Mutation',
	fields: {
		// Movie
		movieCreate: movieMutation.create(),
		movieDelete: movieMutation.delete(),
		movieUpdate: movieMutation.update(),
		movieRefetch: movieMutation.refetch(),
	}
});
const graphQLSchema = new GraphQLSchema({
	query,
	mutation,
});

export default graphQLSchema;
