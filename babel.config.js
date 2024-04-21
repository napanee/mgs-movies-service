module.exports = {
	'presets': [
		'@babel/preset-env',
		[
			'@babel/preset-react', {
				'runtime': 'automatic',
			},
		],
		[
			'@babel/preset-typescript', {
				allowDeclareFields: true,
			},
		],
	],
	'plugins': [
		[
			'inline-dotenv', {
				path: './.env',
			},
		],
		'tsconfig-paths-module-resolver',
	],
};
