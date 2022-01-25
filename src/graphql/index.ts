import {GraphQLObjectType, GraphQLSchema, GraphQLString} from 'graphql';


const
	Query = new GraphQLObjectType({
		name: 'Query',
		fields: {
			ping: {
				type: GraphQLString,
				resolve: () => 'pong',
			},
		},
	}),
	graphQLSchema = new GraphQLSchema({
		query: Query,
	})
;

export default graphQLSchema;
