import {join} from 'path';

import Dotenv from 'dotenv-webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';

import {deploymentEnv, rootDir} from '../utils/env';


let envFile;

switch(deploymentEnv) {
	case 'live':
		envFile = './.env.production';
		break;
	case 'staging':
		envFile = './.env.staging';
		break;
	default:
		envFile = './.env';
		break;
}
export const dotenvPlugin = new Dotenv({path: envFile});

export const htmlWebpackPlugin = new HtmlWebpackPlugin({
	filename: 'index.html',
	inject: 'body',
	template: join(rootDir, 'src', 'index.ejs'),
});
