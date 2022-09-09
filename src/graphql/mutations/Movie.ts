import {GraphQLInt, GraphQLNonNull} from 'graphql';

import {
	MutationMovieCreateArgs,
	MutationMovieDeleteArgs,
	MutationMovieRefetchArgs,
	MutationMovieUpdateArgs,
} from '@src/graphql-types';

import MovieResolver from '../resolvers/Movie';
import {
	movieCreatePayload,
	movieDeletePayload,
	movieRefetchInput,
	movieRefetchPayload,
	movieUpdateInput,
	movieUpdatePayload,
} from '../types';


class MovieMutation {
	private resolver = new MovieResolver();

	create() {
		return {
			type: movieCreatePayload,
			args: {
				tmdb: {
					type: new GraphQLNonNull(GraphQLInt),
				},
			},
			resolve: (_: unknown, args: MutationMovieCreateArgs) => this.resolver.create(args),
		};
	}

	update() {
		return {
			type: movieUpdatePayload,
			args: {
				id: {
					type: new GraphQLNonNull(GraphQLInt),
				},
				input: {
					type: new GraphQLNonNull(movieUpdateInput),
				},
			},
			resolve: (_: unknown, args: MutationMovieUpdateArgs) => this.resolver.update(args),
		};
	}

	refetch() {
		return {
			type: movieRefetchPayload,
			args: {
				id: {
					type: new GraphQLNonNull(GraphQLInt),
				},
				input: {
					type: movieRefetchInput,
				},
			},
			resolve: (_: unknown, args: MutationMovieRefetchArgs) => this.resolver.refetch(args),
		};
	}

	delete() {
		return {
			type: movieDeletePayload,
			args: {
				id: {
					type: new GraphQLNonNull(GraphQLInt),
				},
			},
			resolve: (_: unknown, args: MutationMovieDeleteArgs) => this.resolver.delete(args),
		};
	}
}

export default MovieMutation;
