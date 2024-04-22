import {Configuration} from 'webpack';

import * as plugins from './plugins';
import * as rules from './rules';


const config: Configuration = {
	mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
	devtool: process.env.NODE_ENV === 'production' ? 'source-map' : 'inline-source-map',
	stats: {
		children: true,
		errors: true,
		errorDetails: true,
	},
	module: {
		rules: [
			rules.typescriptRule,
			rules.graphQLRule,
		],
	},
	plugins: [
		plugins.dotenvPlugin,
	],
	resolve: {
		extensions: ['.tsx', '.ts', '.js'],
		plugins: [
			plugins.tsconfigPathsPlugin,
		],
	},
};

export default config;
