export const saveImage = jest.fn((name) => {
	return Promise.resolve(`new-${name}`);
});
