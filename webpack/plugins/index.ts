import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import Dotenv from 'dotenv-webpack';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import {HotModuleReplacementPlugin, ProgressPlugin} from 'webpack';


export const reactRefreshWebpackPlugin = new ReactRefreshWebpackPlugin();
export const dotenvPlugin = new Dotenv();
export const tsconfigPathsPlugin = new TsconfigPathsPlugin();
export const hotModuleReplacementPlugin = new HotModuleReplacementPlugin();
export const progressPlugin = new ProgressPlugin();
