import {join} from 'path';

import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';

import {defaultPort, devServerHost, rootDir} from './utils/env';

import {Configuration} from '../webpack.config.babel';


const config: Configuration = {
	target: 'web',
	mode: 'development',
	devtool: 'cheap-module-source-map',
	plugins: [new ReactRefreshWebpackPlugin()],
	devServer: {
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
	},
	output: {
		publicPath: `http://${devServerHost}:${defaultPort}/`,
		filename: '[name].[fullhash].js',
	},
};

export default config;
