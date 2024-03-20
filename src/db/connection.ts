import {Options, Sequelize} from 'sequelize';

import dbConfig from './config';


const ENV = process.env.NODE_ENV || 'development';
const {database, dialect, host, password, username} = dbConfig[ENV];

// eslint-disable-next-line no-console
export const logging = !!process.env.DEBUG && ((sql: string, timing?: number) => console.log(timing, sql));
const options: Options = {host, dialect, logging, define: {underscored: true}};

export const sequelizeConnection = new Sequelize(database, username, password, options);
