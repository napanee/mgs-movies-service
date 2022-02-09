module.exports = {
	'presets': [
		'@babel/preset-env',
		'@babel/preset-react',
	],
	'plugins': [
		[
			'@babel/plugin-transform-typescript', {
				allowDeclareFields: true,
			},
		],
		[
			'inline-dotenv', {
				path: './localhost.env',
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
