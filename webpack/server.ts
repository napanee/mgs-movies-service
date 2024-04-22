import {webpack} from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import app from '@src/app';

import webpackConfig from '../webpack.config';


const port = process.env.PORT || 3000;
const isDev = process.env.NODE_ENV === 'development';

if (isDev) {
	const webpackCompiler = webpack(webpackConfig);

	app.use(
		webpackDevMiddleware(webpackCompiler, {
			publicPath: webpackConfig.output?.publicPath,
		})
	);

	app.use(
		webpackHotMiddleware(webpackCompiler, {
			log: false,
			path: '/__webpack_hmr',
			heartbeat: 2000,
		})
	);
}

export const server = app.listen(port, () => {
	// eslint-disable-next-line no-console
	console.log(`App starts on port ${port}`);
});
