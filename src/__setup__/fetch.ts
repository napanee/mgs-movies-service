import fetch from 'jest-fetch-mock';


global.fetch = fetch as jest.MockedFunction<typeof fetch>;
