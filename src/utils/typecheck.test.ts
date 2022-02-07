import {FindOptions, IncludeOptions} from 'sequelize';

import User from '@models/User';

import {instanceOfFindOptions, instanceOfIncludeOptions} from './typecheck';


describe('The typechecker', () => {
	test('should return false for findOptions', async () => {
		const test = {foo: 'bar'};

		const isFindOptions = instanceOfFindOptions(test);

		expect(isFindOptions).toBeFalsy();
	});

	test('should return true for findOptions', async () => {
		const test1: FindOptions = {
			include: {},
		};

		const test2: FindOptions = {
			order: [],
		};

		const isFindOptions1 = instanceOfFindOptions(test1);
		const isFindOptions2 = instanceOfFindOptions(test2);

		expect(isFindOptions1).toBeTruthy();
		expect(isFindOptions2).toBeTruthy();
	});

	test('should return false for includeOptions', async () => {
		const test1 = {foo: 'bar'};
		const test2: IncludeOptions = {
			model: User,
		};
		const test3: IncludeOptions = {
			where: {},
		};

		const isIncludeOptions1 = instanceOfIncludeOptions(test1);
		const isIncludeOptions2 = instanceOfIncludeOptions(test2);
		const isIncludeOptions3 = instanceOfIncludeOptions(test3);

		expect(isIncludeOptions1).toBeFalsy();
		expect(isIncludeOptions2).toBeFalsy();
		expect(isIncludeOptions3).toBeFalsy();
	});

	test('should return true for includeOptions', async () => {
		const test: IncludeOptions = {
			model: User,
			where: {},
		};

		const isIncludeOptions = instanceOfIncludeOptions(test);

		expect(isIncludeOptions).toBeTruthy();
	});
});
