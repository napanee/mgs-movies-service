import fs from 'fs';

import {MD5} from 'crypto-js';
import fetch, {enableFetchMocks} from 'jest-fetch-mock';

import {saveImage} from './save-image';


jest.mock('fs');
enableFetchMocks();

describe('The image saver', () => {
	afterEach(() => {
		fetch.resetMocks();
	});

	test('should return null on error', async () => {
		fetch.mockResponse(JSON.stringify({}), {status: 403});

		const result = await saveImage('path', 'path');

		expect(fetch).toBeCalledTimes(1);
		expect(result).toBeNull();
	});

	test('should create file', async () => {
		const mockFnMkdirSync = jest.spyOn(fs, 'mkdirSync');
		const mockFnWriteFileSync = jest.spyOn(fs, 'writeFileSync');

		fetch.mockResponse('FooBarBaz', {status: 200});

		const result = await saveImage('image.jpg', 'path');

		expect(fetch).toBeCalledTimes(1);
		expect(mockFnMkdirSync).toBeCalledTimes(1);
		expect(mockFnWriteFileSync).toBeCalledTimes(1);
		expect(result).toBe(`path/${MD5('image.jpg')}.jpg`);

		mockFnMkdirSync.mockRestore();
		mockFnWriteFileSync.mockRestore();
	});
});
