jest.mock('dayjs', () => {
	return (value: object | string | null) => {
		const date = value;

		return {
			isValid: () => !!date,
			year: () => date?.toString().substring(0, 4) || '1984',
		};
	};
});
