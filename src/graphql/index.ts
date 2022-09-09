import {GraphQLObjectType, GraphQLSchema} from 'graphql';

import {MovieMutation} from './mutations';
import {GenreQuery, MovieQuery, PersonQuery} from './queries';

import {MutationResolvers, Query} from '../graphql-types';


const genreQuery = new GenreQuery();
const movieQuery = new MovieQuery();
const personQuery = new PersonQuery();
const movieMutation = new MovieMutation();
const query = new GraphQLObjectType<Query>({
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
		// Actor
		actors: personQuery.list('actor'),
		// Director
		directors: personQuery.list('director'),
	},
});
const mutation = new GraphQLObjectType<MutationResolvers>({
	name: 'Mutation',
	fields: {
		// Movie
		movieCreate: movieMutation.create(),
		movieDelete: movieMutation.delete(),
		movieUpdate: movieMutation.update(),
		movieRefetch: movieMutation.refetch(),
	},
});
const graphQLSchema = new GraphQLSchema({
	query,
	mutation,
});

export default graphQLSchema;
