import cors from 'cors';
import express, {Application} from 'express';

import {STATIC_ROOT, STATIC_URL} from './config/config';
import dbInit from './db/init';
import routerGraphql from './routes/graphql';


dbInit();

const app: Application = express();
const corsOptions = {origin: '*', optionsSuccessStatus: 200};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(STATIC_URL, express.static(STATIC_ROOT));
app.use('/graphql', routerGraphql);
app.get('/admin', (_, res) => {
	res.send(`
		<!DOCTYPE html>
		<html lang="de">
			<head>
				<meta charset="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
				<title>Admin</title>
			</head>
			<body>
				<noscript>You need to enable JavaScript to run this app.</noscript>
				<div id="root"></div>
				<script src="${STATIC_URL}js/app.js"></script>
			</body>
		</html>
	`);
});

export default app;
