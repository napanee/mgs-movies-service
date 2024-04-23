import cors from 'cors';
import express, {Application, NextFunction, Request, Response} from 'express';

import {MEDIA_ROOT, MEDIA_URL, STATIC_ROOT, STATIC_URL} from './config';
import dbInit from './db/init';
import routerGraphql from './routes/graphql';


const isDev = process.env.NODE_ENV === 'development';

if (isDev) {
	dbInit();
}

const app: Application = express();
const corsOptions = {origin: '*', optionsSuccessStatus: 200};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(MEDIA_URL, express.static(MEDIA_ROOT));
app.use(STATIC_URL, express.static(STATIC_ROOT));
app.use('/graphql', routerGraphql);
app.get('/admin(/*)?', (_req, res) => {
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
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
	// eslint-disable-next-line no-console
	console.error(err.stack);
	res.status(500).send('<h1>Internal Server Error (500)</h1>');
});

export default app;
