// require('ts-node/register');


module.exports = {
	roots: ['<rootDir>/src'],
	preset: 'ts-jest',
	testEnvironment: 'node',
	transformIgnorePatterns: ['node_modules/(?!(sequelize|type-fest)/)'],
	moduleFileExtensions: ['js', 'ts', 'd.ts'],
	coveragePathIgnorePatterns: [
		'./server.ts',
		'/migrations/',
	],
	collectCoverageFrom: [
		'**/*.{js,ts}',
	],
	moduleNameMapper: {
		'@src(.*)$': '<rootDir>/src/$1',
		'@db(.*)$': '<rootDir>/src/db/$1',
		'@models(.*)$': '<rootDir>/src/db/models/$1',
		'@graphql(.*)$': '<rootDir>/src/graphql/$1',
		'@utils(.*)$': '<rootDir>/src/utils/$1',
	},
	setupFiles: [
		'./src/__setup__/bcrypt.ts',
		'./src/__setup__/crypto-js.ts',
		'./src/__setup__/dayjs.ts',
		'./src/__setup__/fetch.ts',
	],
	// globalSetup: '<rootDir>/src/__setup__/globalSetup.ts',
	// globalTeardown: '<rootDir>/src/__setup__/globalTeardown.ts',
};
