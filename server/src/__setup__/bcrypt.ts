jest.mock('bcrypt', () => ({
	genSaltSync: jest.fn(() => 'salt'),
	hashSync: jest.fn(() => 'hash'),
}));
