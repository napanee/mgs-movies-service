jest.mock('dayjs', () => {
	return (value: string | null) => {
		const date = value;

		return {
			isValid: () => !!date,
			year: () => date?.substring(0, 4) || '1984',
		};
	};
});
