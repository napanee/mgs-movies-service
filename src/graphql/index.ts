import {GraphQLObjectType, GraphQLSchema} from 'graphql';

import {MovieMutation} from './mutations';
import {GenreQuery, MovieQuery, PersonQuery} from './queries';


const genreQuery = new GenreQuery();
const movieQuery = new MovieQuery();
const personQuery = new PersonQuery();
const movieMutation = new MovieMutation();
const query = new GraphQLObjectType({
	name: 'Query',
	fields: {
		// Genre
		genre: genreQuery.get(),
		genres: genreQuery.list(),
		// Movie
		movie: movieQuery.get(),
		movies: movieQuery.list(),
		// Person
		person: personQuery.get(),
		people: personQuery.list(),
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
