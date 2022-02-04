import express from 'express';

import dbInit from './db/init';
import routerGraphql from './routes/graphql';


dbInit();

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/graphql', routerGraphql);
app.get('/', async (req, res) => {
	res.send('Server running...');
});
app.listen(process.env.PORT, () => {
	// eslint-disable-next-line no-console
	console.log(`App starts on port ${process.env.PORT}`);
});
