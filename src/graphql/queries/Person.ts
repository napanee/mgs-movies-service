import {GraphQLID, GraphQLInt, GraphQLString} from 'graphql';

import PersonResolver, {IArgsGet, IArgsList, PersonType} from '../resolvers/Person';
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

	list(type?: PersonType) {
		return {
			type: personConnection,
			args: {
				limit: {
					type: GraphQLInt,
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
			resolve: (_: unknown, args: Omit<IArgsList, 'type'>) => this.resolver.list({...args, type}),
		};
	}
}

export default PersonQuery;
