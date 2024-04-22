import fs from 'fs';

import {printSchema} from 'graphql';

import graphQLSchema from '@graphql/index';


const fileData = printSchema(graphQLSchema);

fs.writeFileSync('./schema.graphql', fileData);
