module.exports = {
	client: {
		service: {
			name: 'movies-db-service',
			url: 'http://localhost:3000/graphql',
		},
		includes: ['./client/**/*.graphql'],
		excludes: ['**/__tests__/**'],
	},
};
