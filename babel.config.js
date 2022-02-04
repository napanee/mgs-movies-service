module.exports = {
	'presets': [
		'@babel/preset-env',
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
	],
};
