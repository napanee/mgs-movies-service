import {Configuration as WebpackConfiguration} from 'webpack';
import {Configuration as WebpackDevServerConfiguration} from 'webpack-dev-server';
import merge from 'webpack-merge';

import configClient from './webpack/webpack.client';
import configCommon from './webpack/webpack.common';


export interface Configuration extends WebpackConfiguration {
	devServer?: WebpackDevServerConfiguration;
}

const config = merge<Configuration>(configCommon, configClient);


export default config;
