import {transformKeys} from './transformer';


describe.skip('The transformer', () => {
	test('should return snake-cased-keys-object with camelCased keys', async () => {
		const snakeCasedObject = {
			first_name: 'Foo',
			last_name: 'Bar',
		};
		const expectedResult = {
			firstName: 'Foo',
			lastName: 'Bar',
		};
		const camelCasedObject = transformKeys(snakeCasedObject);

		expect(camelCasedObject).toEqual(expectedResult);
	});
});
