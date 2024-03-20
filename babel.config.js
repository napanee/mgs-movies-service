module.exports = {
	'presets': [
		'@babel/preset-env',
		[
			'@babel/preset-react', {
				'runtime': 'automatic',
			},
		],
	],
	'plugins': [
		[
			'@babel/plugin-transform-typescript', {
				allowDeclareFields: true,
			},
		],
		[
			'inline-dotenv', {
				path: './.env',
			},
		],
		'tsconfig-paths-module-resolver',
	],
};
