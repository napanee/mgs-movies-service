import {Dialect} from 'sequelize';


type Config = {
	[key in typeof process.env.NODE_ENV]: {
		username: string;
		password: string;
		database: string;
		host: string;
		dialect: Dialect;
	};
}

const config: Config = {
	development: {
		username: 'postgres',
		password: 'postgres',
		database: 'movies_dev',
		host: '127.0.0.1',
		dialect: 'postgres',
	},
	production: {
		username: process.env.DATABASE_USER,
		password: process.env.DATABASE_PASS,
		database: process.env.DATABASE_NAME,
		host: process.env.DATABASE_HOST,
		dialect: process.env.DATABASE_DIALECT,
	},
};

export default config;
