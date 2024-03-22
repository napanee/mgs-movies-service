import {join, resolve} from 'path';

import * as plugins from './plugins';
import {defaultPort, devServerHost, rootDir} from './utils/env';

import {Configuration} from '../webpack.config.babel';


const config: Configuration = {
	target: 'web',
	entry: {app: './js/index.tsx'},
	context: resolve(process.cwd(), 'client'),
};

if (process.env.NODE_ENV === 'production') {
	config.output = {
		filename: 'js/[name].js',
		chunkFilename: 'js/[name]-[chunkhash].js',
		path: join(process.cwd(), 'build', 'static'),
		publicPath: '/static/',
	};
} else {
	config.plugins = [
		plugins.htmlWebpackPlugin,
		plugins.reactRefreshWebpackPlugin,
	];
	config.devServer = {
		client: {
			overlay: false,
		},
		headers: {'Access-Control-Allow-Origin': '*'},
		historyApiFallback: true,
		host: devServerHost,
		hot: true,
		port: defaultPort,
		static: [
			{
				directory: join(rootDir, 'web', 'media'),
				publicPath: '/media',
			},
		],
	};
	config.output = {
		publicPath: `http://${devServerHost}:${defaultPort}/`,
		filename: '[name].[fullhash].js',
	};
}

export default config;
