/* eslint-disable @typescript-eslint/no-var-requires */
const {pathsToModuleNameMapper} = require('ts-jest');

const {compilerOptions} = require('./tsconfig');


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
	moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {prefix: '<rootDir>/'}),
	setupFiles: [
		'./src/__setup__/bcrypt.ts',
		'./src/__setup__/crypto-js.ts',
		'./src/__setup__/dayjs.ts',
		'./src/__setup__/fetch.ts',
	],
	// globalSetup: '<rootDir>/src/__setup__/globalSetup.ts',
	// globalTeardown: '<rootDir>/src/__setup__/globalTeardown.ts',
};
