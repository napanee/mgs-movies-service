import {resolve} from 'path';

import {EntryObject} from 'webpack';

import * as plugins from './plugins';
import {isDev} from './utils/env';

import {Configuration} from '../webpack.config';


type Output = {[key: string]: string};

const config: Configuration = {
	target: 'web',
	entry: {
		app: [
			'./js/index.tsx',
		],
	},
	context: resolve(process.cwd(), 'client'),
	output: {
		filename: 'js/[name].js',
		chunkFilename: 'js/[name]-[chunkhash].js',
		path: resolve(process.cwd(), 'build', 'static'),
		publicPath: '/static/',
	},
	plugins: [
		plugins.htmlWebpackPlugin,
	],
};

if (isDev) {
	((config.entry as EntryObject).app as [string])
		.push('webpack-hot-middleware/client?path=/__webpack_hmr&reload=true');
	config.plugins?.push(plugins.hotModuleReplacementPlugin);
	config.plugins?.push(plugins.reactRefreshWebpackPlugin);
	(config.output as Output).hotUpdateChunkFilename = '.hot/hot-update.js';
	(config.output as Output).hotUpdateMainFilename = '.hot/hot-update.json';
}

export default config;
