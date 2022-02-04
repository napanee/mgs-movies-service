import {GraphQLID, GraphQLInt, GraphQLString} from 'graphql';

import PersonResolver, {IArgsGet, IArgsList} from '../resolvers/Person';
import {personConnection, personNode} from '../types';


class PersonQuery {
	private resolver = new PersonResolver();

	get() {
		return {
			type: personNode,
			args: {
				id: {
					type: GraphQLID,
				},
				name: {
					type: GraphQLString,
				},
			},
			resolve: (_: unknown, args: IArgsGet) => this.resolver.get(args),
		};
	}

	list() {
		return {
			type: personConnection,
			args: {
				first: {
					type: GraphQLInt,
					defaultValue: 10,
				},
				offset: {
					type: GraphQLInt,
					defaultValue: 0,
				},
				orderBy: {
					type: GraphQLString,
					defaultValue: 'name',
				},
			},
			resolve: (_: unknown, args: IArgsList) => this.resolver.list(args),
		};
	}
}

export default PersonQuery;
