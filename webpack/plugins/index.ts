import {join} from 'path';

import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import Dotenv from 'dotenv-webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import {HotModuleReplacementPlugin, ProgressPlugin} from 'webpack';

import {rootDir} from '../utils/env';


export const reactRefreshWebpackPlugin = new ReactRefreshWebpackPlugin();
export const dotenvPlugin = new Dotenv();
export const htmlWebpackPlugin = new HtmlWebpackPlugin({
	filename: 'index.html',
	inject: 'body',
	template: join(rootDir, 'src', 'index.ejs'),
});
export const tsconfigPathsPlugin = new TsconfigPathsPlugin();
export const hotModuleReplacementPlugin = new HotModuleReplacementPlugin();
export const progressPlugin = new ProgressPlugin();
