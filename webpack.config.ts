import {Configuration as WebpackConfiguration} from 'webpack';
import {Configuration as WebpackDevServerConfiguration} from 'webpack-dev-server';
import merge from 'webpack-merge';

import configClient from './webpack/webpack.client';
import configCommon from './webpack/webpack.common';
import configServer from './webpack/webpack.server';


export interface Configuration extends WebpackConfiguration {
	devServer?: WebpackDevServerConfiguration;
}

export default [
	merge<Configuration>(configCommon, configClient),
	merge<Configuration>(configCommon, configServer),
];
