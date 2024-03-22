import {resolve} from 'path';

import {Configuration} from 'webpack';
import nodeExternals from 'webpack-node-externals';


const config: Configuration = {
	target: 'node',
	entry: {server: './server.ts'},
	context: resolve(process.cwd(), 'src'),
	output: {
		filename: '[name].js',
		path: resolve(process.cwd(), 'build'),
	},
	node: {
		// Need this when working with express, otherwise the build fails
		__dirname: false, // if you don't put this is, __dirname
		__filename: false, // and __filename return blank or /
	},
	externals: [nodeExternals()], // Need this to avoid error when working with Express
};

export default config;
