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
		[
			'module-resolver', {
				'alias': {
					'@src': './src',
					'@db': './src/db',
					'@models': './src/db/models',
					'@graphql': './src/graphql',
					'@utils': './src/utils',
				},
			},
		],
	],
};
