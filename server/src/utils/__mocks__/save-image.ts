export const saveImage = jest.fn((name, path) => {
	return Promise.resolve(`${path}/new-${name}`);
});
