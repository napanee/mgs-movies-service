module.exports = {
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
