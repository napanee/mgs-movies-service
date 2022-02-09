import {Configuration as WebpackConfiguration} from 'webpack';
import {Configuration as WebpackDevServerConfiguration} from 'webpack-dev-server';
import merge from 'webpack-merge';

import baseConfig from './webpack/base';
import devConfig from './webpack/dev';


export interface Configuration extends WebpackConfiguration {
	devServer?: WebpackDevServerConfiguration;
}

const config = () => merge<Configuration>(baseConfig, devConfig);

export default config;
