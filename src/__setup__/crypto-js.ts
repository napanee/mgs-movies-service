jest.mock('crypto-js', () => ({
	MD5: jest.fn((value: string) => `${value}${value}${value}`),
}));
