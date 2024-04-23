import express from 'express';
import {createHandler} from 'graphql-http/lib/use/express';

import GraphQLSchema from '@graphql/index';


const
	router = express.Router()
;

router.use('/', createHandler({schema: GraphQLSchema}));

export default router;
