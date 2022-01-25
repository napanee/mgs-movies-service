import express from 'express';
import {graphqlHTTP} from 'express-graphql';

import GraphQLSchema from '../graphql';


const
	router = express.Router()
;

router.use('/', graphqlHTTP((req) => ({
	schema: GraphQLSchema,
	graphiql: process.env.NODE_ENV === 'development',
})));

export default router;
