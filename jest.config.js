/* eslint-disable @typescript-eslint/no-var-requires */
const dotenv = require('dotenv');
const {pathsToModuleNameMapper} = require('ts-jest');

const {compilerOptions} = require('./tsconfig');


dotenv.config({path: '.env.test'});

module.exports = {
	roots: ['<rootDir>/server/src'],
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
		'./server/src/__setup__/bcrypt.ts',
		'./server/src/__setup__/crypto-js.ts',
		'./server/src/__setup__/dayjs.ts',
		'./server/src/__setup__/fetch.ts',
	],
	// globalSetup: '<rootDir>/src/__setup__/globalSetup.ts',
	// globalTeardown: '<rootDir>/src/__setup__/globalTeardown.ts',
};
