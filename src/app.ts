import express, {Application} from 'express';

import dbInit from './db/init';
import routerGraphql from './routes/graphql';


dbInit();

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/graphql', routerGraphql);
app.get('/', async (_, res) => {
	res.send('Server running...');
});

export default app;
