import {Dialect} from 'sequelize';


type Config = {
	[key in typeof process.env.NODE_ENV]: {
		database: string;
		dialect: Dialect;
		host: string;
		password: string;
		username: string;
	};
};

const config: Config = {
	development: {
		username: 'postgres',
		password: 'postgres',
		database: 'movies_dev',
		host: '127.0.0.1',
		dialect: 'postgres',
	},
	test: {
		username: 'postgres',
		password: 'postgres',
		database: 'movies_test',
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
