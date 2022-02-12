import {join} from 'path';

import * as plugins from './plugins';
import * as rules from './rules';
import {rootDir} from './utils/env';


export default {
	context: __dirname,
	entry: {
		main: [join(rootDir, 'client', 'js', 'index.tsx')],
	},
	output: {
		path: join(rootDir, 'build'),
	},
	module: {
		rules: [
			rules.typescriptRule,
			rules.htmlRule,
		],
	},
	plugins: [
		plugins.htmlWebpackPlugin,
		plugins.dotenvPlugin,
	],
	resolve: {
		alias: {
			'@components': join(rootDir, 'client', 'js', 'components'),
			'@utils': join(rootDir, 'client', 'js', 'utils'),
			'@pages': join(rootDir, 'client', 'js', 'pages'),
		},
		extensions: ['.tsx', '.ts', '.js'],
	},
};
